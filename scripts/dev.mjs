import http from 'node:http';import fs from 'node:fs/promises';import path from 'node:path';import {fileURLToPath} from 'node:url';
import {createApi} from '../server/api.js';import {createStore,getPool} from '../server/db.js';
export async function startDevServer({api,publicRoot,host='127.0.0.1',port=4173}){
 const origin=`http://${host}:${port}`,mime={'.html':'text/html; charset=utf-8','.js':'application/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.json':'application/json; charset=utf-8','.zip':'application/zip','.md':'text/markdown; charset=utf-8'};
 const server=http.createServer(async(req,res)=>{
  try{
   const url=new URL(req.url,origin);
   if(url.pathname.startsWith('/api/')){const chunks=[];let size=0;for await(const chunk of req){size+=chunk.length;if(size>1500000){res.writeHead(413);res.end();return;}chunks.push(chunk);}const method=req.method;const request=new Request(url,{method,headers:req.headers,...(!['GET','HEAD'].includes(method)?{body:Buffer.concat(chunks)}:{})});const response=await api(request);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));return;}
   if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return;}
   const file=path.resolve(publicRoot,'.'+decodeURIComponent(url.pathname==='/'?'/index.html':url.pathname));if(!file.startsWith(path.resolve(publicRoot)+path.sep)){res.writeHead(404);res.end();return;}
   const content=await fs.readFile(file);res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'text/plain; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Permissions-Policy':'loopback-network=(self)'});res.end(req.method==='HEAD'?undefined:content);
  }catch{res.writeHead(404);res.end('No encontrado.');}
 });
 await new Promise(resolve=>server.listen(port,host,resolve));console.log('Vista local: '+origin+'/');return server;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const index=process.argv.indexOf('--port'),port=index<0?4173:Number(process.argv[index+1]),origin='http://127.0.0.1:'+port;
 let handler;const api=request=>{try{handler??=createApi(createStore(getPool()),{...process.env,APP_ORIGIN:origin,NODE_ENV:'development'});return handler(request);}catch{return Response.json({error:'Configura DATABASE_URL en tu .env antes de iniciar sesión.'},{status:503});}};
 await startDevServer({api,port,publicRoot:path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../public')});
}
