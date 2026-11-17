# Simulacro integral EX200 · 120 minutos

32 retos, 62 objetivos y 10 áreas. Duración exacta del entrenamiento: 02:00:00, sin pausa. No representa una duración oficial del examen ni una calificación oficial.

El plazo se fija al iniciar. Cambiar de reto, cerrar la pestaña o recargar no reinicia el reloj. Al agotarlo se cierra el intento con la evidencia guardada. Si la pestaña estaba cerrada, el cierre se registra al volver con la fecha límite original y el tiempo limitado a dos horas.

## Navegación

Usa Anterior, Siguiente, Omitir por ahora, Marcar para revisar o el selector para ir a cualquier reto. No hay requisitos de formulario para cambiar de reto. El omitido queda para revisión; tu evidencia y el reto seleccionado se guardan. Preparado es una marca personal, no una verificación técnica. Las dependencias se pueden abordar en el orden que elijas.

## Preparación antes del reloj

Dos VMs con consola y SSH; kit actualizado y verificador actualizado con vagrant provision; discos adicionales habilitados y vacíos (dos de 8 GiB en server y uno en client); snapshots de base; paquetes base, repositorios y conectividad. Puedes descargar previamente los runtimes/paquetes de Flatpak para que la red no domine el intento. Dentro del reto se demuestra la instalación/retirada. No restaures un snapshot sin comprender qué trabajo sobrescribe.

El objetivo de paquetes permite CDN de Red Hat, un repositorio remoto o RPM local. El escenario Rocky utiliza remoto/local y documenta el CDN como vía específica de RHEL. Podman conserva su catálogo complementario y no forma parte de estos 62 objetivos.

## Distribución de tiempo

Los minutos por reto suman 120 y son orientativos. No hay bloqueo ni cronómetro independiente por ejercicio. Las pruebas de reinicio se pueden compartir entre retos cuando sus criterios lo permitan.

| Reto | Área | Minutos orientativos | Objetivos |
|---|---|---:|---|
| 01. Shell, identidad y archivos | tools | 2 | T01, T02, T05, T07, T08 |
| 02. Filtrar sin perder la evidencia | tools | 3 | T02, T03 |
| 03. Claves SSH y transferencia íntegra | tools | 4 | T04, SYS10, SEC03 |
| 04. tar, gzip y bzip2 con restauración | tools | 5 | T06 |
| 05. Enlaces y permisos ugo/rwx | tools | 3 | T09, T10 |
| 06. Encuentra ayuda dentro del sistema | tools | 2 | T11 |
| 07. Repositorio RPM y ciclo del paquete | software | 4 | SW01, SW02 |
| 08. Flatpak: remote, instalación y retirada | software | 4 | SW03, SW04 |
| 09. Un inventario que cumple su contrato | scripts | 5 | SH01, SH02, SH03, SH04 |
| 10. Arranque normal y targets | systems | 4 | SYS01, SYS02, MT03 |
| 11. Recuperar acceso desde el arranque | systems | 5 | SYS03 |
| 12. Procesos, prioridad y perfil de ajuste | systems | 3 | SYS04, SYS05, SYS06 |
| 13. Registros que sobreviven al reinicio | systems | 3 | SYS07, SYS08 |
| 14. Servicio de red: estado y persistencia | maintenance | 3 | SYS09, MT02, NW03 |
| 15. Particiones GPT sin tocar la raíz | storage | 4 | ST01 |
| 16. PV y grupo de volúmenes | storage | 3 | ST02, ST03 |
| 17. Crear y retirar volúmenes lógicos | storage | 4 | ST04 |
| 18. Montaje por UUID o etiqueta | storage | 3 | ST05 |
| 19. Agregar swap conservando los datos | storage | 3 | ST06 |
| 20. VFAT, ext4 y XFS en uso | filesystems | 5 | FS01 |
| 21. Publicar y montar NFS | filesystems | 4 | FS02 |
| 22. NFS a demanda con autofs | filesystems | 4 | FS03 |
| 23. Ampliar un LV sin perder el archivo | filesystems | 4 | FS04 |
| 24. Colaboración y permisos predeterminados | filesystems | 3 | FS05, SEC02 |
| 25. at, cron y timer systemd | maintenance | 5 | MT01 |
| 26. Cliente de tiempo y cargador de arranque | maintenance | 4 | MT04, MT06 |
| 27. Paquetes desde origen remoto y RPM local | maintenance | 4 | MT05 |
| 28. IPv4, IPv6 y resolución persistentes | network | 5 | NW01, NW02 |
| 29. Cuentas, grupos, contraseña y sudo | users | 4 | USR01, USR02, USR03, USR04 |
| 30. Firewall con pruebas positivas y negativas | security | 3 | NW04, SEC01 |
| 31. SELinux: modos y contextos | security | 4 | SEC04, SEC05, SEC06 |
| 32. SELinux: puerto y booleano | security | 4 | SEC07, SEC08 |

