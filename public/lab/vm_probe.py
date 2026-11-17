#!/usr/bin/env python3
"""Direct EX200 preparation probe. Reads state; script tests use disposable /tmp fixtures as vagrant."""
import argparse,datetime,configparser,glob,grp,hashlib,json,os,pwd,re,shutil,stat,subprocess,tarfile,tempfile
from pathlib import Path

def run(*args,timeout=15):
    try:
        p=subprocess.run(list(args),capture_output=True,text=True,timeout=timeout,check=False)
        return p.returncode,p.stdout[:100000].strip(),p.stderr[:2000].strip()
    except (OSError,subprocess.SubprocessError) as e:return 127,'',type(e).__name__

def user(*args):return run('runuser','-u','vagrant','--','env','HOME=/home/vagrant','XDG_RUNTIME_DIR=/run/user/'+str(pwd.getpwnam('vagrant').pw_uid),*args)
def read(path):return Path(path).read_text(errors='replace')
def sha(path):return hashlib.sha256(Path(path).read_bytes()).hexdigest()
def digest(value):return hashlib.sha256(json.dumps(value,sort_keys=True,ensure_ascii=True).encode()).hexdigest()
def result(passed,value,detail,persistent=True):return {'status':'pass' if passed else 'fail','persistent':persistent,'fingerprint':digest(value),'detail':detail,'observed':value}
def doc(detail,value=None):return {'status':'documental','persistent':False,'fingerprint':digest(value),'detail':detail,'observed':value}
def unsupported(detail):return {'status':'unsupported','persistent':False,'fingerprint':'','detail':detail}
def file_state(path):
    p=Path(path);s=p.stat();return {'path':str(p),'mode':oct(stat.S_IMODE(s.st_mode)),'uid':s.st_uid,'gid':s.st_gid,'hash':sha(p) if p.is_file() else None}
def mode(path):return stat.S_IMODE(Path(path).stat().st_mode)
def enabled(unit):return run('systemctl','is-enabled','--quiet',unit)[0]==0
def active(unit):return run('systemctl','is-active','--quiet',unit)[0]==0
def service(unit):return {'active':active(unit),'enabled':enabled(unit)}
def mount(path):
    code,out,_=run('findmnt','-J','--mountpoint',path,'-o','TARGET,SOURCE,FSTYPE,OPTIONS,UUID')
    return {k:v for k,v in json.loads(out)['filesystems'][0].items() if k!='source'} if code==0 else {}
def lvs():
    code,out,_=run('lvs','--reportformat','json','--units','b','--nosuffix','-o','vg_name,lv_name,lv_size')
    return json.loads(out)['report'][0]['lv'] if code==0 else []
def sudo_rule():
    out=run('sudo','-l','-U','antonio')[1]
    return '/usr/bin/systemctl status sshd' in out and not re.search(r'\(ALL[^)]*\)\s+(?:NOPASSWD:\s*)?ALL',out),out

