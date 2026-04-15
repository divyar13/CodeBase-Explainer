# CodeBase Explainer

Paste any public GitHub repository URL and get an instant AI-powered breakdown of the entire codebase — what it does, how it's structured, and how to run it.

![Tech](https://img.shields.io/badge/React-18-blue) ![Tech](https://img.shields.io/badge/Node.js-Express-green) ![Tech](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen) ![Tech](https://img.shields.io/badge/AI-Gemini%202.5-orange)

---
## Deploy Link - code-base-explainer-teal.vercel.app

## What It Does

Most developers waste hours reading through files just to understand what a project does. CodeBase Explainer solves this — paste a GitHub URL and in seconds you get:

- A one-line summary of what the project does
- The full tech stack (languages, frameworks, databases, APIs)
- Folder-by-folder explanation of the project structure
- Step-by-step instructions to run it locally
- AI observations about the codebase

You can also **browse any file** in the repo and ask AI to explain it in plain English.

---

## Features

- **Instant Repo Analysis** — Paste any public GitHub URL and get a full breakdown
- **File Browser** — Browse the entire repo using Monaco Editor (VS Code's editor)
- **AI File Explanation** — Click any file, hit Explain, get plain English description
- **Analysis History** — All past analyses saved, searchable by repo name or tech stack
- **Google Login** — One-click sign in with Google OAuth

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS |
| Code Viewer | Monaco Editor |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| AI | Google Gemini 2.5 Flash |
| Auth | Google OAuth 2.0, JWT |
| GitHub Data | GitHub REST API |

---

## Getting Started

### Prerequisites

You need API keys for:
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) — free tier works
- [Google Cloud Console](https://console.cloud.google.com/) — for OAuth credentials
- [Google AI Studio](https://aistudio.google.com/app/apikey) — for Gemini API key

### Setup

```bash
# Clone the repo
git clone https://github.com/divyar13/CodeBase-Explainer.git
cd CodeBase-Explainer

# Install all dependencies (root + backend + frontend)
npm run install-all

# Copy env example and fill in your keys
cp .env.example .env
```

Edit `.env` with your credentials — see `.env.example` for all required fields.

### Run

```bash
npm run dev
```

This starts both servers:
- Frontend → `http://localhost:3000`
- Backend → `http://localhost:5000`

---

## Project Structure

```
CodeBase-Explainer/
├── backend/
│   ├── config/          # Database and passport config
│   ├── controllers/     # Business logic
│   ├── middleware/      # JWT auth middleware
│   ├── models/          # MongoDB schemas (User, Analysis)
│   ├── routes/          # API endpoints
│   ├── utils/           # GitHub and Gemini helpers
│   └── server.js
├── frontend/
│   └── src/
│       ├── pages/       # Landing, Login, Dashboard, Analysis
│       ├── context/     # Auth context
│       ├── hooks/       # useAuth hook
│       └── utils/       # Axios API client
├── .env.example
└── package.json
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/auth/google` | Google OAuth login |
| GET | `/auth/me` | Get current user |
| POST | `/api/analysis/analyze` | Analyze a GitHub repo |
| GET | `/api/analysis` | List all analyses |
| GET | `/api/analysis/:id` | Get specific analysis |
| GET | `/api/analysis/:id/file` | Get file content |
| POST | `/api/analysis/:id/explain-file` | AI explain a file |
