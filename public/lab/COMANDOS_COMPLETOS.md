# Comandos completos · referencia de preparación

95 ejemplos de referencia. Usa una VM de práctica; no son soluciones de las misiones. Las rutas /tmp/guia-demo deben prepararse donde el ejemplo lo indique. Cada comando es independiente salvo esos requisitos de archivos/directorios. Consulta siempre el manual instalado.

## Shell y archivos · VM

```bash
id
```

Muestra la identidad efectiva y los grupos de la sesión.

Manual: `man id`

## Shell y archivos · VM

```bash
whoami
```

Muestra el nombre del usuario efectivo.

Manual: `man whoami`

## Shell y archivos · VM

```bash
sudo -iu vagrant
```

Abre una sesión de login como vagrant si tu política sudo lo permite. Sal con exit.

Manual: `man sudo`

## Shell y archivos · VM

```bash
mkdir -p /tmp/guia-demo/entrada /tmp/guia-demo/salida
```

Crea directorios de demostración sin modificar rutas del simulacro.

Manual: `man mkdir`

## Shell y archivos · VM

```bash
printf '%s\n' 'INFO solicitud 1' 'ERROR solicitud 2' > /tmp/guia-demo/entrada/eventos.log
```

Escribe dos líneas y redirige stdout a un archivo; requiere el directorio anterior.

Manual: `man printf`

## Shell y archivos · VM

```bash
printf '%s\n' 'INFO solicitud 3' >> /tmp/guia-demo/entrada/eventos.log
```

Agrega una línea al final conservando el contenido anterior.

Manual: `man bash`

## Shell y archivos · VM

```bash
ls /ruta-que-no-existe 2> /tmp/guia-demo/error.log
```

Captura stderr de un error deliberado de consulta.

Manual: `man bash`

## Shell y archivos · VM

```bash
grep -E '^ERROR|solicitud [13]$' /tmp/guia-demo/entrada/eventos.log
```

Filtra por dos patrones usando expresiones regulares extendidas.

Manual: `man grep`

## Shell y archivos · VM

```bash
grep -i error /tmp/guia-demo/entrada/eventos.log | wc -l
```

Pasa la salida de grep a wc para contar líneas coincidentes.

Manual: `man wc`

## Shell y archivos · VM

```bash
cp /tmp/guia-demo/entrada/eventos.log /tmp/guia-demo/salida/copia.log
```

Copia un archivo dentro del área de demostración.

Manual: `man cp`

## Shell y archivos · VM

```bash
mv /tmp/guia-demo/salida/copia.log /tmp/guia-demo/salida/renombrado.log
```

Renombra la copia de demostración.

Manual: `man mv`

## Shell y archivos · VM

```bash
rm -i /tmp/guia-demo/salida/renombrado.log
```

Elimina la copia después de pedir confirmación.

Manual: `man rm`

## Shell y archivos · VM

```bash
vim /tmp/guia-demo/nota.txt
```

Abre el editor para crear o modificar una nota.

Manual: `man vim`

## Shell y archivos · VM

```bash
ln /tmp/guia-demo/entrada/eventos.log /tmp/guia-demo/eventos-fisico.log
```

Crea un enlace físico al archivo de demostración.

Manual: `man ln`

## Shell y archivos · VM

```bash
ln -s /tmp/guia-demo/entrada/eventos.log /tmp/guia-demo/eventos-simbolico.log
```

Crea un enlace simbólico que referencia una ruta.

Manual: `man ln`

## Shell y archivos · VM

```bash
stat /tmp/guia-demo/eventos-fisico.log
```

Consulta inodo, propietario, tamaño y permisos.

Manual: `man stat`

## Shell y archivos · VM

```bash
chmod u=rw,g=r,o= /tmp/guia-demo/entrada/eventos.log
```

Asigna permisos al archivo de ejemplo con notación simbólica.

Manual: `man chmod`

## Archivos comprimidos · VM

```bash
tar -czf /tmp/guia-demo/copia.tar.gz -C /tmp/guia-demo entrada
```

Archiva el directorio de ejemplo y comprime con gzip.

Manual: `man tar`

## Archivos comprimidos · VM

```bash
tar -cjf /tmp/guia-demo/copia.tar.bz2 -C /tmp/guia-demo entrada
```

