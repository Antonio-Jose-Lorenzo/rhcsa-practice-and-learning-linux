import {extraUI} from './english-ui-extra.js';
import {learningEN,toolPurposes} from './english-learning.js';
import {labs,domains,phases} from './catalog.js';
import {examTasks,objectives} from './exam.js';
import {commandGuide} from './command-guide.js';
import {examEN,domainEN,objectiveEN} from './english-content.js';
import {labsEN} from './english-labs.js';
export let language='es';try{language=localStorage.getItem('linuxlab-language')==='en'?'en':'es'}catch{}
export const L=(es,en)=>language==='en'?en:es;
export function setLanguage(value){language=value==='en'?'en':'es';try{localStorage.setItem('linuxlab-language',language)}catch{}document.documentElement.lang=language;}
const pairs=new Map();
function register(es,en){if(typeof es==='string'&&typeof en==='string'&&es.trim())pairs.set(es.trim(),en);else if(Array.isArray(es)&&Array.isArray(en))es.forEach((v,i)=>register(v,en[i]));}
for(const original of [...labs,...examTasks]){const en=(original.isExamTask?examEN:labsEN)[original.id];if(!en)throw Error('Missing English scenario: '+original.id);for(const field of ['title','task','criteria','summary','incident'])register(original[field],en[field]);}
for(const [id,name,description] of domains){register(name,domainEN[id][0]);register(description,domainEN[id][1]);}
objectives.forEach(o=>{const index=Number(o.id.match(/\d+$/)[0])-1;const prefix=o.id.replace(/\d+$/,'');register(o.title,objectiveEN[prefix]?.[index]);});
register(phases,['Learn','Practice','Break','Diagnose','Repair','Document']);
for(const [es,en] of Object.entries(extraUI))register(es,en);
for(const item of [...labs,...examTasks]){
 const en=learningEN[item.domain];
 if(item.learning)for(const field of ['concept','questions','traps'])register(item.learning[field],en[field]);
 if(!item.isExamTask)register(item.hints,[en.questions[0],en.questions[1],'Review the listed man pages, compare the observed state with each criterion and change one variable at a time.']);
 if(item.commands)for(const [cmd,purpose] of item.commands)register(purpose,toolPurposes[cmd]||'Inspect the selected object using the installed manual; choose the required parameters.');
}