## Mapa completo de cobertura

- **T01 · Shell y sintaxis correcta** → 1. Shell, identidad y archivos
- **T02 · Redirección de entrada y salida** → 1. Shell, identidad y archivos; 2. Filtrar sin perder la evidencia
- **T03 · grep y expresiones regulares** → 2. Filtrar sin perder la evidencia
- **T04 · Acceso remoto por SSH** → 3. Claves SSH y transferencia íntegra
- **T05 · Inicio de sesión y cambio de usuario** → 1. Shell, identidad y archivos
- **T06 · tar, gzip y bzip2: archivo, compresión y extracción** → 4. tar, gzip y bzip2 con restauración
- **T07 · Creación y edición de textos** → 1. Shell, identidad y archivos
- **T08 · Crear, borrar, copiar y mover archivos y directorios** → 1. Shell, identidad y archivos
- **T09 · Enlaces físicos y simbólicos** → 5. Enlaces y permisos ugo/rwx
- **T10 · Permisos estándar ugo/rwx** → 5. Enlaces y permisos ugo/rwx
- **T11 · Documentación man, info y /usr/share/doc** → 6. Encuentra ayuda dentro del sistema
- **SW01 · Acceso a repositorios RPM** → 7. Repositorio RPM y ciclo del paquete
- **SW02 · Instalación y retirada de paquetes RPM** → 7. Repositorio RPM y ciclo del paquete
- **SW03 · Acceso a repositorios Flatpak** → 8. Flatpak: remote, instalación y retirada
- **SW04 · Instalación y retirada de aplicaciones Flatpak** → 8. Flatpak: remote, instalación y retirada
- **SH01 · Condiciones con if, test o corchetes** → 9. Un inventario que cumple su contrato
- **SH02 · Bucles sobre archivos y entrada** → 9. Un inventario que cumple su contrato
- **SH03 · Argumentos posicionales del script** → 9. Un inventario que cumple su contrato
- **SH04 · Procesar salida de comandos dentro del script** → 9. Un inventario que cumple su contrato
- **SYS01 · Arranque, reinicio y apagado normales** → 10. Arranque normal y targets
- **SYS02 · Arranque manual en otros targets** → 10. Arranque normal y targets
- **SYS03 · Interrumpir el arranque y recuperar acceso** → 11. Recuperar acceso desde el arranque
- **SYS04 · Identificar procesos de alto consumo y terminarlos** → 12. Procesos, prioridad y perfil de ajuste
- **SYS05 · Ajustar programación de procesos** → 12. Procesos, prioridad y perfil de ajuste
- **SYS06 · Perfiles de ajuste** → 12. Procesos, prioridad y perfil de ajuste
- **SYS07 · Interpretar registros y journal** → 13. Registros que sobreviven al reinicio
- **SYS08 · Conservar el journal** → 13. Registros que sobreviven al reinicio
- **SYS09 · Gestionar estado de servicios de red** → 14. Servicio de red: estado y persistencia
- **SYS10 · Transferencia segura entre sistemas** → 3. Claves SSH y transferencia íntegra
- **ST01 · Enumerar, crear y eliminar particiones GPT** → 15. Particiones GPT sin tocar la raíz
- **ST02 · Crear y eliminar volúmenes físicos** → 16. PV y grupo de volúmenes
- **ST03 · Asignar PV a grupos de volúmenes** → 16. PV y grupo de volúmenes
- **ST04 · Crear y eliminar volúmenes lógicos** → 17. Crear y retirar volúmenes lógicos
- **ST05 · Montar al arrancar mediante UUID o etiqueta** → 18. Montaje por UUID o etiqueta
- **ST06 · Añadir particiones, LV y swap sin perder datos** → 19. Agregar swap conservando los datos
- **FS01 · Crear y usar VFAT, ext4 y XFS; montar y desmontar** → 20. VFAT, ext4 y XFS en uso
- **FS02 · Montaje y desmontaje de NFS** → 21. Publicar y montar NFS
- **FS03 · Configurar autofs** → 22. NFS a demanda con autofs
- **FS04 · Ampliar volúmenes lógicos existentes** → 23. Ampliar un LV sin perder el archivo
- **FS05 · Diagnosticar y reparar permisos** → 24. Colaboración y permisos predeterminados
- **MT01 · Programar con at, cron y timers systemd** → 25. at, cron y timer systemd
- **MT02 · Gestionar servicios y habilitación al arrancar** → 14. Servicio de red: estado y persistencia
- **MT03 · Target predeterminado de arranque** → 10. Arranque normal y targets
- **MT04 · Configurar un cliente de tiempo** → 26. Cliente de tiempo y cargador de arranque
- **MT05 · Instalar y actualizar desde CDN de Red Hat, repositorio remoto o RPM local** → 27. Paquetes desde origen remoto y RPM local
- **MT06 · Modificar el cargador de arranque** → 26. Cliente de tiempo y cargador de arranque
- **NW01 · Direcciones IPv4 e IPv6** → 28. IPv4, IPv6 y resolución persistentes
- **NW02 · Resolución de nombres de host** → 28. IPv4, IPv6 y resolución persistentes
- **NW03 · Servicios de red habilitados al arrancar** → 14. Servicio de red: estado y persistencia
- **NW04 · Restricción de acceso con firewalld** → 30. Firewall con pruebas positivas y negativas
- **USR01 · Crear, modificar y eliminar usuarios** → 29. Cuentas, grupos, contraseña y sudo
- **USR02 · Contraseñas y caducidad** → 29. Cuentas, grupos, contraseña y sudo
- **USR03 · Crear, modificar y eliminar grupos y pertenencias** → 29. Cuentas, grupos, contraseña y sudo
- **USR04 · Acceso privilegiado** → 29. Cuentas, grupos, contraseña y sudo
- **SEC01 · Ajustes con firewalld/firewall-cmd** → 30. Firewall con pruebas positivas y negativas
- **SEC02 · Permisos predeterminados de archivos** → 24. Colaboración y permisos predeterminados
- **SEC03 · Autenticación SSH por claves** → 3. Claves SSH y transferencia íntegra
- **SEC04 · Modos permissive y enforcing de SELinux** → 31. SELinux: modos y contextos
- **SEC05 · Contextos de archivos y procesos de SELinux** → 31. SELinux: modos y contextos
- **SEC06 · Restaurar contextos predeterminados** → 31. SELinux: modos y contextos
- **SEC07 · Etiquetas de puerto SELinux** → 32. SELinux: puerto y booleano
- **SEC08 · Booleanos SELinux** → 32. SELinux: puerto y booleano

