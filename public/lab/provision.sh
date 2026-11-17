#!/usr/bin/env bash
# Preparación de la VM. No configura las respuestas de los ejercicios.
set -euo pipefail
source /etc/os-release
if [[ "${ID}" != "rocky" || ! "${VERSION_ID%%.*}" =~ ^(9|10)$ ]]; then
  echo 'Este provisionador requiere Rocky Linux 9 o 10.' >&2; exit 1
fi
node="${1:-}"
lab_timezone="${2:-UTC}"
if [[ "$node" != "server" && "$node" != "client" ]]; then
  echo 'Uso: provision.sh server|client [UTC|America/Montevideo]' >&2; exit 1
fi
if [[ "$lab_timezone" != "UTC" && "$lab_timezone" != "America/Montevideo" ]]; then
  echo 'Timezone admitido: UTC o America/Montevideo.' >&2; exit 1
fi
# Descargas limitadas para el perfil base de 1 GiB de RAM.
dnf -y --setopt=max_parallel_downloads=1 upgrade
dnf -y --setopt=max_parallel_downloads=1 --setopt=install_weak_deps=False install \
  vim-enhanced bash-completion man-db man-pages info less findutils procps-ng \
  iproute iputils bind-utils curl wget rsync tar gzip bzip2 util-linux \
  openssh-clients openssh-server sudo NetworkManager firewalld chrony \
  policycoreutils-python-utils lvm2 xfsprogs e2fsprogs dosfstools parted \
  nfs-utils autofs at cronie tuned flatpak podman python3
timedatectl set-timezone "$lab_timezone"
hostnamectl set-hostname "${node}.lab"
systemctl enable --now sshd NetworkManager firewalld
install -d -m 0755 /opt/ex200 /srv/ex200
install -m 0755 /tmp/ex200-verify.py /opt/ex200/verify.py
rm -f /tmp/ex200-verify.py
if [[ ! -f /opt/ex200/access.log ]]; then
  cat > /opt/ex200/access.log <<'DATA'
2026-11-01T09:00:00 INFO servicio disponible
2026-11-01T09:01:00 ERROR solicitud 41 sin respuesta
2026-11-01T09:02:00 INFO comprobacion iniciada
2026-11-01T09:03:00 ERROR recurso 52 no encontrado
2026-11-01T09:04:00 ERROR tiempo agotado en solicitud 61
DATA
  chmod 0644 /opt/ex200/access.log
fi
# Bloque gestionado: repetir el provisioning no duplica estas entradas.
sed -i '/^# BEGIN EX200 LAB$/,/^# END EX200 LAB$/d' /etc/hosts
cat >> /etc/hosts <<'HOSTS'
# BEGIN EX200 LAB
192.168.56.10 server.lab server
192.168.56.20 client.lab client
# END EX200 LAB
HOSTS
printf '%s\n' 'Base lista. Revisa red, discos y actualizaciones; reinicia y crea un snapshot.'
