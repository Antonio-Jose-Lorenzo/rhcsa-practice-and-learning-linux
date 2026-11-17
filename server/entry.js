import {createApi} from './api.js';
import {createStore,getPool} from './db.js';
let handler;
export default {async fetch(request){try{handler??=createApi(createStore(getPool()),process.env);return await handler(request);}catch{ return Response.json({error:'El servidor aún no está configurado. Revisa DATABASE_URL y APP_ORIGIN.'},{status:503,headers:{'Cache-Control':'no-store'}});}}};
