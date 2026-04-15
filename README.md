# CodeBase Explainer

> Paste any public GitHub repo URL — understand the entire codebase in seconds.

No more spending hours reading files just to figure out what a project does.
CodeBase Explainer analyzes any public repo, reads key files, and gives you a plain English breakdown — instantly.

**Example output:**
> "This is a Next.js e-commerce app that uses Stripe for payments, Prisma as the ORM, and Tailwind for styling. Authentication is handled via NextAuth."

---

## Features

- **Repo Analysis** — Paste any public GitHub URL, get an instant AI explanation
- **Folder Structure Breakdown** — Understand how the project is organized
- **File Browser** — Browse any file in the repo using Monaco Editor (VS Code's editor)
- **AI File Explanation** — Click any file and get a plain English explanation
- **Analysis History** — All your past analyses saved and searchable

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS, Monaco Editor |
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose) |
| AI | Google Gemini 2.5 Flash |
| Auth | Google OAuth 2.0 + JWT |
| Integration | GitHub REST API |

---

## Run Locally

### 1. Clone the repo

```bash
git clone https://github.com/divyar13/CodeBase-Explainer.git
cd CodeBase-Explainer
```

### 2. Setup environment variables

```bash
cp .env.example .env
```

Fill in your keys in `.env`:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:3000
SESSION_SECRET=your_session_secret
```

### 3. Install dependencies & run

```bash
npm run install-all
npm run dev
```

This starts:
- Backend on `http://localhost:5000`
- Frontend on `http://localhost:3000`

---

## Getting API Keys

| Key | Where to get |
|-----|-------------|
| `MONGODB_URI` | [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) — free tier |
| `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` | [Google Cloud Console](https://console.cloud.google.com/) → OAuth 2.0 |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) — free tier |
| `GITHUB_TOKEN` | [GitHub Settings](https://github.com/settings/tokens) — optional, for higher rate limits |

---

## Why This Exists

Every developer knows the pain of joining a new codebase with zero context.
This tool solves exactly that — for any public repo, in seconds.
