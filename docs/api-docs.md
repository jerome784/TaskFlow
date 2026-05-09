# TaskFlow API Documentation

Base URL: `/api`

All protected endpoints require:

```http
Authorization: Bearer <jwt>
```

## Auth

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/auth/register` | Public | Register a user and return a JWT. The first registered user may be `ADMIN`; later admin creation should be done by an admin. |
| `POST` | `/auth/login` | Public | Authenticate with email/password and return a JWT. |
| `GET` | `/auth/me` | Authenticated | Return the current user. |

### Register request

```json
{
  "name": "Maya Manager",
  "email": "maya@example.com",
  "password": "password123",
  "role": "MANAGER"
}
```

Roles: `ADMIN`, `MANAGER`, `DEVELOPER`.

## Users

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/users` | Admin, Manager | List users. |
| `GET` | `/users/me` | Authenticated | Return the current user profile. |
| `GET` | `/users/{id}` | Admin, Manager, or self | Return one user. |
| `PATCH` | `/users/{id}/role` | Admin | Update a user's role. |

## Projects

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/projects` | Authenticated | List visible projects. |
| `GET` | `/projects/{id}` | Project member, Manager, Admin | Get project details. |
| `POST` | `/projects` | Admin, Manager | Create a project. |
| `PUT` | `/projects/{id}` | Admin or project manager | Update a project. |
| `DELETE` | `/projects/{id}` | Admin or project manager | Delete a project. |
| `PATCH` | `/projects/{projectId}/members/{userId}` | Admin or project manager | Add a project member. |
| `DELETE` | `/projects/{projectId}/members/{userId}` | Admin or project manager | Remove a project member. |

## Tasks

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/tasks?status=TODO&projectId=1` | Authenticated | List visible tasks. Developers only see assigned tasks. |
| `GET` | `/tasks/{id}` | Admin, Manager, or assignee | Get task details. |
| `POST` | `/tasks` | Admin, Manager | Create and assign a task. |
| `PUT` | `/tasks/{id}` | Admin, Manager | Update task details. |
| `PATCH` | `/tasks/{id}/status` | Admin, Manager, or assignee | Move a task through `TODO`, `IN_PROGRESS`, `DONE`. |
| `DELETE` | `/tasks/{id}` | Admin, Manager | Delete a task. |

### Task request

```json
{
  "title": "Build task API",
  "description": "Implement CRUD endpoints",
  "status": "TODO",
  "priority": "HIGH",
  "dueDate": "2026-05-10",
  "assigneeId": 2,
  "projectId": 1
}
```

Priorities: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`. The backend also accepts `Urgent` as `CRITICAL` for frontend compatibility.

## Reports And Activity

| Method | Endpoint | Access | Purpose |
| --- | --- | --- | --- |
| `GET` | `/reports/summary` | Authenticated | Task totals, status counts, priority counts, overdue count, and assignee totals. |
| `GET` | `/reports/tasks.csv` | Authenticated | Download a CSV task export. |
| `GET` | `/activity-logs` | Admin, Manager | Return the latest 50 activity log records. |

## Monitoring

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/actuator/health` | App health. |
| `GET` | `/actuator/prometheus` | Prometheus scrape endpoint. |
