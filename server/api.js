import {randomUUID} from 'node:crypto';
import {authenticated,credentials,passwordHash,passwordMatches,dummyHash,randomToken,hashToken,sessionCookie,cookieToken,throttle,touchProfile,profileView,constantEqual} from './auth.js';
import {fresh,validState,freezeFinished,currentState,hydrate,persistedState} from './study.js';
import {validateVmReport} from './verification.js';
import {listUsers,deletionPreview,deleteUser,HttpError} from './admin.js';
const json=(value,status=200,headers={})=>Response.json(value,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff',...headers}});
const fail=(error,status=400)=>json({error},status);
async function body(request){if(Number(request.headers.get('content-length')||0)>1500000)throw new HttpError('El contenido supera 1,5 MB.',413);const text=await request.text();if(Buffer.byteLength(text)>1500000)throw new HttpError('El contenido supera 1,5 MB.',413);let value;try{value=JSON.parse(text);}catch{throw new HttpError('El contenido JSON no es válido.');}if(!value||typeof value!=='object'||Array.isArray(value))throw new HttpError('Se requiere un objeto JSON.');return value;}
function validated(fn,...args){try{return fn(...args);}catch(e){throw new HttpError(e.message);}}
export function appOrigin(env){
 if(!env.APP_ORIGIN)throw Error('APP_ORIGIN no está configurada.');
 const url=new URL(env.APP_ORIGIN),local=['localhost','127.0.0.1','[::1]'].includes(url.hostname)&&env.NODE_ENV!=='production';
 if((url.protocol!=='https:'&&!local)||url.origin!==env.APP_ORIGIN||url.username||url.password)throw Error('APP_ORIGIN debe ser un origen HTTPS exacto, sin ruta.');
 return url.origin;
}
export function createApi(db,env){
 const origin=appOrigin(env),registration=['closed','invite','open'].includes(env.REGISTRATION_MODE)?env.REGISTRATION_MODE:'closed';
 return async function api(request){
  const url=new URL(request.url);if(url.origin!==origin)return fail('Origen del servidor no autorizado.',403);
  if(!['GET','HEAD'].includes(request.method)){
   if(request.headers.get('origin')!==origin||request.headers.get('sec-fetch-site')==='cross-site')return fail('Origen de la solicitud no autorizado.',403);
   if(!request.headers.get('content-type')?.startsWith('application/json'))return fail('Se requiere contenido JSON.',415);
  }
  try{
   if(url.pathname==='/api/config'&&request.method==='GET')return json({platform:'supabase',registration});
   if(url.pathname==='/api/auth'&&request.method==='POST'){
    const input=await body(request);if(!['login','register'].includes(input.mode))return fail('Elige iniciar sesión o crear perfil.');
    const {username,password}=validated(credentials,input);
    // Username throttling works independently of any proxy/IP headers.
    if(!await throttle(db,'login:'+hashToken(username)))return fail('Demasiados intentos. Espera 15 minutos.',429);
    let profile=(await db.query('SELECT id,username,password_hash,role FROM linux_lab.study_profiles WHERE username=$1',[username])).rows[0];
    if(input.mode==='register'){
     if(registration==='closed')return fail('El registro está cerrado. Contacta al administrador.',403);
     if(registration==='invite'&&(!env.REGISTRATION_CODE||typeof input.inviteCode!=='string'||!constantEqual(hashToken(input.inviteCode),hashToken(env.REGISTRATION_CODE))))return fail('Código de invitación incorrecto.',403);
     if(profile)return fail('Ese nombre de usuario ya está registrado.',409);
     const id=randomUUID(),hash=await passwordHash(password),now=Date.now();
     await db.transaction(async tx=>{await tx.query('INSERT INTO linux_lab.study_profiles(id,username,password_hash,created_at,last_seen_at) VALUES($1,$2,$3,$4,$4)',[id,username,hash,now]);await tx.query('INSERT INTO linux_lab.study_progress(profile_id,payload,revision,updated_at) VALUES($1,$2,0,$3)',[id,JSON.stringify(fresh()),now]);});
     profile={id,username,role:'user'};
    }else if(!await passwordMatches(password,profile?.password_hash||dummyHash)||!profile)return fail('Usuario o contraseña incorrectos.',401);
    const token=randomToken(),now=Date.now();
    await db.query('INSERT INTO linux_lab.study_sessions(token_hash,profile_id,created_at,expires_at) VALUES($1,$2,$3,$4)',[hashToken(token),profile.id,now,now+604800000]);
    await db.query('UPDATE linux_lab.study_profiles SET last_seen_at=$1 WHERE id=$2',[now,profile.id]);
    return json({profile:profileView(profile),...await currentState(db,profile.id)},200,{'Set-Cookie':sessionCookie(token,origin)});
   }
   const profile=await authenticated(request,db);if(!profile)return fail('Inicia sesión con tu usuario de estudio.',401);
   if(!await touchProfile(db,profile.id))return fail('La cuenta ya no está disponible.',401);
   if(url.pathname==='/api/me'&&request.method==='GET')return json({profile:profileView(profile),...await currentState(db,profile.id)});
   if(url.pathname==='/api/logout'&&request.method==='POST'){await db.query('DELETE FROM linux_lab.study_sessions WHERE token_hash=$1',[hashToken(cookieToken(request))]);return json({ok:true},200,{'Set-Cookie':sessionCookie('',origin,0)});}
   if(url.pathname==='/api/state'&&request.method==='PUT'){
    const input=await body(request),state=validated(validState,input.state),revision=input.revision;
    if(!Number.isInteger(revision)||revision<0)return fail('Revisión inválida.');
    const previous=await currentState(db,profile.id);freezeFinished(state,previous.state);await hydrate(db,profile.id,state);
    const result=await db.query('UPDATE linux_lab.study_progress SET payload=$1,revision=revision+1,updated_at=$2 WHERE profile_id=$3 AND revision=$4',[JSON.stringify(persistedState(state)),Date.now(),profile.id,revision]);
    if(!result.rowCount)return fail('El progreso cambió en otra pestaña. Recarga antes de seguir.',409);
    return json({state,revision:revision+1});
   }
   if(url.pathname==='/api/evidence'&&request.method==='POST'){
    const input=await body(request),phase=input.phase;if(!['before','after'].includes(phase))return fail('Fase de recolección inválida.');
    const {state,revision}=await currentState(db,profile.id),attempt=state.history.find(a=>a.id===input.attemptId);
    if(!attempt||attempt.status!=='finished'||attempt.mode!=='exam'||attempt.examVersion<4)return fail('Finaliza un intento compatible antes de validar las VMs.');
    const report=validated(validateVmReport,input.report,attempt,phase);
    const prior=(await db.query("SELECT payload FROM linux_lab.vm_reports WHERE profile_id=$1 AND attempt_id=$2 AND phase='before'",[profile.id,attempt.id])).rows[0];
    if(phase==='after'&&(!prior||Date.parse(report.generatedAt)<=Date.parse(JSON.parse(prior.payload).generatedAt)))return fail('Falta una referencia anterior válida al reinicio o la segunda lectura no es posterior.');
    const conflict=phase==='before'?'DO NOTHING':'DO UPDATE SET payload=EXCLUDED.payload,created_at=EXCLUDED.created_at';
    await db.query('INSERT INTO linux_lab.vm_reports(id,profile_id,attempt_id,phase,payload,created_at) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT(profile_id,attempt_id,phase) '+conflict,[randomUUID(),profile.id,attempt.id,phase,JSON.stringify(report),Date.now()]);
    const current=await currentState(db,profile.id);return json({attempt:current.state.history.find(a=>a.id===attempt.id),revision});
   }
   if(url.pathname.startsWith('/api/admin/')){
    if(profile.role!=='admin')return fail('Esta sección está reservada al administrador.',403);
    if(url.pathname==='/api/admin/users'&&request.method==='GET')return json(await listUsers(db,url));
    if(url.pathname==='/api/admin/delete-preview'&&request.method==='GET')return json(await deletionPreview(db,profile,url.searchParams.get('id')||''));
    if(url.pathname==='/api/admin/delete'&&request.method==='POST'){const input=await body(request);return json(await deleteUser(db,profile,input.id,input));}
   }
   return fail('Ruta no encontrada.',404);
  }catch(error){
   if(error instanceof HttpError)return fail(error.message,error.status);
   if(error.code==='23505')return fail('El registro ya existe. Recarga antes de repetir.',409);
   // Never expose database connection strings, SQL text, credentials or driver errors.
   if(error.code)return fail('No se pudo completar la operación en la base de datos.',503);
   return fail('No se pudo completar la operación.',500);
  }
 };
}