def check(lab,i):
    role=run('hostname','-s')[1]
    if role=='client' and lab=='examservices' and i==1:
        code,_,_=user('ssh','-o','BatchMode=yes','-o','StrictHostKeyChecking=yes','-o','ConnectTimeout=5','vagrant@server.lab','true');return result(code==0,{'sshReachable':code==0},'Servicio SSH de server comprobado desde client con identidad de host verificada.')
    if role=='client' and lab=='examsepolicy' and i in (0,2):
        code,out,_=run('curl','--fail','--silent','--max-time','5','http://192.168.56.10:8081/');return result(code==0,{'httpReachable':code==0,'contentHash':hashlib.sha256(out.encode()).hexdigest()},'Acceso HTTP en el puerto 8081 probado desde client.')
    if role=='client' and lab=='examnfs':
        if i==1:
            code,out,_=run('timeout','8','cat','/mnt/ex200/compartido/saludo.txt',timeout=12);m=mount('/mnt/ex200/compartido');return result(code==0 and m.get('fstype') in ('nfs','nfs4'),{'mount':m,'contentHash':hashlib.sha256(out.encode()).hexdigest()},'Lectura real y montaje NFS comprobados desde client; documenta el rechazo de escritura y el recorrido manual. La política ro se consulta en server.')
        return doc('El montaje manual y desmontaje requieren el registro de ejecución; se recoge el estado NFS final.',run('findmnt','-t','nfs,nfs4','-J')[1])
    if lab=='examshell':
        p=Path('/srv/ex200/shell/inventario.txt')
        if i==0:
            text=read(p);host=run('hostname')[1]
            return result(host in text and any(n in text for n in ['vagrant','root','antonio']),file_state(p),'Texto, hostname e identidad observados en inventario.txt.')
        if i==1:return doc('El historial de copiar, mover y eliminar no se acredita solo con el estado final.',[str(p) for p in Path('/srv/ex200/shell').rglob('*')][:30])
        return doc('El cambio de identidad y el recorrido de redirecciones requieren evidencia de ejecución; no se infieren de una marca.')
    if lab=='examregex':
        source=read('/opt/ex200/access.log').splitlines();root=Path('/srv/ex200/expediente')
        if i==0:
            p=root/'errores.txt';return result(read(p).splitlines()==[l for l in source if 'ERROR' in l],file_state(p),'Comparación exacta de eventos ERROR contra la fuente.')
        if i==1:
            p=root/'solicitudes-1.txt';expected=[l for l in source if re.search(r'(?:request_id=|solicitud\s+)(?:[0-9]*1)\b',l)];return result(read(p).splitlines()==expected,file_state(p),'Comparación de la salida solicitudes-1.txt con el criterio de identificador.')
        return doc('El patrón utilizado y la separación de stderr requieren el registro de ejecución.')
    if lab=='examssh':
        if i==0:
            code,_,err=user('ssh','-o','BatchMode=yes','-o','StrictHostKeyChecking=yes','-o','ConnectTimeout=6','vagrant@server.lab','true')
            return result(code==0,{'keyAccess':code==0},'Prueba SSH no interactiva, con verificación de host: '+('correcta' if code==0 else err),True)
        if i==1:
            p='/home/vagrant/evidencia.log';return result(sha(p)==sha('/opt/ex200/access.log'),file_state(p),'SHA-256 del archivo transferido comparado con la fuente.')
        folder=Path('/home/vagrant/.ssh');files=[p for p in folder.glob('*') if p.is_file() and p.name in ['id_rsa','id_ed25519','authorized_keys']];safe=mode(folder)<=0o700 and all(mode(p)&0o077==0 for p in files)
        return result(safe,{'folder':oct(mode(folder)),'files':{p.name:oct(mode(p)) for p in files}},'Permisos de claves comprobados sin leer su contenido.')
    if lab=='examarchives':
        origin=Path('/srv/ex200/archivo-origen');back=Path('/srv/ex200/archivos')
        archives=[back/'respaldo.tar.gz',back/'respaldo.tar.bz2']
        if i==0:
            states=[]
            for p,kind in zip(archives,['r:gz','r:bz2']):
                with tarfile.open(p,kind) as t:states.append({'archive':p.name,'entries':[(m.name,m.type.decode(errors='replace')) for m in t.getmembers()]})
            return result(all(s['entries'] for s in states),states,'Ambos tar se pueden listar con la compresión solicitada.')
        expected={str(p.relative_to(origin)):sha(p) for p in origin.rglob('*') if p.is_file() and not p.is_symlink()}
        actual=[{str(p.relative_to(back/name)):sha(p) for p in (back/name).rglob('*') if p.is_file() and not p.is_symlink()} for name in ['restaurado-gzip','restaurado-bzip2']]
        if i==1:return result(bool(expected) and all(a==expected for a in actual),actual,'Árboles restaurados comparados por rutas y hashes.')
        return doc('Los checksums se recogen directamente; documenta el manifiesto anterior y el recorrido de extracción.',actual)
    if lab=='examlinks':
        root=Path('/srv/ex200/enlaces');a=root/'dato.txt';hard=root/'fisico.txt';sym=root/'simbolico.txt'
        if i==0:return result(not hard.is_symlink() and os.path.samefile(a,hard) and sym.is_symlink() and sym.resolve()==a.resolve(),{'hardSame':os.path.samefile(a,hard),'symlink':str(sym.readlink())},'Identidad del enlace físico y destino del simbólico comprobados.')
        if i==1:return result(mode(a)==0o640,file_state(a),'Modo final 640 y contenido identificados.')
        return doc('La prueba histórica de renombrado requiere registro; el estado final de enlaces se verifica por separado.')
    if lab=='examdocs':return doc('La consulta de man, info y documentos es transitoria: aporta sección, nodo o ruta y su uso.',{'man':run('man','-w','bash')[1],'infoInstalled':bool(shutil.which('info')),'docDirectories':len(glob.glob('/usr/share/doc/*'))})
    if lab=='examrpm':
        if i==0:
            code,out,_=run('rpm','-q','tree');return result(code==0 and shutil.which('tree') is not None,{'package':out},'Paquete tree y ejecutable consultados en la VM.')
        if i==1:
            p=Path('/etc/yum.repos.d/ex200-lab.repo');cfg=configparser.ConfigParser(interpolation=None);cfg.read(p);secure=bool(cfg.sections()) and all(cfg.get(section,'gpgcheck',fallback='')=='1' and any('rockylinux.org' in cfg.get(section,key,fallback='') for key in ['baseurl','mirrorlist','metalink']) for section in cfg.sections());return result(secure,file_state(p),'Archivo, IDs, origen Rocky y comprobación de firma observados; documenta la disponibilidad efectiva del repositorio.')
        return doc('El ciclo de instalación/retirada se acredita con el historial de transacciones.',run('dnf','history','list',timeout=25)[1])
    if lab=='examflatpak':
        code,remotes,_=user('flatpak','--user','remotes','--columns=name,url')
        if i==0:return result(code==0 and any(line.startswith('flathub') and 'flathub.org' in line for line in remotes.splitlines()),{'remotes':remotes},'Remotes de usuario consultados directamente.')
        history=user('flatpak','--user','history','--columns=time,change,ref')[1]
        return doc('La instalación y retirada son acciones transitorias; contrasta las referencias con el historial recogido.',{'history':history,'applications':user('flatpak','--user','list')[1]})
    if lab=='examscript':
        path='/srv/ex200/inventario.sh';syntax=run('bash','-n',path)[0]==0
        if not syntax or not os.access(path,os.X_OK):return result(False,{},'El script no es ejecutable o su sintaxis no pasa bash -n.',True)
        if i==0:
            a=run('runuser','-u','vagrant','--','bash',path);b=run('runuser','-u','vagrant','--','bash',path,'/ruta/ex200-inexistente','/tmp/ex200-salida-no-creada')
            return result(a[0]!=0 and bool(a[2]) and b[0]!=0 and bool(b[2]),{'missingArgs':a[0]!=0,'missingPath':b[0]!=0},'Pruebas acotadas de argumentos inválidos como vagrant.',False)
        with tempfile.TemporaryDirectory(prefix='ex200-test-') as tmp:
            root=Path(tmp);os.chmod(root,0o777);source=root/'entrada';source.mkdir(mode=0o755);(source/'nombre con espacios.txt').write_text('abc');(source/'otro.txt').write_text('12345');out=root/'salida';empty=root/'vacio';empty.mkdir(mode=0o755)
            code,_,_=run('runuser','-u','vagrant','--','bash',path,str(source),str(out));content=out.read_text() if out.exists() else ''
            emptyout=root/'salida-vacia';ecode,_,_=run('runuser','-u','vagrant','--','bash',path,str(empty),str(emptyout));emptytext=emptyout.read_text() if emptyout.exists() else None
            good=code==0 and any('nombre con espacios.txt' in l and re.search(r'\b3\b',l) for l in content.splitlines()) and any('otro.txt' in l and re.search(r'\b5\b',l) for l in content.splitlines()) and ecode==0 and emptytext==''
            if i==1:return result(good,{'spaceName':good,'empty':emptytext==''},'Prueba funcional de nombres con espacios y directorio vacío en un fixture temporal.',False)
            script=read(path);logic=bool(re.search(r'\b(if|test)\b|\[',script)) and bool(re.search(r'\b(for|while)\b',script))
            return result(good and logic,{'hash':sha(path),'resultMatches':good,'logic':logic},'Resultados del inventario y estructuras de control contrastados; no se ejecuta como root.',True)
    if lab=='examboottarget':
        if i==1:
            target=run('systemctl','get-default')[1];return result(target=='multi-user.target',{'target':target},'Target predeterminado consultado.')
        return doc('Los pasos de arranque/apagado y target temporal requieren registro de consola.',{'default':run('systemctl','get-default')[1],'boots':run('journalctl','--list-boots','--no-pager')[1]})
    if lab=='examrecovery' and i==2:
        enforce=run('getenforce')[1];label=run('stat','-c','%C','/etc/shadow')[1];return result(enforce=='Enforcing' and ':shadow_t:' in label,{'enforcing':enforce,'shadowContext':label},'Modo SELinux y contexto de shadow comprobados tras el arranque.')
    if lab=='examrecovery':return doc('La recuperación de credenciales y el proceso de arranque no se infieren del estado final; requieren evidencia de consola sin secretos.',{'selinux':run('getenforce')[1],'bootId':read('/proc/sys/kernel/random/boot_id').strip()})
    if lab=='examprocess':
        if i<2:return doc('La carga, cambio de nice y terminación son acciones transitorias; usa los registros de ejecución.',run('ps','-eo','pid,ppid,ni,comm,%cpu,%mem','--sort=-%cpu')[1][:5000])
        code,out,_=run('tuned-adm','active');return result(code==0 and bool(out),{'activeProfile':out},'Perfil tuned activo consultado; la justificación se documenta.')
    if lab=='examjournal':
        files=glob.glob('/var/log/journal/*/system*.journal');persistent=any(Path(p).stat().st_size>0 for p in files)
        if i==0:return result(persistent,{'persistent':persistent},'Presencia de journal persistente en disco.')
        if i==1:
            code,out,_=run('journalctl','-t','ex200-lab','-o','json','--no-pager');current=read('/proc/sys/kernel/random/boot_id').strip().replace('-','');events=[json.loads(line) for line in out.splitlines() if line.startswith('{')];prior=any(e.get('_BOOT_ID')!=current for e in events);return result(code==0 and prior,{'previousEvent':prior},'Evento ex200-lab encontrado en un arranque anterior al actual.',False)
        return doc('La interpretación de un registro requiere tu análisis; se adjunta evidencia real de sshd.',run('journalctl','-u','sshd','-n','10','--no-pager')[1])
    if lab=='examservices':
        if i==0:return doc('El recorrido de parada/inicio necesita su registro; se recoge el estado actual.',service('sshd'))
        value=service('sshd');return result(value['active'] and value['enabled'],value,'sshd activo y habilitado observado en la VM.')
    if lab=='examgpt':
        devices=json.loads(run('lsblk','-J','-b','-o','NAME,TYPE,SIZE,FSTYPE,PTTYPE,MOUNTPOINTS')[1]).get('blockdevices',[])
        disks=[d for d in devices if d['type']=='disk' and 7*1024**3<=int(d['size'])<=9*1024**3]
        valid=[d for d in disks if d.get('pttype')=='gpt' and d.get('children')]
        if i==0:return result(bool(disks),{'practiceDisks':[d['name'] for d in disks]},'Discos de práctica identificados por tamaño; no se elige ni modifica un dispositivo.')
        if i==1:return result(bool(valid),{'gpt':[{'disk':d['name'],'parts':[(c['name'],c['size']) for c in d['children']]} for d in valid]},'GPT y particiones existentes consultadas.')
        return doc('La eliminación y recreación histórica de una partición necesita registro; el estado final se observa directamente.',valid)
    if lab=='exampv':
        code,out,_=run('pvs','--reportformat','json','-o','pv_name,vg_name');rows=json.loads(out)['report'][0]['pv'] if code==0 else []
        if i==0:return result(any(r['vg_name']=='vg_lab' for r in rows),rows,'Asignación de PV a vg_lab consultada.')
        return doc('La creación y retirada del PV temporal y la justificación de capas requieren evidencia; se adjunta el inventario final.',rows)
    if lab=='examlv':
        rows=lvs();data=next((r for r in rows if r['vg_name']=='vg_lab' and r['lv_name']=='datos'),None)
        if i==0:return result(bool(data) and float(data['lv_size'])>=512*1024**2,data,'LV datos existente. La ampliación posterior puede aumentar su tamaño.')
        if i==1:return doc('La creación y retirada del LV temporal requiere evidencia del recorrido.',rows)
        m=mount('/srv/ex200/lvm');return result(m.get('fstype')=='xfs',m,'Montaje XFS del LV consultado.')
    if lab=='exammount':
        m=mount('/srv/ex200/disco');fstab=read('/etc/fstab')
        if i==0:
            label=run('findmnt','-n','--mountpoint','/srv/ex200/disco','-o','LABEL')[1];return result(m.get('fstype')=='ext4' and label=='EX200DATA',{'mount':m,'label':label},'Montaje ext4 y etiqueta EX200DATA observados.')
        line=next((l for l in fstab.splitlines() if not l.lstrip().startswith('#') and '/srv/ex200/disco' in l),'');valid=bool(re.match(r'\s*(UUID=|LABEL=)',line))
        return result(valid and m.get('fstype')=='ext4',{'entry':line,'uuid':m.get('uuid'),'fstype':m.get('fstype')},'Entrada por UUID/etiqueta y montaje efectivo comprobados.')
    if lab=='examswap':
        code,out,_=run('swapon','--show','--json','--bytes');rows=json.loads(out).get('swapdevices',[]) if code==0 else []
        selected=[{k:v for k,v in r.items() if k!='used'} for r in rows if 'intercambio' in r.get('name','')]
        if i==0:return result(bool(selected) and int(selected[0].get('size',0))>=250*1024**2,selected,'Swap adicional activo observado.')
        if i==1:
            line=next((l for l in read('/etc/fstab').splitlines() if not l.startswith('#') and re.search(r'\s+swap\s+',l) and l.startswith('UUID=')),'');return result(bool(line) and bool(selected),{'entry':line,'swap':selected},'Persistencia por UUID y swap activo comprobados.')
        return doc('La conservación de los datos se contrasta con tus hashes anteriores; se recoge el inventario actual.',lvs())
    if lab=='examformats':
        rows=[]
        for p in Path('/srv/ex200/fs').iterdir():
            m=mount(str(p))
            if m:rows.append(m)
        if i==0:return result({'vfat','ext4','xfs'}.issubset({r['fstype'] for r in rows}),rows,'Los tres formatos están montados y se identifican por findmnt.')
        return doc('Lectura/escritura, desmontaje y comparación de hashes requieren el registro de prueba.',rows)
    if lab=='examnfs':
        text=run('exportfs','-v')[1];block=re.search(r'^/srv/ex200/compartido\s+(.*?)(?=^/|\Z)',text,re.M|re.S);entries=re.findall(r'(\S+)\s*\(([^)]*)\)',block.group(1)) if block else [];expected=len(entries)==1 and entries[0][0]=='192.168.56.20' and 'ro' in entries[0][1].split(',')
        if i==0:return result(expected and Path('/srv/ex200/compartido/saludo.txt').is_file(),{'exports':entries,'fileHash':sha('/srv/ex200/compartido/saludo.txt')},'Exportación de solo lectura, alcance exclusivo a client y archivo saludo.txt observados en server.')
        return doc('El montaje manual, rechazo de escritura y desmontaje se acreditan con evidencia de client.',{'nfsService':service('nfs-server')})
    if lab=='examautofs':
        configs={str(p):read(p) for p in [Path('/etc/auto.master'),*Path('/etc/auto.master.d').glob('*'),*Path('/etc').glob('auto.*')] if p.is_file()}
        effective=active('autofs');readcode,readout,_=run('timeout','8','cat','/mnt/ex200/compartido/saludo.txt',timeout=12);text='\n'.join(configs.values());declared='/mnt/ex200' in text and ('server' in text or '192.168.56.10' in text)
        if i==1:return doc('La expiración de un montaje por inactividad necesita registro de la prueba.',{'active':effective,'declared':declared})
        return result(effective and declared and readcode==0,{'maps':configs,'contentHash':hashlib.sha256(readout.encode()).hexdigest()},'Servicio autofs, mapas y lectura real del recurso por demanda comprobados.')
    if lab=='examgrow':
        row=next((r for r in lvs() if r['vg_name']=='vg_lab' and r['lv_name']=='datos'),None);m=mount('/srv/ex200/lvm')
        if i==0:return result(bool(row) and float(row['lv_size'])>=1024**3 and m.get('fstype')=='xfs',{'lv':row,'mount':m},'LV de al menos 1 GiB y XFS montado observados.')
        if i==1:return doc('El checksum anterior a la ampliación debe contrastarse con el archivo actual.',{'mount':m})
        line=next((l for l in read('/etc/fstab').splitlines() if '/srv/ex200/lvm' in l and not l.startswith('#')),'');return result(line.startswith('UUID=') and m.get('fstype')=='xfs',{'entry':line,'mount':m},'Montaje por UUID y estado efectivo consultados.')
    if lab=='examperms':
        path='/srv/ex200/equipo';group=grp.getgrnam('operaciones');st=Path(path).stat()
        if i==0:return result(st.st_gid==group.gr_gid and bool(st.st_mode&stat.S_ISGID),{'gid':st.st_gid,'mode':oct(stat.S_IMODE(st.st_mode))},'Grupo propietario y setgid observados.')
        if i==1:return doc('Los permisos de archivos nuevos y la prueba desde identidades distintas requieren evidencia funcional.',{'mode':oct(stat.S_IMODE(st.st_mode))})
        return doc('El diagnóstico y reparación del fallo de búsqueda necesitan el registro del incidente.',{'mode':oct(stat.S_IMODE(st.st_mode))})
    if lab=='examscheduler':
        value=service('ex200-heartbeat.timer');units={name:run('systemctl','cat',name)[1] for name in ['ex200-heartbeat.timer','ex200-heartbeat.service']}
        if i==0:return result(value['active'] and value['enabled'],{'state':value,'units':units},'Timer activo/habilitado y unidades leídas.')
        if i==1:return doc('at es transitorio; conserva evidencia de su ejecución y de cron.',{'atQueue':run('atq')[1],'cron':run('crontab','-u','vagrant','-l')[1]})
        return result(bool(units['ex200-heartbeat.timer']) and bool(units['ex200-heartbeat.service']) and value['active'],units,'Configuración de las unidades consultada; contrasta la ejecución con el registro.')
    if lab=='examtimeboot':
        if i==0:
            sources=run('chronyc','sources','-n')[1];config=read('/etc/chrony.conf');return result(active('chronyd') and '^*' in sources,{'config':config,'active':active('chronyd')},'chronyd activo con fuente seleccionada; configuración leída.')
        grub=read('/etc/default/grub');return doc('El cambio y la comprobación en consola del cargador requieren registro; se recoge su configuración.',{'grub':grub})
    if lab=='examrepo':return doc('La procedencia y el historial de transacciones se recogen; identifica la transacción y el RPM local utilizado.',{'repos':run('dnf','repolist','--enabled',timeout=25)[1],'history':run('dnf','history','list',timeout=25)[1]})
    if lab=='examnetwork':
        role=run('hostname','-s')[1];ip4='192.168.56.10' if role=='server' else '192.168.56.20';ip6='fd42:200::10' if role=='server' else 'fd42:200::20';addresses=run('ip','-j','address')[1];data=json.loads(addresses);allips=[a['local'] for d in data for a in d.get('addr_info',[])];routes=run('ip','route','show','default')[1]
        if i==0:return result(ip4 in allips and ip6 in allips,{'private':sorted(ip for ip in allips if ip.startswith('192.168.56.') or ip.startswith('fd42:200:'))},'Direcciones privadas IPv4 e IPv6 leídas en el nodo.')
        host=run('getent','ahostsv4','server.lab')[1];client=run('getent','ahostsv4','client.lab')[1];good='192.168.56.10' in host and '192.168.56.20' in client
        peer4='192.168.56.20' if role=='server' else '192.168.56.10';peer6='fd42:200::20' if role=='server' else 'fd42:200::10';ping4=run('ping','-c','1','-W','2',peer4)[0]==0;ping6=run('ping','-6','-c','1','-W','2',peer6)[0]==0;return result(good and bool(routes) and ping4 and ping6 and ip4 in allips and ip6 in allips,{'hosts':[host,client],'defaultRoute':routes,'ipv4Reachable':ping4,'ipv6Reachable':ping6},'Resolución, ruta NAT y comunicación IPv4/IPv6 con el otro nodo comprobadas.')
    if lab=='examusers':
        if i==0:
            group=grp.getgrnam('operaciones');members={name:run('id','-nG',name)[1] for name in ['antonio','ana']};return result(all('operaciones' in value.split() for value in members.values()),{'members':members,'gid':group.gr_gid},'Cuentas y pertenencias observadas en server.')
        if i==1:
            row=next(l.split(':') for l in read('/etc/shadow').splitlines() if l.startswith('antonio:'));value={'max':row[4],'warn':row[5],'passwordSet':bool(row[1]) and not row[1].startswith(('!','*'))};return result(value['max']=='90' and value['warn']=='7' and value['passwordSet'],value,'Caducidad y existencia de contraseña observadas sin recoger el hash.')
        allowed,out=sudo_rule();return doc('La delegación sudo se consulta directamente; el ciclo del usuario/grupo temporal requiere registro.',{'sudoLimited':allowed,'listing':out})
    if lab=='examfirewall':
        state=active('firewalld');addresses=json.loads(run('ip','-j','address')[1]);iface=next((d['ifname'] for d in addresses if any(a.get('local','').startswith('192.168.56.') for a in d.get('addr_info',[]))),'')
        zone=run('firewall-cmd','--get-zone-of-interface',iface)[1] if iface else ''
        if not zone or zone=='no zone':zone=run('firewall-cmd','--get-default-zone')[1]
        runtime=run('firewall-cmd','--zone='+zone,'--list-services')[1].split();permanent=run('firewall-cmd','--permanent','--zone='+zone,'--list-services')[1].split()
        if i==1:return doc('Las pruebas positivas y negativas desde client requieren su registro de ejecución.',{'interface':iface,'zone':zone})
        consistent=all(service in runtime and service in permanent for service in ['ssh','nfs'])
        return result(state and bool(iface) and consistent,{'interface':iface,'zone':zone,'runtime':sorted(runtime),'permanent':sorted(permanent)},'Zona real de la interfaz privada, servicios runtime/permanentes y firewalld activo consultados.')
    if lab=='examsecontext':
        enforce=run('getenforce')[1];label=run('stat','-c','%C','/srv/ex200/web')[1];rules=run('semanage','fcontext','-l','-C')[1]
        if i==0:return result(enforce=='Enforcing' and ':httpd_sys_content_t:' in label and '/srv/ex200/web' in rules,{'mode':enforce,'label':label,'rules':rules},'Enforcing y contexto web efectivo/declarado observados.')
        if i==1:return doc('El cambio temporal a permissive y regreso requieren registro; se recogen los dominios de httpd.',{'mode':enforce,'processes':run('ps','-eZ')[1].split('httpd')[:3]})
        return doc('La restauración tras provocar un contexto incorrecto requiere evidencia del incidente; el contexto final se comprueba directamente.',{'label':label,'rules':rules})
    if lab=='examsepolicy':
        if i==0:
            ports=run('semanage','port','-l')[1];match=next((line for line in ports.splitlines() if line.startswith('http_port_t') and re.search(r'\b8081\b',line)),'');response=run('curl','--fail','--silent','--max-time','5','http://192.168.56.10:8081/')[0]==0
            return result(bool(match) and response,{'portPolicy':match,'pageResponds':response},'Etiqueta de puerto y respuesta HTTP comprobadas en server; el acceso desde client se documenta.')
        if i==1:
            spec=json.loads(read('/srv/ex200/booleano.json'));name=spec.get('name');desired=spec.get('value');allowed={'httpd_use_nfs','httpd_can_network_connect','httpd_read_user_content','httpd_enable_homedirs'}
            if name not in allowed or desired not in ('on','off'):return result(False,{},'Selecciona un booleano HTTP/NFS y registra name/value en booleano.json.')
            code,out,_=run('getsebool',name);observed={'name':name,'expected':desired,'actual':out,'custom':next((l for l in run('semanage','boolean','-l','-C')[1].splitlines() if l.startswith(name+' ')),'')}
            return result(code==0 and out.endswith('--> '+desired),observed,'Booleano seleccionado consultado directamente; el valor debe mantenerse tras el reinicio.')
        config=[(str(p),sha(p)) for p in Path('/etc/httpd/conf.d').glob('*.conf')];mode=run('getenforce')[1];return result(mode=='Enforcing' and active('httpd'),{'mode':mode,'httpd':service('httpd'),'config':config},'Protección y servicio HTTP activos; configuración recogida para comparar tras reiniciar.')
    return unsupported('Este criterio no dispone de un control directo en esta versión.')

