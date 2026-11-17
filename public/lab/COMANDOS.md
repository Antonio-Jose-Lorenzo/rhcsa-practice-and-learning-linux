# Comandos para investigar · RHCSA Lab

Comandos de observación y plantillas, sin una solución ordenada de los ejercicios. Ejecuta las observaciones dentro de las VMs; los parámetros en MAYÚSCULAS o entre corchetes deben decidirse, no copiarse literalmente. En modo simulacro, usa la documentación local y revisa este material al finalizar.

## Un expediente desde la terminal

Preparación de objetivos EX200; práctica en Rocky Linux 10.

La terminal conecta identidad, rutas, contenido y metadatos. Antes de modificar un objeto, define qué observación distingue un archivo, un directorio y un enlace.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `pwd; id` | Identificar directorio e identidad actuales. | observar |
| `ls -li RUTA` | Comparar metadatos e inodos; sustituye RUTA. | plantilla |
| `stat RUTA` | Examinar permisos, propietario y tipo. | plantilla |
| `grep [OPCIONES] PATRÓN ARCHIVO` | Investigar filtrado; elige patrón y opciones. | plantilla |
| `find DIRECTORIO [CRITERIOS]` | Diseñar una búsqueda con alcance limitado. | plantilla |
| `tar --help` | Consultar formatos, listado y extracción. | observar |
| `man -k PALABRA` | Localizar manuales por concepto. | plantilla |

Manuales: `man grep`, `man tar`, `man ln`, `info coreutils`

Preguntas:

- ¿Qué comando observa contenido y cuál observa metadatos?
- ¿Qué cambia si tu directorio actual o tu identidad no es la que supones?

Errores a investigar:

- Perder nombres con espacios al recorrer una salida.
- Confundir permiso de un archivo con permiso de atravesar su directorio.

## De client a server, con confianza

Preparación de objetivos EX200; práctica en Rocky Linux 10.

La terminal conecta identidad, rutas, contenido y metadatos. Antes de modificar un objeto, define qué observación distingue un archivo, un directorio y un enlace.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `pwd; id` | Identificar directorio e identidad actuales. | observar |
| `ls -li RUTA` | Comparar metadatos e inodos; sustituye RUTA. | plantilla |
| `stat RUTA` | Examinar permisos, propietario y tipo. | plantilla |
| `grep [OPCIONES] PATRÓN ARCHIVO` | Investigar filtrado; elige patrón y opciones. | plantilla |
| `find DIRECTORIO [CRITERIOS]` | Diseñar una búsqueda con alcance limitado. | plantilla |
| `tar --help` | Consultar formatos, listado y extracción. | observar |
| `man -k PALABRA` | Localizar manuales por concepto. | plantilla |

Manuales: `man ssh`, `man ssh-keygen`, `man scp`

Preguntas:

- ¿Qué comando observa contenido y cuál observa metadatos?
- ¿Qué cambia si tu directorio actual o tu identidad no es la que supones?

Errores a investigar:

- Perder nombres con espacios al recorrer una salida.
- Confundir permiso de un archivo con permiso de atravesar su directorio.

## Un origen de software confiable

Preparación de objetivos EX200; práctica en Rocky Linux 10.

Un repositorio aporta metadatos y paquetes; una instalación deja archivos y un historial. Flatpak añade remotes, referencias, runtimes y alcances por usuario o sistema.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `dnf repolist` | Observar repositorios habilitados. | observar |
| `dnf info PAQUETE` | Investigar origen y versión antes de decidir. | plantilla |
| `rpm -q PAQUETE` | Consultar si un RPM está instalado. | plantilla |
| `dnf history` | Examinar transacciones existentes. | observar |
| `flatpak remotes --user` | Inventariar orígenes del usuario. | observar |
| `flatpak list --user` | Listar aplicaciones y runtimes de usuario. | observar |
| `flatpak remote-add --help` | Investigar sintaxis sin añadir un remote. | observar |
| `flatpak install --help` | Consultar instalación y alcance. | observar |

Manuales: `man dnf`, `man rpm`

Preguntas:

- ¿Tu consulta usa el mismo alcance que tu instalación?
- ¿Puedes justificar origen y arquitectura antes de instalar?

Errores a investigar:

- Mezclar paquetes de Rocky 9 y 10.
- Interpretar un error de red como ausencia del paquete.

## Aplicaciones con Flatpak

Preparación de objetivos EX200; práctica en Rocky Linux 10.

Un repositorio aporta metadatos y paquetes; una instalación deja archivos y un historial. Flatpak añade remotes, referencias, runtimes y alcances por usuario o sistema.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `dnf repolist` | Observar repositorios habilitados. | observar |
| `dnf info PAQUETE` | Investigar origen y versión antes de decidir. | plantilla |
| `rpm -q PAQUETE` | Consultar si un RPM está instalado. | plantilla |
| `dnf history` | Examinar transacciones existentes. | observar |
| `flatpak remotes --user` | Inventariar orígenes del usuario. | observar |
| `flatpak list --user` | Listar aplicaciones y runtimes de usuario. | observar |
| `flatpak remote-add --help` | Investigar sintaxis sin añadir un remote. | observar |
| `flatpak install --help` | Consultar instalación y alcance. | observar |

