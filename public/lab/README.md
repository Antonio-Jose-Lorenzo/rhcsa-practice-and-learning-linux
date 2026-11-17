# RHCSA Lab · Rocky Linux 10 · VirtualBox

Un laboratorio de dos VMs para Windows, macOS Intel y Linux x86_64. Escenarios originales, documentación e inspección; no incluye soluciones ordenadas ni preguntas reales del examen.

## Versión elegida y alcance

La versión principal es **Rocky Linux 10**, según la indicación inicial. Como la lista copiada también mencionaba Rocky Linux 9, se incluye `Vagrantfile.rocky9` como alternativa separada. No se actualiza una VM 9 a 10 al cambiar el archivo: usa una carpeta nueva para otra versión y conserva tus respaldos.

El alcance oficial actual de EX200 está basado en **RHEL 10**. Rocky 10 sirve para practicar las herramientas comunes; no reproduce los servicios de suscripción ni el CDN de Red Hat. Flatpak figura en los objetivos actuales. Podman/contendedores se ofrece como complemento de administración y DevOps porque no aparece en esa lista actual; no se presenta como una exigencia de EX200 RHEL 10.

Referencia revisada: 17 de noviembre de 2026. [Objetivos oficiales](https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam).

## Vagrantfile comentado

El archivo `Vagrantfile` incluido es la configuración principal. Mantén juntos todos los archivos del kit: el archivo usa `provision.sh` y copia `verify.py` por SSH. Puedes ver y copiar su contenido completo desde **Mis máquinas** en la web.

El bloque `LAB` concentra las opciones que se modifican con más frecuencia:

| Opción | Valor principal | Motivo |
|---|---|---|
| Imagen | Rocky 10.3, build 20261112.0, VirtualBox x86_64 | URL oficial y SHA-256 fijados, sin depender de un enlace latest mutable |
| CPU | 1 vCPU por VM | Perfil ligero para practicar administración |
| Memoria | 1024 MiB por VM | Perfil base solicitado; 2048 MiB si una carga lo necesita |
| Disco de sistema | 25 GiB de capacidad virtual solicitada | La imagen oficial parte de un disco de 10 GiB; ampliar el disco no amplía todas sus capas automáticamente |
| Timezone | UTC | Permite comparar logs y calendarios sin depender del país del estudiante |
| extra_disks | false | Mantiene el entorno inicial simple; habilítalo para almacenamiento |