## Misiones y criterios

### 01. Shell, identidad y archivos

server · 2 min orientativos · T01, T02, T05, T07, T08

Desde una shell de server, identifica tu usuario y cambia a otra identidad local de prueba mediante una vía autorizada. En /srv/ex200/shell crea y edita inventario.txt con hostname e identidad. Copia el archivo a una subcarpeta, muévelo a otra y elimina únicamente la copia desechable. Captura stdout y stderr de una consulta de prueba en archivos separados. Conserva el original y registra la identidad efectiva en cada paso.

- El texto editado contiene hostname e identidad comprobados. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- La copia, el movimiento y la eliminación se limitan a los objetos de prueba. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- stdout y stderr quedan separados; documentaste el cambio de identidad y el regreso a la sesión original. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 02. Filtrar sin perder la evidencia

server · 3 min orientativos · T02, T03

Usa /opt/ex200/access.log. Genera /srv/ex200/expediente/errores.txt con exactamente las líneas ERROR. En /srv/ex200/expediente/solicitudes-1.txt selecciona las líneas cuyo identificador de solicitud termina en 1 mediante una expresión regular y conserva los registros fuente. Demuestra una redirección de errores y explica la diferencia entre una coincidencia literal y el patrón que elegiste.

- errores.txt coincide exactamente con los eventos ERROR de la fuente. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- La segunda salida satisface el patrón y conserva el archivo original. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- La evidencia distingue stdout/stderr y justifica la expresión regular. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 03. Claves SSH y transferencia íntegra

ambas · 4 min orientativos · T04, SYS10, SEC03

Como vagrant en client, habilita acceso por clave a vagrant@server.lab sin desactivar la validación de identidad del host. Transfiere /opt/ex200/access.log desde server a /home/vagrant/evidencia.log en client mediante un transporte cifrado. Compara hashes y revisa los permisos de claves y directorios. No modifiques el acceso de gestión de Vagrant ni copies claves privadas.

- Una conexión desde client a server usa la clave de usuario prevista y verifica la identidad del host. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- evidencia.log tiene el mismo SHA-256 que la fuente. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- Documentaste permisos, identidad efectiva y transporte utilizado sin exponer secretos. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 04. tar, gzip y bzip2 con restauración

server · 5 min orientativos · T06

Prepara un árbol pequeño bajo /srv/ex200/archivo-origen con texto, un subdirectorio y un enlace. En /srv/ex200/archivos crea respaldo.tar.gz y respaldo.tar.bz2 con tar y las compresiones respectivas gzip y bzip2. Lista ambos sin extraer, después extrae sus contenidos en /srv/ex200/archivos/restaurado-gzip y /srv/ex200/archivos/restaurado-bzip2, inicialmente vacíos, conservando las rutas relativas del árbol original. Compara checksums de los textos restaurados y conserva un manifiesto. No uses rutas del sistema ni sobreescribas el origen.

