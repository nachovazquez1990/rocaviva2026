# Rocaviva Eventos - Web Redesign 2026

## Self-Maintenance Rule
After EVERY user request, before responding, evaluate:
1. Does this request introduce a new decision, pattern, convention, or tool? -> Update CLAUDE.md
2. Does this request add, change, or complete a task? -> Update ROADMAP.md
3. Does this request change architecture, workflow, or project structure? -> Update both
4. Does this request reveal a user preference or correction? -> Update CLAUDE.md and/or memory
If none apply, proceed normally. Keep updates minimal and precise - don't bloat the docs.

## Project Overview
Complete redesign of rocaviva.eu - a cultural events company specializing in historical figure exhibitions.
The goal is a modern, elegant, award-worthy website with exceptional UX/UI, animations, accessibility, and SEO.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4 + CSS Modules for complex animations
- **Animations:** Framer Motion + GSAP for scroll-based and complex animations
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **CMS:** Custom admin panel with Supabase Auth
- **Deployment:** Vercel
- **Image hosting:** Vercel Blob (optimized with next/image)
- **i18n:** next-intl (ES, EN, FR)
- **Instagram feed:** Behold widget (Instagram integration, feed ID in NEXT_PUBLIC_BEHOLD_FEED_ID)
- **Version control:** Git + GitHub

