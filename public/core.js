import {EXAM_SECONDS,EXAM_VERSION} from './exam.js';
export function elapsed(s,now=Date.now()){if(s?.mode==='exam'&&Number.isFinite(s.deadlineAt))return Math.min(s.limit*1000,Math.max(0,now-(s.deadlineAt-s.limit*1000)));return s?Math.min(s.limit*1000,Math.max(0,s.elapsed+(s.status==='running'?Math.max(0,now-s.runningSince):0))):0}
export function remaining(s,now=Date.now()){if(s?.mode==='exam'&&Number.isFinite(s.deadlineAt))return Math.max(0,Math.min(s.limit*1000,s.deadlineAt-now));return s?Math.max(0,s.limit*1000-elapsed(s,now)):0}
export function formatTime(ms){const secs=Math.max(0,Math.ceil(ms/1000));return `${String(Math.floor(secs/3600)).padStart(2,'0')}:${String(Math.floor(secs%3600/60)).padStart(2,'0')}:${String(secs%60).padStart(2,'0')}`}
export function parseReport(data,s,validIds){
 if(!s || s.status!=='running')throw Error('Inicia o reanuda una sesión antes de importar.');
 if(s.mode==='exam'&&remaining(s)<=0)throw Error('El plazo del simulacro terminó; ya no se admite evidencia.');
 if(s.mode==='exam'&&s.examVersion>=4)throw Error('Este simulacro requiere el agente local y recolección directa antes y después del reinicio.');
 if(!data||data.schema!==1||data.kind!=='ex200-report'||data.attempt!==s.id)throw Error('El informe no corresponde a esta sesión. Usa su identificador al recogerlo.');
 const time=Date.parse(data.generatedAt);if(!Number.isFinite(time)||time<s.startedAt-2000||time>Date.now()+60000)throw Error('El informe tiene una fecha inválida o anterior al inicio.');
 if(!Array.isArray(data.results)||!data.results.length||data.results.length>100)throw Error('El informe no contiene resultados válidos.');
 const seen=new Set(); for(const r of data.results){if(!validIds.includes(r.lab)||!s.labs.includes(r.lab)||!Number.isInteger(r.criterion)||r.criterion<0||r.criterion>2||typeof r.pass!=='boolean'||!['server','client'].includes(r.machine)||typeof r.detail!=='string')throw Error('Resultado incompatible con los ejercicios de la sesión.');const k=r.lab+':'+r.criterion;if(seen.has(k))throw Error('El informe contiene criterios duplicados.');seen.add(k)} return data.results;
}
export function completeLab(l,s){const r=s.work[l.id]||{};if(s.mode==='exam'&&s.examVersion>=4){const v=s.verification;if(v?.status!=='compared'||v.nodes?.length!==2||!v.nodes.every(n=>n.sameMachine&&n.rebooted))return false;return l.criteria.every((_,i)=>{const c=v.checks?.[l.id]?.[i];return c?.documentary?r.manual?.[i]===true&&String(r.evidence?.[i]||'').trim().length>=20:c?.pass===true&&(!c.requiresDocumentation||r.manual?.[i]===true&&String(r.evidence?.[i]||'').trim().length>=20)})&&String(r.notes||'').trim().length>=30}return l.criteria.every((_,i)=>l.auto.includes(i)?r.checks?.[i]?.pass===true:r.manual?.[i]===true&&String(r.evidence?.[i]||'').trim().length>=20)&&String(r.notes||'').trim().length>=30}

export function makeSession(ids,mode,now=Date.now(),id=crypto.randomUUID(),practiceMinutes=25){
 const exam=mode==='exam';
 return {id,mode,labs:[...ids],status:'running',startedAt:now,runningSince:now,elapsed:0,limit:exam?EXAM_SECONDS:practiceMinutes*60,deadlineAt:exam?now+EXAM_SECONDS*1000:null,examVersion:exam?EXAM_VERSION:null,selectedLab:ids[0],work:{[ids[0]]:{phase:1,hints:0,notes:'',evidence:{},manual:{},checks:{},visited:true}}};
}
export function selectExamTask(s,id,now=Date.now()){
 if(!s||!s.labs.includes(id)||s.status!=='running'||(s.mode==='exam'&&remaining(s,now)<=0))return false;
 s.selectedLab=id;s.work[id]??={phase:1,hints:0,notes:'',evidence:{},manual:{},checks:{}};s.work[id].visited=true;return true;
}
export function navigateExam(s,direction,now=Date.now()){
 if(!s||s.mode!=='exam'||s.status!=='running'||remaining(s,now)<=0)return null;
 const id=s.labs.includes(s.selectedLab)?s.selectedLab:s.labs[0];
 const i=s.labs.indexOf(id);
 if(direction==='skip'){s.work[id]??={};s.work[id].review=true;s.work[id].skipped=true;s.work[id].ready=false}
 const next=s.labs[(i+(direction==='previous'?-1:1)+s.labs.length)%s.labs.length];
 selectExamTask(s,next,now);return next;
}
export function examTaskStatus(s,id){const w=s.work[id]||{};return w.review?'review':w.ready?'ready':w.visited?'working':'pending'}
export function examObjectiveResults(s,objectives,exercises){
 return objectives.map(o=>{const tasks=exercises.filter(t=>s.labs.includes(t.id)&&t.objectives?.includes(o.id));return {...o,tasks:tasks.map(t=>t.id),complete:tasks.length>0&&tasks.every(t=>completeLab(t,s))}});
}
export function closeSession(s,exercises,now=Date.now(),forceTimeout=false){
 s.elapsed=elapsed(s,now);
 s.timedOut=forceTimeout||(Number.isFinite(s.deadlineAt)&&now>=s.deadlineAt);
 s.status='finished';s.finishedAt=s.timedOut&&Number.isFinite(s.deadlineAt)?s.deadlineAt:now;s.closedAt=now;
 s.completed=s.labs.filter(id=>{const t=exercises.find(t=>t.id===id);return t&&completeLab(t,s)});
 return s;
}
