import pg from 'pg';
let cachedPool;
const numericFields=new Set(['created_at','authenticated_at','last_seen_at','expires_at','reset_at','updated_at','target_last_seen_at']);
export function normalizeRow(row){if(!row)return null;return Object.fromEntries(Object.entries(row).map(([k,v])=>[k,numericFields.has(k)&&v!==null?Number(v):v]));}
export function connectionOptions(env=process.env){
  if(!env.DATABASE_URL)throw Error('DATABASE_URL no está configurada.');
  const url=new URL(env.DATABASE_URL);
  if(!['postgres:','postgresql:'].includes(url.protocol))throw Error('DATABASE_URL debe ser una conexión PostgreSQL.');
  // Prevent URL parameters from silently weakening certificate validation.
  for(const key of ['sslmode','sslcert','sslkey','sslrootcert'])url.searchParams.delete(key);
  const local=['localhost','127.0.0.1','[::1]'].includes(url.hostname)&&env.NODE_ENV!=='production';
  return {connectionString:url.toString(),max:3,idleTimeoutMillis:10000,connectionTimeoutMillis:10000,query_timeout:15000,
    ssl:local?false:{rejectUnauthorized:true,...(env.DATABASE_CA_CERT?{ca:env.DATABASE_CA_CERT.replace(/\\n/g,'\n')}:{})}};
}
export function getPool(env=process.env){if(!cachedPool){cachedPool=new pg.Pool(connectionOptions(env));cachedPool.on('error',()=>{});}return cachedPool;}
export function createStore(pool){
  const query=async(text,values=[])=>{const r=await pool.query(text,values);return {...r,rows:r.rows.map(normalizeRow)};};
  return {query,async transaction(fn){const client=await pool.connect();try{await client.query('BEGIN');const result=await fn({query:async(text,values=[])=>{const r=await client.query(text,values);return {...r,rows:r.rows.map(normalizeRow)};}});await client.query('COMMIT');return result;}catch(e){await client.query('ROLLBACK');throw e;}finally{client.release();}}};
}
