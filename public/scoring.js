import {examTasks,objectives} from './exam.js';

export const SCORE_VERSION=1;
export const MAX_SCORE=300;
// Training weights, unrelated to Red Hat's confidential exam rubric.
// Each area receives 30 whole points; distribute them over its criteria.
export const rubric=objectives.map(o=>o.domain).filter((id,i,a)=>a.indexOf(id)===i).map(domain=>{
 const tasks=examTasks.filter(t=>t.domain===domain);
 const count=tasks.reduce((n,t)=>n+t.criteria.length,0);
 let index=0;
 return {domain,max:30,tasks:tasks.map(t=>{
  const criteria=t.criteria.map((_,i)=>({index:i,max:Math.floor(30/count)+(index++<30%count?1:0)}));
  return {id:t.id,max:criteria.reduce((n,c)=>n+c.max,0),criteria};
 })};
});

export function scoreExam(attempt){
 const v=attempt?.verification;
 const supported=attempt?.mode==='exam'&&attempt.examVersion>=4;
 const verified=supported&&attempt.status==='finished'&&v?.status==='compared'&&v.nodes?.length===2&&v.nodes.every(n=>n.sameMachine===true&&n.rebooted===true);
 const areas=rubric.map(area=>{
  const tasks=area.tasks.map(task=>{
   const work=attempt?.work?.[task.id]||{};
   const criteria=task.criteria.map(criterion=>{
    const check=v?.checks?.[task.id]?.[criterion.index];
    const documented=work.manual?.[criterion.index]===true&&String(work.evidence?.[criterion.index]||'').trim().length>=20;
    const inAttempt=attempt?.labs?.includes(task.id);
    const documentary=check?.documentary===true;
    const passed=!!(verified&&inAttempt&&(documentary?documented:check?.pass===true&&(!check.requiresDocumentation||documented)));
    return {...criterion,earned:passed?criterion.max:0,kind:documentary?'documentary':'technical',passed};
   });
   return {...task,criteria,earned:criteria.reduce((n,c)=>n+c.earned,0)};
  });
  return {...area,tasks,earned:tasks.reduce((n,t)=>n+t.earned,0)};
 });
 const criteria=areas.flatMap(a=>a.tasks.flatMap(t=>t.criteria));
 return {version:SCORE_VERSION,max:MAX_SCORE,supported,verified,pending:!verified,total:areas.reduce((n,a)=>n+a.earned,0),technical:criteria.filter(c=>c.kind==='technical').reduce((n,c)=>n+c.earned,0),documentary:criteria.filter(c=>c.kind==='documentary').reduce((n,c)=>n+c.earned,0),areas};
}
export const taskRubric=id=>rubric.flatMap(a=>a.tasks).find(t=>t.id===id);
