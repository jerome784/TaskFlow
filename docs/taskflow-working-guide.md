# TaskFlow Working Guide

Generated on: 2026-04-29

## 1. Project Summary

TaskFlow is a team task management SaaS application. The frontend is built with React, Vite, Tailwind CSS, React Query, Zustand, and Axios. The backend is built with Java 17 and Spring Boot 3, using Spring Security, JWT authentication, Spring Data JPA, PostgreSQL, Actuator, and Prometheus metrics.

The application lets users register, log in, select a workspace purpose, create projects, assign tasks, update task status, view reports, manage roles, and export task reports.

## 2. Runtime Architecture

Browser users open the React frontend. React sends HTTP requests to the Spring Boot backend under `/api`. The backend validates the JWT from the `Authorization` header, applies role-based permissions, reads or writes PostgreSQL data through JPA repositories, and returns JSON responses to React.

Main flow:

1. User registers or logs in from React.
2. React calls `POST /api/auth/register` or `POST /api/auth/login`.
3. Spring Boot validates credentials and returns a JWT plus user details.
4. React stores the token and user in Zustand/localStorage.
5. Axios attaches `Authorization: Bearer <token>` to protected API calls.
6. Spring Security validates the JWT through `JwtFilter`.
7. Controllers call services, services call repositories, and repositories persist data in PostgreSQL.
8. React Query caches API responses and refreshes data after mutations.

## 3. Frontend And Backend Connection

Frontend API base URL:

```text
frontend/.env
VITE_API_URL=http://localhost:8080/api
```

Main frontend connection files:

```text
frontend/src/api/client.js
frontend/src/api/auth.js
frontend/src/api/tasks.js
frontend/src/api/projects.js
frontend/src/api/reports.js
frontend/src/api/users.js
frontend/src/api/activityLogs.js
frontend/src/store/authStore.js
```

`client.js` creates the shared Axios client. It reads the JWT from `authStore` and attaches it to every request. If the backend returns `401 Unauthorized`, the client logs the user out.

`authStore.js` stores:

```text
user
token
isAuthenticated
purpose
```

After page refresh, the app calls `/api/auth/me` to restore the current user when a token already exists.

## 4. Connected Frontend Pages

`Login.jsx` now calls:

```text
POST /api/auth/login
```

`Register.jsx` now calls:

```text
POST /api/auth/register
```

`Tasks.jsx` now calls:

```text
GET /api/tasks
POST /api/tasks
PATCH /api/tasks/{id}/status
GET /api/users
GET /api/projects
```

`Projects.jsx` now calls:

```text
GET /api/projects
POST /api/projects
```

`Reports.jsx` now calls:

```text
GET /api/reports/summary
GET /api/reports/tasks.csv
```

`TeamDashboard.jsx` now calls:

```text
GET /api/reports/summary
GET /api/projects
GET /api/activity-logs
```

`Admin.jsx` now calls:

```text
GET /api/users
PATCH /api/users/{id}/role
```

## 5. Backend Structure

Important backend packages:

```text
backend/src/main/java/com/taskflow/controller
backend/src/main/java/com/taskflow/service
backend/src/main/java/com/taskflow/repository
backend/src/main/java/com/taskflow/entity
backend/src/main/java/com/taskflow/dto
backend/src/main/java/com/taskflow/security
backend/src/main/java/com/taskflow/config
backend/src/main/java/com/taskflow/exception
backend/src/main/java/com/taskflow/enums
```

Controllers expose REST APIs. Services contain business logic and permission checks. Repositories use Spring Data JPA. Entities map Java objects to database tables. DTOs define request and response objects. Security files handle JWT creation, validation, and user authentication.

## 6. Backend Entities

Main database entities:

```text
User
Project
Task
ActivityLog
```

Relationships:

```text
User -> Tasks assigned to user
User -> Tasks created by user
Project -> Manager user
Project -> Team members
Task -> Assignee user
Task -> Creator user
Task -> Project
ActivityLog -> Actor user
```