const descriptions=`Show effective identity and session groups.
Show the effective username.
Open a login session as vagrant when sudo policy permits; leave with exit.
Create demo directories outside simulation paths.
Write two lines and redirect stdout; requires the preceding directory.
Append a line while retaining existing content.
Capture stderr from a deliberate lookup error.
Filter two patterns using extended regular expressions.
Pipe grep output to wc to count matching lines.
Copy a file inside the demo area.
Rename the demo copy.
Remove the copy after confirmation.
Open the editor to create or edit a note.
Create a hard link to the demo file.
Create a symbolic link referring to a path.
Inspect inode, owner, size and permissions.
Set demo-file permissions using symbolic notation.
Archive the demo directory with gzip compression.
Create a bzip2-compressed archive.
List the archive without extracting it.
Extract into salida; review archive paths first.
Compute a hash to compare content.
Open fstab in the file-formats manual section.
Search manual descriptions by keyword.
Open the GNU utilities Info manual.
List installed Bash package documentation.
List enabled RPM repositories.
Inspect Bash package information.
Query the installed Bash version.
Install tree interactively in a separate practice VM.
Remove the package after reviewing the transaction.
Query transaction history.
Query the user’s Flatpak remotes.
Add Flathub for the user; requires Internet.
Install a demo application; review runtime requirements and size.
Uninstall the demo application after confirmation.
Check syntax without running the existing script.
Run a simple condition based on directory state.
Process arguments while preserving spaces in each item.
Save command output in a variable.
Query the default boot target.
List failed units.
Query SSH service state without a pager.
Check whether SSH is enabled at boot.
Sort processes by CPU usage and show nice priority.
Run a short task with lower CPU priority.
Query the active tuning profile when tuned is installed.
Read the last thirty SSH unit records.
List boots retained by the journal.
Read the previous boot when persistent journal is available.
Identify disks, filesystems and UUIDs before changing storage.
Inspect partition tables without modifying them.
Query LVM physical volumes.
Query volume groups and free capacity.
Query logical volumes and their devices.
Validate fstab entries without mounting or repairing.
Filter mounts by filesystem type.
Show active swap areas.
Query usage and type of mounted filesystems.
List systemd timers and upcoming runs.
List the current user’s crontab.
Query the user’s pending at jobs.
Query timezone and clock state.
Query time sources and their selection state.
Show interface addresses.
Query the default IPv4 route.
List NetworkManager connection profiles.
Query name resolution through the system’s effective mechanism.
Query listening TCP sockets.
Open SSH; verify the host fingerprint before accepting it.
Copy a reference file from server through encrypted transport.
Query the vagrant account through NSS.
Query vagrant UID and groups.
Query account expiry policy.
List sudo operations authorized for your session.
Show the shell’s default permission mask.
Query demo-directory permissions and ACLs.
Show active firewall zones and their interfaces.
Query runtime configuration in the default zone.
Query permanent configuration for comparison with runtime.
Query the effective SELinux mode.
Query a directory’s SELinux context.
Show process contexts.
Preview context restoration without changes using -n.
List SELinux port labels.
Query a SELinux boolean.
Query the user’s container environment; extra preparation practice.
Download a fully qualified image; requires network and space.
Run a temporary container and remove it on completion.
List the user’s running and stopped containers.
List local images.
Create/start the VMs defined by the kit.
Open SSH on server; substitute client for the other VM.
Normally shut down both VMs.
Delete VMs and their disks after confirmation; review and back up first.`.split('\n');
commandGuide.forEach((c,i)=>register(c.description,descriptions[i]));
const areaNames=['Shell and files','Archives and compression','Documentation','RPM and Flatpak','Bash','System and processes','Storage','Scheduling and time','Networking and SSH','Users and permissions','Firewall and SELinux','Podman · extra practice','Host · Vagrant'];
const areas=[...new Set(commandGuide.map(c=>c.area))];areas.forEach((a,i)=>register(a,areaNames[i]||a));
const ui=`Mi espacio|My workspace
Laboratorios|Labs
Simulacro|Exam simulation
Mis máquinas|My machines
Mi progreso|My progress
Bitácora|Journal
Biblioteca|Library
Comandos completos|Complete commands
Verificación de VMs|VM verification
Sesión de práctica|Practice session
Laboratorio|Lab
TU PREPARACIÓN|YOUR PREPARATION
TU LABORATORIO|YOUR LAB
Mi preparación|My preparation
Espacio privado|Private workspace
Espacio personal|Personal workspace
APRENDE. RESUELVE. REPITE.|LEARN. SOLVE. REPEAT.
Salir|Sign out
Respaldar|Back up
Guardado en tu perfil|Saved to your profile
Cargando perfil|Loading profile
Cambios pendientes|Unsaved changes
Guardando en tu perfil…|Saving to your profile…
Usuario|Username
Contraseña|Password
Elige tu nombre de usuario|Choose your username
Mínimo 12 caracteres|At least 12 characters
Crear mi perfil|Create my profile
Entrar a mi espacio|Sign in
Crear un perfil nuevo|Create a new profile
Ya tengo un perfil. Iniciar sesión|Already have a profile? Sign in
Registro cerrado · contactar al administrador|Registration closed · contact the administrator
Código de invitación|Invitation code
TU ESPACIO PERSONAL DE PREPARACIÓN|YOUR PERSONAL STUDY WORKSPACE
Continúa tu preparación.|Continue your preparation.
Crea tu perfil de estudio.|Create your study profile.
Guarda tus prácticas, simulacros y bitácora en tu propio espacio. Tu perfil está dentro del acceso privado del sitio.|Keep practice, simulations and your journal in your own workspace within the private site.
Cada persona tiene sus propios datos y sesiones de acceso.|Each person has their own data and login sessions.
Una guía para practicar.|A guide for practice.
Conserva tu contraseña y exporta respaldos. No se solicita correo ni hay recuperación por correo.|Keep your password and export backups. Email and email-based recovery are not used.
Cargando el acceso a tu espacio…|Loading access to your workspace…
El registro lo controla el administrador. No uses una contraseña que ya utilices en otros servicios.|The administrator controls registration. Choose a password you do not use elsewhere.
Rocky Linux 10 es el entorno de laboratorio. El acceso privado del sitio se mantiene; crear un perfil no convierte el enlace en público.|Rocky Linux 10 is the lab environment. Creating a profile does not make the private site public.
Guía independiente de preparación · No es un examen oficial.|Independent preparation guide · Not an official exam.
Aviso de independencia|Independence notice
Guía independiente de preparación|Independent preparation guide
TU ESPACIO DE PRÁCTICA|YOUR PRACTICE WORKSPACE
La confianza se construye un laboratorio a la vez.|Confidence grows one lab at a time.
Objetivo: RHCSA EX200|Goal: RHCSA EX200
TU SIGUIENTE PASO|YOUR NEXT STEP
Menos memorizar.|Less memorization.
Más saber resolver.|More problem solving.
Dos máquinas. Retos reales. Un espacio para equivocarte, investigar y volver a intentarlo.|Two machines. Practical challenges. A place to make mistakes, investigate and try again.
Continuar sesión|Continue session
Empezar una práctica|Start practice
Explorar laboratorios|Explore labs
Pistas, sin soluciones|Hints without solutions
A tu ritmo|At your own pace
tu entorno de práctica|your practice environment
red privada · host-only|private network · host-only
VMs locales · verificación tras reiniciar|Local VMs · verification after reboot
Laboratorios completados|Completed labs
Resultados y evidencia registrados|Recorded results and evidence
Tiempo de práctica|Practice time
Cada intento suma experiencia|Every attempt builds experience
Cobertura de tu ruta|Study-path coverage
Sesiones finalizadas|Finished sessions
Una sesión en curso|One session in progress
Listo para tu siguiente intento|Ready for your next attempt
Tu práctica, con intención|Practice with purpose
Elige un punto de entrada. Tú decides el recorrido.|Choose where to start. You decide the route.
EN CURSO|IN PROGRESS
PARA CONTINUAR|UP NEXT
Vuelve a tu sesión|Return to your session
El reloj conserva el tiempo y tus notas. Retoma tu práctica donde la dejaste.|The timer and notes are retained. Resume where you left off.
APRENDER HACIENDO|LEARN BY DOING
Buscar por tema, reto o herramienta…|Search by topic, challenge or tool…
Buscar laboratorios|Search labs
Todas las áreas|All areas
Todos los estados|All statuses
Pendientes|Pending
Completados|Completed
Completado|Completed
Para reforzar|Needs practice
Complemento|Extra practice
Fundamentos|Fundamentals
Intermedio|Intermediate
Avanzado|Advanced
Filtrar por área|Filter by area
Filtrar por estado|Filter by status
No hay coincidencias|No matches
Prueba otro término o elimina los filtros.|Try another term or clear the filters.
Restablecer filtros|Reset filters
← Volver a laboratorios|← Back to labs
Tu misión|Your mission
¿Cómo sabrás que está logrado?|How will you know it is complete?
Verificación local|Local verification
Evidencia + autoevaluación|Evidence + self-assessment
PRÁCTICA GUIADA|GUIDED PRACTICE
Un reto. Seis perspectivas.|One challenge. Six perspectives.
Consulta recursos, prueba, provoca una avería controlada y documenta lo que aprendiste.|Read, test, introduce a controlled fault and document what you learned.
Iniciar práctica|Start practice
Pausa disponible. Progreso guardado en tu perfil.|Pausing available. Progress saved to your profile.
Antes de empezar|Before you start
Prepara las VMs y un snapshot limpio. Los ejercicios se ejecutan en tu terminal local.|Prepare your VMs and a clean snapshot. Work in your local terminal.
Ir a mis máquinas|Go to my machines
COBERTURA COMPLETA · DOS HORAS|FULL COVERAGE · TWO HOURS
Simulacro integral EX200|Full EX200 practice simulation
32 retos específicos que recorren los 62 objetivos de estudio que compartiste.|32 focused challenges covering all 62 study objectives.
EX200 / RHEL 10 · entorno práctico Rocky 10|EX200 / RHEL 10 · Rocky 10 practice environment
Todos los objetivos.|All objectives.
El orden lo decides tú.|You choose the order.
Una sesión de entrenamiento de|A training session lasting
02:00:00 exactas|exactly 02:00:00
120 minutos|120 minutes
Una fecha límite fija, incluso al cerrar o recargar.|A fixed deadline, including after closing or reloading.
Salta y vuelve|Skip and return
Siguiente, anterior, revisar y acceso directo a cualquier reto.|Next, previous, review and direct access to any task.
Sin pausa ni pistas|No pause or hints
Los resultados y las referencias se revisan al finalizar.|Review results and references after finishing.
Iniciar simulacro de 2 horas|Start the 2-hour simulation
Volver a la sesión en curso|Return to the current session
Prepara el entorno antes de iniciar el reloj|Prepare the environment before starting the timer
Preparar mis máquinas|Prepare my machines
32 retos · 120 minutos orientativos|32 challenges · 120 suggested minutes
MAPA DE COBERTURA|COVERAGE MAP
62 de 62 objetivos incluidos|All 62 objectives included
Cada punto de tu lista está asociado a uno o más retos. Abre un área para comprobar el recorrido.|Each objective maps to one or more challenges. Open an area to inspect coverage.
Descargar mapa y requisitos|Read the map and requirements
Con evidencia|With evidence
Por reforzar|Needs practice
Pendiente|Pending
Visitado|Visited
Revisar|Review
Preparado|Ready
Retos|Challenges
Ir al reto|Jump to task
← Anterior|← Previous
Omitir por ahora|Skip for now
Siguiente →|Next →
Volver al primer reto →|Back to first task →
Quitar marca de revisión|Remove review mark
Marcar para revisar|Mark for review
Quitar preparado|Remove ready mark
Marcar como preparado|Mark ready
Preparado es una marca personal: no acredita un resultado técnico. Puedes pasar a otro reto con criterios pendientes; tu evidencia se conserva.|Ready is a personal mark, not a verified result. You may move on with pending criteria; your evidence is retained.
AQUÍ|HERE
Aquí empieza tu próxima práctica|Your next practice starts here
Elige un laboratorio o inicia un simulacro.|Choose a lab or start a simulation.
Resuelve con autonomía.|Solve independently.
TIEMPO RESTANTE|TIME REMAINING
Tiempo restante|Time remaining
Sin pausa|No pause
Finalizar|Finish
EN PAUSA|PAUSED
Haz una pausa. Tu avance está aquí.|Take a break. Your progress is here.
El reloj está detenido. Reanuda para continuar el reto.|The timer is stopped. Resume to continue the challenge.
Reanudar práctica|Resume practice
Evidencia y resultados|Evidence and results
Comprueba el estado real de tu trabajo en las VMs.|Check the actual state of your work in the VMs.
Importar informe|Import report
Cómo obtener el informe de esta sesión|How to collect this session’s report
Copiar|Copy
FOCO EN EL RETO|FOCUS ON THE CHALLENGE
RETROALIMENTACIÓN|FEEDBACK
Tu trabajo, tu criterio.|Your work, your judgment.
Una pista a la vez.|One hint at a time.
Tu avance se guarda|Your progress is saved
ID de sesión|Session ID
Tu siguiente comprobación|Your next check
Evaluar avance|Evaluate progress
Todas las pistas visibles|All hints visible
REFERENCIA PRÁCTICA|PRACTICAL REFERENCE
Buscar comando o descripción|Search commands or descriptions
Área|Area
Anfitrión|Host
Dentro de la VM|Inside the VM
Consultar manuales y biblioteca|Open manuals and library
No hay ejemplos que coincidan con tu búsqueda.|No examples match your search.
Registro personal y evaluación directa|Personal record and direct evaluation
Evidencia de ejecución (para pasos transitorios, mínimo 20 caracteres)|Execution evidence (transient steps: at least 20 characters)
He documentado esta comprobación (marca personal)|I documented this check (personal mark)
LECTURA REAL · DOS VMS · PERSISTENCIA|REAL READINGS · TWO VMS · PERSISTENCE
Validación pendiente|Verification pending
Recolecciones comparadas|Readings compared
VM|VM
Misma VM|Same VM
Nuevo arranque|New boot
Sí|Yes
No|No
Identificadores de arranque recogidos|Collected boot identifiers
Validando…|Validating…
Recopilar, reiniciar ambas VMs y validar|Collect, reboot both VMs and verify
Conectar agente y validar|Connect agent and verify
GUÍA INDEPENDIENTE · RESULTADOS DEL ENTRENAMIENTO|INDEPENDENT GUIDE · TRAINING RESULTS
Revisa la evidencia de tu intento.|Review your attempt’s evidence.
El trabajo terminó. Falta validar las VMs.|Work has ended. VM verification is pending.
Resultado técnico pendiente|Technical result pending
Documental · autoevaluación|Documentary · self-assessment
Control técnico verificado|Verified technical check
Control técnico por reforzar|Technical check needs work
Pendiente de verificación.|Verification pending.
Requiere recolección directa de las VMs.|Direct VM readings required.
Observaciones recogidas en las VMs|Collected VM observations
Bitácora del intento|Attempt journal
Para investigar|Further reading
Cerrar resultados|Close results
Exportar respaldo|Export backup
CONEXIÓN CON TU LABORATORIO|CONNECT YOUR LAB
Verificación de las dos VMs|Verification of both VMs
Recopila hechos del sistema y comprueba que la configuración sobrevive a un reinicio normal.|Collect system facts and verify configuration survives a normal reboot.
1. Inicia el agente en tu equipo|1. Start the agent on your host
Descargar kit actualizado|Download updated kit
Leer guía del agente|Read the agent guide
2. Empareja esta pestaña|2. Pair this tab
Código temporal de tu terminal|Temporary code from your terminal
64 caracteres del agente|64-character agent code
Puerto local|Local port
Volver a emparejar|Pair again
Conectar con mi agente|Connect my agent
Desconectar|Disconnect
Esperando emparejamiento.|Waiting for pairing.
Agente emparejado con server y client.|Agent paired with server and client.
3. Valida el intento terminado|3. Verify the finished attempt
Entiende antes de intervenir|Understand before changing
Lo que necesitas comprender|What you need to understand
Preguntas para investigar|Questions to investigate
Errores frecuentes|Common mistakes
Pregunta de partida|Starting question
Romper, con un punto de retorno|Break, with a return point
Diagnostica antes de cambiar|Diagnose before changing
¿Qué cambió?|What changed?
¿Qué evidencia tienes?|What evidence do you have?
¿En qué capa falla?|Which layer is failing?
¿Cómo probarás tu hipótesis?|How will you test your hypothesis?
Repara y vuelve a comprobar|Repair and check again
Convierte el intento en conocimiento|Turn the attempt into knowledge
Guardado automático en tu perfil|Automatically saved to your profile
Herramientas y comandos para investigar|Tools and commands to investigate
Comando o plantilla|Command or template
Para qué sirve|Purpose
Uso|Use
Plantilla|Template
Observar|Observe
Documentación técnica|Technical documentation
en la VM|in the VM
TU ENTORNO LOCAL|YOUR LOCAL ENVIRONMENT
El mismo laboratorio, en tu equipo.|The same lab on your computer.
Descargar kit completo|Download full kit
Prepara tu sistema anfitrión|Prepare your host
Sistema anfitrión|Host operating system
Un Vagrantfile para entender y modificar|A Vagrantfile to understand and modify
Ver Vagrantfile comentado|View the commented Vagrantfile
Copiar Vagrantfile|Copy Vagrantfile
Descargar archivo|Download source
Arquitectura elegida|Architecture
Por qué UTC|Why UTC
Ventajas para preparar RHCSA|Benefits for RHCSA preparation
Mejoras futuras posibles|Possible improvements
Del primer arranque al primer reto|From first boot to first challenge
Descomprime el kit y revisa LAB|Extract the kit and review LAB
Inicia las dos VMs|Start both VMs
Comprueba y guarda un punto de retorno|Check and save a recovery point
Practica y recoge evidencia|Practice and collect evidence
Comandos básicos de Vagrant|Basic Vagrant commands
Comando|Command
Qué hace|What it does
Errores comunes a evitar|Common mistakes to avoid
Alternativa Rocky Linux 9|Rocky Linux 9 alternative
Descargar alternativa Rocky 9|Read the Rocky 9 alternative
Checklist de preparación|Preparation checklist
Dentro del kit|Inside the kit
CADA INTENTO CUENTA|EVERY ATTEMPT COUNTS
Tu progreso|Your progress
Completar significa cumplir los criterios y dejar evidencia.|Completion means meeting the criteria and providing evidence.
Restaurar respaldo|Restore backup
COBERTURA DEL CATÁLOGO|CATALOG COVERAGE
Historial de sesiones|Session history
Consulta lo que comprobaste y lo que puedes reforzar.|Review what you verified and where to improve.
Tu historial empieza con el primer intento|Your history starts with the first attempt
El catálogo está abierto. Escoge el reto que necesitas hoy.|The catalog is open. Choose the challenge you need today.
Elegir laboratorio|Choose a lab
Exportar actual|Export current data
DE LA EXPERIENCIA AL CRITERIO|FROM EXPERIENCE TO JUDGMENT
Tu bitácora|Your journal
Síntoma, hipótesis, causa y reparación: el conocimiento que te llevas.|Symptom, hypothesis, cause and repair: the knowledge you retain.
Exportar bitácora|Export journal
Captura un aprendizaje|Capture a lesson
Título|Title
Tu nota|Your note
Una avería, una duda o algo que aprendiste…|A fault, a question or something you learned…
Guardar nota|Save note
Conocimiento registrado|Recorded knowledge
NOTA PERSONAL|PERSONAL NOTE
Eliminar nota|Delete note
Conservar|Keep
INVESTIGA. CONTRASTA. PRACTICA.|INVESTIGATE. COMPARE. PRACTICE.
Tu biblioteca de referencia|Your reference library
Empieza por documentación oficial y aprende a encontrar ayuda dentro del sistema.|Start with official documentation and learn to find help inside the system.
Objetivos oficiales EX200|Official EX200 objectives
Consultar alcance oficial|Read official scope
ANTES DE EMPEZAR|BEFORE YOU START
¿Listo para 02:00:00 exactas?|Ready for exactly 02:00:00?
Iniciar simulacro|Start simulation
Seguir preparando|Continue preparation
Cancelar|Cancel
Cerrar|Close
Información de la sesión|Session information
Ir al contenido|Skip to content`;
for(const line of ui.split('\n')){const [es,en]=line.split('|');register(es,en);}
export function translateText(text){
 if(language!=='en'||!text?.trim())return text;
 const value=text.trim();let translated=pairs.get(value);
 if(!translated){const patterns=[
 [/^Hola, (.+)$/,'Hello, $1'],[/^(\d+) laboratorios? disponibles?$/,'$1 labs available'],[/^Ver los (\d+) laboratorios$/,'View all $1 labs'],[/^(\d+) escenarios: 10 áreas de EX200 y un bloque adicional de Podman\.$/,'$1 scenarios: 10 EX200 areas and additional Podman practice.'],[/^(\d+) ejemplos ejecutables con descripción, ámbito y manual\.$/,'$1 runnable examples with description, scope and manual.'],[/^(\d+) preparados$/,'$1 ready'],[/^(\d+) para revisar$/,'$1 to review'],[/^RETO (\d+) DE (\d+)$/,'TASK $1 OF $2'],[/^(\d+) min orientativos$/,'$1 suggested min'],[/^Ver pista (\d+)$/,'Show hint $1'],[/^PISTA (\d+)$/,'HINT $1'],[/^(\d+) objetivos$/,'$1 objectives'],[/^\+ documentación requerida$/,'+ documentation required'],[/^\/(\s*)(\d+) retos completos$/,'/ $2 completed tasks'],[/^(\d+) de (\d+) laboratorios completados$/,'$1 of $2 labs completed'],[/^(\d+) de 6 comprobaciones marcadas por ti$/,'$1 of 6 checks marked by you'],[/^(\d+) \/ (\d+) objetivos con reto completado$/,'$1 / $2 objectives with completed tasks'],[/^([\d/]+) completos$/,'$1 complete']];
 for(const [pattern,replacement] of patterns)if(pattern.test(value)){translated=value.replace(pattern,replacement);break;}
 }

 if(!translated&&/^\d+\. /.test(value)){const index=value.indexOf('. ')+2;const title=translateText(value.slice(index));if(title!==value.slice(index))translated=value.slice(0,index)+title;}
 if(!translated&&value.includes(' · ')){const parts=value.split(' · '),output=parts.map(part=>translateText(part)).join(' · ');if(output!==value)translated=output;}
 if(!translated&&/^Abrir /.test(value))translated='Open '+translateText(value.slice(6));
 if(!translated&&/\b\d+ objetivos?\b/.test(value))translated=value.replace(/\b(\d+) objetivo(s)?\b/g,'$1 objective$2');
 return translated?text.replace(value,translated):text;
}
export function languageControl(){return `<div class="language-control" role="group" aria-label="${L('Idioma','Language')}"><button data-language="es" aria-pressed="${language==='es'}">ES</button><button data-language="en" aria-pressed="${language==='en'}">EN</button></div>`;}
export function translateDOM(root=document.body){
 document.documentElement.lang=language;
 if(language!=='en')return;
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){if(node.parentElement?.closest('code,pre,textarea,script,style,.preserve,.profile,.attempt-id,[data-user-content]'))continue;const output=translateText(node.nodeValue);if(output!==node.nodeValue)node.nodeValue=output;}
 for(const el of root.querySelectorAll('[placeholder],[aria-label],[title]'))for(const attr of ['placeholder','aria-label','title'])if(el.hasAttribute(attr)){const value=el.getAttribute(attr),output=translateText(value);if(output!==value)el.setAttribute(attr,output);}
}
export const translationCount=()=>pairs.size;
const moreUI={
'Hay progreso anterior en este navegador.':'Previous progress exists in this browser.','Importarlo a este perfil':'Import into this profile','Configurar mi laboratorio':'Set up my lab','MODO SIMULACRO':'SIMULATION MODE','120 minutos exactos. 32 retos. Puedes saltar y volver a cualquier ejercicio.':'Exactly 120 minutes. 32 tasks. Skip and return to any task.','Preparar un simulacro':'Prepare a simulation','TU MÉTODO':'YOUR METHOD','Navegación principal':'Main navigation','Topología del laboratorio local':'Local lab topology','Tu actividad':'Your activity','RHCSA Lab: mi espacio':'RHCSA Lab: my workspace',
'Rocky Linux 10 · VirtualBox · Windows, macOS Intel y Linux x86_64.':'Rocky Linux 10 · VirtualBox · Windows, Intel macOS and x86_64 Linux.','Servicios, almacenamiento, seguridad y Podman':'Services, storage, security and Podman','Acceso remoto, pruebas de red, NFS y Flatpak':'Remote access, network tests, NFS and Flatpak','2 discos de 8 GiB opcionales':'2 optional 8 GiB disks','1 disco de 8 GiB opcional':'1 optional 8 GiB disk','· extra_disks: false por defecto':'· extra_disks: false by default',
'Instala Vagrant, VirtualBox y Python 3 para tu distribución. Comprueba que el módulo de VirtualBox carga con tu kernel y que la CPU es x86_64 compatible con x86-64-v3 para Rocky 10.':'Install Vagrant, VirtualBox and Python 3 for your distribution. Check the VirtualBox kernel module and x86-64-v3 CPU support for Rocky 10.',
'No ejecutes Vagrant con sudo: crearía otro estado y otras claves. Si Secure Boot impide cargar un módulo, sigue el proceso de firma de tu distribución.':'Do not run Vagrant with sudo: it would create separate state and keys. If Secure Boot blocks a module, follow your distribution’s signing procedure.',
'Instala VirtualBox y Vagrant para Windows, Python 3 con el lanzador py y OpenSSH Client. Ejecuta este kit desde PowerShell en Windows; evita mezclar Vagrant de WSL con el proveedor nativo.':'Install VirtualBox, Vagrant, Python 3 with the py launcher and OpenSSH Client for Windows. Run the kit from Windows PowerShell; do not mix WSL Vagrant with the native provider.',
'Instala Vagrant, VirtualBox y Python 3 para tu distribución.':'Install Vagrant, VirtualBox and Python 3 for your distribution.',
'Instala versiones compatibles de VirtualBox, Vagrant y Python 3 para macOS.':'Install compatible VirtualBox, Vagrant and Python 3 releases for macOS.',
'En Mac Intel, comprueba que el hipervisor exponga x86-64-v3 a Rocky 10. Empieza con una VM si otras aplicaciones consumen recursos.':'On Intel Macs check that the hypervisor exposes x86-64-v3 to Rocky 10. Start with one VM if other applications consume resources.',
'Instala VirtualBox, Vagrant y Python 3 para tu distribución.':'Install VirtualBox, Vagrant and Python 3 for your distribution.',
'Instala VirtualBox, Vagrant y Python 3 para tu sistema.':'Install VirtualBox, Vagrant and Python 3 for your system.',
'Crea/inicia ambas VMs y aprovisiona en el primer arranque.':'Create/start both VMs and provision on first boot.','Abre una shell SSH en server; usa client para el otro nodo.':'Open SSH on server; use client for the other node.','Apaga normalmente las VMs conservando discos y estado.':'Shut down the VMs normally while retaining disks and state.','Elimina las VMs y sus discos asociados tras confirmación. No se deshace con vagrant up.':'Delete VMs and associated disks after confirmation. vagrant up does not restore deleted data.','Repite el provisionador; puede instalar nuevas actualizaciones.':'Repeat provisioning, possibly installing new updates.','Reinicia y aplica cambios de hardware/red.':'Reboot and apply hardware/network changes.',
'El agente local lee ambas VMs mediante Vagrant SSH y entrega las observaciones a tu perfil. No necesitas exponer SSH a Internet. El acceso del sitio sigue siendo privado; compartirlo con otra persona requiere una concesión de acceso aparte.':'The local agent reads both VMs through Vagrant SSH and sends observations to your profile. SSH needs no Internet exposure. Site sharing requires a separate access grant.',
'VirtualBox, Vagrant y Python disponibles en mi sistema anfitrión.':'VirtualBox, Vagrant and Python are available on my host.','Rocky 10 inicia y la CPU expone las instrucciones requeridas.':'Rocky 10 boots and the CPU exposes the required instructions.','server y client tienen hostname, consola y SSH funcionales.':'server and client have working hostnames, consoles and SSH.','NAT proporciona Internet y la red privada comunica ambos nodos.':'NAT provides Internet and the private network connects both nodes.','Discos de práctica habilitados e identificados si el reto los necesita.':'Practice disks are enabled and identified when needed.','Actualizaciones revisadas, reinicio completado y snapshot base guardado.':'Updates checked, reboot complete and baseline snapshot saved.',
'Guía independiente de preparación. No es un examen oficial ni está afiliada, patrocinada o avalada por Red Hat. Los escenarios son originales y no contienen preguntas reales del examen. Red Hat, RHEL, RHCSA y EX200 son marcas de sus respectivos titulares. Los resultados de práctica no garantizan aprobación.':'Independent preparation guide. Not an official exam; not affiliated with, sponsored or endorsed by Red Hat. Scenarios are original and contain no real exam questions. Red Hat, RHEL, RHCSA and EX200 are trademarks of their respective owners. Practice results do not guarantee passing.',
'Rocky Linux 10 es el entorno de laboratorio. El acceso privado del sitio se mantiene; crear un perfil no convierte el enlace en público.':'Rocky Linux 10 is the lab environment. Creating a profile does not make the private site public.',
'Lo que necesitas comprender':'What you need to understand','Preguntas para investigar':'Research questions','Errores frecuentes':'Common mistakes','Pregunta de partida':'Starting question','Plantilla':'Template','Observar':'Observe','en la VM':'in the VM','Documentación técnica':'Technical documentation','Antes de empezar':'Before starting','Reanudar':'Resume','Pausar':'Pause','Retos':'Challenges','Siguiente →':'Next →','← Anterior':'← Previous','Omitir por ahora':'Skip for now','Volver al primer reto →':'Return to first task →','Ir al reto':'Go to task','Pendiente':'Pending','Visitado':'Visited','Revisar':'Review','Preparado':'Ready','Importar informe':'Import report','Con evidencia':'With evidence','Por reforzar':'Needs practice','Conectar agente y validar':'Connect agent and validate','Resultado técnico pendiente':'Technical result pending',
'El trabajo está cerrado. Falta recoger el estado, reiniciar las dos VMs y contrastar la segunda lectura. Aún no hay un resultado técnico confirmado.':'Work is closed. Collect state, reboot both VMs and compare the second reading. No technical result is confirmed yet.','Las mismas dos VMs tienen nuevos identificadores de arranque. Cada control distingue configuración técnica y evidencia documental.':'The same two VMs have new boot IDs. Each check distinguishes technical configuration from documentary evidence.','GUÍA INDEPENDIENTE · RESULTADOS DEL ENTRENAMIENTO':'INDEPENDENT GUIDE · TRAINING RESULTS','Revisa la evidencia de tu intento.':'Review your attempt evidence.','El trabajo terminó. Falta validar las VMs.':'Work finished. VM verification is still required.','Bitácora del intento':'Attempt journal','Para investigar':'Further research','Sin diagnóstico documentado; se requieren 30 caracteres para completar el reto.':'No documented diagnosis; at least 30 characters are needed to complete the task.','Pendiente de verificación.':'Verification pending.','Control técnico verificado':'Verified technical check','Control técnico por reforzar':'Technical check needs practice','Documental · autoevaluación':'Documentary · self-assessment','Observaciones recogidas en las VMs':'Collected VM observations','Cerrar resultados':'Close results','Exportar respaldo':'Export backup','Volver a mi progreso':'Return to my progress',
'1. Inicia el agente en tu equipo':'1. Start the agent on your host','2. Empareja esta pestaña':'2. Pair this tab','3. Valida el intento terminado':'3. Validate the finished attempt','CONEXIÓN CON TU LABORATORIO':'CONNECT YOUR LAB','Verificación de las dos VMs':'Verify both VMs','Recopila hechos del sistema y comprueba que la configuración sobrevive a un reinicio normal.':'Collect system facts and check that configuration survives a normal reboot.','Código temporal de tu terminal':'Temporary code from your terminal','64 caracteres del agente':'64-character agent code','Puerto local':'Local port','Conectar con mi agente':'Connect my agent','Volver a emparejar':'Pair again','Desconectar':'Disconnect','Esperando emparejamiento.':'Waiting to pair.','Agente emparejado con server y client.':'Agent paired with server and client.',
'Requiere extra_disks: true en el Vagrantfile y discos vacíos identificados. Swap requiere completar primero LVM.':'Requires extra_disks: true and identified empty disks. Complete LVM before swap.','Completa primero Usuarios y grupos.':'Complete Users and groups first.','Completa primero NFS/autofs.':'Complete NFS/autofs first.','Requiere Podman instalado; aumenta la RAM si tu carga lo necesita.':'Requires Podman; increase RAM if the workload needs it.'
};for(const [es,en] of Object.entries(moreUI))register(es,en);
register('Contrasta cada criterio con la evidencia observada; revisa las páginas de manual indicadas al terminar.','Compare every criterion with observed evidence; review the listed man pages after finishing.');
register('Bash','Bash');
const lastPairs={
'SIMULACRO INTEGRAL · 02:00:00 · SIN PAUSA':'FULL SIMULATION · 02:00:00 · NO PAUSE','PRÁCTICA GUIADA':'GUIDED PRACTICE','Simulacro':'Exam simulation','Los recursos de aprendizaje estarán disponibles al finalizar el simulacro.':'Learning resources become available after finishing the simulation.','Tu misión':'Your mission','Los cambios deben sobrevivir al reinicio cuando el criterio lo indique.':'Changes must survive reboot when required by the criterion.','Una pista a la vez.':'One hint at a time.','Pausa disponible. Progreso guardado en tu perfil.':'Pause is available. Progress is saved to your profile.','Antes de empezar':'Before starting','¿Cómo sabrás que está logrado?':'How will you know it is complete?','Un reto. Seis perspectivas.':'One challenge. Six perspectives.','Consulta recursos, prueba, provoca una avería controlada y documenta lo que aprendiste.':'Read, test, introduce a controlled fault and document what you learned.','Prepara las VMs y un snapshot limpio. Los ejercicios se ejecutan en tu terminal local.':'Prepare VMs and a clean snapshot. Exercises run in your local terminal.','Iniciar práctica':'Start practice','← Volver a laboratorios':'← Back to labs','Ir a mis máquinas':'Go to my machines','Documentación técnica':'Technical documentation','Se contrastará con la lectura de las VMs. La evidencia documental se identifica por separado.':'Compared against VM readings. Documentary evidence is labeled separately.','Observaciones recogidas en las VMs':'Collected VM observations','Cerrar resultados':'Close results','Exportar respaldo':'Export backup','Requiere recolección directa de las VMs.':'Requires direct VM collection.','Sin evidencia documental registrada antes del cierre.':'No documentary evidence recorded before closing.','Comprobado antes y después del reinicio; la configuración persistente conserva su huella.':'Verified before and after reboot; persistent configuration retains its fingerprint.','La configuración observada cambió entre las dos recolecciones.':'Observed configuration changed between readings.','No se confirmó el reinicio de las mismas dos VMs.':'Reboot of the same two VMs was not confirmed.','No hay control completo para este criterio.':'This criterion has no complete check.','El verificador no pudo evaluar este criterio; permanece pendiente.':'The verifier could not evaluate this criterion; it remains pending.','Acción transitoria: la lectura de VM aporta contexto; requiere tu evidencia documental.':'Transient action: VM readings provide context; documentary evidence is required.','Objetivos oficiales EX200':'Official EX200 objectives','Consultar alcance oficial':'View official scope','INVESTIGA. CONTRASTA. PRACTICA.':'RESEARCH. COMPARE. PRACTICE.','Tu biblioteca de referencia':'Your reference library','Empieza por documentación oficial y aprende a encontrar ayuda dentro del sistema.':'Start with official documentation and learn to find help inside the system.','En cada manual busca DESCRIPCIÓN, OPCIONES, EJEMPLOS y VÉASE TAMBIÉN. Durante el simulacro, usa la documentación instalada en tus VMs.':'Look for DESCRIPTION, OPTIONS, EXAMPLES and SEE ALSO in each manual. Use documentation installed in your VMs during simulation.',
'Instala VirtualBox y Vagrant para Windows, Python 3 con el lanzador py y OpenSSH Client. Ejecuta este kit desde PowerShell en Windows; evita mezclar Vagrant de WSL con el proveedor nativo.':'Install VirtualBox, Vagrant, Python 3 with the py launcher and OpenSSH Client. Run the kit from Windows PowerShell without mixing WSL Vagrant with the native provider.','Instala versiones compatibles de VirtualBox, Vagrant y Python 3 para Intel. En Apple Silicon necesitas una imagen y proveedor ARM64 compatibles.':'Install compatible Intel editions of VirtualBox, Vagrant and Python 3. Apple Silicon needs an ARM64 image and compatible provider.','Instala Vagrant y VirtualBox para tu distribución.':'Install Vagrant and VirtualBox for your distribution.','Crea/inicia ambas VMs y aprovisiona en el primer arranque.':'Create/start both VMs and provision on first boot.','Abre una shell SSH en server; usa client para el otro nodo.':'Open SSH on server; use client for the other node.','Apaga normalmente las VMs conservando discos y estado.':'Shut down normally while preserving disks and state.','Elimina las VMs y sus discos asociados tras confirmación. No se deshace con vagrant up.':'Delete VMs and their disks after confirmation. vagrant up cannot recover deleted data.','Repite el provisionador; puede instalar nuevas actualizaciones.':'Repeat provisioning; new updates may be installed.','Reinicia y aplica cambios de hardware/red.':'Reboot and apply hardware/network changes.','El agente local lee ambas VMs mediante Vagrant SSH y entrega las observaciones a tu perfil. No necesitas exponer SSH a Internet. El acceso del sitio sigue siendo privado; compartirlo con otra persona requiere una concesión de acceso aparte.':'The local agent reads both VMs through Vagrant SSH and sends observations to your profile. No Internet-exposed SSH is needed. Site access remains private and sharing requires a separate access grant.'
};for(const [es,en] of Object.entries(lastPairs))register(es,en);
register('Contrasta cada criterio con la evidencia observada; revisa las páginas de manual indicadas al terminar.','Compare each criterion with observed evidence; review the listed manual pages after finishing.');

register('extra_disks: false por defecto','extra_disks: false by default');
register('Leer mapa y requisitos','Read map and requirements');
register(', con 32 retos breves y los 62 objetivos distribuidos en las 10 áreas. Incluye tar con gzip y bzip2, Flatpak, scripts, arranque, LVM, NFS/autofs, programación, red, usuarios, firewall y SELinux.',', with 32 focused tasks and 62 objectives across 10 areas. Includes tar with gzip/bzip2, Flatpak, scripting, boot, LVM, NFS/autofs, scheduling, networking, users, firewall and SELinux.');

register('Podrás revisar pistas y resultados cuando finalices. El tiempo sigue contando aunque cambies de pantalla.','Review hints and results after finishing. Time continues when changing screens.');
register('Trabaja en tu terminal local. Esta web coordina el reto; el verificador lee el estado de tus VMs.','Work in your local terminal. This website coordinates the task; the verifier reads your VMs.');
register('Ciclo de práctica','Practice cycle');
register('5 objetivos · Visitado','5 objectives · Visited');
register('Tiempo de resolución','Working time');
register('Seguir practicando','Keep practicing');register('Finalizar y ver resultados','Finish and view results');
register('CERRAR ESTE INTENTO','CLOSE THIS ATTEMPT');
