#!/usr/bin/env python3
"""Loopback companion for Linux Lab: Vagrant SSH collection and explicit normal reboots."""
import argparse,datetime,hmac,json,re,secrets,shutil,subprocess,threading,time,uuid,webbrowser
from http.server import BaseHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlparse

ROLES=('server','client')
def collect_nodes(root,labs,attempt,phase,vagrant='vagrant',progress=lambda _:None):
    probe=(root/'vm_probe.py').read_text(encoding='utf-8');machines=[]
    for role in ROLES:
        progress('Leyendo '+role+' por SSH…')
        command='sudo python3 - --role '+role+' --labs '+','.join(labs)
        proc=subprocess.run([vagrant,'ssh',role,'-c',command],input=probe,cwd=root,text=True,capture_output=True,timeout=300)
        if proc.returncode:raise RuntimeError('No se pudo leer '+role+'. Comprueba vagrant status, SSH y Python en esa VM.')
        payload=next((line.split('EX200_NODE=',1)[1] for line in proc.stdout.splitlines() if 'EX200_NODE=' in line),None)
        if not payload:raise RuntimeError('El nodo '+role+' no devolvió una lectura válida.')
        node=json.loads(payload)
        if node.get('role')!=role or not node.get('bootId') or not node.get('machineId'):raise RuntimeError('La identidad del nodo '+role+' no es válida.')
        machines.append(node)
    return {'schema':2,'kind':'ex200-direct-report','attempt':attempt,'phase':phase,'generatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'machines':machines}

def reboot_nodes(root,vagrant='vagrant',progress=lambda _:None):
    for role in ROLES:
        progress('Reiniciando '+role+' y esperando SSH…')
        proc=subprocess.run([vagrant,'reload',role],cwd=root,text=True,capture_output=True,timeout=360)
        if proc.returncode:raise RuntimeError('El reinicio de '+role+' no terminó correctamente. Revisa la consola; no se confirma persistencia.')
    return {'rebootRequested':['server','client']}

class Companion:
    def __init__(self,root,origin,token,vagrant='vagrant'):
        self.root,self.origin,self.token,self.vagrant=root,origin,token,vagrant;self.jobs={};self.lock=threading.Lock();self.before=set()
        self.allowed=set(json.loads((root/'catalog-contract.json').read_text())['labs'])
    def start(self,data):
        action=data.get('action');attempt=data.get('attempt');labs=data.get('labs',[])
        if action not in ('collect','reboot') or not isinstance(attempt,str) or not re.fullmatch(r'[a-zA-Z0-9-]{8,80}',attempt):raise ValueError('Acción o intento inválido.')
        if action=='collect' and (not labs or not isinstance(labs,list) or len(labs)>72 or any(lab not in self.allowed or not re.fullmatch('[a-z]+',lab) for lab in labs) or data.get('phase') not in ('before','after')):raise ValueError('Lista de retos o fase inválida.')
        if action=='reboot' and (attempt not in self.before or data.get('confirm') is not True):raise ValueError('Primero recoge el estado anterior y confirma el reinicio de las dos VMs.')
        if not self.lock.acquire(blocking=False):raise RuntimeError('Ya hay una recolección o reinicio en curso.')
        jid=str(uuid.uuid4());job={'id':jid,'status':'running','message':'Preparando conexión con las VMs…','createdAt':time.time()};self.jobs[jid]=job
        def work():
            try:
                update=lambda text:job.update(message=text)
                result=collect_nodes(self.root,labs,attempt,data['phase'],self.vagrant,update) if action=='collect' else reboot_nodes(self.root,self.vagrant,update)
                if action=='collect' and data['phase']=='before':self.before.add(attempt)
                job.update(status='done',message='Operación terminada.',result=result)
            except Exception as error:job.update(status='failed',message=str(error))
            finally:self.lock.release()
        threading.Thread(target=work,daemon=True).start();return {'jobId':jid}

def make_handler(companion):
    class Handler(BaseHTTPRequestHandler):
        def log_message(self,*args):pass
        def authorized(self):return self.headers.get('Origin')==companion.origin and hmac.compare_digest(self.headers.get('X-Linux-Lab-Token',''),companion.token)
        def send(self,value,status=200):
            payload=json.dumps(value,ensure_ascii=False).encode();self.send_response(status);self.send_header('Content-Type','application/json; charset=utf-8');self.send_header('Cache-Control','no-store');self.send_header('X-Content-Type-Options','nosniff')
            if self.headers.get('Origin')==companion.origin:self.send_header('Access-Control-Allow-Origin',companion.origin);self.send_header('Vary','Origin')
            self.send_header('Content-Length',str(len(payload)));self.end_headers();self.wfile.write(payload)
        def do_OPTIONS(self):
            if self.headers.get('Origin')!=companion.origin:return self.send({'error':'Origen no permitido.'},403)
            self.send_response(204);self.send_header('Access-Control-Allow-Origin',companion.origin);self.send_header('Access-Control-Allow-Methods','GET,POST,OPTIONS');self.send_header('Access-Control-Allow-Headers','Content-Type,X-Linux-Lab-Token');self.send_header('Vary','Origin');self.end_headers()
        def do_GET(self):
            if not self.authorized():return self.send({'error':'Emparejamiento local requerido.'},403)
            if self.path=='/status':return self.send({'ready':True,'version':1,'nodes':['server','client'],'busy':companion.lock.locked()})
            if self.path.startswith('/jobs/'):
                job=companion.jobs.get(self.path.split('/')[-1]);return self.send(job or {'error':'Operación desconocida.'},200 if job else 404)
            return self.send({'error':'No encontrado.'},404)
        def do_POST(self):
            if not self.authorized():return self.send({'error':'Emparejamiento local requerido.'},403)
            if self.path!='/jobs':return self.send({'error':'No encontrado.'},404)
            try:
                length=int(self.headers.get('Content-Length','0'))
                if length<=0 or length>20000:return self.send({'error':'Tamaño de solicitud inválido.'},413)
                data=json.loads(self.rfile.read(length));return self.send(companion.start(data),202)
            except (ValueError,RuntimeError) as error:return self.send({'error':str(error)},409)
        def do_PUT(self):return self.send({'error':'Método no permitido.'},405)
    return Handler

def main():
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('--site',required=True);parser.add_argument('--port',type=int,default=8765);parser.add_argument('--no-browser',action='store_true');args=parser.parse_args()
    parsed=urlparse(args.site)
    if parsed.scheme!='https' and not (parsed.scheme=='http' and parsed.hostname in ('127.0.0.1','localhost')):parser.error('El sitio debe usar HTTPS; HTTP solo se admite en una vista local.')
    if parsed.path not in ('','/') or parsed.query or parsed.fragment:parser.error('Usa el origen del sitio sin ruta, query ni fragmento.')
    if not 1024<=args.port<=65535:parser.error('Puerto inválido.')
    root=Path(__file__).resolve().parent
    if not (root/'Vagrantfile').exists() or not (root/'vm_probe.py').exists():parser.error('Ejecuta el agente desde el kit completo.')
    if not shutil.which('vagrant'):parser.error('Vagrant no está disponible en PATH. Compruébalo en tu sistema anfitrión.')
    token=secrets.token_hex(32);origin=args.site.rstrip('/');companion=Companion(root,origin,token)
    server=ThreadingHTTPServer(('127.0.0.1',args.port),make_handler(companion))
    print('Linux Lab · agente local activo en 127.0.0.1:'+str(args.port));print('Código de emparejamiento de esta ejecución:\n'+token);print('Solo acepta solicitudes del sitio '+origin+'. Cierra con Ctrl+C.');print('No compartas este código ni expongas el puerto a la red.')
    if not args.no_browser:webbrowser.open(origin+'/#verification')
    try:server.serve_forever()
    except KeyboardInterrupt:pass
    finally:server.server_close()
if __name__=='__main__':main()
