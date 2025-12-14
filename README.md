# Gradient: Academic Tracker

## Project Information

**Project Title:** Gradient: Academic Tracker

**Proponent:** Vee Emmanuel L. Añora

---

## 1. Project Overview

Gradient: Academic Tracker is a web-based system designed to help students monitor, analyze, and optimize their academic performance. It serves as a centralized platform that integrates detailed subject-grade tracking, flexible GPA/GWA computation, and performance-based analytics.

The system addresses common academic challenges such as fragmented grade records, varying grading systems across subjects, and the lack of tools for holistic academic planning. From individual assessment tracking to final graduation standing, Gradient provides students with clarity, foresight, and actionable insights to guide their academic decisions.

---

## 2. Key Features

### Subject Grade Computation

* Allows students to input detailed course grading criteria (e.g., tests, activities, term exams) and their respective weight percentages.
* Automatically calculates the overall grade of a subject based on completed course assessments.

### Predictive Grade Calculation

* Predicts the minimum score required for incomplete course assessments to pass the subject or reach a specific target grade.

### Comprehensive GWA Calculation

* Term GPA computation.
* Calculates General Weighted Average (GWA) for:

  * Cumulative
  * Semester

### Performance-Based Recommendations

* Analyzes current recorded scores across different types of course assessments (quizzes, activities, projects, term exams).
* Provides personalized recommendations on which assessment types to prioritize to improve subject standing and overall GPA/GWA.

### User & Term Management

* Ability to create, edit, and delete academic terms.
* Automatic detection and setting of an active term based on start and end dates.

### Course Management

* Create, edit, and delete individual courses, including details like course name, code, units, type, structure, and target GPA.
* Assign courses to specific academic terms.

---

## 3. Tech Stack

### Frontend

* **Next.js** – React framework with server-side rendering and static generation
* **React** – UI library
* **TypeScript** – Static typing for improved maintainability
* **Tailwind CSS** – Utility-first styling framework
* **shadcn/ui** – Reusable UI components built on Tailwind and Radix UI
* **Lucide React** – SVG icon library
* **Recharts** – Data visualization and charting

### Backend & Database

* **Supabase** – PostgreSQL database, authentication, instant APIs, and real-time subscriptions

### Authentication

* **Supabase Auth** – Email/password authentication and Google OAuth

### Deployment

* **Vercel** – Serverless deployment platform optimized for Next.js

---

## 4. Getting Started

### Prerequisites

Ensure the following tools and accounts are available:

* Node.js (LTS recommended)
* npm or Yarn
* Git
* Supabase account
* Vercel account (optional, for deployment)

### Installation

Clone the repository:

```bash
git clone git@github.com:CSci-153-Web-Systems-and-Technologies/batch-2025-gradient-web.git
cd batch-2025-gradient-web
```

Install dependencies:

```bash
npm install
# or
yarn install
```

---

## 5. Environment Setup

### Supabase Project Setup

1. Create a new project in the Supabase Dashboard.
2. Retrieve the **Project URL** and **Anon Key** from **Settings > API**.
3. Enable OAuth providers (e.g., Google) under **Authentication > Providers**.
4. Configure redirect URIs, for example:

   * `http://localhost:3000/auth/callback`
   * `https://your-vercel-domain.vercel.app/auth/callback`

### Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SITE_URL=your-website-url
GEMINI_API_KEY=your-gemini-api-key
```

---

## 6. Database Schema

The following tables are expected in the Supabase PostgreSQL database. Proper Row-Level Security (RLS) policies should be applied.

* **terms** – Academic term details (academic year, semester, dates, user_id, is_active)
* **courses** – Course information (name, code, units, type, structure, target GPA, grading breakdown, term_id, user_id)
* **assessments** – Assessment definitions (assessment name, occurrences, percentage, component type)
* **assessment_grades** – Individual assessment grades per occurrence
* **grading_scale** – Custom grading scales per course
* **users** (optional) – Extended user profile data

---

## 7. Project Structure

The application follows the **Next.js App Router** convention.

```text
.
├── app/                      # Main application directory
│   ├── (auth)/               # Authentication-related routes (signin, signup, forgot-password, reset-password, auth callbacks)
│   ├── (authernticated)/     # Authenticated routes (dashboard, courses, terms, calculate, recommendation, settings)
│   ├── api/                  # API routes (check-email, recommendation)
│   ├── components/           # Page-specific components
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout for the application
│   └── page.tsx              # Root page (landing page)
├── components/               # Reusable UI components across the application
│   ├── ui/                   # Shadcn/ui components (button, card, input, label, etc.)
│   └── CallToAction.tsx      # Example shared component
├── lib/                      # Utility functions and server actions
│   └── auth-actions.ts       # Server actions for authentication
├── public/                   # Static assets (images, fonts)
├── types/                    # TypeScript type definitions
│   └── index.ts              # Centralized type definitions
├── utils/                    # Supabase client configurations and helper functions
│   ├── supabase/             # Supabase client instances (client, middleware, server)
│   └── convertPercentageToGPA.ts # Utility for GPA conversion
├── next.config.mjs           # Next.js configuration
├── package.json              # Project dependencies and scripts
├── postcss.config.mjs        # PostCSS configuration
├── README.md                 # Project README
├── tailwind.config.ts        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

---

## 8. Detailed Feature Breakdown

### Authentication Flow

* Email/password and Google OAuth registration
* Email confirmation for new users
* Secure login and session persistence
* Password reset and recovery
* Middleware-based route protection
* Separate client-side and server-side Supabase clients

### Term Management

* Create New Term: Users can define academic years, semesters, and optionally, start and end dates.
* View Terms: Displays a list of all created terms, categorized into "Active Term" (based on current date), "Upcoming Terms," "Past Terms," and "Unscheduled Terms."
* Edit Term: Modify academic year, semester, and dates. Also allows managing courses within a term.
* Delete Term: Remove a term (with confirmation).

### Course Management

* Create Course: Add new courses with details like name, code, type, units, target GPA, and grading structure (e.g., Lecture Only, Lecture + Laboratory).
* View Course Details: A dedicated page ([id]) for each course to view assessments, grades, and grading scales.
* Manage Assessments: Define assessment types (quizzes, activities, exams), their occurrences, and weight percentages for Lecture and/or Laboratory components.
* Input Grades: Record grades for each assessment occurrence.
* Grading Scale Setup: Customize the grading scale for each course.
* Edit/Delete Course: Modify course details or remove a course (with confirmation).

###  GWA Analytics

* Cumulative GWA: Displays the overall General Weighted Average across all courses.
* Term-Specific GWA: Calculate GWA for a selected term.
* Academic GWA / Total GWA: Differentiates between academic and non-academic course contributions.
* GWA Trend: Visualizes GWA progression over different terms using a line chart (recharts).

### Performance Recommendations

* Prioritization: Based on current grades and assessment weights, the system identifies which assessment types (quiz, activity, project, exam) require the most focus to improve overall course or term standing.

---

## 9. Development

### Run in Development Mode

```bash
npm run dev
# or
yarn dev
```

Visit:

```
http://localhost:3000
```

### Linting

```bash
npm run lint
```

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

---

## 10. Deployment

### Deploying to Vercel

1. Connect the repository to Vercel.
2. Configure environment variables:

   * `NEXT_PUBLIC_SUPABASE_URL`
   * `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   * `NEXT_PUBLIC_SITE_URL`
   * `GEMINI_API_KEY`
3. Deploy via Git push or manual trigger.

Update Supabase OAuth redirect URIs to include the Vercel deployment URL.

---

## 11. Contributing

Contributions are welcome.

1. Fork the repository.
2. Create a feature branch:

   ```bash
   git checkout -b feature/your-feature-name
   ```
3. Commit your changes:

   ```bash
   git commit -m "feat: Add new feature"
   ```
4. Push to your branch:

   ```bash
   git push origin feature/your-feature-name
   ```
5. Open a Pull Request.