## Design System Decisions
- **Brand color:** #c32e25 (Rocaviva Red) at 600, full 50-950 palette
- **Accent color:** Navy (#334e7b at 600)
- **Neutrals:** Warm stone tinted (not pure gray)
- **Semantic:** Classic green/yellow/red/blue
- **Light mode only** (no dark mode)
- **Display font:** Bodoni Moda (serif, dramatic scale, italic for quotes)
- **Body font:** Inter (sans-serif)
- **Typography scale:** Dramatic — Display up to 9xl, large contrast with body
- **Buttons:** Sharp (no border-radius), color change on hover (no fill animation)
- **Inputs:** Underline style (bottom border only)
- **Cards:** No border, white on neutral-50, subtle shadow on hover
- **Animations:** Medium level — fadeInUp, stagger, parallax, scale on hover
- **Reference site:** teamlab.art (but light mode version — clean, minimal, image-forward)

## Admin CMS Architecture
- Login: `/[locale]/admin/login` (public, no auth required)
- Protected routes: `/[locale]/admin/*` via `(dashboard)` route group with auth layout
- Auth check in `(dashboard)/layout.tsx` using Supabase server client
- CRUD pages use client-side Supabase (browser client) with RLS for security
- Analytics: `page_views` + `analytics_events` tables in Supabase
- Tracking: `PageTracker` client component in public layout + `/api/track` API route
- Country detection via Vercel `x-vercel-ip-country` header
- Admin UI in Spanish only (no i18n for admin)
- Tri-lingual content editing via `LocalizedInputs` component (ES/EN/FR tabs)

## Architecture Decisions
- App Router with route groups for `(public)` and `(admin)`
- Server Components by default, Client Components only when needed (interactivity/animations)
- Dynamic routes: `/[locale]/projects/[slug]`, `/[locale]/projects/[slug]/[exhibition]`
- Supabase Row Level Security (RLS) for all tables
- ISR (Incremental Static Regeneration) for public pages
- Image optimization via next/image with Vercel Blob storage
- Structured data (JSON-LD) on every page for SEO

## Project Structure
```
src/
  app/
    [locale]/
      (public)/
        page.tsx                    # Home
        projects/
          page.tsx                  # Projects carousel
          [slug]/
            page.tsx                # Individual project
            [exhibition]/
              page.tsx              # Exhibition/itinerancy
        communication/
          page.tsx                  # Press/media coverage
        books/
          page.tsx                  # Books section
        collaborators/
          page.tsx                  # Partner logos grid
      (admin)/
        admin/
          layout.tsx                # Admin layout with auth
          page.tsx                  # Dashboard
          projects/
          communication/
          books/
          collaborators/
    api/
      book-download/route.ts        # Book download after form
      contact/route.ts              # Contact form
    layout.tsx                      # Root layout
  components/
    ui/                             # Base UI components (buttons, inputs, cards)
    layout/                         # Header, Footer, Navigation, LoadingScreen
    home/                           # Hero, Services, About sections
    projects/                       # ProjectCarousel, ProjectCard, Timeline
    communication/                  # NewsCard, NewsFilter
    books/                          # BookForm, BookDisplay
    collaborators/                  # LogoGrid
    animations/                     # Shared animation wrappers
  lib/
    supabase/
      client.ts                     # Browser client
      server.ts                     # Server client
      admin.ts                      # Service role client
      types.ts                      # Generated DB types
    i18n/
      config.ts
      request.ts
    utils.ts
    seo.ts                          # SEO helpers, JSON-LD generators
  messages/
    es.json
    en.json
    fr.json
  styles/
    globals.css
    animations.css
```

## Database Schema (Supabase)
Key tables:
- `projects` - id, slug, title_es/en/fr, description_es/en/fr, image_url, dossier_url_es/en/fr, order, created_at
- `exhibitions` - id, project_id (FK), slug, city, venue, date_from, date_to, description_es/en/fr, image_url, order
- `exhibition_images` - id, exhibition_id (FK), image_url, alt_es/en/fr, order
- `project_images` - id, project_id (FK), image_url, alt_es/en/fr, order
- `news` - id, title_es/en/fr, description_es/en/fr, image_url, date, link_url, type (press/radio/tv/video), created_at
- `books` - id, title_es/en/fr, description_es/en/fr, image_url, extra_image_url, download_url_part1, download_url_part2
- `book_downloads` - id, book_id (FK), name, email, interest, profession, comments, created_at
- `collaborators` - id, name, logo_url, website_url, order
- `home_content` - id, key, value_es/en/fr (for editable home sections)

## Code Standards
- All components use TypeScript with explicit prop types
- Use `cn()` utility (clsx + tailwind-merge) for conditional classes
- Server actions for form submissions
- Error boundaries on every route segment
- Loading states with Suspense boundaries
- All images must have alt text (translated)
- Semantic HTML throughout (header, main, nav, article, section, footer)
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast ratio minimum 4.5:1 (WCAG AA)
- Focus visible styles on all interactive elements

## SEO Requirements
- Unique meta title and description per page (translated)
- Open Graph and Twitter Card meta tags
- Canonical URLs with hreflang alternates
- Sitemap.xml and robots.txt auto-generated
- JSON-LD structured data (Organization, Event, BreadcrumbList, Article)
- Semantic heading hierarchy (single h1 per page)

## Performance Targets
- Lighthouse scores: 95+ across all categories
- LCP < 2.5s, FID < 100ms, CLS < 0.1
- Font preloading, image lazy loading, code splitting

## Git Workflow
- `main` branch: production (Vercel production domain, rocaviva.eu from v1.0.0)
- `dev` branch: pre-production (Vercel free preview domain)
- Feature branches: `fase/N-nombre` (e.g., `fase/1-design-system`)
- Hotfix branches: `fix/nombre-del-fix`
- Conventional commits: `feat(TX.X):`, `fix(TX.X):`, `style:`, `refactor:`, `test:`, `chore:`, `a11y:`, `i18n:`, `perf:`
- Semantic versioning: patch (v0.0.X), minor (v0.X.0 per feature/fase), major (vX.0.0 for production)
- CI/CD: GitHub Actions runs typecheck + lint + test + build on push to dev/main
- Lighthouse audit runs on push to main
- See GIT-WORKFLOW.md for full details

## Testing
- Framework: Vitest + Testing Library + happy-dom
- Test utils with NextIntl provider wrapper: `src/test/utils.tsx`
- Run: `npm run test` (single run), `npm run test:watch` (dev), `npm run check` (all checks)
- Every component should have basic render + accessibility tests

## Important Notes
- The site must be fully responsive (mobile-first approach)
- Loading screen appears only on initial visit (session-based)
- Navigation must be impressive on both desktop and mobile
- Timeline component for exhibitions uses metro-stop metaphor
- Book download requires form completion (data stored in Supabase)
- Admin CMS behind Supabase Auth (email/password)
- Facebook integration via Behold (not Instagram this time)