# The node providing each task is fixed; both nodes always return identity and inventory.
CLIENT={'examssh','examflatpak','examboottarget','examrecovery','examformats','examautofs'}
TASKS={'examshell','examregex','examssh','examarchives','examlinks','examdocs','examrpm','examflatpak','examscript','examboottarget','examrecovery','examprocess','examjournal','examservices','examgpt','exampv','examlv','exammount','examswap','examformats','examnfs','examautofs','examgrow','examperms','examscheduler','examtimeboot','examrepo','examnetwork','examusers','examfirewall','examsecontext','examsepolicy'}
def check_roles(lab,i):
    if lab=='examnetwork':return ('server','client')
    if lab=='examnfs':return ('server',) if i==0 else ('client',)
    if lab=='examservices' and i==1:return ('server','client')
    if lab=='examsepolicy' and i!=1:return ('server','client')
    return ('client',) if lab in CLIENT else ('server',)

def probe(role,labs):
    release=read('/etc/os-release');hostname=run('hostname','-s')[1]
    if not re.search(r'^ID="?rocky"?$',release,re.M) or not re.search(r'^VERSION_ID="?(?:9|10)(?:\.|"|$)',release,re.M) or hostname!=role:raise ValueError('Se requiere el nodo Rocky de laboratorio esperado.')
    results=[]
    for lab in labs:
        if lab not in TASKS:continue
        for i in range(3):
            if role not in check_roles(lab,i):continue
            try:value=check(lab,i)
            except Exception as e:value=result(False,{},'No se pudo comprobar el recurso: '+type(e).__name__+'. Revisa requisitos y nombres esperados.')
            value['requiresDocumentation']=(lab,i) in {('examnfs',1),('examssh',2),('examrpm',1),('examprocess',2),('examlv',0),('examlv',2),('examscheduler',2),('examtimeboot',0),('examsepolicy',0),('examsepolicy',1),('examsepolicy',2)}
            results.append({'lab':lab,'criterion':i,**value})
    return {'role':role,'hostname':run('hostname')[1],'machineId':read('/etc/machine-id').strip(),'bootId':read('/proc/sys/kernel/random/boot_id').strip(),'os':next((l.split('=',1)[1].strip('"') for l in release.splitlines() if l.startswith('PRETTY_NAME=')),''),'capturedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'inventory':{'addresses':run('ip','-br','address')[1],'failedServices':run('systemctl','--failed','--no-pager')[1],'selinux':run('getenforce')[1]},'results':results}
def main():
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--role',choices=['server','client'],required=True);p.add_argument('--labs',required=True);a=p.parse_args();labs=a.labs.split(',')
    if any(not re.fullmatch(r'[a-z]+',lab) for lab in labs):p.error('IDs inválidos.')
    if os.geteuid()!=0:p.error('Ejecutar dentro de la VM con sudo.')
    print('EX200_NODE='+json.dumps(probe(a.role,labs),ensure_ascii=False))
if __name__=='__main__':main()
