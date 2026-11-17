import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import {fileURLToPath} from 'node:url';import {randomUUID} from 'node:crypto';
import {PGlite} from '@electric-sql/pglite';
import {createApi} from '../server/api.js';import {normalizeRow,connectionOptions} from '../server/db.js';import {passwordHash,hashToken} from '../server/auth.js';import {makeSession,closeSession} from '../public/core.js';import {examTasks} from '../public/exam.js';
const origin='https://linux-lab.test',password='Synthetic-lab-password-2026';
function adapter(engine){return {async query(text,values=[]){const r=await engine.query(text,values);return {rows:r.rows.map(normalizeRow),rowCount:r.affectedRows??r.rows.length};},transaction:fn=>engine.transaction(tx=>fn(adapter(tx)))};}
async function setup(){const engine=new PGlite();await engine.exec('CREATE ROLE anon; CREATE ROLE authenticated;');await engine.exec(fs.readFileSync(fileURLToPath(new URL('../supabase/migrations/202611170001_linux_lab.sql',import.meta.url)),'utf8'));const db=adapter(engine),env={APP_ORIGIN:origin,REGISTRATION_MODE:'invite',REGISTRATION_CODE:'local-invite-only'},api=createApi(db,env);
 const call=async(path,method='GET',body,cookie='',headers={})=>api(new Request(origin+path,{method,headers:{Origin:origin,'Content-Type':'application/json',Cookie:cookie,...headers},...(body?{body:JSON.stringify(body)}:{})}));
 const register=async username=>{const r=await call('/api/auth','POST',{mode:'register',username,password,inviteCode:env.REGISTRATION_CODE});assert.equal(r.status,200,await r.clone().text());return {data:await r.json(),cookie:r.headers.get('set-cookie').split(';')[0]};};
 return {engine,db,env,api,call,register};}
async function fixture(fn){const ctx=await setup();try{await fn(ctx);}finally{await ctx.engine.close();}}

