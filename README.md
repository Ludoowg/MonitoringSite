# Monitoring Site — DevOps (local deployment)

**Stack:** React + Vite (frontend) · Node.js + Express + Prisma (backend) · PostgreSQL · Nginx · Docker · Jenkins

**Pipeline:** npm audit · OWASP Dependency-Check · SonarQube · Docker image build · Trivy · push to Docker Hub

---

## Introduction

I built a website monitoring application: users can register URLs to watch, run health checks, and review status and history. The stack is a React frontend for the UI, a Node.js backend with Prisma for the API and data access, and PostgreSQL for persistent storage.

To keep quality and security under control, I use Jenkins for CI/CD. The pipeline runs dependency checks (npm audit and OWASP Dependency-Check), static analysis with SonarQube on backend and frontend separately, then builds Docker images for both services. Trivy scans those images before they are pushed to my Docker registry. This README documents version 1 of the project: local DevOps setup and the full pipeline.

![CI/CD pipeline monitoringsite project](docs/images/cicdpipeline.png)


---

## Table of contents

1. [Project overview & goals](#1-project-overview--goals)
2. [Architecture](#2-architecture)
3. [Application stack](#3-application-stack)
4. [Local development](#4-local-development)
5. [Docker & containerization](#5-docker--containerization)
6. [CI/CD with Jenkins](#6-cicd-with-jenkins)


---

## 1. Project overview & goals

### What the application does

Monitoring Site is a lightweight uptime monitoring tool. You register **monitors** (URLs to watch), run **checks** against them, and see whether each site is responding correctly.

Each check measures the HTTP response and assigns a status:

| Status | Meaning |
|--------|---------|
| **UP** | Response OK (2xx–3xx) within the configured threshold |
| **SLOW** | Response OK but slower than the threshold |
| **DOWN** | HTTP error (4xx/5xx) or network failure |
| **UNKNOWN** | Monitor created but not checked yet |

The UI is split into four main views:

- **Dashboard** — global summary (counts of UP / DOWN / SLOW), recent checks, and monitor overview
- **Monitors** — list of registered sites, add/delete monitors, trigger a manual check
- **Monitor details** — history of checks for one monitor
- **Checks** — full history of all checks across every monitor

![monitor page](docs/images/monitormonito.png)

![checks page](docs/images/checksmonito.png)

### Use case

The app targets a simple operational need: know quickly if a website or API endpoint is reachable and how fast it responds. It is a **V1 POC** — suitable for personal use, demos, or learning — not a multi-tenant SaaS with authentication or alerting yet.

### Version 1 — scope

**Included:**

- Full-stack app (React + Vite frontend, Node.js + Express + Prisma backend, PostgreSQL)
- Containerized with Docker (separate images for backend and frontend, Nginx reverse proxy)
- Runnable locally via Docker Compose (dev and prod compose files)
- Automated tests (Jest backend, Vitest frontend) with coverage
- Jenkins CI/CD pipeline: npm audit, OWASP Dependency-Check, SonarQube, Docker build, Trivy scan, push to Docker Hub

**Out of scope for V1:**

- Production deployment on a remote server (images are built and pushed, but deploy is manual)
- Kubernetes orchestration
- Infrastructure monitoring (Prometheus, Grafana)
- User accounts, roles, or email/Slack alerts

### V2 — planned direction

Move from Docker Compose on a single machine to Kubernetes, and add observability (Prometheus + Grafana) to monitor the monitoring platform itself.

### Learning goals

The main objective of this first version is to understand the full lifecycle of a full-stack application with DevOps practices: design the app, write and run tests, containerize services, wire a CI/CD pipeline, and apply security and quality checks before publishing images. Docker Compose and Jenkins are the foundation; Kubernetes comes in V2.

---


## 2. Architecture

### Request flow

When a user opens the app, everything goes through the **browser**. The only service exposed on the host is the **reverse-proxy Nginx** (`localhost:8081`).

**Loading the UI (`/`):**

```
Browser → Nginx (reverse proxy, :8081)
        → Frontend container (Nginx static server, :80)
        → React build (HTML / JS / CSS)
```

**API calls (`/api/...`):**

```
Browser → Nginx (reverse proxy, :8081)
        → Backend (Express, :3000)
        → PostgreSQL (via Prisma)
```

### Services (4 containers)

| Service | Role | Exposed to host? |
|---------|------|------------------|
| **nginx** | Reverse proxy — routes `/` and `/api/` | Yes (`8081:80`) |
| **frontend** | Serves the built React app (Nginx as static file server) | No (internal only) |
| **backend** | REST API (Express + Prisma) | No (internal only) |
| **postgres** | Persistent data storage | No (internal only) |


### Docker network

All services run on the same bridge network: `monitoring-network`. Containers resolve each other by **service name** (`frontend`, `backend`, `postgres`) — Docker’s embedded DNS. 

Only Nginx publishes a port to the host. Backend, frontend, and Postgres stay on the internal network. That **reduces the attack surface**: fewer entry points from outside Docker, even though services still talk to each other inside the stack.

### Dev vs prod Compose files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | **Local dev** — builds images from `backend/Dockerfile` and `frontend/Dockerfile` (`build:`) |
| `docker-compose.prod.yml` | **Prod-like run** — pulls pre-built images from Docker Hub (`image: ludoowg/monitoring-site-*`) |

### Two Nginx layers (frontend only)

For page requests, traffic passes through two Nginx instances: the **reverse proxy** (routing) and the **static file server** inside the frontend image (serving the Vite build). They are not redundant — each image stays self-contained.

---


## 3. Application stack

### 3.1 Frontend (React + Vite)

Main pages: **Dashboard**, **Monitors**, **Monitor details**, **Checks** — routed with React Router. Data fetching uses React Query (`@tanstack/react-query`) and HTTP calls go through a shared Axios client.

The API base URL is set with `VITE_API_URL` so the same build can target different environments. In Docker, the variable is passed as a **build argument** because Vite injects it into the static bundle at compile time.

The production build is copied into an Nginx image and served on port 80 inside the frontend container.

### 3.2 Backend (Node.js + Express + Prisma)

The backend uses Prisma as an ORM to talk to PostgreSQL — not to communicate with the frontend.

The Prisma schema defines two models: `Monitor` and `Check`, plus enums `MonitorStatus` and `CheckStatus`. A monitor is a URL to watch; a check stores the result of one HTTP probe (status, response time, errors).

Main API routes (all under `/api`):

- `GET /api/health` — backend liveness check (used by Docker healthcheck)
- CRUD on `/api/monitors` and manual checks via `POST /api/monitors/:id/check`
- `GET /api/checks` and per-monitor check history

At container startup, `prisma migrate deploy` runs before `npm start`, so the database schema matches the code before any request is handled.

---

## 4. Local development

Developed on macOS (Apple Silicon) with Node.js and Docker Desktop.

**Prerequisites:** Node.js 20+, Docker Desktop, Git.

Environment variables live in `.env` files (never committed). Example files document required keys:

| File | Used for |
|------|----------|
| `.env.example` | Root — Docker Compose (`DATABASE_URL`, Postgres, `VITE_API_URL`, `PORT`) |
| `backend/.env.example` | Backend without Docker (`PORT=5000`, local Postgres URL) |
| `frontend/.env.example` | Frontend without Docker (`VITE_API_URL` → backend on port 5000) |

Copy examples before first run:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

### Run without Docker

You need a local PostgreSQL instance matching `DATABASE_URL` in `backend/.env`.

```bash
cd backend
npm install
npx prisma migrate dev
npm run dev
```

```bash
cd frontend
npm install
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend (Vite) | http://localhost:5173 |
| Backend API | http://localhost:5000/api |
| Health check | http://localhost:5000/api/health |

### Run with Docker Compose

From the project root:

```bash
docker compose up --build
```

This builds and starts nginx, frontend, backend, and PostgreSQL. Postgres uses a named volume for data persistence. Prefer pinning the Postgres image (e.g. `postgres:16-alpine`) in Compose to avoid breaking changes on the `latest` tag.

| Service | URL |
|---------|-----|
| Application (via Nginx) | http://localhost:8081 |
| API health | http://localhost:8081/api/health |

If you want to run the project locally using the pre-built Docker images, you can use the production Compose file:

```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

This will pull the backend and frontend images from the Docker image repositories configured in `docker-compose.prod.yml`, instead of rebuilding them locally from the Dockerfiles.

If a deployment introduces an issue, the application can be rolled back by changing the image tag in `docker-compose.prod.yml` to a previous `$GIT_COMMIT` tag and restarting the services:

```bash
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

Using Git commit tags makes deployments more traceable and allows the application to be restored to a previously validated image version.

![docker compose up](docs/images/dockercomposeup.png)

---

## 5. Docker & containerization


### Docker Images and Build Strategy

The project uses two separate Docker images: one for the frontend and one for the backend.
This separation makes the architecture easier to maintain because both services have different technologies, dependencies and runtime requirements. It also allows each service to be built, updated, scanned and deployed independently without affecting the other one.
Both Dockerfiles use multi-stage builds in order to reduce the final image size and keep only the files required at runtime.
For the frontend image, the Docker Compose configuration passes `VITE_API_URL` as a build argument. This is required because Vite environment variables are injected at build time into the generated static files, instead of being read dynamically at container runtime.
The backend Dockerfile generates the Prisma Client during the image build. At container startup, the backend runs Prisma migrations with `prisma migrate deploy` before starting the Node.js server. This ensures that the database schema is up to date before the application starts handling requests.
Both the frontend and backend folders include a `.dockerignore` file to reduce the Docker build context. This prevents unnecessary or sensitive files such as `node_modules`, `.env`, coverage reports, cache files and local development artifacts from being sent to the Docker daemon during the build.


---

## 6. CI/CD with Jenkins

This project includes a Jenkins CI/CD pipeline used to automate testing, code quality analysis, security checks, Docker image builds and image publishing.
Jenkins runs locally inside a Docker container and must be configured with the required tools and plugins, including Node.js, OWASP Dependency-Check, SonarQube Scanner, Docker and the HTML Publisher plugin.
To avoid keeping too many old build files and reports, the pipeline is configured to keep only the last 30 builds and the last 30 archived artifacts.

### Pipeline Overview

The Jenkins pipeline is composed of several stages:

![jenkins step](docs/images/jenkinsstep.png)

#### 1. Install Dependencies

The pipeline starts by installing backend and frontend dependencies in parallel.
It uses `npm ci` instead of `npm install` to ensure deterministic dependency installation based on the `package-lock.json` file. This makes CI/CD and Docker builds more reproducible and prevents unexpected dependency updates during automated builds.

#### 2. Tests and Build Validation

The backend and frontend are tested in parallel.
For the backend, the pipeline runs Jest tests with coverage and executes `npx prisma validate` to make sure the Prisma schema is valid.
For the frontend, the pipeline runs Vitest tests with coverage and also executes a production build. This build validation ensures that the React/Vite application can be compiled successfully before creating the Docker image.

#### 3. NPM Audit

The pipeline runs `npm audit` on both the backend and the frontend dependencies.
The audit is configured to detect high severity vulnerabilities. During development, this stage is wrapped with `catchError` so that detected vulnerabilities mark the build as unstable instead of completely stopping the workflow.

#### 4. OWASP Dependency-Check

OWASP Dependency-Check is used to complement `npm audit` by scanning the backend and frontend dependencies for known CVEs.
The scan is executed on both folders and generates a global dependency report. The HTML report is then published in Jenkins, making it easier to review vulnerable dependencies, CVE references and possible remediation actions.

![owasp](docs/images/owaspcheck.png)

#### 5. SonarQube Analysis

SonarQube is used to analyze code quality, maintainability, reliability, test coverage and potential bugs.
The backend and frontend are analyzed as two separate SonarQube projects. This separation makes the results easier to understand because both parts of the application have different codebases, test reports and responsibilities.

SonarQube helps detect issues such as:
- bugs
- code smells
- duplicated code
- maintainability issues
- reliability issues
- test coverage gaps

The pipeline also uses a Quality Gate to decide whether the code quality is acceptable before continuing.

![sonarqube](docs/images/sonarqube.png)

#### 6. Docker Image Build

After the code, tests and security checks have been validated, the pipeline builds two separate Docker images:

- `ludoowg/monitoring-site-backend`
- `ludoowg/monitoring-site-frontend`

Each image is built with two tags:

- `$GIT_COMMIT`, to keep a precise and traceable version of the image
- `latest`, to identify the most recent build

Using separate images for the backend and frontend makes it possible to update, scan and deploy each service independently.

#### 7. Trivy Image Scan

Trivy scans both images for `HIGH` and `CRITICAL` vulnerabilities. Table output appears in the Jenkins logs; JSON reports are archived as artifacts.

Unlike the SonarQube Quality Gate (`abortPipeline: true`), Trivy is configured with `--exit-code 0`, so **the pipeline does not fail** when vulnerabilities are found — results are for review before push. To block the build on critical CVEs, set `--exit-code 1` (or a dedicated threshold).

![trivy](docs/images/trivyscanning.png)


#### 8. Push to Docker Hub

Once the images have been built and scanned, the pipeline pushes them to Docker Hub.
Both the `$GIT_COMMIT` and `latest` tags are pushed for the backend and frontend images.
The images are publicly available on Docker Hub and can be pulled to run the application without rebuilding it locally.

![dockerhub](docs/images/dockerhub.png)

---

## Quick reference

| Context | Command |
|---------|---------|
| Dev stack (build) | `docker compose up --build` |
| Prod-like stack (pull) | `docker compose -f docker-compose.prod.yml pull && docker compose -f docker-compose.prod.yml up -d` |
| API health (Docker) | `curl http://localhost:8081/api/health` |
| Docker Hub images | `ludoowg/monitoring-site-backend`, `ludoowg/monitoring-site-frontend` |