- Los dos archivos tar usan la compresión prevista y se pueden listar. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- Cada restauración reproduce el árbol y los enlaces esperados. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- Los hashes coinciden y los destinos de extracción quedaron documentados. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 05. Enlaces y permisos ugo/rwx

server · 3 min orientativos · T09, T10

En /srv/ex200/enlaces crea un archivo dato.txt, un enlace físico fisico.txt y otro simbólico simbolico.txt a ese archivo. Establece modo 640 en el original. Comprueba inodos, tipo y permisos. Renombra únicamente el original en una prueba controlada y describe qué enlace conserva acceso y cuál depende de la ruta; restaura después el nombre original.

- El enlace físico comparte inodo y el simbólico contiene una referencia de ruta. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- dato.txt termina con modo 640 y los enlaces correctos. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- La prueba de renombrado tiene evidencia y termina con el estado solicitado restaurado. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 06. Encuentra ayuda dentro del sistema

server · 2 min orientativos · T11

Encuentra una opción relevante para este simulacro en man, una explicación en info y un documento de un paquete instalado bajo /usr/share/doc. Registra el comando de consulta, la sección o ruta encontrada y para qué decisión concreta te sirve. No necesitas Internet ni copiar extensos fragmentos del documento.

- Hay una referencia man con sección y opción identificadas. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- Hay una referencia info navegada con su nodo o tema. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- Hay un archivo real de /usr/share/doc y se explica su utilidad. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 07. Repositorio RPM y ciclo del paquete

server · 4 min orientativos · SW01, SW02

Identifica BaseOS/AppStream de Rocky 10 y su política de firma. Configura y comprueba /etc/yum.repos.d/ex200-lab.repo como archivo de repositorio de laboratorio con un origen oficial válido, evitando IDs duplicados activos. Instala tree, consulta procedencia y archivos, retíralo y vuelve a instalarlo. Termina con tree instalado. No mezcles versiones mayores ni desactives la firma para ocultar un error.

- tree está instalado y el ejecutable está disponible. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- El repositorio de laboratorio tiene ID, origen y validación de firma comprobados. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- La evidencia registra instalación, retirada y reinstalación del mismo paquete. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 08. Flatpak: remote, instalación y retirada

client · 4 min orientativos · SW03, SW04

Como vagrant, configura un remote de usuario flathub desde el descriptor oficial. Elige una aplicación pequeña compatible con la arquitectura, instálala, registra referencia y runtime, y retírala. Conserva el remote configurado. Comprueba previamente espacio, memoria e Internet. Puedes elegir y descargar la aplicación de práctica antes del reloj para evitar que la velocidad de Internet domine la evaluación; dentro de la sesión demuestra instalación y retirada.

- El remote de usuario existe y corresponde al origen oficial. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- La aplicación elegida queda identificada por ID, arquitectura, rama y runtime. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- Hay evidencia de instalación y retirada dentro de la sesión, diferenciando usuario y sistema. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 09. Un inventario que cumple su contrato

server · 5 min orientativos · SH01, SH02, SH03, SH04

Crea /srv/ex200/inventario.sh. Recibe directorio de entrada y archivo de salida como $1 y $2. Recorre archivos regulares del primer nivel y escribe nombre y tamaño usando salida de comandos. Incluye una condición y un bucle. Si faltan argumentos o no existe el directorio, informa por stderr y devuelve error. Prueba un nombre con espacios y un directorio vacío sin modificar los archivos de entrada.

- La condición y los argumentos producen una salida de error y código coherentes en casos inválidos. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- El bucle procesa correctamente archivos con espacios y el directorio vacío. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- La salida utiliza resultados de comandos y los nombres/tamaños coinciden con comprobaciones independientes. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 10. Arranque normal y targets

client · 4 min orientativos · SYS01, SYS02, MT03

Desde la consola de client demuestra un cambio temporal a un target de mantenimiento y el regreso a modo multiusuario. Establece multi-user.target como predeterminado. Realiza un reinicio y un apagado normal, vuelve a iniciar client desde el host y conserva evidencia del target y del nuevo arranque. El reloj continúa durante estas operaciones. No alteres NAT ni las claves de gestión.

- La evidencia muestra el target temporal y el regreso normal. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- El target predeterminado es multi-user.target después del reinicio. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- Se registraron reinicio, apagado y arranque normales sin pérdida del acceso de gestión. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 11. Recuperar acceso desde el arranque

client · 5 min orientativos · SYS03