Crea un archivo comprimido con bzip2.

Manual: `man tar`

## Archivos comprimidos · VM

```bash
tar -tf /tmp/guia-demo/copia.tar.gz
```

Lista el archivo sin extraerlo.

Manual: `man tar`

## Archivos comprimidos · VM

```bash
tar -xf /tmp/guia-demo/copia.tar.gz -C /tmp/guia-demo/salida
```

Extrae el archivo dentro de salida; revisa sus rutas antes de extraer.

Manual: `man tar`

## Archivos comprimidos · VM

```bash
sha256sum /tmp/guia-demo/entrada/eventos.log
```

Calcula un hash para comparar contenido.

Manual: `man sha256sum`

## Documentación · VM

```bash
man 5 fstab
```

Abre la sección de formato de archivos del manual de fstab.

Manual: `man man`

## Documentación · VM

```bash
man -k filesystem
```

Busca manuales por palabra clave en su descripción.

Manual: `man apropos`

## Documentación · VM

```bash
info coreutils
```

Abre el manual Info de las utilidades GNU.

Manual: `man info`

## Documentación · VM

```bash
rpm -qd bash
```

Enumera documentación instalada del paquete Bash.

Manual: `man rpm`

## RPM y Flatpak · VM

```bash
dnf repolist --enabled
```

Enumera repositorios RPM habilitados.

Manual: `man dnf`

## RPM y Flatpak · VM

```bash
dnf info bash
```

Consulta información del paquete Bash.

Manual: `man dnf`

## RPM y Flatpak · VM

```bash
rpm -q bash
```

Consulta la versión de Bash instalada.

Manual: `man rpm`

## RPM y Flatpak · VM

```bash
sudo dnf install tree
```

Instala tree con confirmación interactiva; úsalo en una VM de práctica independiente.

Manual: `man dnf`

## RPM y Flatpak · VM

```bash
sudo dnf remove tree
```

Retira el paquete tras revisar la transacción.

Manual: `man dnf`

## RPM y Flatpak · VM

```bash
dnf history list
```

Consulta el historial de transacciones.

Manual: `man dnf`

## RPM y Flatpak · VM

```bash
flatpak --user remotes --show-details
```

Consulta repositorios Flatpak del usuario.

Manual: `man flatpak-remotes`

## RPM y Flatpak · VM

```bash
flatpak --user remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
```

Añade Flathub al usuario; necesita Internet.

Manual: `man flatpak-remote-add`

## RPM y Flatpak · VM

```bash
flatpak --user install flathub org.gnome.Calculator
```

Ejemplo de instalación de una aplicación; revisa los runtimes y el tamaño.

Manual: `man flatpak-install`

## RPM y Flatpak · VM

```bash
flatpak --user uninstall org.gnome.Calculator
```

Desinstala la aplicación de ejemplo después de confirmar.

Manual: `man flatpak-uninstall`

## Bash · VM

```bash
bash -n /tmp/guia-demo/ejemplo.sh
```

Comprueba sintaxis sin ejecutar el script; el archivo debe existir.

Manual: `man bash`

## Bash · VM

```bash
bash -c 'if [ -d /tmp ]; then printf "%s\n" "Directorio disponible"; fi'
```

Ejecuta una condición simple basada en el estado de un directorio.

Manual: `man bash`

## Bash · VM

```bash
bash -c 'for valor in "$@"; do printf "%s\n" "$valor"; done' demo uno 'dos palabras'
```

Procesa argumentos conservando los espacios de cada elemento.

Manual: `man bash`

## Bash · VM

```bash
bash -c 'host=$(hostname); printf "Equipo: %s\n" "$host"'
```

Guarda la salida de un comando en una variable.

Manual: `man bash`

## Sistema y procesos · VM

```bash
systemctl get-default
```

Consulta el target de arranque predeterminado.

Manual: `man systemctl`

## Sistema y procesos · VM

```bash
systemctl --failed
```

Enumera unidades en estado fallido.

Manual: `man systemctl`

## Sistema y procesos · VM

```bash
systemctl status sshd --no-pager
```

Consulta el estado del servicio SSH sin paginador.

Manual: `man systemctl`

## Sistema y procesos · VM

```bash
systemctl is-enabled sshd
```

