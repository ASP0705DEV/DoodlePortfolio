# CMS Architecture & Admin Documentation

## Overview
This document provides complete instructions for setup, configuration, content management, analytics tracking, lead management, backup/restore, and deployment of the **Doodle Art Portfolio & Business CMS Platform**.

---

## 1. Technology Architecture
- **Frontend Framework:** React 18, Vite, TypeScript, TanStack Router
- **Styling & Motion:** Tailwind CSS, Framer Motion (`motion/react`), Lucide Icons
- **Database & Auth:** Supabase (PostgreSQL, RLS Policies, Realtime)
- **Fallback Engine:** Local persistent state fallback (`localStorage`) for offline stability
- **Analytics:** Privacy-first GDPR cookie consent telemetry tracker (`analytics_events`)
- **AI Chatbot:** Goal-driven assistant with WhatsApp Business handoff (`+91 7070362117`)

---

## 2. Installation & Setup
```bash
# Clone repository
git clone https://github.com/codeping0705/doodle-portfolio.git
cd doodle-portfolio

# Install node dependencies
npm install

# Run local development server
npm run dev

# Production build
npm run build
```

---

## 3. Admin Login & Authorization
- **Public Portfolio:** Remain open for all visitors without mandatory user login.
- **Admin Portal Path:** `/admin`
- **Passcode Authentication:** Enter `admin123` or `admin` to access the CMS Control Room.

---

## 4. CMS Features & Features Overview
1. **Analytics Dashboard:** Visual metrics for total visitors, returning users, device type, OS, browser, scroll depth, and conversion goals.
2. **Lead CRM System:** Centralized inbox for contact messages, AI chatbot leads, consultation requests, and newsletter subscribers.
3. **Project Showcase Manager:** Create, update, reorder, feature, or delete project case studies.
4. **Blog Platform Manager:** Write, edit, schedule, publish/unpublish articles with SEO tags.
5. **Backup & Restore:** One-click JSON backup export and instant JSON upload restore.

---

## 5. Deployment Instructions
The application is pre-configured for deployment on:
- **Netlify:** Connect GitHub repo, set build command `npm run build` and output `.output/public`.
- **Vercel:** Select Vite framework preset and deploy.
- **Cloudflare Pages:** Import project and set output directory `.output/public`.