Con consola disponible y snapshot de client creado antes del reloj, practica interrumpir el arranque y recuperar una credencial local de prueba. Usa una cuenta desechable y conserva la vía de gestión. Realiza el tratamiento de contextos necesario y termina con SELinux enforcing y arranque normal. La contraseña elegida no debe aparecer en la evidencia. Si necesitas volver al snapshot, documenta qué trabajo de client se perdería antes de hacerlo.

- Se demuestra una intervención de recuperación desde la consola de arranque. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- La cuenta de prueba recupera acceso sin exponer credenciales ni eliminar el canal de gestión. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- El arranque normal posterior conserva enforcing y los contextos necesarios. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 12. Procesos, prioridad y perfil de ajuste

server · 3 min orientativos · SYS04, SYS05, SYS06

Identifica los procesos de mayor consumo de CPU y memoria. Genera solo una carga de CPU de prueba limitada a 45 segundos, identifica PID y padre, ajusta su nice a 10 y termina únicamente esa carga. No provoques agotamiento de memoria. Identifica el perfil tuned activo, selecciona un perfil disponible apropiado para esta VM y justifica la elección.

- Identificaste PID y consumo de CPU/memoria y terminaste la carga correcta. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- La evidencia muestra nice 10 antes de terminar el proceso. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- El perfil tuned final está identificado y su elección se justifica. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 13. Registros que sobreviven al reinicio

server · 3 min orientativos · SYS07, SYS08

Configura almacenamiento persistente del journal. Emite un evento con etiqueta ex200-lab, localízalo y reinicia server cuando resulte conveniente para este y otros retos. Recupera el evento del arranque anterior e interpreta además un registro de sshd y un archivo de log disponible en /var/log. Conserva fecha, unidad o proceso y boot ID.

- Hay archivos del journal persistente escritos en disco. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- El evento ex200-lab se recupera de un arranque anterior. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- La evidencia interpreta un registro del journal y un archivo de log sin confundir aviso con fallo. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 14. Servicio de red: estado y persistencia

server · 3 min orientativos · SYS09, MT02, NW03

Gestiona sshd desde la consola o una sesión alternativa segura: registra su estado, detén e inicia el servicio y comprueba acceso desde client al finalizar. Mantén sshd habilitado para el arranque. Demuestra la diferencia entre activo y habilitado y conserva evidencia posterior al reinicio compartido con otros retos.

- La parada y el inicio de sshd se documentan sin perder la vía de recuperación. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- sshd queda activo, habilitado y accesible desde client. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- La prueba posterior al reinicio confirma persistencia y diferencia los dos estados. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 15. Particiones GPT sin tocar la raíz

server · 4 min orientativos · ST01

Identifica el primer disco adicional vacío de 8 GiB de server. Crea una tabla GPT y dos particiones de aproximadamente 1 GiB. Elimina únicamente la segunda partición de prueba y vuelve a crearla para el ejercicio de PV temporal. Conserva la primera. Registra el disco por tamaño, ruta y ausencia de montajes antes de escribir; nunca supongas que siempre es sdb.

- El dispositivo de práctica está identificado y no contiene el sistema raíz. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- La tabla GPT y la primera partición se conservan. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- Hay evidencia de creación, eliminación y recreación de la segunda partición. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 16. PV y grupo de volúmenes

server · 3 min orientativos · ST02, ST03

Usa el segundo disco adicional vacío de server para crear un PV y asignarlo a vg_lab. En la segunda partición desechable del primer disco, preparada en el reto GPT, crea otro PV temporal y elimínalo después de comprobar que no contiene datos ni pertenece a un VG en uso. No retires el PV de vg_lab. Deja listo el grupo para crear volúmenes lógicos.

- El PV del segundo disco pertenece a vg_lab. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- El PV temporal se creó y retiró de forma segura en el dispositivo de prueba. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- La evidencia distingue disco, partición, PV y VG y conserva el grupo principal. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 17. Crear y retirar volúmenes lógicos

server · 4 min orientativos · ST04

Dentro de vg_lab crea un LV datos de 512 MiB y otro LV temporal de 128 MiB. Comprueba ambos y elimina únicamente el temporal después de verificar que no tiene datos útiles ni está montado. Formatea datos como XFS, escribe un archivo de prueba y móntalo en /srv/ex200/lvm. Conserva su checksum para el reto de ampliación.

- El LV datos existe con 512 MiB antes de ampliar. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- El LV temporal se creó y retiró con evidencia de su identidad. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- XFS está montado en /srv/ex200/lvm y el archivo de prueba tiene checksum guardado. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 18. Montaje por UUID o etiqueta

server · 3 min orientativos · ST05

