# Linux Lab · RHCSA EX200 Preparation

**Learn. Solve. Repeat.**

An interactive web platform for hands-on Linux system administration practice on **Rocky Linux 10**, backed by two local virtual machines (`server.lab` and `client.lab`) and a cloud-synced progress tracker powered by **Node.js**, **PostgreSQL on Supabase** (with Row Level Security), and **Vercel**.

Designed around **40 guided labs** and a **32-challenge full mock exam** covering **62 EX200 study objectives**, Linux Lab follows an engineering-first learning loop:

> **Learn → Practice → Break → Diagnose → Repair → Document**

![Linux Lab Workspace Dashboard](docs/01-dashboard.png)

---

## How It Works

Unlike browser-only terminal simulators, Linux Lab pairs a web study environment with **real local virtual machines** running on your workstation:

1. **Provision Local VMs:** Download the VM kit from the app and boot two isolated Rocky Linux 10 nodes (`server.lab` and `client.lab`) over a private host-only network using Vagrant and VirtualBox.
2. **Pair the Local Agent:** Run the lightweight Python bridge (`agent.py` on port `8765`) and link it to your browser session with a one-time pairing code.
3. **Practice or Take a Mock Exam:** Work through guided labs at your own pace—or enter the strict 2-hour EX200 mock exam mode—executing real administration tasks (LVM, SELinux, firewalld, systemd, Podman, NFS/autofs, boot recovery, and more).
4. **Verify Reboot Persistence:** When you validate a finished attempt, the local probe inspects both VMs via SSH, records a baseline, triggers a real `vagrant reload` on each node, and re-collects state—crediting persistence **only** if the machine identity matches, the `boot ID` changed, and your configuration survived the reboot.

---

## Key Features & Visual Tour

### 1. Guided Labs (40 Scenarios · 10 EX200 Domains + Podman)
- **Structured Curriculum:** 40 hands-on labs spanning all 10 official RHCSA EX200 domains plus a dedicated **Podman** container module, filterable by topic, difficulty (`Fundamentals`, `Intermediate`, `Advanced`), target node, and completion status.
- **Six-Perspective Workflow:** Each lab provides a clear mission brief, estimated duration, targeted hints (without spoiling the answer), controlled failure drills, and a structured logbook prompt.
- **Pause & Resume:** Start a lab, pause your session at any time, and pick up right where you left off with automatic cloud state persistence.

| Labs Catalog & Domain Filters | Inside a Guided Lab Mission |
| :---: | :---: |
| ![40 Guided Labs Catalog](docs/02-labs-catalog.png) | ![Guided Lab Mission View](docs/03-lab-mission.png) |

---

### 2. Full 2-Hour EX200 Mock Exam (32 Challenges · 62 Objectives)
- **Authentic Exam Conditions:** An exact **02:00:00** countdown with a fixed deadline that persists even if you close or reload the browser tab.
- **Free Challenge Navigation:** Jump forward, move back, or review any of the 32 focused challenges across all 10 exam areas in whatever order you choose.
- **Zero-Hint Assessment Mode:** Hints and pauses are disabled during active mock attempts; detailed objective breakdowns and manual references are unlocked upon completion.

![Full EX200 Mock Exam Mode](docs/04-mock-exam.png)

---

### 3. Dual-VM Lab Architecture & Reboot Persistence Verification
Your local lab mirrors a real client-server administration topology on a private host-only network (`192.168.56.0/24`):

| Node | IP Address | Default Specs | Primary Focus Areas |
| :--- | :--- | :--- | :--- |
| **`server.lab`** | `192.168.56.10/24` | 1 vCPU · 1 GiB RAM · 25 GiB disk *(+2 optional 8 GiB disks)* | System services, storage/LVM, SELinux, firewall, and Podman |
| **`client.lab`** | `192.168.56.20/24` | 1 vCPU · 1 GiB RAM · 25 GiB disk *(+1 optional 8 GiB disk)* | Remote SSH access, network diagnostics, NFS/autofs, and Flatpak |

> *Note: The VM kit defaults to **Rocky Linux 10** and includes `Vagrantfile.rocky9` as an explicit alternative without mixing OS versions inside a session.*

| Local VM Environment (`server` & `client`) | Local Agent Pairing & Reboot Persistence Check |
| :---: | :---: |
| ![Local Virtual Machines](docs/05-local-machines.png) | ![Agent Pairing and Reboot Validation](docs/06-reboot-validation.png) |

---

### 4. Executable Command Reference & Study Logbook
- **95 Executable Examples:** Searchable reference library of 95 real-world administration commands complete with descriptions, execution context (host vs. VM), `man` page pointers, and offline export.
- **Progress Analytics & Logbook (*Bitácora*):** Track completed labs (`0/40`), total practice time, syllabus coverage percentage, session history, and personal troubleshooting notes—with full profile backup/export support.

