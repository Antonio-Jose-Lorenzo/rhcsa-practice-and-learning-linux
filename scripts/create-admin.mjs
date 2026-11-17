import {randomUUID} from 'node:crypto';
import {credentials,passwordHash} from '../server/auth.js';
import {getPool} from '../server/db.js';
import {fresh} from '../server/study.js';
function hidden(prompt){if(!process.stdin.isTTY)throw Error('Ejecuta este comando en una terminal interactiva de tu equipo.');process.stdout.write(prompt);process.stdin.setRawMode(true);process.stdin.setEncoding('utf8');process.stdin.resume();return new Promise((resolve,reject)=>{let value='';const done=()=>{process.stdin.off('data',read);process.stdin.setRawMode(false);process.stdin.pause();process.stdout.write('\n');};function read(chunk){for(const ch of chunk){if(ch==='\r'||ch==='\n'){done();resolve(value);return;}if(ch==='\u0003'){done();reject(Error('Cancelado.'));return;}if(ch==='\u007f'||ch==='\b')value=[...value].slice(0,-1).join('');else if(ch>=' '&&value.length<256)value+=ch;}}process.stdin.on('data',read);});}
const index=process.argv.indexOf('--username'),username=index>=0?process.argv[index+1]:'';
let pool;
try{
 const password=await hidden('Contraseña del administrador (no se muestra): '),confirm=await hidden('Repite la contraseña: ');
 if(password!==confirm)throw Error('Las contraseñas no coinciden.');const data=credentials({username,password}),hash=await passwordHash(data.password),now=Date.now(),id=randomUUID();
 pool=getPool();const client=await pool.connect();try{await client.query('BEGIN');await client.query("INSERT INTO linux_lab.study_profiles(id,username,password_hash,role,created_at,last_seen_at) VALUES($1,$2,$3,'admin',$4,$4)",[id,data.username,hash,now]);await client.query('INSERT INTO linux_lab.study_progress(profile_id,payload,revision,updated_at) VALUES($1,$2,0,$3)',[id,JSON.stringify(fresh()),now]);await client.query('COMMIT');}catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}
 console.log('Administrador creado. Ya puede iniciar sesión en la aplicación.');
}catch(e){console.error(e.code==='23505'?'Ese usuario ya existe; no se modificó su cuenta.':e.code?'No se pudo crear la cuenta. Revisa la conexión y la migración.':e.message);process.exitCode=1;}finally{await pool?.end();}