Utiliza la primera partición del primer disco de práctica. Crea ext4 con etiqueta EX200DATA y móntalo en /srv/ex200/disco. Configura el arranque por UUID o etiqueta, valida la entrada antes de reiniciar y comprueba el montaje posterior. No uses nombres de dispositivo variables para la persistencia ni modifiques la entrada de la raíz.

- El filesystem ext4 tiene la etiqueta prevista y el montaje correcto. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- La configuración persistente usa UUID o etiqueta válidos. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- El montaje vuelve después del reinicio sin intervención y sin afectar la raíz. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 19. Agregar swap conservando los datos

server · 3 min orientativos · ST06

Después de preparar vg_lab y los volúmenes del simulacro, añade un LV intercambio de 256 MiB como swap adicional. Conserva el swap existente y los datos de los retos de almacenamiento. Configura activación por UUID y verifica tras reiniciar. Compara particiones/LV y checksums anteriores con el estado final para demostrar que la ampliación fue no destructiva.

- El LV intercambio está activo como swap adicional. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- La activación persiste mediante su UUID. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- Las particiones, LV y archivos previos permanecen intactos después del reinicio. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 20. VFAT, ext4 y XFS en uso

client · 5 min orientativos · FS01

En el disco adicional vacío de client crea tres particiones de 512 MiB. Crea VFAT, ext4 y XFS respectivamente y móntalos bajo /srv/ex200/fs/. Escribe y lee un archivo en cada uno, desmonta y vuelve a montar. Comprueba checksums y explica una diferencia de permisos observada en VFAT. Configura también su montaje al arrancar, para comprobar los tres formatos tras el reinicio. No uses el disco del sistema.

- Los tres tipos de filesystem y sus puntos de montaje se identifican correctamente. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- Las pruebas de lectura/escritura sobreviven a desmontar y montar. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- Los checksums coinciden y se explica la diferencia de permisos de VFAT. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 21. Publicar y montar NFS

ambas · 4 min orientativos · FS02

En server prepara /srv/ex200/compartido con saludo.txt y expórtalo por NFS solo a la IP privada de client en lectura. En client realiza un montaje manual de prueba, lee el archivo, confirma rechazo de escritura y desmonta. Conserva la exportación para autofs. Mantén el firewall y SELinux activos y configura solo los accesos necesarios.

- La exportación de lectura tiene alcance a client y contiene saludo.txt. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- client monta, lee y no obtiene escritura en el recurso. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- El montaje manual se desmonta y quedan identificadas las dependencias de red y servicio. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 22. NFS a demanda con autofs

client · 4 min orientativos · FS03

Usa la exportación creada en el reto NFS. Configura autofs para acceder desde client a /mnt/ex200/compartido. Comprueba activación por acceso, lectura de saludo.txt y expiración al dejar de usarlo. Asegúrate de no tener una shell dentro del montaje mientras pruebas su expiración. Verifica la configuración después del reinicio de client.

- autofs activa el recurso al acceder a la ruta prevista. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- La lectura funciona y la expiración se demuestra sin mantener el montaje ocupado. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- El acceso sigue funcionando después de reiniciar client. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 23. Ampliar un LV sin perder el archivo

server · 4 min orientativos · FS04

Amplía vg_lab/datos de 512 MiB a al menos 1 GiB y amplía el XFS que contiene, manteniendo /srv/ex200/lvm como montaje. Conserva el archivo y compara su checksum. Configura montaje persistente por UUID y comprueba tras reiniciar. Distingue el tamaño del LV del tamaño del filesystem.

- vg_lab/datos tiene al menos 1 GiB y contiene XFS montado en /srv/ex200/lvm. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- El checksum del archivo anterior no cambia y el filesystem usa la ampliación. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- El montaje persiste por UUID y funciona después del reinicio. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 24. Colaboración y permisos predeterminados

server · 3 min orientativos · FS05, SEC02

Después del reto de usuarios, configura /srv/ex200/equipo para operaciones. antonio y ana deben colaborar; un usuario ajeno no debe atravesar el directorio. Los archivos nuevos deben heredar el grupo y tener modo 660 mediante permisos predeterminados apropiados. Provoca y repara un fallo de búsqueda en un subdirectorio de prueba sin aplicar 777.

- operaciones es el grupo propietario del directorio y está activo setgid. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- Los usuarios del equipo colaboran y los archivos nuevos cumplen grupo y modo 660; una cuenta ajena queda rechazada. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- La evidencia identifica y repara el permiso del subdirectorio con alcance mínimo. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 25. at, cron y timer systemd

server · 5 min orientativos · MT01

Prepara una tarea propia de heartbeat que escriba una marca de tiempo sin secretos. Demuestra una ejecución única con at, una ejecución cron como vagrant y una ejecución mediante ex200-heartbeat.service activada por ex200-heartbeat.timer cada cinco minutos. El timer debe quedar activo y habilitado. Diferencia los tres programadores y sus identidades de ejecución.

