import {scoreExam} from '../public/scoring.js';
import {labs} from '../public/catalog.js';
import {examTasks} from '../public/exam.js';
import {completeLab} from '../public/core.js';
import {compareReports} from './verification.js';
export const exercises=[...labs,...examTasks];
const ids=new Set(exercises.map(t=>t.id));
export const fresh=()=>({version:1,session:null,history:[],vmChecks:[],journal:[]});
export function validState(state){
 if(!state||state.version!==1||!Array.isArray(state.history)||state.history.length>200||!Array.isArray(state.journal)||state.journal.length>1000||!Array.isArray(state.vmChecks)||state.vmChecks.some(n=>!Number.isInteger(n)||n<0||n>5))throw Error('Progreso incompatible.');
 const attempts=[...state.history,...(state.session?[state.session]:[])];
 if(new Set(attempts.map(a=>a.id)).size!==attempts.length)throw Error('Hay intentos duplicados.');
 for(const a of attempts){if(typeof a.id!=='string'||a.id.length>80||!Array.isArray(a.labs)||!a.labs.length||new Set(a.labs).size!==a.labs.length||!a.labs.every(id=>ids.has(id))||!a.work||!Number.isFinite(a.startedAt)||!Number.isFinite(a.limit)||!Array.isArray(a.completed||[]))throw Error('Intento incompatible.');if(a.mode==='exam'&&a.examVersion>=4&&(a.limit!==7200||a.deadlineAt!==a.startedAt+7200000))throw Error('El simulacro debe conservar su plazo de dos horas.');}
 if(state.history.some(a=>a.status!=='finished')||state.journal.some(j=>typeof j.title!=='string'||typeof j.body!=='string'||!Number.isFinite(j.at)))throw Error('Historial o bitácora incompatible.');
 return state;
}
export function freezeFinished(state,previous){for(const a of state.history){const saved=previous.history.find(h=>h.id===a.id&&h.examVersion>=4&&h.status==='finished');if(saved)Object.assign(a,structuredClone(saved));}return state;}
export async function hydrate(db,id,state){
 const reports=(await db.query('SELECT attempt_id,phase,payload FROM linux_lab.vm_reports WHERE profile_id=$1 ORDER BY created_at DESC LIMIT 400',[id])).rows;
 for(const a of [...state.history,...(state.session?[state.session]:[])]){
  if(a.mode!=='exam'||!(a.examVersion>=4))continue;
  const before=reports.find(r=>r.attempt_id===a.id&&r.phase==='before'),after=reports.find(r=>r.attempt_id===a.id&&r.phase==='after');
  a.verification=before&&after?compareReports(JSON.parse(before.payload),JSON.parse(after.payload),a):{status:before?'awaiting-reboot':'pending',nodes:[],checks:{}};
  if(a.status==='finished')a.completed=a.labs.filter(id=>completeLab(exercises.find(t=>t.id===id),a));a.score=scoreExam(a);
 }
 return state;
}
export async function currentState(db,id){const row=(await db.query('SELECT payload,revision FROM linux_lab.study_progress WHERE profile_id=$1',[id])).rows[0];return {state:await hydrate(db,id,row?JSON.parse(row.payload):fresh()),revision:row?.revision||0};}
export function persistedState(state){const copy=structuredClone(state);for(const a of [...copy.history,...(copy.session?[copy.session]:[])])if(a.examVersion>=4){{delete a.verification;delete a.score;}delete a.score;}return copy;}
