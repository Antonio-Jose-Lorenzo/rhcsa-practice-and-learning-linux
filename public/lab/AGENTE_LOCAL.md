# Conectar las dos VMs y comprobar persistencia

Esta es una guía independiente de preparación, no un examen oficial ni un producto afiliado, patrocinado o avalado por Red Hat. Los escenarios son originales, sin preguntas reales del examen. Red Hat, RHEL, RHCSA y EX200 son marcas de sus respectivos titulares. El resultado no garantiza aprobar una certificación.

## Preparación

1. Descarga el kit actualizado y descomprímelo junto al estado de Vagrant de tus VMs de laboratorio. Mantén juntos Vagrantfile, agent.py, vm_probe.py y catalog-contract.json. No sobrescribas un Vagrantfile personalizado sin conservar tus cambios.
2. Necesitas Python 3.9 o posterior y Vagrant en el anfitrión. No requiere pip ni un servidor SSH en tu equipo. Las VMs necesitan Python 3 y el acceso de administración habitual de Vagrant.
3. Inicia ambas VMs con `vagrant up`. Confirma `vagrant ssh server` y `vagrant ssh client`. Dentro de cada VM, el hostname corto debe ser server o client y la distribución Rocky 9/10.
4. Guarda una base limpia y prepara los discos adicionales antes del reloj. Las prácticas del simulacro se ejecutan dentro de las VMs, nunca en tu equipo principal.

## Emparejamiento

Desde la carpeta del kit, en el anfitrión:

```powershell
# Windows / PowerShell
py -3 agent.py --site https://TU-DOMINIO
```

```bash
# macOS Intel o Linux
python3 agent.py --site https://TU-DOMINIO
```

Abre la URL privada en una pestaña completa del navegador e inicia sesión con tu perfil de estudio. En **Verificación de VMs**, copia el código temporal que imprime tu terminal y pulsa **Conectar con mi agente**. El código permanece en memoria de la pestaña; vuelve a emparejar después de recargar. No compartas el código ni lo guardes en tus notas.

Usa Chrome o Edge de escritorio actualizado. Si aparece el permiso de acceso a red local, debes autorizarlo para conectar a tu propio agente. Las políticas del equipo y otros navegadores pueden bloquear esta comunicación HTTPS → loopback. No desactives las protecciones del navegador para evitarlo; usa un navegador compatible. Safari/Firefox no se presentan como compatibles con este flujo sin validación adicional.

Si el puerto 8765 está ocupado, usa `python3 agent.py --site https://TU-DOMINIO --port 8766` (o `py -3` en Windows) y cambia el puerto del formulario. El servidor siempre escucha en **127.0.0.1**, sin exposición LAN ni Internet. Solo acepta el origen exacto del sitio y un token temporal. El agente no permite enviar comandos arbitrarios desde la web.

## Recorrido de validación

1. Resuelve los retos en tus VMs y documenta dentro del plazo los pasos transitorios. Las marcas Preparado y Revisar son organización personal, no un resultado técnico.
2. El simulacro tiene 7200 segundos exactos. Al terminar, se bloquean sus notas y sus marcas. La comparación posterior no añade tiempo de resolución.
3. En los resultados pulsa **Recopilar, reiniciar ambas VMs y validar**. Se lee siempre server y client, aunque no hayas marcado nada como preparado.
4. El agente envía la sonda por Vagrant SSH y recoge estado, machine-id y boot ID. La web guarda la primera lectura como referencia del intento, vinculada a tu perfil.
5. Ejecuta un reinicio normal mediante `vagrant reload server` y `vagrant reload client`, esperando el regreso de SSH. No se reprovisiona ni se corrigen los retos.
6. Recoge ambos nodos otra vez. El resultado requiere las mismas identidades de máquina y boot IDs diferentes en las dos VMs. Los controles persistentes deben cumplir en ambas lecturas y conservar su huella de configuración.
7. Consulta en cada criterio las observaciones anteriores y posteriores. Los controles técnicos, los controles con documentación adicional y las acciones documentales se identifican por separado.

La primera referencia se conserva si reintentas. Si una configuración ya fallaba en esa referencia, arreglarla después no acredita que cumplía al cerrar ese intento; practica de nuevo en otro intento. Validar inmediatamente al cerrar reduce el intervalo sin observación. La guía no puede demostrar cuándo hiciste cambios antes de su primera lectura: no es una plataforma de examen supervisado ni una prueba resistente a manipulación.

Si se cierra el navegador, reinicia el agente y empareja otra vez. Puedes reintentar la validación del intento pendiente contra su referencia original. Si falla SSH, el arranque o un nodo no se identifica, queda pendiente; no se transforma en aprobado por una marca manual. Revisa la consola y los requisitos antes de repetir. No restaures snapshots durante la comparación: pueden volver a un arranque anterior o reemplazar el trabajo.

## Alcance de las comprobaciones

La sonda lee inventarios y ajustes y ejecuta pruebas funcionales acotadas: SSH no interactivo entre nodos, lectura autofs, conectividad, HTTP y pruebas de scripts con fixtures temporales como vagrant. No aplica reparaciones, formatea discos ni instala paquetes. Las pruebas de script ejecutan tu código como vagrant y deben realizarse únicamente en estas VMs desechables.

Los hechos persistentes se comprueban directamente cuando existe un criterio observable: servicios, red, usuarios, permisos, archivos, LVM, montajes, swap, firewall, contextos y booleanos SELinux. Algunas acciones no se demuestran solo mirando el estado final: borrar un usuario temporal, parar y volver a iniciar un servicio, usar una consola de recuperación o consultar man. Se recoge contexto real de las VMs, pero esos pasos requieren tu registro de ejecución y se muestran como **documentales / autoevaluación**. Los controles parciales requieren también documentación y no se completan si su control técnico falla.

No se transmiten claves privadas, contraseñas ni hashes de contraseñas. Se almacenan observaciones del laboratorio, hashes de archivos de práctica, identificadores de máquina/arranque y contexto de servicios/configuraciones. No incluyas secretos en notas, scripts o archivos de demostración. Los informes se vinculan a tu perfil dentro del sitio privado.

## Cerrar

Pulsa Ctrl+C en la terminal del agente. El token deja de funcionar cuando acaba ese proceso. La web conserva tus resultados y tu bitácora en el perfil; puedes exportar un respaldo.


## Edición Vercel y Supabase

Esta copia usa cuentas propias y PostgreSQL de Supabase; no necesita la identidad de ChatGPT. Consulta el README principal del proyecto para configurar acceso y almacenamiento. Sustituye TU-DOMINIO por el origen real; el agente exige --site y no acepta rutas.