Task statuses:

```text
TODO
IN_PROGRESS
DONE
```

Priority levels:

```text
LOW
MEDIUM
HIGH
CRITICAL
```

Roles:

```text
ADMIN
MANAGER
DEVELOPER
```

## 7. Security And Permissions

Public endpoints:

```text
POST /api/auth/register
POST /api/auth/login
GET /actuator/health
GET /actuator/info
GET /actuator/prometheus
```

Protected endpoints require a JWT token.

Role behavior:

```text
ADMIN: full access and role management
MANAGER: create projects, assign tasks, view reports
DEVELOPER: view and update assigned tasks
```

JWT files:

```text
backend/src/main/java/com/taskflow/security/JwtUtil.java
backend/src/main/java/com/taskflow/security/JwtFilter.java
backend/src/main/java/com/taskflow/security/UserDetailsServiceImpl.java
backend/src/main/java/com/taskflow/config/SecurityConfig.java
```

## 8. Docker Files Used

Backend Dockerfile:

```text
backend/Dockerfile
```

It uses a Maven Java 17 image to build the Spring Boot jar, then runs the jar in a lightweight Eclipse Temurin runtime image.

Frontend Dockerfile:

```text
frontend/Dockerfile
```

It builds the React app and serves the static production files through Nginx.

Frontend Nginx config:

```text
frontend/nginx.conf
```

It serves the Vite build output and supports React Router fallback routing.

Docker Compose file:

```text
docker/docker-compose.yml
```

Services included:

```text
backend
frontend
db
prometheus
grafana
```

PostgreSQL runs as the `db` service. The backend connects to it with:

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/taskflow
```

## 9. Kubernetes Files

Kubernetes manifests are stored in:

```text
k8s/
```

Important files:

```text
namespace.yaml
configmap.yaml
secret.yaml
backend-deployment.yaml
backend-service.yaml
frontend-deployment.yaml
frontend-service.yaml
postgres-deployment.yaml
postgres-service.yaml
postgres-pvc.yaml
ingress.yaml
hpa.yaml
```

`configmap.yaml` stores non-secret database settings. `secret.yaml` stores database password and JWT secret. Backend and frontend deployments define app containers. Services expose them inside the cluster. Ingress routes external traffic.

## 10. Monitoring

Spring Boot exposes Prometheus metrics at:

```text
/actuator/prometheus
```

Prometheus config:

```text
monitoring/prometheus.yml
```

Grafana dashboard:

```text
monitoring/grafana/dashboard.json
```

Prometheus scrapes backend metrics, and Grafana visualizes those metrics.

## 11. CI/CD Files

Jenkins pipeline:

```text
jenkins/Jenkinsfile
```

GitHub Actions workflow:

```text
.github/workflows/ci.yml
```

Expected CI/CD stages:

```text
Checkout code
Run backend tests
Build Spring Boot jar
Build Docker images
Push images
Deploy to Kubernetes
```

## 12. Local Development Commands

Backend:

```bash
cd backend
mvn.cmd test
mvn.cmd package
mvn.cmd spring-boot:run
```

Frontend:

```bash
cd frontend
npm.cmd run dev
npm.cmd run lint
npm.cmd run build
```

Docker Compose:

```bash
cd docker
docker compose up --build
```

Expected local URLs:

```text
Frontend: http://localhost:3000 or http://localhost:5173
Backend:  http://localhost:8080
Postgres: localhost:5432
Prometheus: http://localhost:9090
Grafana: http://localhost:3001
```

## 13. Verification Completed

Backend:

```text
mvn.cmd test passed
3 tests passed
```

Frontend:

```text
npm.cmd run lint passed
npm.cmd run build passed
```

The frontend is no longer using mock login/register/task/project/report/admin data for the connected team-management workflow. It now communicates with the Spring Boot backend through Axios and React Query.