Manuales: `man flatpak`, [Referencia](https://docs.flatpak.org/en/latest/using-flatpak.html)

Preguntas:

- ¿Tu consulta usa el mismo alcance que tu instalación?
- ¿Puedes justificar origen y arquitectura antes de instalar?

Errores a investigar:

- Mezclar paquetes de Rocky 9 y 10.
- Interpretar un error de red como ausencia del paquete.

## Un pequeño inventario reproducible

Preparación de objetivos EX200; práctica en Rocky Linux 10.

Un script fiable tiene un contrato: entradas, salida útil, errores y código final. Las pruebas negativas deben diseñarse antes de confiar en el recorrido correcto.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `bash -n ARCHIVO` | Comprobar sintaxis sin ejecutar el script. | plantilla |
| `bash --help` | Explorar modos de ejecución e invocación. | observar |
| `test --help` | Revisar pruebas; el builtin puede diferir del ejecutable. | observar |
| `printf FORMATO [ARGUMENTOS]` | Investigar salida controlada y formatos. | plantilla |
| `COMANDO > SALIDA 2> ERRORES` | Sintaxis de redirección; elige los destinos. | plantilla |
| `man bash` | Consultar quoting, condiciones, bucles y exit. | observar |

Manuales: `man bash`, `man test`, `man stat`

Preguntas:

- ¿Qué ocurre si la entrada está vacía o contiene espacios?
- ¿Qué evidencia verá quien llame al script cuando falle?

Errores a investigar:

- Probar siempre como root.
- Confundir una salida vacía con ejecución satisfactoria.

## Un proceso fuera de control

Preparación de objetivos EX200; práctica en Rocky Linux 10.

El estado del sistema se interpreta en capas: arranque, unidad, proceso, recursos y servicio ofrecido. Los registros relacionan un síntoma con una línea de tiempo.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `ps -eo pid,ppid,ni,comm` | Relacionar procesos, padres y nice. | observar |
| `free -h` | Observar memoria disponible y swap. | observar |
| `systemctl --failed` | Localizar unidades fallidas. | observar |
| `journalctl -b` | Consultar registros del arranque actual. | observar |
| `tuned-adm active` | Ver perfil de ajuste activo. | observar |
| `systemctl status UNIDAD` | Consultar la unidad que investigas. | plantilla |
| `journalctl -u UNIDAD` | Filtrar el journal por el servicio elegido. | plantilla |

Manuales: `man ps`, `man top`, `man nice`, `man tuned-adm`

Preguntas:

- ¿El fallo existe en este arranque o viene del anterior?
- ¿El estado de una unidad coincide con el resultado observado por el cliente?

Errores a investigar:

- Terminar un proceso sin identificar su unidad o padre.
- Cambiar un target permanente cuando solo se quería una prueba temporal.

## Registros que sobreviven

Preparación de objetivos EX200; práctica en Rocky Linux 10.

El estado del sistema se interpreta en capas: arranque, unidad, proceso, recursos y servicio ofrecido. Los registros relacionan un síntoma con una línea de tiempo.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `ps -eo pid,ppid,ni,comm` | Relacionar procesos, padres y nice. | observar |
| `free -h` | Observar memoria disponible y swap. | observar |
| `systemctl --failed` | Localizar unidades fallidas. | observar |
| `journalctl -b` | Consultar registros del arranque actual. | observar |
| `tuned-adm active` | Ver perfil de ajuste activo. | observar |
| `systemctl status UNIDAD` | Consultar la unidad que investigas. | plantilla |
| `journalctl -u UNIDAD` | Filtrar el journal por el servicio elegido. | plantilla |

Manuales: `man journald.conf`, `man journalctl`, `man logger`

Preguntas:

- ¿El fallo existe en este arranque o viene del anterior?
- ¿El estado de una unidad coincide con el resultado observado por el cliente?

Errores a investigar:

- Terminar un proceso sin identificar su unidad o padre.
- Cambiar un target permanente cuando solo se quería una prueba temporal.

## Recuperación desde la consola

Preparación de objetivos EX200; práctica en Rocky Linux 10.

El estado del sistema se interpreta en capas: arranque, unidad, proceso, recursos y servicio ofrecido. Los registros relacionan un síntoma con una línea de tiempo.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `ps -eo pid,ppid,ni,comm` | Relacionar procesos, padres y nice. | observar |
| `free -h` | Observar memoria disponible y swap. | observar |
| `systemctl --failed` | Localizar unidades fallidas. | observar |
| `journalctl -b` | Consultar registros del arranque actual. | observar |
| `tuned-adm active` | Ver perfil de ajuste activo. | observar |
| `systemctl status UNIDAD` | Consultar la unidad que investigas. | plantilla |
| `journalctl -u UNIDAD` | Filtrar el journal por el servicio elegido. | plantilla |

Manuales: `man systemd.special`, [Referencia](https://docs.redhat.com/es/documentation/red_hat_enterprise_linux/10/html/managing_monitoring_and_updating_the_kernel)

Preguntas:

- ¿El fallo existe en este arranque o viene del anterior?
- ¿El estado de una unidad coincide con el resultado observado por el cliente?

Errores a investigar:

- Terminar un proceso sin identificar su unidad o padre.
- Cambiar un target permanente cuando solo se quería una prueba temporal.

## Un disco, un plan claro

Preparación de objetivos EX200; práctica en Rocky Linux 10.

Disco, partición, PV, VG, LV y filesystem tienen capacidades e identidades diferentes. Una ampliación de una capa no garantiza el crecimiento de las otras.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `lsblk -f` | Relacionar discos, particiones, formatos y UUID. | observar |
| `findmnt` | Examinar montajes actuales. | observar |
| `pvs; vgs; lvs` | Observar las capas existentes de LVM. | observar |
| `swapon --show` | Consultar intercambio activo. | observar |
| `df -hT` | Comparar capacidad del filesystem y tipo. | observar |
| `parted --help` | Investigar gestión de particiones antes de modificar. | observar |
| `lvextend --help` | Estudiar ampliación sin elegir el destino por ti. | observar |

Manuales: `man lsblk`, `man parted`, `man fstab`

Preguntas:

- ¿Puedes señalar con evidencia el disco adicional antes de escribir?
- ¿Qué identidad usará el montaje después del próximo arranque?

Errores a investigar:

- Suponer nombres sdb/sdc en todos los equipos.
- Confundir tamaño del disco virtual con espacio útil de la raíz.

## Almacenamiento que crece

Preparación de objetivos EX200; práctica en Rocky Linux 10.

Disco, partición, PV, VG, LV y filesystem tienen capacidades e identidades diferentes. Una ampliación de una capa no garantiza el crecimiento de las otras.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `lsblk -f` | Relacionar discos, particiones, formatos y UUID. | observar |
| `findmnt` | Examinar montajes actuales. | observar |
| `pvs; vgs; lvs` | Observar las capas existentes de LVM. | observar |
| `swapon --show` | Consultar intercambio activo. | observar |
| `df -hT` | Comparar capacidad del filesystem y tipo. | observar |
| `parted --help` | Investigar gestión de particiones antes de modificar. | observar |
| `lvextend --help` | Estudiar ampliación sin elegir el destino por ti. | observar |

Manuales: `man lvm`, `man lvextend`, `man xfs_growfs`

Preguntas:

- ¿Puedes señalar con evidencia el disco adicional antes de escribir?
- ¿Qué identidad usará el montaje después del próximo arranque?

Errores a investigar:

- Suponer nombres sdb/sdc en todos los equipos.
- Confundir tamaño del disco virtual con espacio útil de la raíz.

## Swap sin tocar los datos

Preparación de objetivos EX200; práctica en Rocky Linux 10.

Disco, partición, PV, VG, LV y filesystem tienen capacidades e identidades diferentes. Una ampliación de una capa no garantiza el crecimiento de las otras.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `lsblk -f` | Relacionar discos, particiones, formatos y UUID. | observar |
| `findmnt` | Examinar montajes actuales. | observar |
| `pvs; vgs; lvs` | Observar las capas existentes de LVM. | observar |
| `swapon --show` | Consultar intercambio activo. | observar |
| `df -hT` | Comparar capacidad del filesystem y tipo. | observar |
| `parted --help` | Investigar gestión de particiones antes de modificar. | observar |
| `lvextend --help` | Estudiar ampliación sin elegir el destino por ti. | observar |

Manuales: `man swapon`, `man mkswap`, `man fstab`

Preguntas:

- ¿Puedes señalar con evidencia el disco adicional antes de escribir?
- ¿Qué identidad usará el montaje después del próximo arranque?

Errores a investigar:

- Suponer nombres sdb/sdc en todos los equipos.
- Confundir tamaño del disco virtual con espacio útil de la raíz.

## Tres formatos, tres comprobaciones

Preparación de objetivos EX200; práctica en Rocky Linux 10.

El acceso depende del montaje, las identidades, los permisos de la ruta y la política de seguridad. En NFS importa el acuerdo de identidad entre dos sistemas.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `findmnt` | Observar el árbol de montajes. | observar |
| `lsblk -f` | Identificar tipos y etiquetas. | observar |
| `id USUARIO` | Comparar identidades y grupos entre nodos. | plantilla |
| `namei -l RUTA` | Examinar los permisos de toda una ruta. | plantilla |
| `mount --help` | Consultar opciones y tipos sin aplicar cambios. | observar |
| `stat RUTA` | Observar el objeto que presenta el problema. | plantilla |
| `man autofs` | Estudiar mapas y montaje a demanda. | observar |

Manuales: `man mount`, `man mkfs.fat`, `man mkfs.ext4`, `man mkfs.xfs`

Preguntas:

- ¿Quién accede y con qué UID/GID en cada extremo?
- ¿El montaje fue manual, persistente o activado por demanda?

Errores a investigar:

- Evaluar autofs mientras una shell mantiene ocupado el montaje.
- Usar permisos excesivos para ocultar una causa de identidad.

## Un recurso compartido a demanda

Preparación de objetivos EX200; práctica en Rocky Linux 10.

El acceso depende del montaje, las identidades, los permisos de la ruta y la política de seguridad. En NFS importa el acuerdo de identidad entre dos sistemas.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `findmnt` | Observar el árbol de montajes. | observar |
| `lsblk -f` | Identificar tipos y etiquetas. | observar |
| `id USUARIO` | Comparar identidades y grupos entre nodos. | plantilla |
| `namei -l RUTA` | Examinar los permisos de toda una ruta. | plantilla |
| `mount --help` | Consultar opciones y tipos sin aplicar cambios. | observar |
| `stat RUTA` | Observar el objeto que presenta el problema. | plantilla |
| `man autofs` | Estudiar mapas y montaje a demanda. | observar |

Manuales: `man exports`, `man autofs`, `man automount`

Preguntas:

- ¿Quién accede y con qué UID/GID en cada extremo?
- ¿El montaje fue manual, persistente o activado por demanda?

Errores a investigar:

- Evaluar autofs mientras una shell mantiene ocupado el montaje.
- Usar permisos excesivos para ocultar una causa de identidad.

## El archivo existe, el acceso falla

Preparación de objetivos EX200; práctica en Rocky Linux 10.

El acceso depende del montaje, las identidades, los permisos de la ruta y la política de seguridad. En NFS importa el acuerdo de identidad entre dos sistemas.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `findmnt` | Observar el árbol de montajes. | observar |
| `lsblk -f` | Identificar tipos y etiquetas. | observar |
| `id USUARIO` | Comparar identidades y grupos entre nodos. | plantilla |
| `namei -l RUTA` | Examinar los permisos de toda una ruta. | plantilla |
| `mount --help` | Consultar opciones y tipos sin aplicar cambios. | observar |
| `stat RUTA` | Observar el objeto que presenta el problema. | plantilla |
| `man autofs` | Estudiar mapas y montaje a demanda. | observar |

Manuales: `man chmod`, `man umask`, `man namei`

Preguntas:

- ¿Quién accede y con qué UID/GID en cada extremo?
- ¿El montaje fue manual, persistente o activado por demanda?

Errores a investigar:

- Evaluar autofs mientras una shell mantiene ocupado el montaje.
- Usar permisos excesivos para ocultar una causa de identidad.

## Una tarea que llega a tiempo

Preparación de objetivos EX200; práctica en Rocky Linux 10.

Persistencia, activación y ejecución son estados distintos. Un servicio habilitado puede estar detenido; una tarea de calendario puede quedar pendiente durante un apagado.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `systemctl list-timers --all` | Examinar timers y próximas ejecuciones. | observar |
| `timedatectl status` | Consultar reloj y timezone. | observar |
| `chronyc sources` | Observar fuentes de sincronización. | observar |
| `crontab -l` | Leer tareas del usuario actual. | observar |
| `atq` | Listar trabajos at pendientes. | observar |
| `systemd-analyze calendar EXPRESIÓN` | Probar un calendario elegido por ti. | plantilla |
| `systemctl cat UNIDAD` | Examinar configuración efectiva. | plantilla |

Manuales: `man systemd.timer`, `man crontab`, `man at`

Preguntas:

- ¿Qué evento activa el trabajo y bajo qué identidad se ejecuta?
- ¿Qué pasa si el equipo estaba apagado a la hora prevista?

Errores a investigar:

- Depender del PATH o directorio de una sesión interactiva.
- Comparar registros con timezones diferentes.

## Un servicio listo después del reinicio

Preparación de objetivos EX200; práctica en Rocky Linux 10.

Persistencia, activación y ejecución son estados distintos. Un servicio habilitado puede estar detenido; una tarea de calendario puede quedar pendiente durante un apagado.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `systemctl list-timers --all` | Examinar timers y próximas ejecuciones. | observar |
| `timedatectl status` | Consultar reloj y timezone. | observar |
| `chronyc sources` | Observar fuentes de sincronización. | observar |
| `crontab -l` | Leer tareas del usuario actual. | observar |
| `atq` | Listar trabajos at pendientes. | observar |
| `systemd-analyze calendar EXPRESIÓN` | Probar un calendario elegido por ti. | plantilla |
| `systemctl cat UNIDAD` | Examinar configuración efectiva. | plantilla |

Manuales: `man systemctl`, `man chronyc`, [Referencia](https://docs.redhat.com/es/documentation/red_hat_enterprise_linux/10/html/managing_monitoring_and_updating_the_kernel)

Preguntas:

- ¿Qué evento activa el trabajo y bajo qué identidad se ejecuta?
- ¿Qué pasa si el equipo estaba apagado a la hora prevista?

Errores a investigar:

- Depender del PATH o directorio de una sesión interactiva.
- Comparar registros con timezones diferentes.

## Dos nodos, una red estable

Preparación de objetivos EX200; práctica en Rocky Linux 10.

Una prueba por nombre involucra resolución y red. Una conexión involucra además rutas, escucha y filtrado. Diagnostica cada capa con una observación distinta.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `ip -br address` | Observar direcciones e interfaces. | observar |
| `ip route; ip -6 route` | Comparar rutas de ambas familias. | observar |
| `nmcli connection show` | Listar perfiles de red. | observar |
| `ss -lntup` | Identificar sockets en escucha. | observar |
| `getent hosts NOMBRE` | Consultar resolución utilizada por aplicaciones. | plantilla |
| `dig NOMBRE` | Consultar DNS por separado de hosts/NSS. | plantilla |
| `ip route get DESTINO` | Investigar la decisión de ruta sin modificarla. | plantilla |

Manuales: `man nmcli`, `man ip`, `man hosts`

Preguntas:

- ¿La aplicación consulta hosts/NSS o un servidor DNS directamente?
- ¿Qué interfaz y ruta elige el sistema para este destino?

Errores a investigar:

- Configurar un gateway en la interfaz privada de laboratorio.
- Modificar NAT y perder el canal de administración.

## Solo el tráfico necesario

Preparación de objetivos EX200; práctica en Rocky Linux 10.

Permisos Unix, firewall y SELinux responden preguntas diferentes. La reparación debe mantener la protección y atender la causa exacta del rechazo.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `getenforce` | Observar el modo activo de SELinux. | observar |
| `ls -Z RUTA` | Examinar contexto de archivos. | plantilla |
| `ps -eZ` | Relacionar procesos con dominios SELinux. | observar |
| `getsebool -a` | Consultar booleanos de política. | observar |
| `firewall-cmd --get-active-zones` | Ver zonas e interfaces activas. | observar |
| `firewall-cmd --list-all` | Consultar la zona predeterminada; contrasta con la zona real. | observar |
| `semanage --help` | Investigar política persistente sin modificarla. | observar |

Manuales: `man firewalld`, `man firewall-cmd`

Preguntas:

- ¿El AVC identifica un archivo, un puerto o una operación sujeta a un booleano?
- ¿El cambio será persistente o solo afecta al estado actual?

Errores a investigar:

- Usar permissive o 777 como reparación.
- Añadir una regla correcta a una zona que no usa la interfaz.

## Un equipo con acceso controlado

Preparación de objetivos EX200; práctica en Rocky Linux 10.

La cuenta, los grupos de la sesión y las reglas efectivas de privilegio no siempre cambian al mismo tiempo. Evalúa usando la identidad que recibirá el acceso.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `id USUARIO` | Consultar identidad y grupos efectivos. | plantilla |
| `getent passwd USUARIO` | Leer datos de la cuenta sin leer shadow. | plantilla |
| `getent group GRUPO` | Consultar pertenencias del grupo. | plantilla |
| `chage -l USUARIO` | Observar políticas de caducidad. | plantilla |
| `sudo -l` | Listar permisos de tu identidad. | observar |
| `visudo --help` | Investigar validación de archivos sudoers. | observar |
| `man usermod` | Elegir cómo modificar atributos sin perder pertenencias. | observar |

Manuales: `man useradd`, `man usermod`, `man chage`, `man sudoers`

Preguntas:

- ¿La sesión ya refleja el cambio de grupos?
- ¿Otra regla concede más privilegios que la que estás revisando?

Errores a investigar:

- Eliminar grupos previos por elegir una opción incorrecta.
- Confundir permiso de sudo con autenticación por SSH.

## SELinux: reparar la causa

Preparación de objetivos EX200; práctica en Rocky Linux 10.

Permisos Unix, firewall y SELinux responden preguntas diferentes. La reparación debe mantener la protección y atender la causa exacta del rechazo.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `getenforce` | Observar el modo activo de SELinux. | observar |
| `ls -Z RUTA` | Examinar contexto de archivos. | plantilla |
| `ps -eZ` | Relacionar procesos con dominios SELinux. | observar |
| `getsebool -a` | Consultar booleanos de política. | observar |
| `firewall-cmd --get-active-zones` | Ver zonas e interfaces activas. | observar |
| `firewall-cmd --list-all` | Consultar la zona predeterminada; contrasta con la zona real. | observar |
| `semanage --help` | Investigar política persistente sin modificarla. | observar |

Manuales: `man selinux`, `man semanage-fcontext`, `man semanage-port`, `man httpd_selinux`

Preguntas:

- ¿El AVC identifica un archivo, un puerto o una operación sujeta a un booleano?
- ¿El cambio será persistente o solo afecta al estado actual?

Errores a investigar:

- Usar permissive o 777 como reparación.
- Añadir una regla correcta a una zona que no usa la interfaz.

## Encuentra la evidencia correcta

Preparación de objetivos EX200; práctica en Rocky Linux 10.

La terminal conecta identidad, rutas, contenido y metadatos. Antes de modificar un objeto, define qué observación distingue un archivo, un directorio y un enlace.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `pwd; id` | Identificar directorio e identidad actuales. | observar |
| `ls -li RUTA` | Comparar metadatos e inodos; sustituye RUTA. | plantilla |
| `stat RUTA` | Examinar permisos, propietario y tipo. | plantilla |
| `grep [OPCIONES] PATRÓN ARCHIVO` | Investigar filtrado; elige patrón y opciones. | plantilla |
| `find DIRECTORIO [CRITERIOS]` | Diseñar una búsqueda con alcance limitado. | plantilla |
| `tar --help` | Consultar formatos, listado y extracción. | observar |
| `man -k PALABRA` | Localizar manuales por concepto. | plantilla |

Manuales: `man find`, `man xargs`, `man stat`

Preguntas:

- ¿Qué comando observa contenido y cuál observa metadatos?
- ¿Qué cambia si tu directorio actual o tu identidad no es la que supones?

Errores a investigar:

- Perder nombres con espacios al recorrer una salida.
- Confundir permiso de un archivo con permiso de atravesar su directorio.

## Un respaldo que realmente se restaura

Preparación de objetivos EX200; práctica en Rocky Linux 10.

La terminal conecta identidad, rutas, contenido y metadatos. Antes de modificar un objeto, define qué observación distingue un archivo, un directorio y un enlace.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `pwd; id` | Identificar directorio e identidad actuales. | observar |
| `ls -li RUTA` | Comparar metadatos e inodos; sustituye RUTA. | plantilla |
| `stat RUTA` | Examinar permisos, propietario y tipo. | plantilla |
| `grep [OPCIONES] PATRÓN ARCHIVO` | Investigar filtrado; elige patrón y opciones. | plantilla |
| `find DIRECTORIO [CRITERIOS]` | Diseñar una búsqueda con alcance limitado. | plantilla |
| `tar --help` | Consultar formatos, listado y extracción. | observar |
| `man -k PALABRA` | Localizar manuales por concepto. | plantilla |

Manuales: `man tar`, `man gzip`, `man bzip2`, `man sha256sum`

Preguntas:

- ¿Qué comando observa contenido y cuál observa metadatos?
- ¿Qué cambia si tu directorio actual o tu identidad no es la que supones?

Errores a investigar:

- Perder nombres con espacios al recorrer una salida.
- Confundir permiso de un archivo con permiso de atravesar su directorio.

## Un script que falla de forma útil

Preparación de objetivos EX200; práctica en Rocky Linux 10.

Un script fiable tiene un contrato: entradas, salida útil, errores y código final. Las pruebas negativas deben diseñarse antes de confiar en el recorrido correcto.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `bash -n ARCHIVO` | Comprobar sintaxis sin ejecutar el script. | plantilla |
| `bash --help` | Explorar modos de ejecución e invocación. | observar |
| `test --help` | Revisar pruebas; el builtin puede diferir del ejecutable. | observar |
| `printf FORMATO [ARGUMENTOS]` | Investigar salida controlada y formatos. | plantilla |
| `COMANDO > SALIDA 2> ERRORES` | Sintaxis de redirección; elige los destinos. | plantilla |
| `man bash` | Consultar quoting, condiciones, bucles y exit. | observar |

Manuales: `man bash`, `man test`, `man printf`

Preguntas:

- ¿Qué ocurre si la entrada está vacía o contiene espacios?
- ¿Qué evidencia verá quien llame al script cuando falle?

Errores a investigar:

- Probar siempre como root.
- Confundir una salida vacía con ejecución satisfactoria.

## Activo no siempre significa disponible

Preparación de objetivos EX200; práctica en Rocky Linux 10.

El estado del sistema se interpreta en capas: arranque, unidad, proceso, recursos y servicio ofrecido. Los registros relacionan un síntoma con una línea de tiempo.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `ps -eo pid,ppid,ni,comm` | Relacionar procesos, padres y nice. | observar |
| `free -h` | Observar memoria disponible y swap. | observar |
| `systemctl --failed` | Localizar unidades fallidas. | observar |
| `journalctl -b` | Consultar registros del arranque actual. | observar |
| `tuned-adm active` | Ver perfil de ajuste activo. | observar |
| `systemctl status UNIDAD` | Consultar la unidad que investigas. | plantilla |
| `journalctl -u UNIDAD` | Filtrar el journal por el servicio elegido. | plantilla |

Manuales: `man systemd.service`, `man systemctl`, `man ss`, `man journalctl`

Preguntas:

- ¿El fallo existe en este arranque o viene del anterior?
- ¿El estado de una unidad coincide con el resultado observado por el cliente?

Errores a investigar:

- Terminar un proceso sin identificar su unidad o padre.
- Cambiar un target permanente cuando solo se quería una prueba temporal.

## Un montaje antes de reiniciar

Preparación de objetivos EX200; práctica en Rocky Linux 10.

Disco, partición, PV, VG, LV y filesystem tienen capacidades e identidades diferentes. Una ampliación de una capa no garantiza el crecimiento de las otras.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `lsblk -f` | Relacionar discos, particiones, formatos y UUID. | observar |
| `findmnt` | Examinar montajes actuales. | observar |
| `pvs; vgs; lvs` | Observar las capas existentes de LVM. | observar |
| `swapon --show` | Consultar intercambio activo. | observar |
| `df -hT` | Comparar capacidad del filesystem y tipo. | observar |
| `parted --help` | Investigar gestión de particiones antes de modificar. | observar |
| `lvextend --help` | Estudiar ampliación sin elegir el destino por ti. | observar |

Manuales: `man fstab`, `man findmnt`, `man mount`, `man systemd.mount`

Preguntas:

- ¿Puedes señalar con evidencia el disco adicional antes de escribir?
- ¿Qué identidad usará el montaje después del próximo arranque?

Errores a investigar:

- Suponer nombres sdb/sdc en todos los equipos.
- Confundir tamaño del disco virtual con espacio útil de la raíz.

## NFS: la identidad también viaja

Preparación de objetivos EX200; práctica en Rocky Linux 10.

El acceso depende del montaje, las identidades, los permisos de la ruta y la política de seguridad. En NFS importa el acuerdo de identidad entre dos sistemas.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `findmnt` | Observar el árbol de montajes. | observar |
| `lsblk -f` | Identificar tipos y etiquetas. | observar |
| `id USUARIO` | Comparar identidades y grupos entre nodos. | plantilla |
| `namei -l RUTA` | Examinar los permisos de toda una ruta. | plantilla |
| `mount --help` | Consultar opciones y tipos sin aplicar cambios. | observar |
| `stat RUTA` | Observar el objeto que presenta el problema. | plantilla |
| `man autofs` | Estudiar mapas y montaje a demanda. | observar |

Manuales: `man exports`, `man nfs`, `man id`, `man stat`

Preguntas:

- ¿Quién accede y con qué UID/GID en cada extremo?
- ¿El montaje fue manual, persistente o activado por demanda?

Errores a investigar:

- Evaluar autofs mientras una shell mantiene ocupado el montaje.
- Usar permisos excesivos para ocultar una causa de identidad.

## Calendario, zona horaria y ejecuciones perdidas

Preparación de objetivos EX200; práctica en Rocky Linux 10.

Persistencia, activación y ejecución son estados distintos. Un servicio habilitado puede estar detenido; una tarea de calendario puede quedar pendiente durante un apagado.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `systemctl list-timers --all` | Examinar timers y próximas ejecuciones. | observar |
| `timedatectl status` | Consultar reloj y timezone. | observar |
| `chronyc sources` | Observar fuentes de sincronización. | observar |
| `crontab -l` | Leer tareas del usuario actual. | observar |
| `atq` | Listar trabajos at pendientes. | observar |
| `systemd-analyze calendar EXPRESIÓN` | Probar un calendario elegido por ti. | plantilla |
| `systemctl cat UNIDAD` | Examinar configuración efectiva. | plantilla |

Manuales: `man systemd.timer`, `man systemd-analyze`, `man crontab`, `man timedatectl`

Preguntas:

- ¿Qué evento activa el trabajo y bajo qué identidad se ejecuta?
- ¿Qué pasa si el equipo estaba apagado a la hora prevista?

Errores a investigar:

- Depender del PATH o directorio de una sesión interactiva.
- Comparar registros con timezones diferentes.

## El nombre falla, la red responde

Preparación de objetivos EX200; práctica en Rocky Linux 10.

Una prueba por nombre involucra resolución y red. Una conexión involucra además rutas, escucha y filtrado. Diagnostica cada capa con una observación distinta.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `ip -br address` | Observar direcciones e interfaces. | observar |
| `ip route; ip -6 route` | Comparar rutas de ambas familias. | observar |
| `nmcli connection show` | Listar perfiles de red. | observar |
| `ss -lntup` | Identificar sockets en escucha. | observar |
| `getent hosts NOMBRE` | Consultar resolución utilizada por aplicaciones. | plantilla |
| `dig NOMBRE` | Consultar DNS por separado de hosts/NSS. | plantilla |
| `ip route get DESTINO` | Investigar la decisión de ruta sin modificarla. | plantilla |

Manuales: `man getent`, `man nsswitch.conf`, `man hosts`, `man dig`

Preguntas:

- ¿La aplicación consulta hosts/NSS o un servidor DNS directamente?
- ¿Qué interfaz y ruta elige el sistema para este destino?

Errores a investigar:

- Configurar un gateway en la interfaz privada de laboratorio.
- Modificar NAT y perder el canal de administración.

## Dos interfaces, una salida correcta

Preparación de objetivos EX200; práctica en Rocky Linux 10.

Una prueba por nombre involucra resolución y red. Una conexión involucra además rutas, escucha y filtrado. Diagnostica cada capa con una observación distinta.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `ip -br address` | Observar direcciones e interfaces. | observar |
| `ip route; ip -6 route` | Comparar rutas de ambas familias. | observar |
| `nmcli connection show` | Listar perfiles de red. | observar |
| `ss -lntup` | Identificar sockets en escucha. | observar |
| `getent hosts NOMBRE` | Consultar resolución utilizada por aplicaciones. | plantilla |
| `dig NOMBRE` | Consultar DNS por separado de hosts/NSS. | plantilla |
| `ip route get DESTINO` | Investigar la decisión de ruta sin modificarla. | plantilla |

Manuales: `man ip-route`, `man nmcli`, `man ip-address`

Preguntas:

- ¿La aplicación consulta hosts/NSS o un servidor DNS directamente?
- ¿Qué interfaz y ruta elige el sistema para este destino?

Errores a investigar:

- Configurar un gateway en la interfaz privada de laboratorio.
- Modificar NAT y perder el canal de administración.

## Audita una delegación sin ampliar privilegios

Preparación de objetivos EX200; práctica en Rocky Linux 10.

La cuenta, los grupos de la sesión y las reglas efectivas de privilegio no siempre cambian al mismo tiempo. Evalúa usando la identidad que recibirá el acceso.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `id USUARIO` | Consultar identidad y grupos efectivos. | plantilla |
| `getent passwd USUARIO` | Leer datos de la cuenta sin leer shadow. | plantilla |
| `getent group GRUPO` | Consultar pertenencias del grupo. | plantilla |
| `chage -l USUARIO` | Observar políticas de caducidad. | plantilla |
| `sudo -l` | Listar permisos de tu identidad. | observar |
| `visudo --help` | Investigar validación de archivos sudoers. | observar |
| `man usermod` | Elegir cómo modificar atributos sin perder pertenencias. | observar |

Manuales: `man sudo`, `man sudoers`, `man visudo`

Preguntas:

- ¿La sesión ya refleja el cambio de grupos?
- ¿Otra regla concede más privilegios que la que estás revisando?

Errores a investigar:

- Eliminar grupos previos por elegir una opción incorrecta.
- Confundir permiso de sudo con autenticación por SSH.

## Un booleano con una razón

Preparación de objetivos EX200; práctica en Rocky Linux 10.

Permisos Unix, firewall y SELinux responden preguntas diferentes. La reparación debe mantener la protección y atender la causa exacta del rechazo.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `getenforce` | Observar el modo activo de SELinux. | observar |
| `ls -Z RUTA` | Examinar contexto de archivos. | plantilla |
| `ps -eZ` | Relacionar procesos con dominios SELinux. | observar |
| `getsebool -a` | Consultar booleanos de política. | observar |
| `firewall-cmd --get-active-zones` | Ver zonas e interfaces activas. | observar |
| `firewall-cmd --list-all` | Consultar la zona predeterminada; contrasta con la zona real. | observar |
| `semanage --help` | Investigar política persistente sin modificarla. | observar |

Manuales: `man getsebool`, `man setsebool`, `man semanage-boolean`, `man httpd_selinux`

Preguntas:

- ¿El AVC identifica un archivo, un puerto o una operación sujeta a un booleano?
- ¿El cambio será persistente o solo afecta al estado actual?

Errores a investigar:

- Usar permissive o 777 como reparación.
- Añadir una regla correcta a una zona que no usa la interfaz.

## Flatpak: ¿de qué usuario es esta aplicación?

Preparación de objetivos EX200; práctica en Rocky Linux 10.

Un repositorio aporta metadatos y paquetes; una instalación deja archivos y un historial. Flatpak añade remotes, referencias, runtimes y alcances por usuario o sistema.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `dnf repolist` | Observar repositorios habilitados. | observar |
| `dnf info PAQUETE` | Investigar origen y versión antes de decidir. | plantilla |
| `rpm -q PAQUETE` | Consultar si un RPM está instalado. | plantilla |
| `dnf history` | Examinar transacciones existentes. | observar |
| `flatpak remotes --user` | Inventariar orígenes del usuario. | observar |
| `flatpak list --user` | Listar aplicaciones y runtimes de usuario. | observar |
| `flatpak remote-add --help` | Investigar sintaxis sin añadir un remote. | observar |
| `flatpak install --help` | Consultar instalación y alcance. | observar |

Manuales: `man flatpak`, [Referencia](https://docs.flatpak.org/en/latest/using-flatpak.html)

Preguntas:

- ¿Tu consulta usa el mismo alcance que tu instalación?
- ¿Puedes justificar origen y arquitectura antes de instalar?

Errores a investigar:

- Mezclar paquetes de Rocky 9 y 10.
- Interpretar un error de red como ausencia del paquete.

## Flatpak: descarga, origen o referencia

Preparación de objetivos EX200; práctica en Rocky Linux 10.

Un repositorio aporta metadatos y paquetes; una instalación deja archivos y un historial. Flatpak añade remotes, referencias, runtimes y alcances por usuario o sistema.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `dnf repolist` | Observar repositorios habilitados. | observar |
| `dnf info PAQUETE` | Investigar origen y versión antes de decidir. | plantilla |
| `rpm -q PAQUETE` | Consultar si un RPM está instalado. | plantilla |
| `dnf history` | Examinar transacciones existentes. | observar |
| `flatpak remotes --user` | Inventariar orígenes del usuario. | observar |
| `flatpak list --user` | Listar aplicaciones y runtimes de usuario. | observar |
| `flatpak remote-add --help` | Investigar sintaxis sin añadir un remote. | observar |
| `flatpak install --help` | Consultar instalación y alcance. | observar |

Manuales: `man flatpak`, [Referencia](https://docs.flatpak.org/en/latest/flatpak-command-reference.html)

Preguntas:

- ¿Tu consulta usa el mismo alcance que tu instalación?
- ¿Puedes justificar origen y arquitectura antes de instalar?

Errores a investigar:

- Mezclar paquetes de Rocky 9 y 10.
- Interpretar un error de red como ausencia del paquete.

## Una transacción que puedes explicar

Preparación de objetivos EX200; práctica en Rocky Linux 10.

Un repositorio aporta metadatos y paquetes; una instalación deja archivos y un historial. Flatpak añade remotes, referencias, runtimes y alcances por usuario o sistema.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `dnf repolist` | Observar repositorios habilitados. | observar |
| `dnf info PAQUETE` | Investigar origen y versión antes de decidir. | plantilla |
| `rpm -q PAQUETE` | Consultar si un RPM está instalado. | plantilla |
| `dnf history` | Examinar transacciones existentes. | observar |
| `flatpak remotes --user` | Inventariar orígenes del usuario. | observar |
| `flatpak list --user` | Listar aplicaciones y runtimes de usuario. | observar |
| `flatpak remote-add --help` | Investigar sintaxis sin añadir un remote. | observar |
| `flatpak install --help` | Consultar instalación y alcance. | observar |

Manuales: `man dnf`, `man rpm`

Preguntas:

- ¿Tu consulta usa el mismo alcance que tu instalación?
- ¿Puedes justificar origen y arquitectura antes de instalar?

Errores a investigar:

- Mezclar paquetes de Rocky 9 y 10.
- Interpretar un error de red como ausencia del paquete.

## Imágenes con origen e identidad

Complemento de Podman; fuera de los objetivos actuales de EX200/RHEL 10.

Podman ejecuta procesos aislados desde imágenes. Rootless cambia identidades y almacenamiento; la persistencia de datos y del servicio requiere decisiones explícitas.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `podman info` | Examinar versión, rootless, almacenamiento y red. | observar |
| `podman images --digests` | Ver identidad y origen de imágenes locales. | observar |
| `podman ps -a` | Comparar contenedores en ejecución y detenidos. | observar |
| `podman inspect CONTENEDOR` | Examinar configuración y estado; elige el objeto. | plantilla |
| `podman logs CONTENEDOR` | Recoger salida de aplicación. | plantilla |
| `podman network ls` | Inventariar redes existentes. | observar |
| `podman run --help` | Investigar puertos, montajes y límites sin crear el contenedor. | observar |
| `man podman-systemd.unit` | Consultar Quadlet en la versión instalada. | observar |

Manuales: `man podman`, `man podman-pull`, `man podman-inspect`, `man podman-run`

Preguntas:

- ¿Estás observando el almacén del usuario correcto?
- ¿El dato vive en la imagen, el contenedor o un montaje persistente?

Errores a investigar:

- Usar nombres de imagen ambiguos sin registro.
- Desactivar SELinux o usar --privileged para ocultar un error de montaje.

## Un servicio rootless que puedes observar

Complemento de Podman; fuera de los objetivos actuales de EX200/RHEL 10.

Podman ejecuta procesos aislados desde imágenes. Rootless cambia identidades y almacenamiento; la persistencia de datos y del servicio requiere decisiones explícitas.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `podman info` | Examinar versión, rootless, almacenamiento y red. | observar |
| `podman images --digests` | Ver identidad y origen de imágenes locales. | observar |
| `podman ps -a` | Comparar contenedores en ejecución y detenidos. | observar |
| `podman inspect CONTENEDOR` | Examinar configuración y estado; elige el objeto. | plantilla |
| `podman logs CONTENEDOR` | Recoger salida de aplicación. | plantilla |
| `podman network ls` | Inventariar redes existentes. | observar |
| `podman run --help` | Investigar puertos, montajes y límites sin crear el contenedor. | observar |
| `man podman-systemd.unit` | Consultar Quadlet en la versión instalada. | observar |

Manuales: `man podman-run`, `man podman-port`, `man podman-logs`, `man podman-ps`

Preguntas:

- ¿Estás observando el almacén del usuario correcto?
- ¿El dato vive en la imagen, el contenedor o un montaje persistente?

Errores a investigar:

- Usar nombres de imagen ambiguos sin registro.
- Desactivar SELinux o usar --privileged para ocultar un error de montaje.

## Datos que sobreviven al contenedor

Complemento de Podman; fuera de los objetivos actuales de EX200/RHEL 10.

Podman ejecuta procesos aislados desde imágenes. Rootless cambia identidades y almacenamiento; la persistencia de datos y del servicio requiere decisiones explícitas.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `podman info` | Examinar versión, rootless, almacenamiento y red. | observar |
| `podman images --digests` | Ver identidad y origen de imágenes locales. | observar |
| `podman ps -a` | Comparar contenedores en ejecución y detenidos. | observar |
| `podman inspect CONTENEDOR` | Examinar configuración y estado; elige el objeto. | plantilla |
| `podman logs CONTENEDOR` | Recoger salida de aplicación. | plantilla |
| `podman network ls` | Inventariar redes existentes. | observar |
| `podman run --help` | Investigar puertos, montajes y límites sin crear el contenedor. | observar |
| `man podman-systemd.unit` | Consultar Quadlet en la versión instalada. | observar |

Manuales: `man podman-run`, `man podman-unshare`, `man containers-storage.conf`, `man selinux`

Preguntas:

- ¿Estás observando el almacén del usuario correcto?
- ¿El dato vive en la imagen, el contenedor o un montaje persistente?

Errores a investigar:

- Usar nombres de imagen ambiguos sin registro.
- Desactivar SELinux o usar --privileged para ocultar un error de montaje.

## Del contenedor al servicio de usuario

Complemento de Podman; fuera de los objetivos actuales de EX200/RHEL 10.

Podman ejecuta procesos aislados desde imágenes. Rootless cambia identidades y almacenamiento; la persistencia de datos y del servicio requiere decisiones explícitas.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `podman info` | Examinar versión, rootless, almacenamiento y red. | observar |
| `podman images --digests` | Ver identidad y origen de imágenes locales. | observar |
| `podman ps -a` | Comparar contenedores en ejecución y detenidos. | observar |
| `podman inspect CONTENEDOR` | Examinar configuración y estado; elige el objeto. | plantilla |
| `podman logs CONTENEDOR` | Recoger salida de aplicación. | plantilla |
| `podman network ls` | Inventariar redes existentes. | observar |
| `podman run --help` | Investigar puertos, montajes y límites sin crear el contenedor. | observar |
| `man podman-systemd.unit` | Consultar Quadlet en la versión instalada. | observar |

Manuales: `man podman-systemd.unit`, `man systemctl`, `man loginctl`, [Referencia](https://docs.podman.io/en/latest/markdown/podman-systemd.unit.5.html)

Preguntas:

- ¿Estás observando el almacén del usuario correcto?
- ¿El dato vive en la imagen, el contenedor o un montaje persistente?

Errores a investigar:

- Usar nombres de imagen ambiguos sin registro.
- Desactivar SELinux o usar --privileged para ocultar un error de montaje.

## Dos contenedores, una conversación

Complemento de Podman; fuera de los objetivos actuales de EX200/RHEL 10.

Podman ejecuta procesos aislados desde imágenes. Rootless cambia identidades y almacenamiento; la persistencia de datos y del servicio requiere decisiones explícitas.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `podman info` | Examinar versión, rootless, almacenamiento y red. | observar |
| `podman images --digests` | Ver identidad y origen de imágenes locales. | observar |
| `podman ps -a` | Comparar contenedores en ejecución y detenidos. | observar |
| `podman inspect CONTENEDOR` | Examinar configuración y estado; elige el objeto. | plantilla |
| `podman logs CONTENEDOR` | Recoger salida de aplicación. | plantilla |
| `podman network ls` | Inventariar redes existentes. | observar |
| `podman run --help` | Investigar puertos, montajes y límites sin crear el contenedor. | observar |
| `man podman-systemd.unit` | Consultar Quadlet en la versión instalada. | observar |

Manuales: `man podman-network`, `man podman-network-create`, `man podman-network-inspect`, `man podman-exec`

Preguntas:

- ¿Estás observando el almacén del usuario correcto?
- ¿El dato vive en la imagen, el contenedor o un montaje persistente?

Errores a investigar:

- Usar nombres de imagen ambiguos sin registro.
- Desactivar SELinux o usar --privileged para ocultar un error de montaje.

## Diagnostica una salida inesperada

Complemento de Podman; fuera de los objetivos actuales de EX200/RHEL 10.

Podman ejecuta procesos aislados desde imágenes. Rootless cambia identidades y almacenamiento; la persistencia de datos y del servicio requiere decisiones explícitas.

| Comando o plantilla | Propósito | Uso |
|---|---|---|
| `podman info` | Examinar versión, rootless, almacenamiento y red. | observar |
| `podman images --digests` | Ver identidad y origen de imágenes locales. | observar |
| `podman ps -a` | Comparar contenedores en ejecución y detenidos. | observar |
| `podman inspect CONTENEDOR` | Examinar configuración y estado; elige el objeto. | plantilla |
| `podman logs CONTENEDOR` | Recoger salida de aplicación. | plantilla |
| `podman network ls` | Inventariar redes existentes. | observar |
| `podman run --help` | Investigar puertos, montajes y límites sin crear el contenedor. | observar |
| `man podman-systemd.unit` | Consultar Quadlet en la versión instalada. | observar |

Manuales: `man podman-inspect`, `man podman-logs`, `man podman-stats`, `man podman-run`

Preguntas:

- ¿Estás observando el almacén del usuario correcto?
- ¿El dato vive en la imagen, el contenedor o un montaje persistente?

Errores a investigar:

- Usar nombres de imagen ambiguos sin registro.
- Desactivar SELinux o usar --privileged para ocultar un error de montaje.
