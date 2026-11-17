// Human-readable guides; commands retain their original filenames and parameters.
export const kitItems=[
  {
    "file": "provision.sh",
    "es": "Provisionador",
    "en": "Provisioner",
    "where": "guest-auto",
    "aboutEs": "Es la preparación inicial dentro de cada VM. Actualiza paquetes, instala herramientas, establece zona horaria y nombres y prepara los archivos base. Mantiene firewalld y SELinux. No resuelve los retos.",
    "aboutEn": "Performs initial setup inside each VM: updates packages, installs tools, sets timezone and host names and prepares base files. It retains firewalld and SELinux and does not solve challenges.",
    "steps": [
      {
        "es": "Conserva provision.sh junto al Vagrantfile y verify.py. En Windows guarda el script con finales de línea LF; no lo ejecutes con Bash en el anfitrión.",
        "en": "Keep provision.sh beside Vagrantfile and verify.py. On Windows save it with LF line endings; do not run it with Bash on the host.",
        "command": ""
      },
      {
        "es": "Vagrant lo ejecuta automáticamente dentro de server y client durante el primer arranque. Requiere Internet para actualizar e instalar paquetes.",
        "en": "Vagrant automatically runs it inside server and client during the first boot. Internet is needed for package updates and installation.",
        "command": "vagrant up --provider=virtualbox"
      },
      {
        "es": "Desde el anfitrión abre vagrant ssh server (y luego client). Dentro de cada VM comprueba hostname, UTC, red y herramientas con estos comandos. Sal con exit antes de volver a ejecutar Vagrant en el anfitrión.",
        "en": "From the host open vagrant ssh server (then client). Inside each VM check hostname, UTC, networking and tools with these commands. Leave with exit before running Vagrant again on the host.",
        "command": "hostnamectl\ntimedatectl\nip -br address\ncommand -v vim\nexit"
      },
      {
        "es": "Si necesitas repetirlo, usa vagrant provision antes de empezar a practicar. Puede actualizar paquetes y reescribir bloques gestionados como hosts; no lo uses para reparar una respuesta del simulacro. Reinicia y guarda el snapshot limpio.",
        "en": "If needed, run vagrant provision before practice. It can update packages and rewrite managed blocks such as hosts; do not use it to repair a simulation answer. Reboot and save a clean snapshot.",
        "command": "vagrant provision\nvagrant reload\nvagrant snapshot save base-limpia"
      }
    ]
  },
  {
    "file": "catalog-contract.json",
    "es": "Contrato del catálogo",
    "en": "Catalog contract",
    "where": "host",
    "aboutEs": "Es el índice técnico que relaciona identificadores de laboratorios con los controles y las máquinas admitidas. Lo leen el recolector y el agente; no es una lista de respuestas.",
    "aboutEn": "The technical index links lab identifiers to supported checks and machines. The collector and agent read it; it is not an answer sheet.",
    "steps": [
      {
        "es": "No requiere instalación separada. Mantén el JSON junto a collect.py y agent.py al descomprimir el kit.",
        "en": "No separate installation is required. Keep the JSON beside collect.py and agent.py after extraction.",
        "command": ""
      },
      {
        "es": "Descarga el kit completo al actualizar para evitar mezclar versiones de catálogo y verificador. Conserva tu Vagrantfile personalizado antes de reemplazar archivos.",
        "en": "Download the full kit when updating to avoid mixing catalog and verifier versions. Back up your customized Vagrantfile first.",
        "command": ""
      },
      {
        "es": "Copia los IDs del comando que muestra la práctica. No inventes identificadores ni edites el contrato para convertir un criterio en aprobado.",
        "en": "Copy IDs from the command shown by the practice. Do not invent identifiers or edit the contract to mark criteria as passed.",
        "command": ""
      },
      {
        "es": "Si aparece un laboratorio incompatible, revisa que kit, práctica y sesión correspondan a la misma versión.",
        "en": "If a lab is incompatible, check that kit, practice and session use the same version.",
        "command": ""
      }
    ]
  },
  {
    "file": "README.md",
    "es": "Guía de instalación multiplataforma",
    "en": "Cross-platform setup guide",
    "where": "host",
    "aboutEs": "Empieza aquí. Explica los requisitos, la red y el primer arranque en Windows, macOS Intel y Linux x86_64. El laboratorio no instala las VMs dentro del navegador.",
    "aboutEn": "Start here for requirements, networking and the first boot on Windows, Intel macOS and x86_64 Linux. The browser does not host your VMs.",
    "steps": [
      {
        "es": "Instala VirtualBox, Vagrant y Python 3 en el anfitrión. En Windows usa PowerShell; evita mezclar Vagrant de WSL con VirtualBox de Windows. Este kit x86_64 no es una imagen para Apple Silicon.",
        "en": "Install VirtualBox, Vagrant and Python 3 on the host. Use PowerShell on Windows; do not mix WSL Vagrant with Windows VirtualBox. This x86_64 kit is not an Apple Silicon image.",
        "command": ""
      },
      {
        "es": "Extrae el ZIP en una carpeta propia y abre la terminal allí. Conserva todos los archivos del kit juntos.",
        "en": "Extract the ZIP into its own folder and open a terminal there. Keep all kit files together.",
        "command": "vagrant --version\nVBoxManage --version"
      },
      {
        "es": "Revisa LAB en Vagrantfile. Para almacenamiento activa extra_disks: true antes de crear las VMs; identifica los discos vacíos antes de escribir en ellos.",
        "en": "Review LAB in Vagrantfile. Enable extra_disks: true before creating VMs for storage tasks; identify empty disks before writing to them.",
        "command": "vagrant validate\nvagrant up --provider=virtualbox\nvagrant status"
      },
      {
        "es": "Comprueba SSH en ambos nodos, reinicia tras actualizar y guarda una base limpia. Luego inicia una práctica en la web.",
        "en": "Check SSH on both nodes, reboot after updates and save a clean baseline. Then start a practice in the web app.",
        "command": "vagrant ssh server\nvagrant ssh client\nvagrant reload\nvagrant snapshot save base-limpia"
      }
    ]
  },
  {
    "file": "Vagrantfile",
    "es": "Vagrantfile · Rocky Linux 10",
    "en": "Vagrantfile · Rocky Linux 10",
    "where": "host",
    "aboutEs": "Es el plano del laboratorio: define server y client, recursos, imagen, redes y preparación inicial. Vagrant lo lee; no se ejecuta con Bash ni Python.",
    "aboutEn": "The lab blueprint defines server and client, resources, image, networks and initial setup. Vagrant reads it; do not run it with Bash or Python.",
    "steps": [
      {
        "es": "Colócalo junto a provision.sh y verify.py. Ajusta solo el bloque LAB: CPU, RAM, discos y timezone. La imagen está fijada mediante URL y SHA-256.",
        "en": "Keep it beside provision.sh and verify.py. Edit the LAB block for CPU, RAM, disks and timezone. The image is pinned by URL and SHA-256.",
        "command": ""
      },
      {
        "es": "NAT usa DHCP para Internet; la red privada utiliza 192.168.56.10 y 192.168.56.20 para mantener destinos estables. Comprueba conflictos con VPN antes de iniciar.",
        "en": "NAT uses DHCP for Internet; the private network uses 192.168.56.10 and 192.168.56.20 for stable targets. Check for VPN conflicts before starting.",
        "command": "vagrant validate\nvagrant up --provider=virtualbox"
      },
      {
        "es": "Entra a cada VM para practicar; halt conserva discos y destroy elimina las máquinas y sus discos asociados tras confirmación.",
        "en": "Enter each VM to practice; halt preserves disks, while destroy deletes the VMs and their attached disks after confirmation.",
        "command": "vagrant ssh server\nvagrant ssh client\nvagrant halt"
      },
      {
        "es": "La capacidad virtual de 25 GiB no garantiza que la partición y el filesystem raíz ya ocupen ese tamaño. Inspecciónalos dentro de la VM.",
        "en": "A 25 GiB virtual disk does not guarantee the root partition and filesystem already fill it. Inspect them inside the VM.",
        "command": "lsblk\ndf -hT"
      }
    ]
  },
  {
    "file": "Vagrantfile.rocky9",
    "es": "Alternativa · Rocky Linux 9",
    "en": "Alternative · Rocky Linux 9",
    "where": "host",
    "aboutEs": "Ofrece otra base Rocky para comparar versiones. No mezcles sus máquinas ni el estado .vagrant con el laboratorio Rocky 10.",
    "aboutEn": "An alternative Rocky base for comparing versions. Keep its VMs and .vagrant state separate from the Rocky 10 lab.",
    "steps": [
      {
        "es": "Extrae otro kit en una carpeta nueva. Conserva intacta la carpeta que contiene tus prácticas Rocky 10.",
        "en": "Extract another kit into a new folder. Preserve the folder containing your Rocky 10 work.",
        "command": ""
      },
      {
        "es": "En esa carpeta nueva, sustituye el Vagrantfile por una copia de Vagrantfile.rocky9 con el nombre Vagrantfile.",
        "en": "In the new folder, replace Vagrantfile with a copy of Vagrantfile.rocky9 named Vagrantfile.",
        "command": ""
      },
      {
        "es": "Valida y crea las VMs. Sus recursos y red siguen el mismo diseño; revisa que no haya otras VMs usando las mismas IP.",
        "en": "Validate and create the VMs. Resources and networking follow the same design; check that no other VMs use the same IPs.",
        "command": "vagrant validate\nvagrant up --provider=virtualbox"
      },
      {
        "es": "Consulta el manual instalado: paquetes y opciones pueden diferir. Rocky 9 no reproduce el entorno RHEL 10 del temario.",
        "en": "Use the installed manual: packages and options can differ. Rocky 9 does not reproduce the RHEL 10 study environment.",
        "command": "cat /etc/os-release"
      }
    ]
  },
  {
    "file": "collect.py",
    "es": "Recolector multiplataforma · prácticas guiadas",
    "en": "Cross-platform collector · guided practice",
    "where": "host",
    "aboutEs": "Se ejecuta en el anfitrión y consulta las VMs con Vagrant SSH. Llama a verify.py y guarda un informe JSON para importar en una práctica guiada. No verifica un reinicio por sí solo.",
    "aboutEn": "Runs on the host and queries the VMs through Vagrant SSH. It calls verify.py and saves a JSON report for import into guided practice. It does not independently verify a reboot.",
    "steps": [
      {
        "es": "Necesitas Python 3, Vagrant, las VMs encendidas y todos los archivos del kit, incluido catalog-contract.json. No requiere pip.",
        "en": "You need Python 3, Vagrant, running VMs and all kit files, including catalog-contract.json. No pip packages are required.",
        "command": "vagrant status"
      },
      {
        "es": "Inicia una práctica guiada. En Evidencia y resultados abre Cómo obtener el informe y copia el comando: ya contiene el ID y los laboratorios exactos.",
        "en": "Start guided practice. Under Evidence and results, open the report instructions and copy the command containing the exact attempt ID and lab IDs.",
        "command": ""
      },
      {
        "es": "Ejecuta el comando copiado desde la carpeta del kit en tu equipo. Windows usa py -3; macOS/Linux usan python3. Los parámetros de ejemplo deben sustituirse.",
        "en": "Run the copied command from the kit folder on your host. Windows uses py -3; macOS/Linux use python3. Replace the example parameters.",
        "command": "python3 collect.py --attempt ID_DEL_INTENTO --labs ID_DEL_LAB"
      },
      {
        "es": "Importa informe-ex200.json en esa misma sesión. Un informe de otro intento se rechaza. Completa además las evidencias documentales; para el simulacro utiliza agent.py.",
        "en": "Import informe-ex200.json into that same session. Reports from another attempt are rejected. Also complete documentary evidence; use agent.py for the exam simulation.",
        "command": ""
      }
    ]
  },
  {
    "file": "verify.py",
    "es": "Verificador de VMs · prácticas guiadas",
    "en": "VM verifier · guided practice",
    "where": "guest-auto",
    "aboutEs": "Es el lector de controles de las prácticas guiadas. Se instala en /opt/ex200/verify.py dentro de Rocky y devuelve hechos del sistema; no corrige configuraciones.",
    "aboutEn": "Reads guided-practice checks inside Rocky at /opt/ex200/verify.py. It returns system facts without repairing configuration.",
    "steps": [
      {
        "es": "Vagrant lo copia y el provisionador lo instala. No lo ejecutes directamente en el anfitrión: comprueba distribución, privilegios y hostname.",
        "en": "Vagrant copies it and the provisioner installs it. Do not run it directly on the host: it checks distribution, privileges and hostname.",
        "command": ""
      },
      {
        "es": "Para confirmar que está instalado, abre la VM y revisa su ayuda. Este comando no resuelve ningún ejercicio.",
        "en": "To confirm installation, enter the VM and inspect its help. This does not solve a task.",
        "command": "vagrant ssh server -c \"sudo python3 /opt/ex200/verify.py --help\""
      },
      {
        "es": "Durante la práctica usa collect.py en el anfitrión: le envía el ID del intento y los laboratorios. No necesitas invocarlo manualmente para el flujo habitual.",
        "en": "During practice use collect.py on the host: it supplies the attempt and lab IDs. Manual invocation is unnecessary in the normal workflow.",
        "command": ""
      },
      {
        "es": "Un control automático cubre solo el criterio indicado. Las acciones transitorias y la documentación siguen pendientes hasta que aportes evidencia.",
        "en": "An automatic check covers only its stated criterion. Transient actions and documentation remain pending until you provide evidence.",
        "command": ""
      }
    ]
  },
  {
    "file": "agent.py",
    "es": "Agente de conexión local",
    "en": "Local connection agent",
    "where": "host",
    "aboutEs": "Es el puente entre esta pestaña y tus VMs. Escucha en 127.0.0.1:8765, exige un código temporal y el origen exacto de la web; coordina la lectura y el reinicio de ambas máquinas.",
    "aboutEn": "Bridges this tab and your VMs. It listens on 127.0.0.1:8765, requires a temporary code and the exact website origin, and coordinates readings and reboots of both VMs.",
    "steps": [
      {
        "es": "Conserva agent.py, vm_probe.py, catalog-contract.json y Vagrantfile juntos. Arranca ambas VMs y confirma SSH antes del simulacro.",
        "en": "Keep agent.py, vm_probe.py, catalog-contract.json and Vagrantfile together. Start both VMs and confirm SSH before the simulation.",
        "command": "vagrant up\nvagrant status"
      },
      {
        "es": "En el anfitrión inicia el agente con el origen que aparece en esta guía. En Windows cambia python3 por py -3. Mantén abierta la terminal.",
        "en": "Start the agent on the host using the origin shown in this guide. On Windows replace python3 with py -3. Keep the terminal open.",
        "command": "@agent"
      },
      {
        "es": "En Verificación de VMs introduce el código temporal de la terminal. Si el navegador solicita acceso a red local, autoriza este sitio. Tras recargar debes emparejar otra vez.",
        "en": "In VM verification enter the terminal’s temporary code. If the browser requests local-network access, allow this site. Pair again after reloading.",
        "command": ""
      },
      {
        "es": "Al terminar el intento pulsa validar: recoge ambas VMs, guarda la referencia, reinicia ambas y compara otra lectura. No modifica respuestas. Ctrl+C detiene el agente e invalida el código.",
        "en": "After finishing the attempt, validate: collect both VMs, save the baseline, reboot both and compare a second reading. It does not modify answers. Ctrl+C stops the agent and invalidates the code.",
        "command": ""
      }
    ]
  },
  {
    "file": "vm_probe.py",
    "es": "Sonda de las dos VMs",
    "en": "Two-VM probe",
    "where": "guest-auto",
    "aboutEs": "Es el componente que el agente envía a cada VM por SSH para leer machine-id, boot ID y controles técnicos. Algunas comprobaciones ejecutan pruebas funcionales acotadas.",
    "aboutEn": "The agent sends this component to each VM through SSH to read machine-id, boot ID and technical checks. Some checks run bounded functional tests.",
    "steps": [
      {
        "es": "Conserva la sonda original junto al agente. No requiere instalación manual ni ejecutarla en tu anfitrión.",
        "en": "Keep the original probe beside the agent. It requires no manual installation or execution on the host.",
        "command": ""
      },
      {
        "es": "Empareja el agente antes de empezar y trabaja en las VMs de laboratorio. Las pruebas de scripts pueden ejecutar tu código como vagrant; usa solo estas VMs desechables.",
        "en": "Pair the agent before starting and work in the lab VMs. Script checks may execute your code as vagrant; use only these disposable VMs.",
        "command": ""
      },
      {
        "es": "La primera lectura se vincula al intento. La segunda debe conservar machine-id y mostrar otro boot ID en server y client.",
        "en": "The first reading is linked to the attempt. The second must preserve machine-id and show a different boot ID on both server and client.",
        "command": ""
      },
      {
        "es": "Consulta Observaciones recogidas en las VMs en los resultados. Si falta un nodo o una huella no coincide, revisa el criterio; una marca personal no lo aprueba.",
        "en": "Open Collected VM observations in the results. If a node is missing or a fingerprint differs, investigate the criterion; a personal mark cannot pass it.",
        "command": ""
      }
    ]
  },
  {
    "file": "AGENTE_LOCAL.md",
    "es": "Guía del agente y la persistencia",
    "en": "Agent and persistence guide",
    "where": "web",
    "aboutEs": "Explica el recorrido completo del simulacro y las diferencias entre una configuración persistente, una acción transitoria y una marca personal.",
    "aboutEn": "Explains the full simulation workflow and the differences between persistent configuration, a transient action and a personal mark.",
    "steps": [
      {
        "es": "Prepara las VMs, los discos y el agente antes de iniciar el reloj. Guarda una base limpia.",
        "en": "Prepare VMs, disks and the agent before starting the timer. Save a clean baseline.",
        "command": ""
      },
      {
        "es": "Resuelve y documenta dentro de las dos horas. Puedes saltar un reto y volver. Las notas quedan bloqueadas al finalizar.",
        "en": "Work and document within two hours. You may skip a task and return. Notes are locked on finish.",
        "command": ""
      },
      {
        "es": "Valida inmediatamente al cerrar. El reinicio comprueba persistencia, pero no amplía las dos horas ni demuestra cuándo hiciste cambios antes de la primera lectura.",
        "en": "Validate immediately after finishing. Reboot verification does not extend the two hours or prove when changes occurred before the first reading.",
        "command": ""
      },
      {
        "es": "La referencia inicial se conserva al reintentar. Reparar después no convierte un fallo inicial en acierto: prepara otro intento para demostrarlo.",
        "en": "The first baseline is retained on retries. Repairing later does not turn an initial failure into a pass: start another attempt to demonstrate it.",
        "command": ""
      }
    ]
  },
  {
    "file": "COMANDOS_COMPLETOS.md",
    "es": "Ejemplos de comandos completos",
    "en": "Complete command examples",
    "where": "web",
    "aboutEs": "Referencia de ejemplos con explicación, ámbito y manual. No es una secuencia de respuestas a los ejercicios.",
    "aboutEn": "Reference examples with explanations, execution scope and manual pages. This is not a sequence of exercise answers.",
    "steps": [
      {
        "es": "Busca la herramienta en Comandos completos. Comprueba si el ejemplo se ejecuta en el anfitrión o dentro de una VM.",
        "en": "Find the tool in Complete commands. Check whether the example runs on the host or inside a VM.",
        "command": ""
      },
      {
        "es": "Lee la descripción y prepara solo los archivos de demostración indicados. Copia cada ejemplo por separado y revisa rutas antes de ejecutar.",
        "en": "Read the description and prepare only the stated demo files. Copy each example separately and review paths before execution.",
        "command": ""
      },
      {
        "es": "Consulta la página man instalada. Las opciones pueden variar entre versiones; identifica qué observación necesitas antes de elegir una opción.",
        "en": "Use the installed man page. Options can vary by version; identify the observation you need before choosing an option.",
        "command": ""
      },
      {
        "es": "Vuelve al reto y decide tus parámetros. Esta referencia queda fuera del modo de simulacro activo.",
        "en": "Return to the task and choose your parameters. This reference is outside active simulation mode.",
        "command": ""
      }
    ]
  },
  {
    "file": "COMANDOS.md",
    "es": "Herramientas por laboratorio",
    "en": "Tools by laboratory",
    "where": "web",
    "aboutEs": "Relaciona cada laboratorio con herramientas de observación y plantillas de sintaxis para investigar. Los parámetros los decide el estudiante.",
    "aboutEn": "Links each lab to observation tools and syntax templates for investigation. The student chooses the parameters.",
    "steps": [
      {
        "es": "Abre el laboratorio y revisa Herramientas y comandos para investigar.",
        "en": "Open the lab and review Tools and commands to investigate.",
        "command": ""
      },
      {
        "es": "Distingue Observar de Plantilla. Los nombres en MAYÚSCULAS y entre corchetes no se ejecutan literalmente.",
        "en": "Distinguish Observe from Template. Names in UPPERCASE and brackets are not literal executable values.",
        "command": ""
      },
      {
        "es": "Lee man, info y /usr/share/doc en la VM. Recoge evidencia antes de modificar el estado.",
        "en": "Read man, info and /usr/share/doc inside the VM. Gather evidence before changing state.",
        "command": ""
      },
      {
        "es": "Documenta la observación que justifica cada decisión. No conviertas una lista de herramientas en comandos ejecutados a ciegas.",
        "en": "Document the observation supporting each decision. Do not execute a list of tools blindly.",
        "command": ""
      }
    ]
  },
  {
    "file": "SIMULACRO_120_MIN.md",
    "es": "Mapa del simulacro y puntuación",
    "en": "Simulation map and scoring",
    "where": "web",
    "aboutEs": "Muestra los 32 retos, los 62 objetivos de estudio y los requisitos. La duración de práctica es 120 minutos exactos; las referencias se revisan fuera del intento activo.",
    "aboutEn": "Shows 32 tasks, 62 study objectives and requirements. Practice lasts exactly 120 minutes; references are reviewed outside the active attempt.",
    "steps": [
      {
        "es": "Revisa las dependencias de discos, red y paquetes antes del reloj. Los minutos sugeridos por reto orientan, sin bloquear la navegación.",
        "en": "Review disk, network and package dependencies before the timer. Suggested task times guide you without blocking navigation.",
        "command": ""
      },
      {
        "es": "La rúbrica propia suma 300 puntos: 30 por cada una de las 10 áreas. Consulta el peso de cada criterio en Simulacro antes de empezar.",
        "en": "The training rubric totals 300 points: 30 for each of 10 areas. Review each criterion’s weight on the Simulation page before starting.",
        "command": ""
      },
      {
        "es": "Al finalizar, el resultado queda pendiente hasta verificar las dos VMs y su reinicio. Los criterios parciales aprobados suman su peso aunque otro criterio del reto falle.",
        "en": "On finish, the result stays pending until both VMs and their reboot are verified. Passed criteria earn their weight even if another criterion in the task fails.",
        "command": ""
      },
      {
        "es": "Separa puntos técnicos y documentales. No se utiliza una rúbrica oficial ni se predice la nota real de Red Hat. Preparado u Omitido no otorgan puntos.",
        "en": "Distinguish technical and documentary points. This is not an official rubric or a prediction of a Red Hat score. Ready or Skipped marks award no points.",
        "command": ""
      }
    ]
  }
];
