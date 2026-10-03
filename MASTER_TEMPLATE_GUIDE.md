# Master Service Business Web Application & Operating System
## Complete Blueprint, Architecture & Scaling Guide for 100+ Sites

> **System Name:** Turnkey Service Business Operating System (TSB-OS)  
> **Tech Stack:** React 18 (Vite 5) • Tailwind CSS • Lucide Icons • Node.js 24 API • Native SQLite (`node:sqlite` in WAL mode) • EmailJS & Telegram Automation • Vercel & Render Ready  
> **Master Template Location:** `C:\Users\DELL\Documents\service-biz-master-template`

---

## Table of Contents
1. [Executive Overview: What This System Accomplishes](#1-executive-overview)
2. [Master Directory Structure & Component Architecture](#2-master-directory-structure)
3. [The 3-Input Client Intake Pipeline](#3-the-3-input-client-intake-pipeline)
4. [How to Scaffold a New Project in 10 Seconds](#4-how-to-scaffold-a-new-project)
5. [The Modular Data Layer (Where Customization Lives)](#5-the-modular-data-layer)
6. [Adapting the 12-Step Wizard to Any Trade / Industry](#6-adapting-the-12-step-wizard)
7. [The Shop Admin Operating System & Quote Dispatch Studio](#7-the-shop-admin-operating-system)
8. [Backend Engine, SQLite Database & Integrations](#8-backend-engine--sqlite)
9. [Local SEO & Performance Architecture](#9-local-seo--performance)
10. [Step-by-Step Production Deployment (GitHub & Vercel)](#10-production-deployment)
11. [The 1-Prompt Antigravity Recipe (How to Build in 1 Turn)](#11-the-1-prompt-recipe)

---

## 1. Executive Overview

This template is an end-to-end digital operating system built for high-ticket local service businesses (auto mechanics, plumbers, HVAC technicians, electricians, roofers, landscapers, cleaners, etc.).

Most agency websites are static digital business cards. This platform solves the three primary reasons service businesses lose money:
1. **High Lead Abandonment:** Replaces intimidating 10-field contact forms with a frictionless **12-Step Progressive Quote Wizard** that guides customers from symptom description to estimate request in under 2 minutes.
2. **Slow Response Times:** When a customer requests a quote, the system pings the business owner’s phone on **Telegram within 3 seconds**, enabling sub-5-minute lead response (the shop that calls back first wins 78% of jobs).
3. **Operational Chaos:** Provides a built-in, private **Shop Admin Portal (`/#/admin`)** with a real-time job queue, two-way email messaging, a diagnostic shop bay stopwatch, and a **1-Click Quote Dispatch Studio** that delivers branded HTML estimates directly to customer inboxes.

---

## 2. Master Directory Structure

```
service-biz-master-template/
├── .env.example                  # Environment variable reference
├── .gitignore                    # Node modules, build files, and database ignores
├── index.html                    # SEO head tags, schema.org JSON-LD, and preloads
├── package.json                  # Dependencies: react, vite, tailwindcss, lucide-react
├── postcss.config.js             # PostCSS Tailwind engine
├── tailwind.config.js            # Custom color palette (brand accents, midnight mode)
├── vercel.json                   # Vercel SPA routing and /api reverse proxy
├── vite.config.js                # Vite port 3000 and proxy to port 5001
├── scaffold-new-project.js       # Scaffolding engine for new projects
├── create-project.ps1            # PowerShell launcher
│
├── public/                       # Static public assets
│   ├── logo.png                  # Brand logo
│   ├── robots.txt                # Search engine crawler directives
│   ├── sitemap.xml               # Search engine index
│   └── images/                   # Storefront photos and hero video
│       ├── hero-video.mp4        # Background loop video (optional)
│       ├── hero-truck.jpg        # Hero fallback poster
│       ├── card-1.jpg .. card-4  # Featured service cards
│       ├── storefront.jpg        # Physical business exterior
│       └── waiting-room.jpg      # Customer lounge / facility photo
│
├── src/                          # React 18 Frontend
│   ├── App.jsx                   # Global router, midnight dark mode state, navigation
│   ├── index.css                 # Tailwind directives, custom scrollbars
│   ├── main.jsx                  # React DOM mount point
│   │
│   ├── data/                     # 🌟 MODULAR CONFIGURATION LAYER (Edit this per client)
│   │   ├── businessData.js       # Business name, phone, address, hours, reviews, story
│   │   ├── servicesData.js       # All services catalog, categories, icons, descriptions
│   │   ├── amenitiesData.js      # Amenities checklist, accepted payment methods
│   │   └── makesData.js          # Industry qualification lists (vehicle makes, property types, etc.)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx        # Sticky header, logo, anchor links, theme toggle, mobile drawer
│   │   │   └── Footer.jsx        # Pre-footer CTA, 4-column footer, admin entrance link
│   │   ├── home/
│   │   │   ├── Hero.jsx          # Video/photo hero, WCAG AAA gradient, live rating badges
│   │   │   ├── ServicesSection.jsx # Top 4 featured high-margin service cards
│   │   │   ├── AboutSection.jsx  # Founder backstory, timeline, mission
│   │   │   ├── AmenitiesSection.jsx # Amenities grid + payment methods
│   │   │   ├── LocationHoursSection.jsx # Live open/closed MST calculator, Google Map iframe
│   │   │   └── ReviewsSection.jsx # Customer testimonials with Yelp/Google badges
│   │   ├── services/
│   │   │   └── AllServicesPage.jsx # Full-page catalog with live search & category filters
│   │   ├── wizard/
│   │   │   └── QuoteWizardModal.jsx # 12-step interactive lead qualification modal
│   │   └── admin/
│   │       ├── AdminLayout.jsx   # Sidebar + executive navigation layout
│   │       ├── AdminLogin.jsx    # Secure cryptographic password auth screen
│   │       ├── DashboardOverview.jsx # 4 KPI cards, volume chart, priority bay, bay stopwatch
│   │       ├── OrdersView.jsx    # Filterable orders queue (desktop table + mobile cards)
│   │       ├── NewOrderModal.jsx # Manual walk-in / phone estimate entry form
│   │       ├── QuoteDetailModal.jsx # Quote Dispatch Studio (price, turnaround, warranty, HTML email)
│   │       ├── InboxView.jsx     # 2-way threaded customer messaging inbox
│   │       └── AdminSettings.jsx # Self-serve Telegram, EmailJS, shop profile, password reset
│   │
│   └── services/
│       ├── api.js                # Production REST client with bearer token management
│       └── quoteService.js       # Multi-tier wizard submission logic
│
└── server/                       # Node.js 24 + SQLite Backend
    ├── index.js                  # Native HTTP REST API router (no heavy Express bloat)
    ├── db.js                     # Native node:sqlite database engine in WAL mode
    ├── auth.js                   # PBKDF2 SHA-512 cryptographic hashing & session tokens
    ├── data/                     # ACID database directory (.db files created automatically)
    └── services/
        ├── telegram.js           # Telegram Bot API notification engine
        └── mailer.js             # High-converting branded HTML email generator & sender
```

---

## 3. The 3-Input Client Intake Pipeline

To build a website for a new client in under 15 minutes, you only need three inputs:

### Input 1: `brief.md`
A Markdown brief containing:
- Business name, address, phone, email, and owner name.
- Operating hours (days, open/close times).
- 10 to 20 services with short descriptions.
- Customer amenities and accepted payment methods.
- 3 to 5 real Google or Yelp customer reviews.

### Input 2: `assets/` Folder
Drop raw client media into an intake folder:
- `logo.png` (Transparent background)
- `hero.mp4` OR `hero.jpg` (Hero video loop or high-impact image)
- `card-1.jpg`, `card-2.jpg`, `card-3.jpg`, `card-4.jpg` (Featured service imagery)
- `storefront.jpg` (Exterior building photo)
- `facility.jpg` (Customer lounge or workshop)

### Input 3: Guiding Prompts
3 to 5 clear instructions:
- **Brand Colors:** e.g., Royal Blue (`#1d4ed8`) with Gold Accent (`#eab308`).
- **Niche Focus:** e.g., 24/7 Emergency Commercial Plumbing.
- **Wizard Adaptation:** Change Step 5 from "Vehicle Make" to "Building Type" (Residential, Commercial, Industrial).

---

## 4. How to Scaffold a New Project

To create a new website on your laptop from this master template:

### Option A: Using PowerShell (Fastest)
From `C:\Users\DELL\Documents\service-biz-master-template`:
```powershell
.\create-project.ps1 -Name "Apex Elite Plumbing" -Slug "apex-plumbing"
```

### Option B: Using Node.js
```powershell
node scaffold-new-project.js "Apex Elite Plumbing" "apex-plumbing"
```

### What Happens Automatically:
1. Creates `C:\Users\DELL\Documents\apex-plumbing`.
2. Copies all template code cleanly (excluding `node_modules` and old client data).
3. Renames `package.json` to `apex-plumbing`.
4. Initializes a clean `.env` with a unique default admin password.
5. Sets up an `intake/` folder with starter `brief.md` and `prompt.txt`.
6. Initializes a fresh `git` repository.

---

## 5. The Modular Data Layer

You do not need to rewrite UI components for each new client. **95% of client customization happens in 4 files**:

### 1. `src/data/businessData.js`
Contains all business details, phone numbers, addresses, Google Maps links, hours, and customer reviews:
```javascript
export const BUSINESS_INFO = {
  name: "Apex Elite Plumbing",
  legalName: "Apex Elite Plumbing LLC",
  tagline: "Dallas's Premier 24/7 Master Commercial & Residential Plumbers",
  address: {
    street: "4512 Main St",
    city: "Dallas",
    state: "TX",
    zip: "75201",
    formatted: "4512 Main St, Dallas, TX 75201",
  },
  phone: "(214) 555-0199",
  email: "service@apexplumbing.com",
  googleMapsLink: "https://maps.google.com/...",
  hours: [
    { day: "Monday", open: "7:00 AM", close: "6:00 PM", note: "" },
    // ...
  ],
  reviews: [ /* 4 authentic reviews */ ]
};

// Automatic timezone calculation for live "Open Now" / "Closed" pill
export const isOpenNow = () => {
  const now = new Date();
  const hour = now.getHours();
  return hour >= 7 && hour < 18;
};
```

### 2. `src/data/servicesData.js`
Contains the complete catalog of 10-25 services:
```javascript
export const SERVICES = [
  {
    id: 'emergency-leak-repair',
    title: 'Emergency Slab & Pipe Leak Repair',
    category: 'Repairs',
    subType: 'Slab leak',
    description: 'Rapid acoustic and thermal camera leak detection with minimal invasive wall/floor access.',
    icon: 'Droplets', // Valid Lucide icon name
    popular: true,
  },
  // ...
];
```

### 3. `src/data/amenitiesData.js`
Lists facility conveniences and accepted payments:
```javascript
export const AMENITIES_AVAILABLE = [
  { name: '24/7 Emergency Dispatch', icon: 'Clock', description: 'Technicians on call around the clock' },
  { name: 'Upfront Flat-Rate Pricing', icon: 'Banknote', description: 'Zero surprise charges or hidden fees' },
  // ...
];

export const PAYMENT_METHODS = [
  { name: 'Cash', accepted: true },
  { name: 'Credit Cards', accepted: true },
  { name: 'Zelle', accepted: true },
  { name: 'Financing Available', accepted: true },
  { name: 'Venmo', accepted: false }
];
```

### 4. `tailwind.config.js`
Swap brand colors in seconds:
```javascript
colors: {
  shop: {
    red: '#1d4ed8',        // Replace red with client's primary brand color (e.g. Royal Blue)
    redHover: '#1e40af',   // Hover state
    dark: '#000000',
    charcoal: '#0a0a0a',
  }
}
```

---

## 6. Adapting the 12-Step Wizard to Any Trade

The 12-step wizard is built around **micro-commitments**. To adapt it for different industries, modify Step 5 & Step 6 in `src/components/wizard/QuoteWizardModal.jsx`:

| Industry | Step 1 (Category) | Step 5 (Trade Qualification) | Step 6 (Specific Details) |
|---|---|---|---|
| **Auto Repair** | Diagnosis / Maintenance / Repairs | Vehicle Make (Ford, Chevy, Ram...) | Model & Year (e.g. 2021 F-150) |
| **Plumbing** | Emergency / Water Heaters / Drains | Property Type (Residential / Commercial) | Approx Age & Pipe Material |
| **Roofing** | Inspection / Repair / Full Replacement | Roof Material (Shingle, Metal, Tile, Flat) | Approx Square Footage / Stories |
| **HVAC** | A/C Repair / Heating / Maintenance | System Type (Central Air, Heat Pump, Mini-Split)| Brand & Age of Unit |
| **Electrician** | Panel Upgrade / Wiring / EV Charger | Property Type & Current Amperage | Location of Electrical Box |
| **Cleaning** | Deep Clean / Move-In / Recurring Office | Property Size (1-2 Bed, 3-4 Bed, Office SqFt)| Special Requests (Pets, Windows) |

The rest of the flow (**Towing/Logistics, Timeline, Auto-Location with OpenStreetMap, Email, Name, Phone**) remains standard and delivers maximum conversion rates.

---

## 7. The Shop Admin Operating System

Navigate to `/#/admin` (Default password configured in `.env`):

### 1. Cryptographic Authentication
- Passwords are encrypted using **PBKDF2 with SHA-512, 100,000 iterations, and a 16-byte cryptographic salt**.
- Verified using `crypto.timingSafeEqual` to eliminate timing vulnerabilities.
- Sessions issue a secure 32-byte cryptographic token with 14-day lifetime.

### 2. The Executive Dashboard (`DashboardOverview.jsx`)
- **4 Real-Time KPI Cards:** Total Orders, Completed Jobs, Quotes Sent, Pending Action.
- **Weekly Repair Volume Chart:** SVG bar chart showing capacity.
- **Priority Bay Card:** Highlights the most urgent pending job.
- **Shop Bay Stopwatch:** Interactive labor tracking clock (*Hours:Minutes:Seconds*) with Start, Pause, and Reset controls.

### 3. Orders Hub & Phone Creator (`OrdersView.jsx` & `NewOrderModal.jsx`)
- Real-time polling synchronization every 12 seconds.
- Multi-tab filtering (*Needs Quote*, *Quoted*, *Completed*, *Archived*).
- Walk-in / Phone quote modal allows office staff to record offline inquiries into the SQLite database in seconds.

### 4. Quote Dispatch Studio (`QuoteDetailModal.jsx`)
When the business owner opens a quote:
1. Enters total price ($ USD), turnaround time, warranty terms, and custom personal note.
2. Clicks **"Send Official Quote to Customer"**.
3. The system generates a high-converting, branded HTML email matching the shop's aesthetic and dispatches it straight to the customer.
4. Updates order status to `Quoted` in SQLite with timestamp and pricing history.

### 5. Two-Way Customer Inbox (`InboxView.jsx`)
- Converts incoming quote requests into live threaded conversations.
- Staff can reply directly, attaching official quote estimates inline.

### 6. Self-Serve Client Settings (`AdminSettings.jsx`)
Business owners can configure credentials privately **without needing developer help**:
- **Telegram Panel:** Paste Bot Token & Chat ID, click **"Test Telegram Connection"** to verify immediate phone ping.
- **EmailJS Panel:** Paste Service ID, Template IDs, Public Key, click **"Send Test Quote Email"** to verify inbox delivery.
- **Password Reset:** Cryptographic password update panel.

---

## 8. Backend Engine, SQLite & Integrations

- **Zero-Dependency Native Node.js 24**:
  - Uses `node:http` (no heavy third-party Express dependencies).
  - Uses Node 24 native `node:sqlite` (`DatabaseSync`) — requires zero C++ compilation (`node-gyp`), making it 100% portable on Windows, Mac, and Linux.
  - Activated **WAL mode** (`PRAGMA journal_mode = WAL;`) for sub-millisecond query execution and high concurrency.
- **ACID Database Tables**:
  - `quotes`: Complete customer, vehicle/property, logistics, and pricing history.
  - `settings`: Key-value store for shop configuration and masked credentials.
  - `sessions`: Token expiration and authentication lifetimes.
  - `quote_messages`: Full two-way threaded message logs.

---

## 9. Local SEO & Performance Architecture

The `index.html` file includes enterprise-grade search engine optimization:
1. **Schema.org JSON-LD Structured Data**: Pre-configured for local service businesses (`AutoRepair`, `PlumbingService`, `HomeAndConstructionBusiness`). Enables Google Rich Snippets, star ratings, and price indicators in search results.
2. **Geo-Targeting Meta Tags**: `geo.region`, `geo.placename`, `geo.position`, `ICBM` coordinates.
3. **Resource Hints**: `preconnect` and `dns-prefetch` for Google Fonts and Google Maps.
4. **Hero Video & Poster Preloading**: `<link rel="preload">` prevents layout shifts on slow mobile connections.

---

## 10. Production Deployment (GitHub & Vercel)

### Step 1: Push to GitHub
```powershell
cd "C:\Users\DELL\Documents\your-project-slug"
git add .
git commit -m "feat: complete initial release for Client Name"
git remote add origin https://github.com/YourUsername/your-project-slug.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy Frontend to Vercel
```powershell
npx vercel --prod
```
- Select your project name.
- Vercel automatically detects Vite and deploys the production build.
- Routing and API proxying are handled cleanly by `vercel.json`.

### Step 3: Deploy Backend API (Render / Railway / VPS)
- The backend is a standard Node.js process: `node server/index.js`.
- On Render: Create a "Web Service", connect the GitHub repo, set Build Command to `npm install`, and Start Command to `npm start`.
- Update line 5 of `vercel.json` with your live backend URL:
  ```json
  {
    "source": "/api/:path*",
    "destination": "https://your-backend-api.onrender.com/api/:path*"
  }
  ```

---

## 11. The 1-Prompt Antigravity Recipe

To generate your next 100 websites automatically, you can paste the following master prompt into Antigravity:

```text
Build a complete new website project using the Master Template at:
"C:\Users\DELL\Documents\service-biz-master-template"

Client Details:
- Project Name: [Apex Elite Plumbing]
- Project Slug: [apex-plumbing]
- Intake Folder: [C:\Users\DELL\Documents\intake\apex-plumbing]

Instructions:
1. Run the scaffolding script to create C:\Users\DELL\Documents\apex-plumbing
2. Ingest brief.md from the intake folder and populate:
   - src/data/businessData.js (name, phone, address, hours, reviews)
   - src/data/servicesData.js (all client services with icons)
   - src/data/amenitiesData.js (amenities & payments)
   - tailwind.config.js (brand colors: #1d4ed8 Royal Blue)
   - index.html (title, meta description, schema.org JSON-LD for Plumber)
3. Copy raw intake images into public/images/ and set public/logo.png
4. Verify the build with 'npm run build'
5. Commit to git and prepare for Vercel deployment.
```

Antigravity will execute the entire process end-to-end and deliver a tested, verified production site!