La URL fijada y su checksum proceden del [directorio oficial Rocky 10](https://dl.rockylinux.org/pub/rocky/10/images/x86_64/). Una actualización menor de Rocky puede mover artefactos antiguos: si esa URL deja de existir, elige otra imagen oficial compatible y actualiza **URL y SHA-256 juntos**. No desactives la verificación para ocultar un error de descarga. Conserva la box local si necesitas reproducir el mismo laboratorio después.

## Arquitectura elegida

| Nodo | Hostname | CPU / RAM | Disco virtual | Red privada |
|---|---|---|---|---|
| server | server.lab | 1 vCPU / 1 GiB | 25 GiB | 192.168.56.10/24 |
| client | client.lab | 1 vCPU / 1 GiB | 25 GiB | 192.168.56.20/24 |

- Adaptador 1: **NAT con DHCP**, administrado por Vagrant/VirtualBox para salida a Internet.
- Adaptador 2: **host-only con IP fija**. Recomendada para que SSH, NFS y las pruebas entre VMs no cambien de destino después de un reinicio. No se configura gateway por esta interfaz.
- Hostnames y resolución local se configuran durante el provisioning.
- SSH se usa para administración y copia de archivos del kit. Vagrant sustituye su clave inicial mediante `insert_key`.
- No hay carpetas compartidas ni bridge. El kit no necesita Guest Additions para transferir el verificador. Host-only conecta las VMs y el host; no es una frontera de aislamiento frente al host.
- El provisionador conserva firewalld y SELinux. No desactiva protecciones para hacer funcionar los retos.

### Por qué UTC

UTC proporciona una referencia común para registros, cron, timers y correlación entre los dos nodos. No supone que todos los estudiantes vivan en la misma zona. Si quieres practicar con Uruguay, cambia `timezone: "UTC"` por `timezone: "America/Montevideo"` antes de aprovisionar; documenta la diferencia al comparar horas. Las marcas ya escritas no cambian su significado por modificar la presentación horaria.

## Ventajas para preparar RHCSA

Dos nodos permiten observar los dos extremos de SSH, NFS, DNS local y pruebas de firewall. Cada VM ofrece systemd, DNF, LVM, SELinux, usuarios/grupos y consola de arranque. El entorno se puede recrear y guardar con snapshots para practicar el ciclo aprender → practicar → romper → diagnosticar → reparar → documentar.

La web contiene **40 escenarios**: 34 relacionados con las diez áreas públicas de EX200 y seis de Podman como extensión. El catálogo es libre; algunos retos tienen dependencias explícitas, como Usuarios → Permisos y LVM → Swap. Flatpak tiene prácticas de remotes, instalación/retirada, alcance de usuario/sistema y diagnóstico. Podman cubre imágenes, rootless, puertos, volúmenes/SELinux, redes, límites y Quadlet.

## Preparación según el sistema anfitrión

El proveedor de este kit es VirtualBox y la imagen fijada es **x86_64**. Rocky 10 requiere CPU compatible con x86-64-v3 y que el hipervisor exponga sus instrucciones. No basta con que el procesador del host sea moderno: comprueba lo que ve la VM. No se afirma compatibilidad con Mac Apple Silicon usando esta imagen; para ARM64 se necesita otra imagen y un proveedor compatibles.

Instala versiones compatibles de [VirtualBox](https://www.virtualbox.org/wiki/Downloads), [Vagrant](https://developer.hashicorp.com/vagrant/install) y [Python 3](https://www.python.org/downloads/). No necesitas una suscripción Red Hat ni construir una box base RHEL para usar Rocky.

### Windows · PowerShell

Instala las aplicaciones para Windows y OpenSSH Client. Usa Vagrant desde Windows en esta ruta; no mezcles el estado de un Vagrant de WSL con el proveedor Windows. Comprueba:

```powershell
vagrant --version
& "$env:ProgramFiles\Oracle\VirtualBox\VBoxManage.exe" --version
py -3 --version
ssh -V
```

Descomprime el kit en una carpeta local, por ejemplo `$HOME\Labs\rhcsa-lab`. Si aparecen bloqueos de archivos, usa una ubicación fuera de OneDrive. No abras PowerShell como administrador de forma rutinaria: usa la misma identidad con la que creaste el proyecto. Si VirtualBox no puede usar la virtualización, revisa VT-x/AMD-V, su log y compatibilidad con otras plataformas del equipo; no desactives protecciones de Windows sin comprender la causa.

El recolector se invoca con `py -3 collect.py ...`. Si tu instalación no ofrece el lanzador py, usa el ejecutable Python 3 que hayas comprobado. La web permite elegir Windows y adapta el comando mostrado.

### macOS Intel · Terminal

Usa versiones de VirtualBox y Vagrant compatibles con tu macOS. Comprueba:

```sh
VBoxManage --version
vagrant --version
python3 --version
```

Descomprime en `~/Labs/rhcsa-lab`. Usa `python3 collect.py ...`. El MacBook Pro Intel con 16 GB permite un perfil ligero, pero la memoria disponible y las instrucciones expuestas a la VM se deben verificar. Si tienes Apple Silicon, esta imagen x86_64 no es la opción correcta.

### Linux x86_64 · Bash

Instala los paquetes para tu distribución y verifica que el módulo de VirtualBox corresponde al kernel en uso:

```sh
VBoxManage --version
vagrant --version
python3 --version
```

No ejecutes Vagrant con sudo. Si Secure Boot impide cargar un módulo, sigue el procedimiento de firma de módulos de tu distribución; no cambies una protección global a ciegas. Usa `python3 collect.py ...`.

## Primer arranque

1. Descomprime el kit entero en una carpeta nueva. Mantén los scripts en formato LF si los editas desde Windows.
2. Revisa el bloque LAB de `Vagrantfile`. La subred privada no debe coincidir con una VPN u otra red que ya uses. Si cambias direcciones, adapta también el bloque de hosts del provisionador y los enunciados del laboratorio.
3. Para ejercicios GPT/LVM/swap/FS, activa `extra_disks: true` antes de crear el entorno: server recibe dos discos vacíos de 8 GiB y client uno. No se formatean automáticamente. Para practicar contenedores pequeños no se necesitan estos discos.
4. Ejecuta desde esa carpeta:

```sh
vagrant validate
vagrant up --provider=virtualbox
vagrant status
```

El provisioning actualiza paquetes e instala vim, bash-completion, manuales, Python, herramientas de procesos/red/almacenamiento, SSH, SELinux/firewall, NFS/autofs, Flatpak y Podman. Configura hostname y timezone. No crea usuarios del reto, volúmenes LVM, respuestas web, remotes Flatpak ni contenedores de los ejercicios.

Si una actualización instala kernel nuevo, revisa el resultado y reinicia antes de crear el snapshot. No hay un reinicio inesperado al final del script.

```sh
vagrant ssh server
vagrant ssh client
vagrant reload
vagrant snapshot save base-limpia
```

Dentro de cada VM comprueba:

```sh
cat /etc/rocky-release
hostnamectl
timedatectl status
ip -br address
lsblk -f
df -hT
getenforce
systemctl status sshd
```

Prueba salida a Internet y comunicación entre los nodos. No asumas que el disco raíz o los discos vacíos conservarán un nombre concreto. El disco virtual se ajusta a 25 GiB; las particiones y el filesystem pueden seguir con su tamaño anterior. `lsblk` y `df` muestran capas distintas. No amplíes ni reformatees la raíz por imitación de una receta para otro esquema.

### Recursos y cambios

1 GiB es el perfil base solicitado. DNF, runtimes Flatpak e imágenes/aplicaciones Podman pueden necesitar más RAM o disco según su tamaño. Evita generar cargas de memoria como prueba. Si observas falta de recursos, apaga las VMs, cambia `memory_mb: 2048` y vuelve a iniciarlas. Para añadir discos a VMs existentes, conserva primero un snapshot y revisa la política de discos de Vagrant; los cambios de almacenamiento requieren el guest apagado. No se reducen discos para volver a una capacidad menor.

## Comandos básicos de Vagrant

| Comando | Efecto |
|---|---|
| `vagrant up` | Crea/inicia ambas VMs; aprovisiona en el primer arranque |
| `vagrant up server` | Inicia solo server |
| `vagrant ssh server` | Abre SSH en server |
| `vagrant ssh client` | Abre SSH en client |
| `vagrant halt` | Apaga ambas VMs conservando discos y estado |
| `vagrant reload` | Reinicia y aplica cambios de configuración |
| `vagrant provision` | Repite el provisionador; también puede incorporar actualizaciones nuevas |
| `vagrant snapshot list` | Lista snapshots disponibles |
| `vagrant snapshot save NOMBRE` | Guarda el estado bajo un nombre |
| `vagrant snapshot restore NOMBRE` | Reemplaza el estado de las VMs por ese snapshot; exporta antes los datos que quieras conservar |
| `vagrant destroy` | Elimina las VMs y sus discos asociados después de confirmación; un nuevo up crea otro entorno, no recupera el trabajo eliminado |

## Rocky 9 como alternativa explícita

Para seguir el requisito copiado de Rocky 9, descomprime el kit en **otra carpeta**, copia `Vagrantfile.rocky9` sobre el nombre `Vagrantfile` en esa carpeta y verifica que usa la imagen 9.9. Conserva por separado su estado `.vagrant` y sus snapshots. El provisionador y verificador admiten Rocky 9/10. Versiones de paquetes, opciones y la preparación del examen RHEL 10 pueden diferir; compara la documentación instalada. No se afirma que Flatpak o Podman tengan el mismo comportamiento en todas las versiones.

## Comandos de los ejercicios sin entregar la solución

`COMANDOS_COMPLETOS.md` añade 95 ejemplos ejecutables con explicación y manual, sobre rutas de demostración, sin resolver las misiones del simulacro. Cada reto muestra observaciones y referencias de sintaxis. `COMANDOS.md` incluye el mismo material para estudiar sin conexión. Los comandos concretos de observación permiten reunir evidencia; las plantillas con parámetros en MAYÚSCULAS o entre corchetes no se deben ejecutar literalmente. Tú eliges objetivos, opciones, orden y reparación.

La sección man se conserva y se amplía con conceptos, preguntas de investigación y errores frecuentes. En el simulacro estricto se ocultan las pistas y referencias internas hasta finalizar; usa la documentación instalada en las VMs.

## Ciclo de práctica

1. **Aprender:** lee el concepto, busca manuales y define qué estado quieres observar.
2. **Practicar:** inicia el reloj, trabaja en las VMs y recoge pruebas positivas y negativas.
3. **Romper:** crea snapshot y aplica solo la avería acotada en una VM desechable.
4. **Diagnosticar:** escribe síntoma, línea de tiempo, evidencia e hipótesis antes de cambiar nada.
5. **Reparar:** realiza el cambio mínimo y repite las comprobaciones, incluido reinicio cuando se pida.
6. **Documentar:** deja causa, reparación y verificación final en la bitácora.

Las prácticas guiadas admiten pausa y reanudación. El simulacro integral contiene 32 retos que cubren los 62 objetivos suministrados y dura exactamente 120 minutos. No tiene pausa: el plazo sigue con la pestaña cerrada y el intento se entrega al agotarlo. Puedes pasar al siguiente reto, omitirlo por ahora, marcarlo para revisar y volver a cualquier punto sin perder evidencia. Consulta SIMULACRO_120_MIN.md para el mapa completo y los requisitos. El catálogo adicional de Podman queda separado del simulacro EX200.

## Simulacro: lectura directa y persistencia

Consulta **AGENTE_LOCAL.md**. El simulacro actual requiere `agent.py` en el anfitrión: recoge server y client por Vagrant SSH, guarda el estado anterior, reinicia ambos normalmente y recoge otra vez. Las identidades de máquina deben coincidir y los boot IDs cambiar. Las configuraciones persistentes deben cumplir en las dos lecturas con la misma huella. Las marcas manuales no sustituyen estos controles. Los pasos transitorios conservan un tratamiento documental explícito.

## Prácticas guiadas e intentos antiguos: importar evidencia

`collect.py` se ejecuta en el sistema anfitrión y llama a Vagrant por SSH. `verify.py` se ejecuta con sudo dentro de las VMs y solo consulta un subconjunto del estado. No es un agente HTTP, no expone SSH a Internet ni sube informes por su cuenta.

Inicia una sesión en la web. Abre **Cómo obtener el informe de esta sesión** y copia el comando con el ID y los laboratorios exactos. La web adapta el lanzador a Windows/macOS/Linux según tu selección.

```text
Windows:        py -3 collect.py --attempt ID_DE_LA_WEB --labs IDs_DEL_RETO
macOS y Linux: python3 collect.py --attempt ID_DE_LA_WEB --labs IDs_DEL_RETO
```

Estos son formatos de referencia, no IDs válidos. El archivo `informe-ex200.json` se genera junto al kit. Impórtalo durante la sesión activa, antes de finalizar. La web rechaza informes de otro intento o con fecha anterior. El recolector no usa sudo en el host, no ejecuta tus scripts y no recoge claves privadas ni hashes de contraseñas.

Hay **12 controles automáticos en 10 laboratorios del catálogo** para las prácticas guiadas y los intentos del formato anterior; el simulacro actual usa el agente directo; el resto de criterios usa evidencia y autoevaluación explícitas. La existencia de un archivo o una unidad no demuestra por sí sola un historial, una recuperación de arranque o persistencia tras reinicio. Los laboratorios adicionales no simulan verificaciones que no se hayan ejecutado. Si un reto no tiene controles automáticos, el recolector lo indica y se documenta en la web sin importar un informe vacío.

Para completar un reto necesitas todos sus criterios aplicables, al menos 20 caracteres de evidencia en cada criterio manual y una nota final de al menos 30 caracteres. Esto sirve para estudiar; los informes y la autoevaluación no forman un examen resistente a manipulación ni predicen una nota oficial.

## Errores comunes a evitar

- Confundir el sistema anfitrión con la VM. Los comandos Linux de los retos se ejecutan en server/client, no en PowerShell, macOS o tu Linux de uso diario.
- Destruir VMs para corregir cualquier fallo o restaurar un snapshot sin exportar el trabajo que deseas conservar.
- Formatear un disco porque se supone que es sdb. Identifica tamaño, montajes y finalidad antes de escribir.
- Usar paquetes de otra versión mayor, remotes arbitrarios o imágenes de contenedor sin origen explícito.
- Desactivar firewall/SELinux, usar 777 o lanzar contenedores privilegiados para ocultar una causa.
- Confundir memoria asignada con memoria disponible, o disco virtual con espacio libre del filesystem.
- Editar el provisionador con CRLF y recibir errores de intérprete en la VM.
- Cambiar a Rocky 9 con el mismo estado de Rocky 10 esperando una conversión automática.

## Mejoras futuras posibles

Mantener snapshots por módulo; fijar otra imagen oficial para comparar versiones; ajustar memoria para cargas concretas; automatizar más criterios con lectura de estado real; ampliar imágenes ARM64 y proveedores cuando se validen. El perfil inicial prioriza claridad y dos VMs reproducibles.

## Progreso, privacidad y validación

La web guarda prácticas, bitácora e historial en tu perfil de Supabase. Usa el mismo usuario y contraseña para continuar desde otro equipo. No hay recuperación por correo. La privacidad del despliegue se configura por separado en Vercel.

Las pruebas de la aplicación no arrancan las VMs en tus tres sistemas operativos. Verifica `vagrant validate`, el primer arranque, SSH, capacidad, actualizaciones y recursos en cada host. No se afirma haber ejecutado las VMs donde no se han ejecutado.

## Fuentes principales

- [EX200 y alcance RHEL 10](https://www.redhat.com/en/services/training/ex200-red-hat-certified-system-administrator-rhcsa-exam)
- [Rocky Linux: imágenes oficiales](https://dl.rockylinux.org/pub/rocky/10/images/x86_64/)
- [Rocky Linux: pruebas de Vagrant/VirtualBox](https://docs.rockylinux.org/teams/testing/documentation/qa_test_cases/Testcase_Cloud_Vagrant_VirtualBox/)
- [Vagrant: discos](https://developer.hashicorp.com/vagrant/docs/disks/usage)
- [Vagrant: Windows y WSL](https://developer.hashicorp.com/vagrant/docs/other/wsl)
- [Flatpak](https://docs.flatpak.org/en/latest/using-flatpak.html)
- [Podman y Quadlet](https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html)
- [Documentación RHEL 10](https://docs.redhat.com/es/documentation/red_hat_enterprise_linux/10)


## Simulacro integral de dos horas

Consulta `SIMULACRO_120_MIN.md`. El kit actualizado debe estar junto a los scripts; antes del reloj, actualiza el verificador de las VMs con `vagrant provision` y prepara snapshots y discos. Los intentos del formato anterior se conservan como históricos; una sesión antigua activa se identifica y puede finalizarse antes de iniciar el formato de 32 retos. Preparado y Revisar son marcas de navegación, no resultados técnicos.


## Independencia

Guía independiente de preparación. No es un examen oficial ni está afiliada, patrocinada o avalada por Red Hat. Los escenarios son originales y no contienen preguntas reales del examen. Red Hat, RHEL, RHCSA y EX200 son marcas de sus respectivos titulares. El resultado de práctica no garantiza aprobación.


## Edición Vercel y Supabase

Esta copia usa cuentas propias y PostgreSQL de Supabase; no necesita la identidad de ChatGPT. Consulta el README principal del proyecto para configurar acceso y almacenamiento. Sustituye TU-DOMINIO por el origen real; el agente exige --site y no acepta rutas.
