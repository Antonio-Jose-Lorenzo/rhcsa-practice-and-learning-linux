import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {getPool} from '../server/db.js';
const dir=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../supabase/migrations');let pool;
try{pool=getPool();for(const file of fs.readdirSync(dir).filter(x=>x.endsWith('.sql')).sort()){
 // First migration fails safely if the schema already exists. It never drops data.
 const marker=(await pool.query("SELECT to_regclass('linux_lab.schema_migrations') AS marker")).rows[0].marker;
 if(marker&&(await pool.query('SELECT version FROM linux_lab.schema_migrations WHERE version=$1',[file])).rowCount){console.log(file+': ya aplicada.');continue;}
 await pool.query(fs.readFileSync(path.join(dir,file),'utf8'));console.log(file+': aplicada.');
} }catch(e){console.error('No se aplicó la migración. Revisa la conexión o el esquema existente; no se eliminaron tablas de forma automática.');process.exitCode=1;}finally{await pool?.end();}
