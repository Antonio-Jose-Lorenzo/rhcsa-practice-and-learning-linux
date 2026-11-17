import {examTasks,verificationRoles} from '../public/exam.js';
const roles=['server','client'];
const roleFor=verificationRoles;
export function validateVmReport(report,attempt,phase,now=Date.now()){
 if(!report||report.schema!==2||report.kind!=='ex200-direct-report'||report.attempt!==attempt.id||report.phase!==phase)throw Error('Informe de VM incompatible con este intento.');
 const at=Date.parse(report.generatedAt);if(!Number.isFinite(at)||at<attempt.startedAt-5000||at>now+60000||now-at>600000)throw Error('La recolección no es reciente o no corresponde al intento.');
 if(!Array.isArray(report.machines)||report.machines.length!==2||new Set(report.machines.map(m=>m.role)).size!==2||new Set(report.machines.map(m=>m.machineId)).size!==2)throw Error('Se requieren lecturas de dos VMs distintas: server y client.');
 for(const role of roles){const m=report.machines.find(m=>m.role===role);if(!m||!/^([0-9a-f]{32})$/.test(m.machineId)||!/^([0-9a-f-]{36})$/.test(m.bootId)||m.hostname?.split('.')[0]!==role||m.error)throw Error(`No se pudo identificar ${role} o su arranque.`);if(!Array.isArray(m.results))throw Error('Faltan comprobaciones del nodo.');const seen=new Set();for(const r of m.results){const key=r.lab+':'+r.criterion;if(!attempt.labs.includes(r.lab)||!roleFor(r.lab,r.criterion).includes(role)||!Number.isInteger(r.criterion)||r.criterion<0||r.criterion>2||!['pass','fail','documental','unsupported'].includes(r.status)||typeof r.detail!=='string'||seen.has(key))throw Error('Comprobación de VM inválida o duplicada.');seen.add(key);if(r.persistent&&(!/^[a-f0-9]{64}$/.test(r.fingerprint)))throw Error('Falta la huella de configuración persistente.')}}
 return report;
}
export function compareReports(before,after,attempt){
 const nodes=roles.map(role=>{const a=before.machines.find(m=>m.role===role),b=after.machines.find(m=>m.role===role);return {role,sameMachine:!!a?.machineId&&a.machineId===b?.machineId,rebooted:!!a?.bootId&&!!b?.bootId&&a.bootId!==b.bootId,beforeBoot:a?.bootId,afterBoot:b?.bootId}});
 const rebooted=nodes.every(n=>n.sameMachine&&n.rebooted),checks={};
 for(const id of attempt.labs){checks[id]={};for(let i=0;i<3;i++){
  const pairs=roleFor(id,i).map(role=>({role,a:before.machines.find(m=>m.role===role)?.results.find(r=>r.lab===id&&r.criterion===i),b:after.machines.find(m=>m.role===role)?.results.find(r=>r.lab===id&&r.criterion===i)}));
  const complete=pairs.every(p=>p.a&&p.b),documentary=complete&&pairs.every(p=>p.a.status==='documental'&&p.b.status==='documental'),persistent=pairs.some(p=>p.a?.persistent||p.b?.persistent);
  const pass=rebooted&&complete&&pairs.every(({a,b})=>a.status==='pass'&&b.status==='pass'&&a.persistent===b.persistent&&(!a.persistent||a.fingerprint===b.fingerprint));
  const failed=pairs.find(p=>p.a?.status!=='pass'||p.b?.status!=='pass'||p.a?.persistent&&p.a.fingerprint!==p.b?.fingerprint);
  const detail=!rebooted?'No se confirmó el reinicio de las mismas dos VMs.':!complete?'No hay control completo para este criterio.':documentary?'Acción transitoria: la lectura de VM aporta contexto; requiere tu evidencia documental.':failed?.a?.status==='unsupported'||failed?.b?.status==='unsupported'?'El verificador no pudo evaluar este criterio; permanece pendiente.':failed?.a?.status==='fail'?failed.a.detail:failed?.b?.status==='fail'?failed.b.detail:failed?'La configuración observada cambió entre las dos recolecciones.':pass?'Comprobado antes y después del reinicio; la configuración persistente conserva su huella.':'Pendiente de verificación.';
  checks[id][i]={pass,documentary,persistent,machine:pairs.map(p=>p.role).join(' + '),status:documentary?'documental':pass?'verified':'failed',requiresDocumentation:pairs.some(p=>p.a?.requiresDocumentation||p.b?.requiresDocumentation),detail,observations:pairs.map(p=>({machine:p.role,before:p.a?.observed,after:p.b?.observed}))};
 }}
 return {status:rebooted?'compared':'failed',beforeCapturedAt:before.generatedAt,afterCapturedAt:after.generatedAt,checkedAt:Date.now(),nodes,checks};
}
