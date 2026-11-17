# Linux Lab · Preparación RHCSA EX200

Aplicación web para practicar administración de sistemas sobre **Rocky Linux 10**, con dos máquinas virtuales locales: `server` y `client`.

Incluye **40 laboratorios y 32 retos de simulacro**, interfaz **ES/EN** y puntuación de entrenamiento sobre **300 puntos**, siguiendo el ciclo **aprender → practicar → romper → diagnosticar → reparar → documentar**.

## Qué hace

- Ofrece prácticas guiadas que puedes pausar y reanudar.
- Incluye un simulacro de **dos horas exactas**, con navegación entre ejercicios.
- Guarda el progreso, el historial y la bitácora de cada usuario.
- Proporciona ejemplos de comandos, descripciones y referencias a `man`.
- Orienta el diagnóstico sin revelar directamente las soluciones.
- Comprueba las configuraciones de ambas VMs antes y después de reiniciarlas para verificar su persistencia.

## Ejecutar localmente

### Requisitos

- Windows, macOS o Linux con **Node.js 24 LTS**.
- Un proyecto de **Supabase** para almacenar los datos PostgreSQL.
- **Python 3, Vagrant y VirtualBox** para ejecutar el laboratorio y conectar las VMs.

La aplicación se ejecuta en tu equipo y utiliza Supabase como base de datos.

### 1. Instalar dependencias

Abre una terminal en la carpeta del proyecto, donde está `package.json`:

```bash
npm ci
```

### 2. Configurar el entorno

Copia `.env.example` como `.env`. Obtén la conexión PostgreSQL desde **Connect** en tu proyecto de Supabase y completa:

```dotenv
DATABASE_URL=TU_CONEXION_POSTGRESQL
DATABASE_CA_CERT=""
APP_ORIGIN=http://127.0.0.1:4173
REGISTRATION_MODE=closed
REGISTRATION_CODE=""
```

Si la conexión requiere la CA de tu proyecto, coloca su contenido PEM en `DATABASE_CA_CERT`. No compartas el archivo `.env`.

### 3. Preparar la base de datos e iniciar

```bash
npm run db:migrate
npm run db:check
npm run admin:create -- --username admin
npm run dev
```

La creación del administrador solicita una contraseña en la terminal. Después, abre [http://127.0.0.1:4173/](http://127.0.0.1:4173/) e inicia sesión con esa cuenta.

### 4. Conectar el laboratorio

Descarga el kit de VMs desde la aplicación. En la carpeta que contiene el `Vagrantfile`, ejecuta:

```bash
vagrant up
```

Desde la carpeta del agente, ejecútalo con el origen de la aplicación:

```bash
python3 agent.py --site http://127.0.0.1:4173
```

En Windows utiliza `py -3` en lugar de `python3`. Introduce el código temporal del agente en **Verificación de VMs** para completar el emparejamiento.

Las fichas de **Dentro del kit** se abren en otra pestaña con instrucciones, comandos copiables y **Imprimir / Guardar PDF**.

## Autor

**Antonio José Lorenzo**

- [LinkedIn](https://www.linkedin.com/in/antoniojoselorenzo)
- [Portafolio web](https://antoniojlorenzodev.vercel.app/)

## Aviso

Guía independiente de preparación. No es un examen oficial ni está afiliada, patrocinada o avalada por Red Hat. Los resultados de práctica no garantizan aprobar. Red Hat, RHEL, RHCSA y EX200 son marcas de sus respectivos titulares.
