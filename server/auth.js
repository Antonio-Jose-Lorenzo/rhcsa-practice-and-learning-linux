import {randomBytes,createHash,scrypt as scryptCallback,timingSafeEqual} from 'node:crypto';
import {promisify} from 'node:util';
const scrypt=promisify(scryptCallback);
export const randomToken=()=>randomBytes(32).toString('hex');
export const hashToken=value=>createHash('sha256').update(value).digest('hex');
export const constantEqual=(a,b)=>{const x=Buffer.from(a),y=Buffer.from(b);return x.length===y.length&&timingSafeEqual(x,y);};
export function credentials(input){const username=String(input.username||'').trim().toLowerCase(),password=input.password;if(!/^[a-z0-9][a-z0-9_.-]{2,31}$/.test(username))throw Error('Usa un usuario de 3–32 letras, números, puntos, guiones o guiones bajos.');if(typeof password!=='string'||password.length<12||password.length>128)throw Error('Usa una contraseña de 12–128 caracteres.');return {username,password};}
export async function passwordHash(password,salt=randomBytes(16).toString('hex')){const hash=await scrypt(password,Buffer.from(salt,'hex'),32,{N:32768,r:8,p:3,maxmem:64*1024*1024});return `scrypt$32768$8$3$${salt}$${hash.toString('hex')}`;}
export async function passwordMatches(password,stored){if(!/^scrypt\$32768\$8\$3\$[a-f0-9]{32}\$[a-f0-9]{64}$/.test(stored))return false;return constantEqual(await passwordHash(password,stored.split('$')[4]),stored);}
export const dummyHash='scrypt$32768$8$3$'+'0'.repeat(32)+'$'+'0'.repeat(64);
export const cookieToken=request=>request.headers.get('cookie')?.match(/(?:^|;\s*)rhcsa_session=([a-f0-9]{64})(?:;|$)/)?.[1]||'';
export function sessionCookie(token,origin,maxAge=604800){return `rhcsa_session=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${origin.startsWith('https:')?'; Secure':''}`;}
export async function authenticated(request,db,now=Date.now()){
 const token=cookieToken(request);if(!token)return null;
 return (await db.query(`SELECT p.id,p.username,p.role,s.created_at AS authenticated_at FROM linux_lab.study_sessions s JOIN linux_lab.study_profiles p ON p.id=s.profile_id WHERE s.token_hash=$1 AND s.expires_at>$2`,[hashToken(token),now])).rows[0]||null;
}
export async function throttle(db,key,max=8,now=Date.now()){
 const r=await db.query(`INSERT INTO linux_lab.auth_limits(limit_key,count,reset_at) VALUES($1,1,$2)
 ON CONFLICT(limit_key) DO UPDATE SET count=CASE WHEN auth_limits.reset_at<=$3 THEN 1 ELSE auth_limits.count+1 END, reset_at=CASE WHEN auth_limits.reset_at<=$3 THEN EXCLUDED.reset_at ELSE auth_limits.reset_at END RETURNING count`,[key,now+900000,now]);return r.rows[0].count<=max;
}
export async function touchProfile(db,id,now=Date.now()){return (await db.query('UPDATE linux_lab.study_profiles SET last_seen_at=GREATEST(last_seen_at+1,$1) WHERE id=$2',[now,id])).rowCount>0;}
export const profileView=p=>({id:p.id,username:p.username,role:p.role});