- ex200-heartbeat.timer está activo y habilitado. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- Hay evidencia de ejecución por at y por cron con identidad y destino diferenciados. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- La unidad service y el timer se relacionan con una ejecución registrada y un calendario correcto. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 26. Cliente de tiempo y cargador de arranque

server · 4 min orientativos · MT04, MT06

Configura chronyd como cliente con una fuente accesible y comprueba su selección. Con un snapshot y consola de server, modifica de forma reversible el tiempo de espera del cargador de arranque, comprueba el resultado en consola y termina con un arranque normal. Conserva evidencias de la configuración efectiva y del reloj; no cambies la hora manualmente para ocultar una falla de sincronización.

- El cliente de tiempo tiene fuente configurada, seleccionada y estado interpretado. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- El cambio del tiempo de espera del cargador se comprueba desde consola y tiene un punto de retorno. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- El sistema termina con arranque normal, acceso de gestión y configuración del cargador documentada. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 27. Paquetes desde origen remoto y RPM local

server · 4 min orientativos · MT05

Usa un origen remoto oficial compatible para instalar o actualizar un paquete de prueba y conserva un RPM firmado de ese origen para una instalación desde el filesystem local. Registra versión, procedencia y transacción. En Rocky no configures una suscripción Red Hat: documenta que el CDN corresponde a RHEL y qué cambiaría allí. Este objetivo permite CDN, repositorio remoto o archivo local; ejecuta las vías disponibles sin mezclar distribuciones.

- Hay evidencia de instalación o actualización desde un origen remoto válido. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- Se demuestra instalación de un RPM local firmado compatible y su procedencia. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- La evidencia diferencia los métodos disponibles en Rocky del CDN de RHEL y conserva la verificación de firma. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 28. IPv4, IPv6 y resolución persistentes

ambas · 5 min orientativos · NW01, NW02

Conserva NAT. En la interfaz privada usa server 192.168.56.10/24 y client 192.168.56.20/24, y añade fd42:200::10/64 y fd42:200::20/64 respectivamente. Ambos nodos deben resolver server.lab y client.lab localmente y comunicarse en las dos familias. No añadas gateway predeterminado a la interfaz privada. Verifica persistencia y la salida NAT tras un reinicio.

- IPv4 e IPv6 se corresponden con cada nodo en la interfaz privada. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- La resolución de ambos nombres y la conectividad bidireccional quedan comprobadas. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- Las direcciones persisten sin cambiar la salida NAT ni perder gestión. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 29. Cuentas, grupos, contraseña y sudo

server · 4 min orientativos · USR01, USR02, USR03, USR04

Crea operaciones, antonio y ana, con operaciones como grupo suplementario. Establece una contraseña local de práctica para antonio con máximo 90 días y aviso 7. Delega únicamente /usr/bin/systemctl status sshd mediante sudo. Crea, modifica y elimina un usuario y un grupo temporales sin datos útiles. Prueba el acceso efectivo y un rechazo desde la identidad correspondiente. Conserva al usuario vagrant y no registres contraseñas.

- antonio y ana existen y pertenecen a operaciones. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- antonio tiene caducidad máxima de 90 días y aviso de 7. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- Se demuestran contraseña de práctica, ciclo de usuario/grupo temporal y delegación sudo limitada con prueba negativa. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 30. Firewall con pruebas positivas y negativas

server · 3 min orientativos · NW04, SEC01

Mantén firewalld activo e identifica la zona de la interfaz privada. Permite SSH y NFS para este laboratorio y el puerto del servicio HTTP que vas a usar. Compara estado runtime y permanente. Desde client comprueba un acceso permitido y otro rechazado usando un servicio de prueba acotado. Mantén el acceso de gestión y verifica después de reiniciar.

- Las reglas están en la zona usada por la interfaz privada, con alcance documentado. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- Las pruebas desde client demuestran tanto un permiso como un rechazo. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- Runtime y configuración permanente son coherentes y sobreviven al reinicio. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 31. SELinux: modos y contextos

server · 4 min orientativos · SEC04, SEC05, SEC06

Inspecciona los contextos de archivos y procesos de httpd. Prepara /srv/ex200/web con una página propia, declara su contexto web persistente y verifica el etiquetado efectivo. En un archivo de prueba provoca un contexto incorrecto y restaura el predeterminado. Demuestra brevemente permissive y vuelve a enforcing; no uses permissive como reparación y termina con la protección activa.

- SELinux está enforcing y el directorio web tiene contexto httpd apropiado y persistente. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- Hay evidencia del contexto de proceso, del cambio temporal de modo y del regreso a enforcing. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- El contexto incorrecto del archivo de prueba se diagnostica y se restaura al valor declarado. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)

