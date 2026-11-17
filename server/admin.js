import {randomUUID} from 'node:crypto';
import {hashToken,randomToken} from './auth.js';
export class HttpError extends Error{constructor(message,status=400){super(message);this.status=status;}}
const uuid=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/;
export function recentAdmin(profile,now=Date.now()){
 if(profile.role!=='admin')throw new HttpError('Esta sección está reservada al administrador.',403);
 if(now-Number(profile.authenticated_at)>900000)throw new HttpError('Vuelve a iniciar sesión como administrador para confirmar un borrado (máximo 15 minutos).',403);
}
const countsSql=`SELECT p.id,p.username,p.role,p.created_at,p.last_seen_at,
 COALESCE(jsonb_array_length(s.payload::jsonb->'history'),0)::int AS attempts,
 COALESCE(jsonb_array_length(s.payload::jsonb->'journal'),0)::int AS notes,
 (SELECT count(*)::int FROM linux_lab.vm_reports r WHERE r.profile_id=p.id) AS reports
 FROM linux_lab.study_profiles p LEFT JOIN linux_lab.study_progress s ON s.profile_id=p.id`;
export async function listUsers(db,url,now=Date.now()){
 const days=Number(url.searchParams.get('inactiveDays')||0),search=(url.searchParams.get('search')||'').trim().slice(0,32);
 if(!Number.isInteger(days)||days<0||days>3650)throw new HttpError('Filtra entre 0 y 3650 días.');
 const cutoff=now-days*86400000;
 const users=(await db.query(countsSql+` WHERE ($1::int=0 OR p.last_seen_at<$2) AND position($3 in p.username)>0 ORDER BY p.last_seen_at,p.id LIMIT 100`,[days,cutoff,search.toLowerCase()])).rows;
 return {users,limit:100,inactiveDays:days};
}
export async function deletionPreview(db,actor,targetId,now=Date.now()){
 recentAdmin(actor,now);if(!uuid.test(targetId))throw new HttpError('Cuenta inválida.');
 const target=(await db.query(countsSql+' WHERE p.id=$1',[targetId])).rows[0];
 if(!target)throw new HttpError('La cuenta ya no existe.',404);
 if(target.id===actor.id||target.role!=='user')throw new HttpError('No se permite borrar tu propia cuenta ni cuentas administradoras.',403);
 const token=randomToken();await db.query('INSERT INTO linux_lab.deletion_intents(token_hash,actor_id,target_id,target_last_seen_at,expires_at) VALUES($1,$2,$3,$4,$5)',[hashToken(token),actor.id,target.id,target.last_seen_at,now+600000]);
 return {target,token,expiresAt:now+600000};
}
export async function deleteUser(db,actor,targetId,input,now=Date.now()){
 recentAdmin(actor,now);if(!uuid.test(targetId)||typeof input.token!=='string'||!/^[a-f0-9]{64}$/.test(input.token))throw new HttpError('Solicita una nueva vista previa del borrado.');
 return db.transaction(async tx=>{
  // Lock actor, receipt and target together with the deletion; account activity
  // updates take the same target-row lock, preventing a stale confirmation.
  const currentActor=(await tx.query('SELECT role FROM linux_lab.study_profiles WHERE id=$1 FOR UPDATE',[actor.id])).rows[0];
  if(currentActor?.role!=='admin')throw new HttpError('La cuenta administradora ya no está autorizada.',403);
  const receipt=(await tx.query('SELECT * FROM linux_lab.deletion_intents WHERE token_hash=$1 AND actor_id=$2 AND target_id=$3 FOR UPDATE',[hashToken(input.token),actor.id,targetId])).rows[0];
  if(!receipt||receipt.expires_at<=now)throw new HttpError('La confirmación venció. Revisa nuevamente la cuenta.',409);
  const target=(await tx.query('SELECT id,username,role,last_seen_at FROM linux_lab.study_profiles WHERE id=$1 FOR UPDATE',[targetId])).rows[0];
  if(!target)throw new HttpError('La cuenta ya no existe.',404);
  if(target.id===actor.id||target.role!=='user')throw new HttpError('No puedes borrar esa cuenta.',403);
  if(input.confirmation!==target.username)throw new HttpError('Escribe exactamente el nombre de usuario para confirmar.');
  if(target.last_seen_at!==receipt.target_last_seen_at)throw new HttpError('La cuenta tuvo actividad después de la vista previa. Revisa sus datos antes de borrar.',409);
  const counts=(await tx.query(countsSql+' WHERE p.id=$1',[targetId])).rows[0];
  await tx.query('DELETE FROM linux_lab.study_profiles WHERE id=$1',[targetId]);
  await tx.query('INSERT INTO linux_lab.admin_events(id,actor_id,action,target_id,counts,created_at) VALUES($1,$2,$3,$4,$5,$6)',[randomUUID(),actor.id,'delete-profile',targetId,JSON.stringify({attempts:counts.attempts,notes:counts.notes,reports:counts.reports}),now]);
  return {deleted:true,id:targetId};
 });
}