![Command Reference Library](docs/07-command-reference.png)

---

## Tech Stack & Architecture

- **Web Application & API:** Node.js (ES Modules) + `pg` (`node-postgres` connection pooling)
- **Database & Security:** Supabase (PostgreSQL) under a dedicated `linux_lab` schema with **Row Level Security (RLS)** enforced across all tables (`study_profiles`, `study_progress`, `study_sessions`, `vm_reports`, `admin_events`, `auth_limits`, `deletion_intents`)
- **Cloud Hosting:** Vercel (Serverless Functions + strict CA-verified SSL/TLS database connections)
- **Local Lab Bridge:** Python 3 local verification agent (`agent.py`, default port `8765`), HashiCorp Vagrant, and Oracle VirtualBox

---

## Getting Started (Local Setup)

### Prerequisites
- **Node.js 24 LTS** (or Node.js `20.12+` for native `--env-file-if-exists` support)
- A [Supabase](https://supabase.com/) project for PostgreSQL storage
- **Python 3**, **Vagrant**, and **VirtualBox** (for running and verifying the local VMs)

### 1. Clone and Install Dependencies

```bash
git clone https://github.com/your-username/linux-lab-vercel-supabase.git
cd linux-lab-vercel-supabase
npm ci
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Obtain your PostgreSQL connection string from **Connect** in your Supabase dashboard and configure `.env`:

```dotenv
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-1-us-east-1.pooler.supabase.com:6543/postgres
DATABASE_CA_CERT=""
APP_ORIGIN=http://127.0.0.1:4173
REGISTRATION_MODE=closed
REGISTRATION_CODE=""
```

> **SSL Certificate Note:** If your Supabase connection requires root CA verification, download `prod-ca-2021.crt` from **Supabase → Project Settings → Database → SSL Configuration** and store its single-line PEM string in `DATABASE_CA_CERT`:
> ```bash
> node -e 'const fs = require("fs"); console.log("DATABASE_CA_CERT=" + fs.readFileSync("prod-ca-2021.crt", "utf8").trim().replace(/\r?\n/g, "\\n"));'
> ```


### 3. Migrate Database, Create Admin, and Start the App

```bash
npm run db:migrate
npm run db:check
npm run admin:create -- --username admin
npm run dev
```

`admin:create` will prompt you for a password in the terminal. Once the server starts, open [http://127.0.0.1:4173/](http://127.0.0.1:4173/) and sign in with your administrator account.

### 4. Boot and Pair Your Local VMs

1. Download the VM kit from the **Mis máquinas** (*My Machines*) section inside the app.
2. In the folder containing the `Vagrantfile`, provision both virtual machines:
   ```bash
   vagrant up
   ```
3. From the agent directory, start the local verification bridge pointing to your app origin:
   ```bash
   python3 agent.py --site http://127.0.0.1:4173
   ```
   *(On Windows, use `py -3` instead of `python3`.)*
4. Enter the temporary pairing code displayed by the agent into **VM Verification** in the web interface to complete pairing.

---

## Deploying to Vercel

1. Import this repository into **Vercel** and open **Settings → Environment Variables**.
2. Add the following production variables:
   - `DATABASE_URL`: Supabase **Transaction Pooler** URI (port `6543`, without `?sslmode` query parameters) to prevent connection exhaustion in serverless functions.
   - `DATABASE_CA_CERT`: Single-line PEM string of your Supabase root CA certificate (`\n`-escaped).
   - `APP_ORIGIN`: Your public Vercel URL (e.g., `https://your-project.vercel.app`).
   - `REGISTRATION_MODE` & `REGISTRATION_CODE`: Set according to your access policy (`open` or `closed`).
3. Trigger a **Deploy** and verify the function logs.

---

## Project Structure

```text
linux-lab-vercel-supabase/
├── docs/
│   └──                     # UI screenshots referenced in this README
├── scripts/
│   └── check-db.mjs       # Verifies SSL connection, linux_lab schema, and RLS policies
├── server/
│   └── db.js              # Configures pg.Pool, CA validation, and transactions
├── .env.example           # Environment variable template
├── .gitignore             # Excludes secrets (.env, *.crt), VMs (.vagrant, *.box), and artifacts
└── package.json           # Application scripts and dependencies
```

---

## Author

**Antonio Jose Lorenzo**

- [LinkedIn](https://www.linkedin.com/in/antoniojoselorenzo)
- [Web Portfolio](https://antoniojlorenzodev.vercel.app/)

---

## Disclaimer

Independent study and practice guide. This project is not an official certification exam and is not affiliated with, sponsored, or endorsed by Red Hat. Practice results do not guarantee passing the official exam. Red Hat, RHEL, RHCSA, and EX200 are trademarks of their respective owners.

## License

This project is licensed under the [MIT License](LICENSE).

Copyright (c) 2026 Antonio Jose Lorenzo.