### 32. SELinux: puerto y booleano

server · 4 min orientativos · SEC07, SEC08

Sirve la página de /srv/ex200/web con httpd en el puerto TCP 8081 y comprueba acceso desde client. Ajusta el tipo del puerto si la política lo requiere, sin duplicar una etiqueta que ya exista. Investiga y aplica únicamente un booleano relevante para un caso HTTP/NFS de prueba; compara estado temporal y persistente. Registra el booleano seleccionado en /srv/ex200/booleano.json con las claves name (nombre, entre httpd_use_nfs, httpd_can_network_connect, httpd_read_user_content o httpd_enable_homedirs) y value (on u off), según el caso que justifiques. Comprueba el servicio tras reiniciar con enforcing activo.

- El puerto 8081 tiene un tipo autorizado para el servicio y la página responde desde client. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- El booleano elegido corresponde a un caso de prueba documentado y sus valores activo/persistente son coherentes. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)
- La página y la política funcionan tras el reinicio con enforcing y sin permisos innecesarios. (lectura de VM y contraste tras reinicio; acciones transitorias documentales)


## Resultados

El mapa del plan incluye 62/62 objetivos. El resultado de tu intento solo marca objetivos asociados a retos cuyos criterios y documentación se completaron. El simulacro actual requiere el agente local: lectura de server y client, reinicio normal de ambos y segunda lectura. Solo con la misma identidad de máquina, nuevo boot ID y controles persistentes coherentes se acredita persistencia. Las acciones transitorias se identifican como documentales. Consulta AGENTE_LOCAL.md. Un reto preparado u omitido no se considera logrado por esa marca.

## Puntuación de entrenamiento: 300 puntos

Rúbrica propia, no oficial: 10 áreas con 30 puntos cada una. Cada criterio permite crédito parcial. Preparado no suma puntos. El resultado final requiere las lecturas de las mismas dos VMs antes y después del reinicio. Los puntos documentales se distinguen de los técnicos.

| Reto | Criterios 1 / 2 / 3 | Máximo |
|---|---|---:|
| Shell, identidad y archivos | 2 / 2 / 2 | 6 |
| Filtrar sin perder la evidencia | 2 / 2 / 2 | 6 |
| Claves SSH y transferencia íntegra | 2 / 2 / 2 | 6 |
| tar, gzip y bzip2 con restauración | 2 / 2 / 2 | 6 |
| Enlaces y permisos ugo/rwx | 1 / 1 / 1 | 3 |
| Encuentra ayuda dentro del sistema | 1 / 1 / 1 | 3 |
| Repositorio RPM y ciclo del paquete | 5 / 5 / 5 | 15 |
| Flatpak: remote, instalación y retirada | 5 / 5 / 5 | 15 |
| Un inventario que cumple su contrato | 10 / 10 / 10 | 30 |
| Arranque normal y targets | 3 / 3 / 3 | 9 |
| Recuperar acceso desde el arranque | 3 / 3 / 3 | 9 |
| Procesos, prioridad y perfil de ajuste | 2 / 2 / 2 | 6 |
| Registros que sobreviven al reinicio | 2 / 2 / 2 | 6 |
| Particiones GPT sin tocar la raíz | 2 / 2 / 2 | 6 |
| PV y grupo de volúmenes | 2 / 2 / 2 | 6 |
| Crear y retirar volúmenes lógicos | 2 / 2 / 2 | 6 |
| Montaje por UUID o etiqueta | 2 / 2 / 2 | 6 |
| Agregar swap conservando los datos | 2 / 2 / 2 | 6 |
| VFAT, ext4 y XFS en uso | 2 / 2 / 2 | 6 |
| Publicar y montar NFS | 2 / 2 / 2 | 6 |
| NFS a demanda con autofs | 2 / 2 / 2 | 6 |
| Ampliar un LV sin perder el archivo | 2 / 2 / 2 | 6 |
| Colaboración y permisos predeterminados | 2 / 2 / 2 | 6 |
| Servicio de red: estado y persistencia | 3 / 3 / 3 | 9 |
| at, cron y timer systemd | 3 / 3 / 3 | 9 |
| Cliente de tiempo y cargador de arranque | 2 / 2 / 2 | 6 |
| Paquetes desde origen remoto y RPM local | 2 / 2 / 2 | 6 |
| IPv4, IPv6 y resolución persistentes | 10 / 10 / 10 | 30 |
| Cuentas, grupos, contraseña y sudo | 10 / 10 / 10 | 30 |
| Firewall con pruebas positivas y negativas | 4 / 4 / 4 | 12 |
| SELinux: modos y contextos | 3 / 3 / 3 | 9 |
| SELinux: puerto y booleano | 3 / 3 / 3 | 9 |
