# ✅ TaskFlow — Full-Stack Task Manager

A full-stack task management application with user authentication, real-time WebSocket updates, and a responsive Kanban board UI.

## Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 18, Vite, React Router v6     |
| Backend   | Node.js, Express 4                  |
| Database  | SQLite (via better-sqlite3)         |
| Auth      | JWT (jsonwebtoken) + bcryptjs       |
| Real-time | WebSockets (ws library)             |
| Styling   | Pure CSS (no framework)             |

## Features

- **User Auth** — Register, login, JWT-protected routes, auto-logout on token expiry
- **CRUD Tasks** — Create, read, update, delete tasks with title, description, status, priority, due date
- **Kanban Board** — Three-column view: To Do / In Progress / Done
- **Quick Status Toggle** — One-click status advancement on each card
- **Filters & Search** — Filter by status, priority, free-text search, and sort options
- **Stats Dashboard** — Live counts for total, by status, high priority, and overdue tasks
- **Real-time Updates** — WebSocket connection broadcasts task changes instantly
- **Responsive Design** — Works on mobile, tablet, and desktop

## Project Structure

```
task-manager/
├── backend/
│   ├── middleware/
│   │   └── auth.js          # JWT middleware
│   ├── routes/
│   │   ├── auth.js          # /api/auth/* endpoints
│   │   └── tasks.js         # /api/tasks/* endpoints
│   ├── db.js                # SQLite setup & schema
│   ├── server.js            # Express + WebSocket server
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js     # Axios instance with interceptors
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── StatsBar.jsx
    │   │   ├── TaskFilters.jsx
    │   │   ├── TaskCard.jsx
    │   │   ├── TaskModal.jsx
    │   │   └── Spinner.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx
    │   │   └── TaskContext.jsx
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   └── DashboardPage.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Getting Started

### 1. Install dependencies

```bash
# Backend
cd task-manager/backend
npm install

# Frontend
cd task-manager/frontend
npm install
```

### 2. Start the backend

```bash
cd task-manager/backend
npm run dev
# Server runs on http://localhost:4000
```

### 3. Start the frontend

```bash
cd task-manager/frontend
npm run dev
# App runs on http://localhost:5173
```

### 4. Open the app

Navigate to **http://localhost:5173**, register an account, and start managing tasks.

## API Endpoints

### Auth
| Method | Path               | Description        |
|--------|--------------------|--------------------|
| POST   | /api/auth/register | Register new user  |
| POST   | /api/auth/login    | Login              |
| GET    | /api/auth/me       | Get current user   |

### Tasks (all require `Authorization: Bearer <token>`)
| Method | Path                      | Description              |
|--------|---------------------------|--------------------------|
| GET    | /api/tasks                | List tasks (filterable)  |
| POST   | /api/tasks                | Create task              |
| GET    | /api/tasks/:id            | Get single task          |
| PUT    | /api/tasks/:id            | Update task              |
| PATCH  | /api/tasks/:id/status     | Quick status update      |
| DELETE | /api/tasks/:id            | Delete task              |
| GET    | /api/tasks/stats/summary  | Task statistics          |

### WebSocket
Connect to `ws://localhost:4000/ws?token=<jwt>` to receive real-time events:
- `TASK_CREATED` — new task payload
- `TASK_UPDATED` — updated task payload
- `TASK_DELETED` — deleted task ID