Comprueba si SSH está habilitado para el arranque.

Manual: `man systemctl`

## Sistema y procesos · VM

```bash
ps -eo pid,ppid,ni,comm,%cpu,%mem --sort=-%cpu
```

Ordena procesos por consumo de CPU y muestra su prioridad nice.

Manual: `man ps`

## Sistema y procesos · VM

```bash
nice -n 10 sha256sum /usr/bin/bash
```

Ejecuta una tarea corta con menor prioridad de CPU.

Manual: `man nice`

## Sistema y procesos · VM

```bash
tuned-adm active
```

Consulta el perfil de ajuste activo si tuned está instalado.

Manual: `man tuned-adm`

## Sistema y procesos · VM

```bash
journalctl -u sshd -n 30 --no-pager
```

Lee los últimos treinta registros de la unidad SSH.

Manual: `man journalctl`

## Sistema y procesos · VM

```bash
journalctl --list-boots
```

Enumera arranques que conserva el journal.

Manual: `man journalctl`

## Sistema y procesos · VM

```bash
journalctl -b -1 --no-pager
```

Consulta el arranque anterior si hay journal persistente.

Manual: `man journalctl`

## Almacenamiento · VM

```bash
lsblk -o NAME,SIZE,TYPE,FSTYPE,UUID,MOUNTPOINTS
```

Identifica discos, sistemas de archivos y UUID antes de intervenir.

Manual: `man lsblk`

## Almacenamiento · VM

```bash
sudo parted --list
```

Inspecciona las tablas de particiones sin modificarlas.

Manual: `man parted`

## Almacenamiento · VM

```bash
sudo pvs
```

Consulta los volúmenes físicos LVM.

Manual: `man pvs`

## Almacenamiento · VM

```bash
sudo vgs
```

Consulta grupos de volúmenes y capacidad libre.

Manual: `man vgs`

## Almacenamiento · VM

```bash
sudo lvs -o lv_name,vg_name,lv_size,devices
```

Consulta volúmenes lógicos y sus dispositivos.

Manual: `man lvs`

## Almacenamiento · VM

```bash
findmnt --verify --verbose
```

Valida las entradas de fstab; no monta ni repara.

Manual: `man findmnt`

## Almacenamiento · VM

```bash
findmnt -t xfs,ext4,vfat,nfs,nfs4
```

Filtra montajes por tipo de sistema de archivos.

Manual: `man findmnt`

## Almacenamiento · VM

```bash
swapon --show
```

Muestra espacios de intercambio activos.

Manual: `man swapon`

## Almacenamiento · VM

```bash
df -hT
```

Consulta uso y tipo de los sistemas de archivos montados.

Manual: `man df`

## Programación y tiempo · VM

```bash
systemctl list-timers --all
```

Enumera temporizadores systemd y sus próximas ejecuciones.

Manual: `man systemctl`

## Programación y tiempo · VM

```bash
crontab -l
```

Lista el cron del usuario actual.

Manual: `man crontab`

## Programación y tiempo · VM

```bash
atq
```

Consulta las tareas at pendientes del usuario.

Manual: `man atq`

## Programación y tiempo · VM

```bash
timedatectl status
```

Consulta zona horaria y estado del reloj.

Manual: `man timedatectl`

## Programación y tiempo · VM

```bash
chronyc sources -v
```

Consulta fuentes de tiempo y su estado de selección.

Manual: `man chronyc`

## Red y SSH · VM

```bash
ip -br address
```

Muestra direcciones de todas las interfaces.

Manual: `man ip-address`

## Red y SSH · VM

```bash
ip route show default
```

Consulta la ruta IPv4 predeterminada.

Manual: `man ip-route`

## Red y SSH · VM

```bash
nmcli connection show
```

Lista perfiles de NetworkManager.

Manual: `man nmcli`

## Red y SSH · VM

```bash
getent hosts server.lab client.lab
```

Consulta resolución de nombres con el mecanismo efectivo del sistema.

Manual: `man getent`

## Red y SSH · VM

```bash
ss -lnt
```

Consulta sockets TCP en escucha.

Manual: `man ss`

## Red y SSH · VM

```bash
ssh vagrant@server.lab
```

Abre una sesión SSH; verifica la huella del host antes de aceptarla.

