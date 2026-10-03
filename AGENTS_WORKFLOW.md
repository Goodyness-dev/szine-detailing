# TSB-OS Autonomous 2-Agent Production Pipeline

This guide documents the streamlined 2-agent workflow for rapidly producing and certifying high-converting service business websites.

---

## The 4-Step Production Flow

```
  Step 1: Scaffolding (Script - 5 sec)
    └─> Run .\create-project.ps1 -Name "Apex Elite Plumbing"

  Step 2: Intake, Content & Creative Direction (Agent 1)
    └─> "intake-content-agent"
        - Ingests brief, Google Maps link, and design/animation preferences
        - Crafts localized SEO data layers (businessData, servicesData, amenitiesData)
        - Configures Tailwind brand colors
        - Prescribes hero video loops & UI micro-interactions

  Step 3: Trade Wizard & Custom Touches (You + Assistant)
    └─> Adapt QuoteWizardModal.jsx for the specific trade qualification steps
    └─> Wire up the prescribed hero video, animations, and icons

  Step 4: Pre-Flight Audit & Certification (Agent 2)
    └─> "preflight-qa-agent"
        - Scans for template leaks (e.g. leftover "Toby", "TODO", fake emails)
        - Verifies phone/email links & admin credentials
        - Runs `npm run build`
        - Issues the Pre-Flight Green-Light Certification
```

---

## Agent 1: Intake & Creative Direction (`intake-content-agent`)

### When to invoke:
Immediately after scaffolding a new site directory.

### What you provide to the agent:
1. Client brief or raw notes
2. Google Maps link or existing business website / Yelp URL
3. Target trade qualification workflow (e.g., "Ask residential vs commercial, then leak location")
4. Design vibe / animation preferences (e.g., "Midnight theme with deep sapphire blue, water ripple background video, glowing badge for 24/7 dispatch")

### What the agent does automatically:
- Researches local competitors and city keywords.
- Generates:
  - `src/data/businessData.js` (phone, hours, address, reviews, founder bio).
  - `src/data/servicesData.js` (15+ structured services across 3 tiers).
  - `src/data/amenitiesData.js` (financing, warranties, emergency dispatch).
  - `tailwind.config.js` (`shop.red` and `shop.redHover` brand values).
  - `index.html` (SEO title, meta tags, schema.org JSON-LD).
- Returns a **Creative Execution Plan** detailing hero video ideas and animation triggers.

### Example Prompt:
> *"Run `intake-content-agent` on `..\apex-plumbing`. Here is the Google Maps link: [URL]. Business name: Apex Elite Plumbing in Pickering, ON. Style: Deep ocean blue, modern 24/7 emergency theme, video background with water flow, and animated review cards."*

---

## Agent 2: Pre-Flight QA Inspector (`preflight-qa-agent`)

### When to invoke:
Right before deploying to Vercel or handing off to the client.

### What the agent does automatically:
- **Leak Detection:** Greps for "Toby", "tobi", "Casa Grande", "AZ 85122", "lorem", "TODO", "yourdomain.com".
- **Link Auditing:** Checks all `tel:`, `mailto:`, and external links.
- **Admin Verification:** Confirms `AdminLayout`, `AdminLogin`, and `QuoteDetailModal` match the client.
- **Build Certification:** Runs `npm run build` and ensures exit code 0.
- **Auto-Fix:** Patches lingering placeholder strings if discovered.

### Example Prompt:
> *"Run `preflight-qa-agent` on `..\apex-plumbing` to audit the project and make sure it is 100% clean and ready for production."*
