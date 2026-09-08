# SkillBridge

### Student Freelancer Marketplace

[![Production Status](https://img.shields.io/badge/Deployment-Live-success?style=flat-square)](https://skillbridger-sigma.vercel.app)
[![Branch](https://img.shields.io/badge/Branch-integration-blue?style=flat-square)](https://github.com/Munikiran77/veda-26/tree/integration)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-6-darkblue?style=flat-square&logo=prisma)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com)

**Live Production URL:** [https://skillbridger-sigma.vercel.app](https://skillbridger-sigma.vercel.app)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Problem Statement](#2-problem-statement)
3. [Solution](#3-solution)
4. [Key Features](#4-key-features)
5. [How SkillBridge Works](#5-how-skillbridge-works)
6. [User Roles](#6-user-roles)
7. [Technology Stack](#7-technology-stack)
8. [System Architecture](#8-system-architecture)
9. [Project Structure](#9-project-structure)
10. [Authentication & Security](#10-authentication--security)
11. [Database Architecture](#11-database-architecture)
12. [Student Workflow](#12-student-workflow)
13. [Client Workflow](#13-client-workflow)
14. [Installation Requirements](#14-installation-requirements)
15. [Installation & Setup](#15-installation--setup)
16. [Environment Variables](#16-environment-variables)
17. [Database Setup](#17-database-setup)
18. [Running the Application](#18-running-the-application)
19. [Production Demo](#19-production-demo)
20. [API Overview](#20-api-overview)
21. [File Uploads & Storage](#21-file-uploads--storage)
22. [Payments & Escrow](#22-payments--escrow)
23. [Project Recommendation System](#23-project-recommendation-system)
24. [Currency Standardization](#24-currency-standardization)
25. [Future Scope](#25-future-scope)
26. [Team](#26-team)
27. [License](#27-license)
28. [Conclusion](#28-conclusion)

---

## 1. Project Overview

**SkillBridge** is a dedicated two-sided freelance marketplace connecting talented students with businesses and clients seeking skilled project support. 

Built with an Apple-inspired minimalist design language, SkillBridge bridges the traditional divide between academic learning and real-world commercial experience:
- **Students** discover real project opportunities tailored to their specific skills, submit proposals, collaborate in dedicated workspaces, deliver work, receive earnings, and curate project-based portfolios.
- **Clients** post project briefs, discover student talent across fields like Web Development, UI/UX Design, and Machine Learning, review structured proposals, hire candidates, communicate in real time, and manage contract milestones with escrow-backed payment protection.

---

## 2. Problem Statement

### The Student Challenge
- **The Experience Paradox:** University students frequently develop strong academic and technical skills (full-stack development, modern design, machine learning), but encounter difficulty landing traditional internships due to requirements for prior commercial experience.
- **Unfriendly Freelance Platforms:** Mainstream freelancing platforms pit beginners against experienced global agencies and senior professionals, driving prices down and leaving students with zero visibility.
- **Lack of Commercial Project Evidence:** Course assignments rarely reflect real client deliverables or commercial collaboration that hiring managers look for.

### The Client Challenge
- **High Agency Costs & Scarcity:** Startups, small businesses, and independent creators frequently have discrete tasks (building an MVP landing page, designing a Figma design system, writing Python automation scripts) that do not warrant expensive agency retainer fees.
- **Unstructured Discovery:** Hiring students informally via social networks lacks structured proposals, identity verification, milestone tracking, deliverable verification, and payment protection.

---

## 3. Solution

SkillBridge provides a purpose-built platform that creates a safe, transparent, and productive working relationship:

- **Interest & Skill Onboarding:** Students pick their primary fields of interest (Web Development, UI/UX Design, Machine Learning, Mobile Apps, etc.) during signup, immediately calibrating their experience.
- **Algorithmic Project Recommendations:** A deterministic skill-matching engine matches students with active client projects based on skill intersection.
- **Structured Application Pipeline:** Students submit detailed proposals with custom budgets and completion timelines; clients review applicants in an organized dashboard.
- **Contract & Workspace Management:** When an applicant is hired, a binding `WorkContract` is created with dedicated workspaces, progress tracking, and file deliverable attachments.
- **Integrated Milestone Messaging:** Context-aware conversations linked directly to projects and contracts.
- **Milestone Escrow Protection:** Client payments are held in escrow and released to the student's wallet only upon client approval of submitted deliverables.
- **Project-Based Portfolio Growth:** Completed client projects become part of the student's permanent showcase profile.

---

## 4. Key Features

### Student Features
- **Streamlined Registration & Onboarding:** Intuitive student registration with interactive selection of **1–5 Fields of Interest** (e.g., Web Development, UI/UX Design, Machine Learning, Data Science).
- **Skill-Based Recommended Projects:** Automated recommendation feed calculating match percentages (75% to 98%) based on student skills.
- **Marketplace Discovery:** Full project catalog with multi-facet filtering (Category, Budget Range, Experience Level) and full-text search.
- **Comprehensive Project Details:** Detailed project view with deliverables checklist, client details, budget, and estimated duration.
- **Proposal Submission:** Structured modal to submit proposals with custom proposed budgets and delivery timelines.
- **Application Tracking:** Real-time status pipeline (`Pending`, `Under Review`, `Shortlisted`, `Accepted`, `Rejected`, `Withdrawn`).
- **Active Workspace & Deliverables:** Interactive workspace for active contracts to update progress percentages and upload deliverable files.
- **Direct Client Messaging:** Integrated real-time conversation threads with file attachment support.
- **Profile & Portfolio Showcase:** Manage headline, about section, college, experience level, availability, hourly rates, skills, and portfolio case studies.
- **Wallet & Earnings Overview:** Real-time ledger showing available balance, pending escrow funds, and cumulative earnings in Indian Rupees (`₹`).

### Client Features
- **Client Registration & Business Profile:** Register company profile with company name, industry, location, and description.
- **Project Posting Wizard:** Multi-step form to publish projects with budgets, duration, experience tier, skill tags, and milestone deliverables.
- **Project Management Dashboard:** Monitor draft, open, in-progress, and completed projects.
- **Applicant Review & Hiring:** Review student proposals, inspect candidate profiles, and hire students with automatic `WorkContract` creation.
- **Talent Directory:** Discover student freelancers with filtering by expertise, experience level, and hourly rate.
- **Hired Student Workspace:** Monitor contract progress, review submitted deliverables, and mark milestones as complete.
- **Payments & Escrow Management:** Authorize payments into escrow, release escrow to students upon satisfactory review, or trigger refunds.
- **Contextual Messaging:** Dedicated project-linked communications with applicants and hired students.
- **Company Settings:** Configure organization details, contact information, and preferences.

---

## 5. How SkillBridge Works

```text
  STUDENT WORKFLOW                              CLIENT WORKFLOW
  ────────────────                             ────────────────
  1. Sign Up & Select Interests                1. Register Client Account
         │                                            │
  2. Browse Marketplace & Matches              2. Post Project Brief & Budget
         │                                            │
  3. Submit Detailed Proposal                  3. Review Applications & Profiles
         │                                            │
  4. Client Hires Student ◄────────────────────4. Accept Proposal & Fund Escrow
         │
  5. Enter Work Contract & Workspace
         │
  6. Collaborate via Project Chat
         │
  7. Submit Deliverables & Files
         │
  8. Client Reviews & Releases Escrow ─────────► Funds Released to Student
         │
  9. Project Completed & Added to Portfolio
```

---

## 6. User Roles

SkillBridge enforces strict Role-Based Access Control (RBAC) across two distinct user roles:

| Role | Target User | Primary Objective | Portal Route |
| :--- | :--- | :--- | :--- |
| **`STUDENT`** | University & college students, self-taught junior builders | Gain real-world experience, find paid freelance projects, build a project-based portfolio | `/student/*` |
| **`CLIENT`** | Startups, small businesses, indie founders, creators | Post project requirements, discover affordable talent, hire students, manage deliverables | `/client/*` |

Route access is enforced server-side via Next.js Edge Middleware and cryptographically signed session tokens. Attempting to cross portals (e.g., a Client visiting `/student/work`) results in immediate denial and redirection.

---

## 7. Technology Stack

### Frontend
- **Next.js 16 (App Router):** Modern server-side rendering, React Server Components (RSC), and Turbopack bundler.
- **React 19:** Latest React primitives, concurrent transitions, and hooks.
- **TypeScript 5:** End-to-end type safety across components, server actions, and database queries.
- **Tailwind CSS v4:** Modern CSS framework utilizing native CSS variables and utility classes.
- **Framer Motion:** Fluid, Apple-inspired micro-interactions, spring physics, and animated transitions.
- **Lucide React:** Consistent, lightweight UI icon library.

### Backend & Server Architecture
- **Next.js Route Handlers:** RESTful API endpoints with structured JSON responses.
- **Prisma ORM 6:** Type-safe database queries, schema migrations, and relational modeling.
- **Jose:** Fast, standards-compliant JSON Web Token (JWT) signing and verification via HMAC-SHA256 (`HS256`).
- **Bcryptjs:** Secure one-way salt and password hashing.

### Database & Cloud Storage
- **PostgreSQL / Neon:** Relational PostgreSQL database with connection pooling for serverless deployments.
- **Supabase Storage:** Object storage bucket (`skillbridge-files`) with time-limited signed upload and download URLs.

### Security & Utilities
- **HTTP-Only Cookies:** Cross-Site Scripting (XSS) resistant session storage (`sb_session`).
- **OWASP CSRF Defense:** Strict `Origin` and `Host` validation for state-changing HTTP methods.
- **In-Memory Rate Limiting:** Sliding-window rate limiting for authentication, payments, uploads, and messaging.
- **Security Headers:** Strict CSP, HSTS, X-Frame-Options (DENY), and X-Content-Type-Options (nosniff).
- **Clsx & Tailwind-Merge:** Collision-free dynamic class merging.

---

## 8. System Architecture

### Core Data & Request Flow

```text
  ┌────────────────────────────────────────────────────────┐
  │                   Client / Browser                     │
  └──────────────────────────┬─────────────────────────────┘
                             │ HTTPS
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │                 Next.js Edge Middleware                │
  │      • Session Token Extraction (sb_session cookie)    │
  │      • RBAC Enforcement (/student/* vs /client/*)      │
  └──────────────────────────┬─────────────────────────────┘
                             │ Authorized Route
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │             Next.js Server & API Routes                │
  │      • CSRF Origin Verification                        │
  │      • Sliding-Window Rate Limiting                    │
  │      • Contextual IDOR Access Checks                   │
  └─────────────┬───────────────────────────┬──────────────┘
                │                           │
                ▼                           ▼
  ┌───────────────────────────┐   ┌────────────────────────┐
  │        Prisma ORM         │   │    Supabase Storage    │
  │  (PostgreSQL Database)    │   │  (Private File Bucket) │
  └───────────────────────────┘   └────────────────────────┘
```

### Storage Architecture (Private Bucket)
1. **Upload:** Client requests upload -> Server validates authorization, category, file size, and extension -> Stores metadata in `StoredFile` -> Uploads to private bucket.
2. **Download:** Client requests file -> Server checks if user is contract owner, project client, or conversation participant -> Generates a signed, short-lived (300-second) download URL.

### Recommendation Engine Flow
```text
Student Profile ──► Registered Skills (StudentSkill)
                           │
                           ▼
Marketplace Projects ──► Project Skills (ProjectSkill)
                           │
                           ▼
          Deterministic Skill Intersection
                           │
                           ▼
       Match Ratio & Score Calculation (75%–98%)
                           │
                           ▼
     Ranked Recommendations Feed (Top 6 Matches)
```

---

## 9. Project Structure

```text
veda-26/
├── prisma/
│   ├── schema.prisma              # Complete database schema (17 models)
│   └── seed.ts                    # Database seeder with sample projects & profiles
├── public/                        # Static assets, icons, and fonts
├── src/
│   ├── app/                       # Next.js App Router
│   │   ├── api/                   # REST API routes
│   │   │   ├── applications/      # Application lifecycle endpoints
│   │   │   ├── auth/              # login, signup, logout, me
│   │   │   ├── clients/           # Client profile endpoints
│   │   │   ├── conversations/     # Messaging & thread endpoints
│   │   │   ├── dashboard/         # Role-specific dashboard metrics
│   │   │   ├── escrows/           # Escrow release and refund endpoints
│   │   │   ├── files/             # Upload, download-url, and metadata
│   │   │   ├── payments/          # Payment intent, status, cancel, refund
│   │   │   ├── projects/          # Project CRUD & recommendations
│   │   │   ├── student/           # Student earnings & balance endpoints
│   │   │   ├── students/          # Student profile & portfolio endpoints
│   │   │   └── work/              # WorkContract milestone updates
│   │   ├── client/                # Client portal pages
│   │   │   ├── dashboard/         # Client dashboard
│   │   │   ├── hired-students/    # Active contracts management
│   │   │   ├── login/             # Client authentication
│   │   │   ├── messages/          # Project communication
│   │   │   ├── payments/          # Escrow & billing interface
│   │   │   ├── projects/          # Project list, creation wizard, applicant review
│   │   │   ├── settings/          # Organization settings
│   │   │   ├── signup/            # Client registration
│   │   │   └── talent/            # Student discovery & profiles
│   │   ├── student/               # Student portal pages
│   │   │   ├── applications/      # Submitted proposal tracking
│   │   │   ├── login/             # Student authentication
│   │   │   ├── messages/          # Client communication
│   │   │   ├── profile/           # Student portfolio & profile editor
│   │   │   ├── projects/          # Marketplace & recommended feed
│   │   │   ├── signup/            # Registration with Fields of Interest
│   │   │   └── work/              # Contract workspaces & deliverables
│   │   ├── globals.css            # Global styles and Tailwind imports
│   │   ├── layout.tsx             # Root layout with fonts & providers
│   │   └── page.tsx               # Apple-inspired landing page
│   ├── components/                # Reusable UI components
│   │   ├── client/                # Client portal components
│   │   ├── sections/              # Landing page sections (hero, features, about)
│   │   ├── student/               # Student portal components
│   │   └── ui/                    # Shared atomic UI primitives
│   ├── data/                      # Fallback mock data and category constants
│   ├── lib/                       # Core utility & server modules
│   │   ├── server/
│   │   │   ├── auth/              # JWT session creation, verification & RBAC
│   │   │   ├── dashboard/         # Recommendation service
│   │   │   ├── payments/          # Payment state machine & mock provider
│   │   │   ├── security/          # CSRF checking & sliding rate limiter
│   │   │   └── storage/           # Supabase signed URL helpers & validations
│   │   ├── api-mappers.ts         # Prisma-to-DTO conversion mappers
│   │   ├── prisma.ts              # Global Prisma client singleton
│   │   └── utils.ts               # Class merging & formatINR utility
│   └── middleware.ts              # Route-level RBAC authentication middleware
├── .env.example                   # Environment variable template
├── next.config.ts                 # Next.js configuration & security headers
├── package.json                   # Project metadata & dependencies
├── tsconfig.json                  # TypeScript compiler configuration
└── README.md                      # Project documentation
```

---

## 10. Authentication & Security

SkillBridge implements comprehensive defense-in-depth across the application:

| Layer | Mechanism | Details |
| :--- | :--- | :--- |
| **Authentication** | Cryptographic JWT | Created with `jose` using `HS256`, 7-day expiration, signed with `AUTH_SECRET`. |
| **Session Cookie** | `sb_session` | Stored in `httpOnly`, `sameSite: "lax"`, `secure` (production) cookies. Resistant to XSS extraction. |
| **Password Storage** | Salted Bcrypt | Passwords hashed using `bcryptjs` before persisting to PostgreSQL. |
| **Role-Based Isolation** | Next.js Middleware | Direct route isolation (`/student/*` vs `/client/*`). Prevents cross-role access. |
| **IDOR Protection** | Contextual Ownership | Server queries strictly verify that the authenticated user owns the resource or is a contract participant before performing mutations or returning data. |
| **CSRF Defense** | Origin Verification | Non-GET requests require matching `Origin` and `Host` headers. Cross-origin requests are blocked. |
| **Rate Limiting** | Sliding-Window Limiter | In-memory limiter protecting sensitive endpoints: Auth (5/min), Messaging (30/min), Payments (10/min), Uploads (20/min). |
| **File Validation** | MIME & Extension Filter | Blocks dangerous executables (`.exe`, `.bat`, `.sh`, `.vbs`, etc.) and limits file sizes by category. |
| **HTTP Headers** | Security Headers | Strict CSP, HSTS (`max-age=63072000`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`. |

---

## 11. Database Architecture

The data layer is managed with **Prisma ORM** connecting to PostgreSQL.

```text
                  ┌──────────────┐
                  │     User     │
                  └──────┬───────┘
            ┌────────────┴────────────┐
            ▼                         ▼
   ┌─────────────────┐       ┌────────────────┐
   │ StudentProfile  │       │ ClientProfile  │
   └────────┬────────┘       └────────┬───────┘
            │                         │
     ┌──────┴──────┐                  │
     ▼             ▼                  ▼
┌─────────┐  ┌───────────┐     ┌─────────────┐
│  Skill  │  │ Portfolio │     │   Project   │
└─────────┘  └───────────┘     └──────┬──────┘
                                      │
                                      ▼
                               ┌─────────────┐
                               │ Application │
                               └──────┬──────┘
                                      │
                                      ▼
                               ┌──────────────┐
                               │ WorkContract │
                               └──────┬───────┘
                                      │
                               ┌──────┴──────┐
                               ▼             ▼
                         ┌───────────┐ ┌───────────┐
                         │  Payment  │ │  Escrow   │
                         └───────────┘ └───────────┘
```

### Core Models

1. **`User`**: Root identity record storing email, name, password hash, role (`STUDENT` or `CLIENT`), and timestamps.
2. **`StudentProfile`**: 1-to-1 profile with User. Stores headline, bio, college, expertise, experience level, hourly rate, and public visibility.
3. **`ClientProfile`**: 1-to-1 profile with User. Stores company name, industry, description, location, rating, and hiring counters.
4. **`Skill` & `StudentSkill`**: Many-to-many relationship mapping students to registered skills with proficiency levels (`BEGINNER`, `INTERMEDIATE`, `ADVANCED`).
5. **`ProjectSkill`**: Maps projects to required skill tags for match calculation.
6. **`PortfolioProject`**: Student portfolio entries containing title, description, tags, and project URLs.
7. **`Project`**: Client project briefs with title, description, category, budget string (`budget`), numeric budget (`budgetValue`), duration, experience tier, and deliverables array.
8. **`Application`**: Student proposals linked to projects. Enforces a database-level unique constraint `@@unique([projectId, studentId])`.
9. **`WorkContract`**: Active engagement initiated when a client accepts an application. Tracks milestone progress (0–100%) and work status.
10. **`Conversation` & `Message`**: Contextual messaging between student and client linked directly to projects.
11. **`StoredFile`**: Metadata catalog for files uploaded to Supabase Storage, recording owner, category, MIME type, size, and relational context.
12. **`Payment`**: Financial records tracking transaction amounts, status (`PENDING`, `PROCESSING`, `SUCCEEDED`, `FAILED`, `REFUNDED`), and provider.
13. **`Escrow`**: Escrow account binding client funds until milestone deliverable acceptance (`HELD`, `RELEASED`, `REFUNDED`).
14. **`StudentWallet`**: Student financial ledger recording available balance, pending escrow funds, and total earned.
15. **`PaymentTransaction`**: Comprehensive audit log recording every ledger event.

---

## 12. Student Workflow

1. **Registration:** Student creates an account at `/student/signup`, entering name, email, password, and selecting **1–5 Fields of Interest** (e.g. Web Development, UI/UX Design).
2. **Dashboard & Recommendations:** Student accesses the student workspace. The recommendation engine evaluates registered skills against all open projects and surfaces high-affinity matches (75%–98%).
3. **Explore & Filter:** Browse the full project catalog at `/student/projects` with search, category filtering, and budget range filters (e.g. `₹5,000–₹10,000`, `₹25,000+`).
4. **Submit Application:** Open project details, review required deliverables, and submit a proposal including estimated completion and proposed budget.
5. **Interview & Chat:** Communicate directly with the client at `/student/messages` to answer questions or clarify project scope.
6. **Active Contract:** When hired, a `WorkContract` is created. The student enters `/student/work/[id]` to log progress and upload deliverable files.
7. **Milestone Completion & Payout:** Upon client approval of deliverables, escrow is released to the student's wallet balance.
8. **Portfolio Showcase:** Completed projects are added to the student's public portfolio at `/student/profile`.

---

## 13. Client Workflow

1. **Registration:** Client registers at `/client/signup` with their company name, email, and password.
2. **Post Project:** Client creates a new project at `/client/projects/new`, defining category, budget in INR (`₹`), timeline, experience level, required skills, and key deliverables.
3. **Review Applicants:** Client views applicant proposals at `/client/projects/[id]/applicants`, evaluating candidate portfolios, proposals, and requested budgets.
4. **Discover Talent:** Search the student directory at `/client/talent` to view student profiles, registered skills, and case studies.
5. **Hire Student:** Accept a proposal. The system creates a `WorkContract`, initializes payment into escrow (`HELD`), and establishes a project conversation.
6. **Manage Workspace:** Monitor project deliverables and communication in `/client/hired-students`.
7. **Release Escrow:** Inspect uploaded deliverables. Upon satisfaction, release escrow to the student wallet; in case of cancellation, trigger a refund.

---

## 14. Installation Requirements

Before setting up SkillBridge locally, ensure you have:
- **Node.js:** `v18.18.0` or higher (tested on Node.js `v20+` and `v24+`).
- **Package Manager:** `npm` (v9 or higher).
- **Database:** PostgreSQL database instance (local PostgreSQL or a cloud instance such as [Neon](https://neon.tech)).
- **Object Storage (Optional for file uploads):** [Supabase](https://supabase.com) project with a storage bucket named `skillbridge-files`.

---

## 15. Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Munikiran77/veda-26.git
   cd veda-26
   ```

2. **Ensure you are on the integration branch:**
   ```bash
   git checkout integration
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```
   *(The `postinstall` script will automatically run `prisma generate`)*.

---

## 16. Environment Variables

Create a `.env` file in the root directory by copying `.env.example`:

```bash
cp .env.example .env
```

Configure the following environment variables:

Example `.env` configuration with placeholders:

```env
DATABASE_URL=your_database_url
AUTH_SECRET=your_auth_secret
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
APP_URL=http://localhost:3000
```

| Variable | Required | Description | Placeholder Value |
| :--- | :---: | :--- | :--- |
| `DATABASE_URL` | **Yes** | PostgreSQL connection string | `your_database_url` |
| `AUTH_SECRET` | **Yes** | 32+ character secret for JWT signing | `your_auth_secret` |
| `SUPABASE_URL` | Optional | Supabase project URL for file storage | `your_supabase_url` |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | Supabase service-role key for storage | `your_supabase_service_role_key` |
| `APP_URL` | Optional | Application URL for CSRF validation | `http://localhost:3000` |

> **Security Note:** Never commit `.env` to version control. `.env` is ignored in `.gitignore`.

---

## 17. Database Setup

1. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

2. **Push Schema to Database:**
   ```bash
   npx prisma db push
   ```

3. **Seed Database with Sample Data:**
   SkillBridge includes a comprehensive database seeder with mock students, clients, skills, and projects:
   ```bash
   npx prisma db seed
   ```

---

## 18. Running the Application

### Development Mode
Start the local development server with Turbopack:
```bash
npm run dev
```
Open your browser and navigate to:
```text
http://localhost:3000
```

### Production Build
To test the production build locally:
```bash
npm run build
npm run start
```

---

## 19. Production Demo

SkillBridge is deployed and running live on Vercel:

| Environment | Branch | Live URL |
| :--- | :--- | :--- |
| **Production** | `integration` | **[https://skillbridger-sigma.vercel.app](https://skillbridger-sigma.vercel.app)** |

---

## 20. API Overview

All API routes are served under `/api` with standardized JSON error and success payloads.

### Authentication (`/api/auth`)
- `POST /api/auth/signup` — Register a new student or client with profile initialization.
- `POST /api/auth/login` — Authenticate user, issue HTTP-only `sb_session` cookie.
- `POST /api/auth/logout` — Invalidate session and clear auth cookies.
- `GET /api/auth/me` — Retrieve current authenticated user profile.

### Projects (`/api/projects`)
- `GET /api/projects` — Fetch open marketplace projects with category/budget filters.
- `POST /api/projects` — Create a new client project brief.
- `GET /api/projects/[id]` — Retrieve single project details.
- `GET /api/projects/recommended` — Fetch algorithmically recommended projects for authenticated student.
- `GET /api/projects/[id]/applications` — Fetch applications submitted to a project (client-only).

### Applications (`/api/applications`)
- `GET /api/applications` — List applications for current user.
- `GET /api/applications/[id]` — Get application details.
- `PATCH /api/applications/[id]` — Update application status (e.g. accept, shortlist, reject).

### Conversations & Messages (`/api/conversations`)
- `GET /api/conversations` — List active user conversations.
- `POST /api/conversations` — Create or retrieve an existing project thread.
- `GET /api/conversations/[id]/messages` — Fetch message history.
- `POST /api/conversations/[id]/messages` — Send message with optional file attachment.
- `POST /api/conversations/[id]/read` — Mark unread messages as read.

### File Management (`/api/files`)
- `POST /api/files/upload` — Direct multipart file upload with validation.
- `POST /api/files/upload-url` — Request a signed upload URL.
- `GET /api/files/[id]/download` — Request an authorized, time-limited download URL.
- `DELETE /api/files/[id]` — Delete a file from storage and database.

### Payments & Escrows (`/api/payments`, `/api/escrows`)
- `GET /api/payments` — List payments for authenticated client or student.
- `POST /api/payments` — Create payment intent for contract milestone.
- `POST /api/payments/[id]/cancel` — Cancel pending payment.
- `POST /api/payments/[id]/refund` — Refund payment.
- `GET /api/escrows` — List escrow records.
- `POST /api/escrows/[id]/release` — Release held escrow funds to student.
- `POST /api/escrows/[id]/refund` — Refund held escrow funds to client.

### Students & Earnings (`/api/students`, `/api/student`)
- `GET /api/students/[id]` — Fetch public student profile.
- `PATCH /api/students/[id]` — Update student profile information.
- `GET /api/students/[id]/portfolio` — Fetch student portfolio items.
- `POST /api/students/[id]/portfolio` — Add portfolio project.
- `GET /api/student/earnings` — Retrieve student wallet balance and transaction ledger.

---

## 21. File Uploads & Storage

SkillBridge provides secure file handling backed by **Supabase Storage** (`skillbridge-files` bucket):

### File Categories & Size Caps
- **`PROFILE_AVATAR`** (Max 2 MB): `image/jpeg`, `image/png`, `image/webp`.
- **`PORTFOLIO_IMAGE`** (Max 5 MB): `image/jpeg`, `image/png`, `image/webp`, `image/gif`.
- **`PROJECT_FILE`** (Max 15 MB): PDF, images, TXT, CSV, ZIP, JSON.
- **`WORK_DELIVERABLE`** (Max 25 MB): PDF, images, TXT, CSV, ZIP, JSON.
- **`MESSAGE_ATTACHMENT`** (Max 15 MB): PDF, images, TXT, CSV, ZIP, JSON.

### Security Protections
- **Executable Blocking:** Denies dangerous file extensions (`.exe`, `.bat`, `.cmd`, `.sh`, `.vbs`, `.msi`, etc.).
- **Access Control:** File downloads require signed URLs that expire after 300 seconds. Files are only accessible to authorized project/contract participants.

---

## 22. Payments & Escrow

SkillBridge includes a full **Milestone Escrow System** designed to protect both parties:

```text
  1. Contract Initiated ──► Client Funds Escrow (Status: HELD)
                                      │
  2. Student Completes Work ──────────┼──► Work Submitted for Review
                                      │
  3. Client Approves Deliverables ────┴──► Escrow Released (Status: RELEASED)
                                                   │
                                                   ▼
                                         Student Wallet Credited
```

### Demonstration & Mock Provider (`MockPaymentProvider`)
> **Important Notice:** The current SkillBridge implementation uses an internal demonstration and mock payment provider (`MockPaymentProvider`) for evaluation, testing, and workflow validation. It does **not** process real financial transactions, live credit card charges, or actual bank payouts.

The mock payment engine fully exercises the complete financial state machine:
- Simulates authorization, card processing, escrow holds, milestone releases, and refunds.
- Does not handle real currency transactions or connect to live banking networks.
- Simulates failure states when test parameters are triggered.
- Designed behind an abstracted `PaymentProvider` TypeScript interface, ready for future production integration with Stripe or Razorpay.

---

## 23. Project Recommendation System

The recommendation engine (`src/lib/server/dashboard/recommendation-service.ts`) matches students to opportunities deterministically:

1. **Skill Extraction:** Pulls the student's registered skills from `StudentSkill` (selected during onboarding or profile editing).
2. **Exclusion Filter:** Filters out projects the student has already applied to or closed projects.
3. **Skill Intersection:** Compares project required skills with student skills.
4. **Scoring Formula:**
   $$\text{Match Score} = \min\left(98, \max\left(75, 75 + \text{round}\left(\frac{\text{Matching Skills}}{\text{Total Required Skills}} \times 23\right)\right)\right)$$
5. **Ranking Order:**
   - Primary: Number of matching skills (descending).
   - Secondary: Match score (descending).
   - Tertiary: Project creation date (recency).
6. **Result Feed:** Returns the top 6 highest-affinity projects.

---

## 24. Currency Standardization

All monetary amounts displayed across the student interface and landing page are standardized to **Indian Rupees (`₹`)**:
- Formatted via a centralized utility `formatINR` (`src/lib/utils.ts`).
- Uses Indian numbering system grouping (`en-IN` formatting, e.g. `₹5,000`, `₹12,000`, `₹1,50,000`).
- Supports hourly rates (e.g. `₹500/hr`).

---

## 25. Future Scope

The following items are planned for future iterations of SkillBridge:

- **Assessment & Skill Verification:** Automated coding challenges, GitHub repository analysis, and peer-reviewed skill assessments.
- **Production Payment Gateways:** Integration with Razorpay and Stripe for live financial settlement, automated tax invoices, and bank payouts.
- **Real-Time WebSockets:** Transition from polling to WebSocket-based instant messaging and presence indicators.
- **Client Identity Verification:** KYC/business registration verification badges for trusted employers.
- **Video Meeting Integration:** Built-in video calling for project kickoff and milestone reviews.
- **Mobile Application:** Dedicated React Native mobile app for notifications, chat, and quick proposal tracking.

---

## 26. Team

| Name | Role | Responsibilities |
| :--- | :--- | :--- |
| **Team Member 1** | Project Lead / Full-Stack | System architecture, Next.js App Router, Prisma ORM |
| **Team Member 2** | Frontend / UI-UX | Apple-inspired design system, Tailwind CSS, Framer Motion |
| **Team Member 3** | Backend & Security | Authentication, RBAC middleware, CSRF & rate limiting |
| **Team Member 4** | Payments & Storage | Escrow state machine, Supabase storage integration |

---

## 27. License

License information has not been specified.

---

## 28. Conclusion

SkillBridge directly addresses the student experience paradox by providing a structured, safe, and professional marketplace. By combining algorithmic project recommendations, milestone escrow security, integrated workspaces, and project-based portfolio curation, SkillBridge empowers the next generation of digital talent to launch their professional careers.

**Experience SkillBridge Live:** [https://skillbridger-sigma.vercel.app](https://skillbridger-sigma.vercel.app)
