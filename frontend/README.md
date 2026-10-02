# BookNest Frontend

React + Vite frontend for the BookNest Library Management System.

## Run

```powershell
pnpm install
pnpm run dev
```

Default frontend URL: `http://localhost:5173`

The frontend uses `VITE_API_BASE_URL` for the backend API and falls back to `http://localhost:8080` when the variable is not set. See `.env.example`.
