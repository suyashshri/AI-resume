# HireMind — AI-Powered Resume Analyzer

HireMind analyzes your resume against a job description and gives you an instant match score, skill gap analysis, tailored interview questions, an AI-enhanced resume, and a cover letter.

🔗 **Live Demo** → [hiremind.codexyash.com](https://hiremind.codexyash.com)

---

## Features

- Upload resume (PDF) and paste a job description or URL
- AI match score (0-100)
- Skill gap analysis with severity levels (Low / Medium / High)
- Tailored interview questions with suggested answers
- AI-enhanced resume incorporating missing skills
- Cover letter generation (streaming)
- LaTeX resume export
- OTP email verification on signup
- JWT auth with httpOnly cookies
- Background job queue for AI analysis

---

## Tech Stack

**Backend**
- Bun + Express.js
- PostgreSQL + Prisma ORM
- Redis + BullMQ (background jobs)
- Supabase (file storage)
- Resend (email)
- OpenRouter (AI — Claude Sonnet)
- Firecrawl (job URL scraping)

**Frontend**
- React 19 + TypeScript
- Vite + TanStack Router
- Tailwind CSS v4

---

## Prerequisites

Make sure you have these installed:

- [Bun](https://bun.sh) `>= 1.0`
- [Node.js](https://nodejs.org) `>= 18`
- [PostgreSQL](https://www.postgresql.org) running locally or a cloud instance (Neon, Supabase, etc.)
- [Redis](https://redis.io) running locally or a cloud instance (Upstash, etc.)

---

## Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/ai-resume.git
cd ai-resume
```

### 2. Backend setup

```bash
cd backend
bun install
```

Create a `.env` file in the `backend/` folder:

```env
PORT=3000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/hiremind

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend (email)
RESEND_API_KEY=re_your_api_key

# OpenRouter (AI)
OPENROUTER_API_KEY=sk-or-your-api-key

# Firecrawl (job URL scraping)
FIRECRAWL_API_KEY=fc-your-api-key
```

Run database migrations:

```bash
bun --bun run prisma migrate deploy
bun --bun run prisma generate
```

Start the backend:

```bash
bun run dev
```

Backend runs on `http://localhost:3000`

---

### 3. Frontend setup

```bash
cd frontend
bun install
```

Create a `.env` file in the `frontend/` folder:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
bun run dev
```

Frontend runs on `http://localhost:5173`

---

## Getting API Keys

| Service | Where to get it |
|---|---|
| **Supabase** | [supabase.com](https://supabase.com) → New project → Settings → API |
| **Resend** | [resend.com](https://resend.com) → API Keys |
| **OpenRouter** | [openrouter.ai](https://openrouter.ai) → Keys |
| **Firecrawl** | [firecrawl.dev](https://firecrawl.dev) → Dashboard |

---

## Supabase Storage Setup

1. Go to your Supabase project → **Storage → New bucket**
2. Name it `resumes`
3. Set it to **Private**

---

## Project Structure

```
ai-resume/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── routes/          # Express routers
│   │   ├── middleware/      # Auth middleware
│   │   ├── lib/             # Supabase, Redis, OpenRouter, BullMQ
│   │   ├── db/              # Prisma client, Redis client
│   │   ├── types/           # Zod schemas
│   │   └── config/          # Env config
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   └── index.ts             # Entry point
│
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   │   ├── auth/        # Login, Register, OTP, hooks
│   │   │   ├── dashboard/   # Resume, Job, Report management
│   │   │   ├── landing/     # Landing page
│   │   │   └── ui/          # Shared components
│   │   └── routes/          # TanStack Router routes
│   └── index.html
│
└── README.md
```

---

## Environment Notes

- In `development`, OTP codes are logged to the console instead of being emailed — no Resend key needed for basic testing
- Redis `maxmemory-policy` is automatically set to `noeviction` on startup — if using Upstash, set this manually in the dashboard
- BullMQ requires a **non-serverless** Redis instance — use Upstash Regional (not Global) or a local Redis

---

## Contributing

Pull requests are welcome. For major changes, open an issue first to discuss what you'd like to change.

---

## License

MIT