Manual: `man ssh`

## Red y SSH · VM

```bash
scp vagrant@server.lab:/etc/os-release /tmp/rocky-release-demo
```

Copia un archivo de consulta desde server mediante transporte cifrado.

Manual: `man scp`

## Usuarios y permisos · VM

```bash
getent passwd vagrant
```

Consulta la cuenta vagrant mediante NSS.

Manual: `man getent`

## Usuarios y permisos · VM

```bash
id vagrant
```

Consulta UID y grupos de vagrant.

Manual: `man id`

## Usuarios y permisos · VM

```bash
sudo chage -l vagrant
```

Consulta la política de caducidad de la cuenta.

Manual: `man chage`

## Usuarios y permisos · VM

```bash
sudo -l
```

Enumera las operaciones sudo autorizadas para tu sesión.

Manual: `man sudo`

## Usuarios y permisos · VM

```bash
umask
```

Muestra la máscara de permisos predeterminados de la shell.

Manual: `man bash`

## Usuarios y permisos · VM

```bash
getfacl /tmp/guia-demo
```

Consulta permisos y ACL del directorio de ejemplo.

Manual: `man getfacl`

## Firewall y SELinux · VM

```bash
sudo firewall-cmd --get-active-zones
```

Muestra zonas activas e interfaces asociadas.

Manual: `man firewall-cmd`

## Firewall y SELinux · VM

```bash
sudo firewall-cmd --list-all
```

Consulta la configuración runtime de la zona predeterminada.

Manual: `man firewall-cmd`

## Firewall y SELinux · VM

```bash
sudo firewall-cmd --permanent --list-all
```

Consulta la configuración permanente para compararla con runtime.

Manual: `man firewall-cmd`

## Firewall y SELinux · VM

```bash
getenforce
```

Consulta el modo SELinux efectivo.

Manual: `man getenforce`

## Firewall y SELinux · VM

```bash
ls -Zd /var/www/html
```

Consulta el contexto SELinux de un directorio.

Manual: `man ls`

## Firewall y SELinux · VM

```bash
ps -eZ
```

Muestra contextos de procesos.

Manual: `man ps`

## Firewall y SELinux · VM

```bash
sudo restorecon -nRv /var/www/html
```

Simula la restauración de contextos, sin aplicar cambios gracias a -n.

Manual: `man restorecon`

## Firewall y SELinux · VM

```bash
sudo semanage port -l
```

Lista las etiquetas de puerto de SELinux.

Manual: `man semanage-port`

## Firewall y SELinux · VM

```bash
getsebool httpd_can_network_connect
```

Consulta un booleano de SELinux.

Manual: `man getsebool`

## Podman · complemento · VM

```bash
podman info
```

Consulta el entorno de contenedores del usuario; complemento de preparación.

Manual: `man podman-info`

## Podman · complemento · VM

```bash
podman pull docker.io/library/alpine:3.22
```

Descarga una imagen por nombre completo; requiere red y espacio.

Manual: `man podman-pull`

## Podman · complemento · VM

```bash
podman run --rm docker.io/library/alpine:3.22 cat /etc/os-release
```

Ejecuta un contenedor temporal y lo elimina al terminar.

Manual: `man podman-run`

## Podman · complemento · VM

```bash
podman ps --all
```

Lista contenedores activos y detenidos del usuario.

Manual: `man podman-ps`

## Podman · complemento · VM

```bash
podman images
```

Lista imágenes locales.

Manual: `man podman-images`

## Anfitrión · Vagrant · Anfitrión

```bash
vagrant up --provider=virtualbox
```

Crea/inicia las VMs definidas en el kit.

Manual: `vagrant help up`

## Anfitrión · Vagrant · Anfitrión

```bash
vagrant ssh server
```

Abre SSH en server. Sustituye server por client para el otro nodo.

Manual: `vagrant help ssh`

## Anfitrión · Vagrant · Anfitrión

```bash
vagrant halt
```

Apaga normalmente las dos VMs.

Manual: `vagrant help halt`

## Anfitrión · Vagrant · Anfitrión

```bash
vagrant destroy
```

Elimina las VMs y sus discos tras confirmación. Revisa y respalda antes.

Manual: `vagrant help destroy`