test('PostgreSQL migration applies, enables RLS and denies browser database roles',()=>fixture(async({engine,db})=>{
 const rows=(await db.query("SELECT tablename,rowsecurity FROM pg_tables WHERE schemaname='linux_lab'")).rows;assert.equal(rows.length,8);assert.ok(rows.every(r=>r.rowsecurity));
 for(const role of ['anon','authenticated'])assert.equal((await db.query("SELECT has_schema_privilege($1,'linux_lab','USAGE') AS allowed",[role])).rows[0].allowed,false);
 await engine.exec('CREATE ROLE outsider; GRANT USAGE ON SCHEMA linux_lab TO outsider; GRANT SELECT ON linux_lab.study_profiles TO outsider;');
 const id=randomUUID();await db.query("INSERT INTO linux_lab.study_profiles VALUES($1,'invisible','test-hash','user',1,1)",[id]);
 await engine.exec('SET ROLE outsider');assert.equal((await db.query('SELECT * FROM linux_lab.study_profiles')).rows.length,0);await engine.exec('RESET ROLE');
}));
test('standalone authentication isolates progress, ignores ChatGPT identity headers and enforces CSRF/revisions',()=>fixture(async({call,register,db})=>{
 assert.equal((await call('/api/me')).status,401);assert.equal((await call('/api/auth','POST',{mode:'register',username:'bad',password,inviteCode:'incorrect'})).status,403);
 const a=await register('persona_a'),b=await register('persona_b');assert.notEqual(a.data.profile.id,b.data.profile.id);
 const hashes=(await db.query('SELECT password_hash FROM linux_lab.study_profiles')).rows;assert.equal(new Set(hashes.map(h=>h.password_hash)).size,2);assert.ok(hashes.every(h=>h.password_hash.startsWith('scrypt$')&&!h.password_hash.includes(password)));
 const state=a.data.state;state.journal.push({title:'Nota privada',body:'Prueba de separación del historial entre cuentas.',at:Date.now()});assert.equal((await call('/api/state','PUT',{state,revision:0},a.cookie)).status,200);
 assert.equal((await call('/api/state','PUT',{state,revision:0},a.cookie)).status,409);
 assert.equal((await (await call('/api/me','GET',null,b.cookie,{'oai-authenticated-user-id':a.data.profile.id})).json()).state.journal.length,0);
 assert.equal((await call('/api/state','PUT',{state,revision:1},a.cookie,{Origin:'https://evil.test'})).status,403);
 const wrong=await call('/api/auth','POST',{mode:'login',username:'persona_a',password:'Wrong-synthetic-password'});assert.equal(wrong.status,401);
 const login=await call('/api/auth','POST',{mode:'login',username:'persona_a',password});assert.equal(login.status,200);assert.match(login.headers.get('set-cookie'),/HttpOnly; SameSite=Strict/);assert.match(login.headers.get('set-cookie'),/Secure/);
 assert.equal((await call('/api/logout','POST',{},a.cookie)).status,200);assert.equal((await call('/api/me','GET',null,a.cookie)).status,401);
}));
test('registration defaults closed and no visitor can become administrator by registering first',()=>fixture(async({db,env,register})=>{
 const closed=createApi(db,{APP_ORIGIN:origin});const request=new Request(origin+'/api/auth',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({mode:'register',username:'primero',password})});assert.equal((await closed(request)).status,403);
 const account=await register('estudiante');assert.equal(account.data.profile.role,'user');
}));
test('VM reports require both nodes and preserve immutable baseline, deadline and closed work',()=>fixture(async({call,register,db})=>{
 const a=await register('vm_user'),state=a.data.state,attempt=makeSession(['examnetwork'],'exam',Date.now(),'vm-attempt-123');attempt.work.examnetwork.notes='Evidencia de red y persistencia registrada en el intento.';closeSession(attempt,examTasks);state.history.push(attempt);
 assert.equal((await call('/api/state','PUT',{state,revision:0},a.cookie)).status,200);
 attempt.work.examnetwork.notes='Changed after closure';attempt.verification={status:'compared'};assert.equal((await call('/api/state','PUT',{state,revision:1},a.cookie)).status,200);
 const frozen=await (await call('/api/me','GET',null,a.cookie)).json();assert.notEqual(frozen.state.history[0].work.examnetwork.notes,'Changed after closure');assert.equal(frozen.state.history[0].verification.status,'pending');
 const at=Date.now(),make=(phase,boot,time)=>({schema:2,kind:'ex200-direct-report',attempt:attempt.id,phase,generatedAt:new Date(time).toISOString(),machines:['server','client'].map((role,i)=>({role,hostname:role+'.lab',machineId:String(i+1).repeat(32),bootId:`${boot.repeat(8)}-${boot.repeat(4)}-${boot.repeat(4)}-${boot.repeat(4)}-${boot.repeat(12)}`,results:[0,1,2].map(criterion=>({lab:'examnetwork',criterion,status:'pass',persistent:true,fingerprint:'a'.repeat(64),detail:'Synthetic network check'}))}))});
 const before=make('before','a',at),after=make('after','b',at+1000);
 assert.equal((await call('/api/evidence','POST',{attemptId:attempt.id,phase:'before',report:{...before,machines:[before.machines[0]]}},a.cookie)).status,400);
 assert.equal((await call('/api/evidence','POST',{attemptId:attempt.id,phase:'before',report:before},a.cookie)).status,200);
 let result=await (await call('/api/evidence','POST',{attemptId:attempt.id,phase:'after',report:after},a.cookie)).json();assert.equal(result.attempt.verification.checks.examnetwork[0].pass,true);assert.equal(result.attempt.score.total,30);assert.equal(result.attempt.score.technical,30);assert.equal(result.attempt.score.documentary,0);
 await call('/api/evidence','POST',{attemptId:attempt.id,phase:'before',report:make('before','c',at+2000)},a.cookie);assert.equal(JSON.parse((await db.query("SELECT payload FROM linux_lab.vm_reports WHERE phase='before'")).rows[0].payload).machines[0].bootId,before.machines[0].bootId);
 after.machines[1].results[0].fingerprint='b'.repeat(64);result=await (await call('/api/evidence','POST',{attemptId:attempt.id,phase:'after',report:after},a.cookie)).json();assert.equal(result.attempt.verification.checks.examnetwork[0].pass,false);assert.equal(result.attempt.score.total,20);
}));
test('administrator lists inactivity, deletion requires recent authentication, exact confirmation and current activity',()=>fixture(async({register,db,call})=>{
 const admin=await register('owner'),target=await register('inactivo');await db.query("UPDATE linux_lab.study_profiles SET role='admin' WHERE id=$1",[admin.data.profile.id]);
 const old=Date.now()-120*86400000;await db.query('UPDATE linux_lab.study_profiles SET last_seen_at=$1 WHERE id=$2',[old,target.data.profile.id]);
 assert.equal((await call('/api/admin/users','GET',null,target.cookie)).status,403);
 await db.query('UPDATE linux_lab.study_profiles SET last_seen_at=$1 WHERE id=$2',[old,target.data.profile.id]);
 const users=await (await call('/api/admin/users?inactiveDays=90','GET',null,admin.cookie)).json();assert.deepEqual(users.users.map(u=>u.username),['inactivo']);assert.ok(!JSON.stringify(users).includes('password_hash'));
 assert.equal((await call('/api/admin/delete-preview?id='+admin.data.profile.id,'GET',null,admin.cookie)).status,403);
 const preview=await (await call('/api/admin/delete-preview?id='+target.data.profile.id,'GET',null,admin.cookie)).json();
 assert.equal((await call('/api/admin/delete','POST',{id:target.data.profile.id,token:preview.token,confirmation:'wrong'},admin.cookie)).status,400);
 await call('/api/me','GET',null,target.cookie);
 assert.equal((await call('/api/admin/delete','POST',{id:target.data.profile.id,token:preview.token,confirmation:'inactivo'},admin.cookie)).status,409);
 await db.query('UPDATE linux_lab.study_sessions SET created_at=$1 WHERE profile_id=$2',[Date.now()-910000,admin.data.profile.id]);assert.equal((await call('/api/admin/delete-preview?id='+target.data.profile.id,'GET',null,admin.cookie)).status,403);
}));
test('confirmed deletion cascades progress, reports and all sessions; unrelated accounts remain',()=>fixture(async({register,db,call})=>{
 const owner=await register('administrator'),target=await register('remove_me'),other=await register('keep_me');await db.query("UPDATE linux_lab.study_profiles SET role='admin' WHERE id=$1",[owner.data.profile.id]);
 await db.query("INSERT INTO linux_lab.vm_reports VALUES($1,$2,'old-attempt','before','{}',$3)",[randomUUID(),target.data.profile.id,Date.now()]);
 const preview=await (await call('/api/admin/delete-preview?id='+target.data.profile.id,'GET',null,owner.cookie)).json();
 const response=await call('/api/admin/delete','POST',{id:target.data.profile.id,token:preview.token,confirmation:'remove_me'},owner.cookie);assert.equal(response.status,200,await response.clone().text());
 for(const table of ['study_progress','study_sessions','vm_reports'])assert.equal((await db.query('SELECT count(*)::int AS n FROM linux_lab.'+table+' WHERE profile_id=$1',[target.data.profile.id])).rows[0].n,0);
 assert.equal((await call('/api/me','GET',null,target.cookie)).status,401);assert.equal((await call('/api/me','GET',null,other.cookie)).status,200);assert.equal((await call('/api/admin/users','GET',null,owner.cookie)).status,200);
 assert.equal((await db.query('SELECT action FROM linux_lab.admin_events')).rows[0].action,'delete-profile');
 assert.equal((await call('/api/admin/delete','POST',{id:target.data.profile.id,token:preview.token,confirmation:'remove_me'},owner.cookie)).status,409);
}));
test('database connection validates TLS and keeps SSL URL parameters from weakening validation',()=>{
 const config=connectionOptions({NODE_ENV:'production',DATABASE_URL:'postgresql://test:fake@pooler.example:6543/postgres?sslmode=no-verify',DATABASE_CA_CERT:'TEST\\nCA'});assert.equal(config.ssl.rejectUnauthorized,true);assert.equal(config.ssl.ca,'TEST\nCA');assert.equal(new URL(config.connectionString).searchParams.has('sslmode'),false);assert.throws(()=>connectionOptions({}));
});
