# Next.js Boilerplate

A modern full-stack boilerplate built with Next.js, Drizzle ORM, and PostgreSQL — featuring authentication and user management out of the box.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Database ORM**: Drizzle ORM
- **Database**: PostgreSQL
- **Auth**: NextAuth.js
- **Styling**: Tailwind CSS + shadcn/ui
- **Forms**: React Hook Form + Zod
- **Data Fetching**: TanStack Query + Axios
- **Package Manager**: pnpm

---

## Prerequisites

- Node.js 18.x or higher
- pnpm
- PostgreSQL 17.x

---

## Scripts

### Application

| Command              | Description                               |
| -------------------- | ----------------------------------------- |
| `pnpm dev`           | Start the development server              |
| `pnpm build`         | Build the app for production              |
| `pnpm start`         | Start the production server               |
| `pnpm build:staging` | Build using staging environment variables |
| `pnpm lint`          | Run ESLint                                |
| `pnpm format`        | Auto-format code with Prettier            |

### Database (Drizzle)

| Command            | Description                                                    |
| ------------------ | -------------------------------------------------------------- |
| `pnpm db:generate` | Generate database migrations from schema                       |
| `pnpm db:push`     | Push schema changes directly to the DB (good for prototyping)  |
| `pnpm db:studio`   | Open Drizzle Studio (visual DB browser)                        |
| `pnpm db:migrate`  | Apply pending migrations to the database                       |
| `pnpm db:seed`     | Run the seed script (`db/seed.ts`)                             |

---

## Getting Started (Local)

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Fill in the required values in `.env`.

### 3. Run database migrations

```bash
pnpm db:migrate
```

### 4. Create initial migration

```bash
pnpm db:generate
```

### 5. Seed the database

```bash
pnpm db:seed
```

### 6. Start the development server

```bash
pnpm dev
```

---

## Getting Started (Docker / Production)

1. Make sure `.env.production` is updated with the correct values.

2. Run the application:
   ```bash
   docker-compose up -d --build
   ```
   > **Note:** Database migrations run automatically on container startup.

---

## Project Structure

```
app/
  (auth)/          # Login, reset password pages
  (protected)/     # Authenticated pages
    users/         # User management
  api/             # API routes
    auth/
    users/
  forms/           # Zod schemas for forms
config/            # App config, routes, menu, env
components/        # Shared UI components
db/                # Drizzle schema, connection config, and seed
hooks/             # TanStack Query hooks
  users/
lib/               # Utilities and helpers
types/             # Shared TypeScript types
```
