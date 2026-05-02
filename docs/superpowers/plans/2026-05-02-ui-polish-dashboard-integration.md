# UI Polish and Dashboard Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve UI consistency across authenticated pages, add page-specific metadata, and integrate course creation directly into the dashboard.

**Architecture:** 
- Enhance `AuthenticatedHeader` with branding elements (logo + text).
- Use Next.js Metadata API for page titles.
- Lift `CreateCourseModal` state to `DashboardPage` to allow triggering from `CoursesCard`.
- Add interactive loading states to long-running AI operations.

**Tech Stack:** React, Next.js, Lucide React, Tailwind CSS.

---

### Task 1: Enhance Authenticated Header Branding

**Files:**
- Modify: `app/(authenticated)/components/AuthenticatedHeader.tsx`

- [ ] **Step 1: Update Header JSX to include Logo and Brand Text**

Add the logo and "Gradient" text to the left side of the header, keeping the dynamic page title but visually separating them.

```tsx
// app/(authenticated)/components/AuthenticatedHeader.tsx
// Add these imports
import Image from "next/image";

// Update the return statement's left section:
<div className="flex items-center gap-6">
  <Link href="/dashboard" className="flex items-center gap-2 group transition-all">
    <div className="relative w-6 h-6 group-hover:scale-110 transition-transform">
      <Image
        src="/starlogo.svg"
        alt="Gradient Logo"
        width={24}
        height={24}
        className="w-full h-full object-contain"
      />
    </div>
    <span className="text-lg font-black tracking-tighter text-zinc-900 uppercase hidden sm:inline group-hover:opacity-80 transition-opacity">
      Gradient
    </span>
  </Link>
  
  <div className="h-6 w-px bg-zinc-200 hidden sm:block" />
  
  <span className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
    {formattedTitle}
  </span>
</div>
```

- [ ] **Step 2: Commit branding changes**

```bash
git add app/(authenticated)/components/AuthenticatedHeader.tsx
git commit -m "style: add logo and branding to authenticated header"
```

---

### Task 2: Add Page-Specific Metadata

**Files:**
- Modify: `app/(authenticated)/dashboard/page.tsx`
- Modify: `app/(authenticated)/courses/page.tsx`
- Modify: `app/(authenticated)/terms/page.tsx`
- Modify: `app/(authenticated)/calculate/page.tsx`
- Modify: `app/(authenticated)/recommendation/page.tsx`
- Modify: `app/(authenticated)/settings/page.tsx`

- [ ] **Step 1: Add metadata to Dashboard**
```tsx
export const metadata = { title: "Dashboard | Gradient" };
```

- [ ] **Step 2: Add metadata to Courses**
```tsx
export const metadata = { title: "Courses | Gradient" };
```

- [ ] **Step 3: Add metadata to Terms**
```tsx
export const metadata = { title: "Terms | Gradient" };
```

- [ ] **Step 4: Add metadata to Calculate**
```tsx
export const metadata = { title: "Calculate | Gradient" };
```

- [ ] **Step 5: Add metadata to Recommendation**
```tsx
export const metadata = { title: "Recommendation | Gradient" };
```

- [ ] **Step 6: Add metadata to Settings**
```tsx
export const metadata = { title: "Settings | Gradient" };
```

- [ ] **Step 7: Commit metadata changes**
```bash
git add app/(authenticated)/**/page.tsx
git commit -m "feat: add page-specific metadata titles"
```

---

### Task 3: Integrate Create Course Modal in Dashboard

**Files:**
- Modify: `app/(authenticated)/dashboard/page.tsx`
- Modify: `app/(authenticated)/dashboard/components/CoursesCard.tsx`
- Modify: `app/(authenticated)/dashboard/components/AddCourseButton.tsx`

- [ ] **Step 1: Update DashboardPage to handle Modal state**
Import `CreateCourseModal` and manage its visibility.

```tsx
// app/(authenticated)/dashboard/page.tsx
import CreateCourseModal from "../courses/components/CreateCourseModal";

// Add state
const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
const [terms, setTerms] = useState<Term[]>([]); // Need to ensure terms are fetched

// Update fetchData to also fetch terms if not already available
// ... fetch terms from Supabase ...

// Add to JSX
<CreateCourseModal 
  isOpen={isCreateModalOpen}
  onClose={() => setIsCreateModalOpen(false)}
  terms={terms}
  onSubmit={handleCreateCourse} // Implement handleCreateCourse to refresh data
/>
```

- [ ] **Step 2: Update CoursesCard to trigger Modal**
Instead of `router.push('/courses')`, call a function passed from parent.

```tsx
// app/(authenticated)/dashboard/components/CoursesCard.tsx
// Add onAddCourse to props
export default function CoursesCard({ courses = [], onAddCourse }: CoursesCardProps & { onAddCourse: () => void }) {
  // ...
  <AddCourseButton onClick={onAddCourse} />
}
```

- [ ] **Step 3: Update AddCourseButton component styling**
Ensure it matches the requested "Add Course Modal" requirement (visual feedback).

- [ ] **Step 4: Commit dashboard integration**
```bash
git add app/(authenticated)/dashboard/
git commit -m "feat: integrate create course modal into dashboard"
```

---

### Task 4: Recommendation Button Loading State

**Files:**
- Modify: `app/(authenticated)/recommendation/page.tsx`

- [ ] **Step 1: Add spinner to Recommendation Button**

```tsx
// app/(authenticated)/recommendation/page.tsx
<button
  onClick={handleGetRecommendation}
  disabled={loadingRecommendation}
  className="..."
>
  {loadingRecommendation ? (
    <>
      <span className="material-symbols-outlined animate-spin">cyclone</span>
      Generating...
    </>
  ) : (
    <>
      Generate Recommendation
      <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
    </>
  )}
</button>
```

- [ ] **Step 2: Commit loading state changes**
```bash
git add app/(authenticated)/recommendation/page.tsx
git commit -m "ux: add loading spinner to recommendation button"
```
