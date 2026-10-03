#!/usr/bin/env node
/**
 * Autonomous Design Agent Engine for Service Business Scaffolder
 * 
 * 1. Researches and classifies project niche & business identity.
 * 2. Generates bespoke, harmonic design themes (colors, typography, layout archetype).
 * 3. Crafts precise, photorealistic prompts for image generation (hero visual, mood board).
 * 4. Injects design system tokens into tailwind.config.js, index.html, index.css, and src/data/designTheme.js.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// ============================================================================
// 1. ARCHETYPE REGISTRY & DESIGN KNOWLEDGE BASE
// ============================================================================

export const ARCHETYPES = {
  ITALIAN_RUSTIC_TRATTORIA: {
    id: 'italian-rustic',
    name: 'Warm Mediterranean Trattoria & Pizzeria',
    keywords: ['italian', 'pizza', 'pizzeria', 'trattoria', 'pasta', 'ristorante', 'osteria', 'wood-fired', 'forno'],
    headingFont: 'Fraunces',
    bodyFont: 'Plus Jakarta Sans',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..900;1,9..144,400..900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
    colorBases: [
      { primary: '#b84227', primaryHover: '#98331d', secondary: '#2e4a3d', accent: '#d97736', bgLight: '#fdfbf7', bgDark: '#120f0d', surfaceLight: '#ffffff', surfaceDark: '#1a1613', borderLight: '#ebdcd0', borderDark: '#2c241e' },
      { primary: '#c0392b', primaryHover: '#962d22', secondary: '#39424e', accent: '#e67e22', bgLight: '#faf8f5', bgDark: '#141110', surfaceLight: '#ffffff', surfaceDark: '#1e1917', borderLight: '#eedfd5', borderDark: '#302622' },
      { primary: '#9e3223', primaryHover: '#7e261a', secondary: '#414a38', accent: '#c4823f', bgLight: '#fcfaf6', bgDark: '#110f0e', surfaceLight: '#ffffff', surfaceDark: '#1b1715', borderLight: '#e8dbd0', borderDark: '#2b231f' },
    ],
    layoutStyle: 'split-editorial',
    borderRadius: 'rounded-2xl',
    heroBadge: 'Authentic Heritage Kitchen & Wood-Fired Oven',
    heroHeadline: 'Handcrafted Italian Flavors, Made from the Heart',
    heroSubtitle: 'Slow-simmered regional sauces, hand-pulled mozzarella, and wood-fired Neapolitan specialties prepared fresh daily.',
    quickActionLabel: 'Explore Pasta, Pizza & Daily Chef Specials...',
    imagePrompt: (name, city) => `Cinematic 8k commercial photograph of authentic Italian dining at ${name}${city ? ` in ${city}` : ''}. In the foreground, an artisanal wood-fired Neapolitan pizza with blistered crust, fresh buffalo mozzarella, vibrant San Marzano tomatoes, and fragrant basil leaves on a rustic dark wooden table. Soft warm tavern lighting, shallow depth of field, natural steam rising, high-end editorial food photography.`
  },

  JAPANESE_ZEN_MINIMAL: {
    id: 'japanese-zen',
    name: 'Japanese Omakase & Modern Ramen House',
    keywords: ['sushi', 'ramen', 'japanese', 'omakase', 'izakaya', 'bistro', 'tokyo', 'noodle', 'sakura'],
    headingFont: 'Cinzel',
    bodyFont: 'Plus Jakarta Sans',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap',
    colorBases: [
      { primary: '#c2410c', primaryHover: '#9a3412', secondary: '#334155', accent: '#b45309', bgLight: '#f8fafc', bgDark: '#090a0f', surfaceLight: '#ffffff', surfaceDark: '#12141c', borderLight: '#e2e8f0', borderDark: '#1e2230' },
      { primary: '#e11d48', primaryHover: '#be123c', secondary: '#1e293b', accent: '#d97706', bgLight: '#fcfcfc', bgDark: '#0a0a0c', surfaceLight: '#ffffff', surfaceDark: '#141418', borderLight: '#e5e5e5', borderDark: '#23232a' },
    ],
    layoutStyle: 'cinematic-bento',
    borderRadius: 'rounded-2xl',
    heroBadge: 'Master Knife Craft & Artisanal Broths',
    heroHeadline: 'Artistry in Every Slice, Precision in Every Bowl',
    heroSubtitle: 'Sustainably sourced sushi-grade sashimi, 18-hour slow-simmered rich broths, and authentic culinary technique.',
    quickActionLabel: 'Omakase Nigiri, Tonkotsu Ramen, Fresh Rolls...',
    imagePrompt: (name, city) => `Masterful commercial food photograph of luxury Japanese sushi and ramen presentation for ${name}. Elegant slate dark platter displaying pristine salmon and tuna nigiri with delicate micro-greens and gold leaf, next to a steaming ceramic bowl of rich ramen with ajitsuke tamago. Studio dark food photography, moody directional lighting, minimalist Japanese aesthetics.`
  },

  VIBRANT_MEXICAN_TAQUERIA: {
    id: 'mexican-street',
    name: 'Vibrant Authentic Taqueria & Cantina',
    keywords: ['taco', 'tacos', 'taqueria', 'carnitas', 'birria', 'mexican', 'mariscos', 'burrito', 'asada', 'guero', 'charro', 'paisa'],
    headingFont: 'Bricolage Grotesque',
    bodyFont: 'Inter',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800;12..96,900&family=Inter:wght@400;500;600;700&display=swap',
    colorBases: [
      { primary: '#ea580c', primaryHover: '#c2410c', secondary: '#15803d', accent: '#ca8a04', bgLight: '#fafaf9', bgDark: '#12100d', surfaceLight: '#ffffff', surfaceDark: '#1c1814', borderLight: '#e7e5e4', borderDark: '#2c251d' },
      { primary: '#dc2626', primaryHover: '#b91c1c', secondary: '#047857', accent: '#d97706', bgLight: '#fbfbfa', bgDark: '#100e0d', surfaceLight: '#ffffff', surfaceDark: '#1a1614', borderLight: '#e8e5e3', borderDark: '#2d2420' },
      { primary: '#d97706', primaryHover: '#b45309', secondary: '#166534', accent: '#dc2626', bgLight: '#fefce8', bgDark: '#14120b', surfaceLight: '#ffffff', surfaceDark: '#1e1a10', borderLight: '#fef08a', borderDark: '#302813' },
    ],
    layoutStyle: 'bold-action',
    borderRadius: 'rounded-3xl',
    heroBadge: 'Traditional Fire-Roasted Meats & Hand-Pressed Tortillas',
    heroHeadline: 'Authentic Street Flavor, Uncompromising Tradition',
    heroSubtitle: 'Slow-simmered birria de res, citrus-marinated carne asada, and handmade corn tortillas hot off the comal.',
    quickActionLabel: 'Quesabirria, Street Tacos, Fresh Salsas...',
    imagePrompt: (name, city) => `Vibrant, appetizing culinary shot of signature Mexican street tacos for ${name}. Platter of crispy quesabirria tacos dripping with rich consomé, topped with fresh diced white onion, bright cilantro, and lime wedges. Warm rustic terracotta backdrop, natural vibrant colors, shallow depth of field, authentic street food excellence.`
  },

  LUXURY_COSMETIC_MEDSPA: {
    id: 'luxury-medspa',
    name: 'High-End MedSpa, Aesthetics & Beauty Lounge',
    keywords: ['spa', 'medspa', 'beauty', 'skin', 'facial', 'laser', 'brows', 'lash', 'botox', 'aesthetic', 'nails', 'massage', 'cosmetics'],
    headingFont: 'Playfair Display',
    bodyFont: 'Plus Jakarta Sans',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;0,900;1,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
    colorBases: [
      { primary: '#935638', primaryHover: '#78432a', secondary: '#4a3b32', accent: '#c6957b', bgLight: '#faf8f5', bgDark: '#0e0b0a', surfaceLight: '#ffffff', surfaceDark: '#181412', borderLight: '#ede5df', borderDark: '#29201b' },
      { primary: '#a855f7', primaryHover: '#9333ea', secondary: '#3b0764', accent: '#d946ef', bgLight: '#faf5ff', bgDark: '#0d0714', surfaceLight: '#ffffff', surfaceDark: '#180e24', borderLight: '#f3e8ff', borderDark: '#28173d' },
      { primary: '#0d9488', primaryHover: '#0f766e', secondary: '#134e4a', accent: '#14b8a6', bgLight: '#f0fdfa', bgDark: '#061311', surfaceLight: '#ffffff', surfaceDark: '#0d211e', borderLight: '#ccfbf1', borderDark: '#133530' },
    ],
    layoutStyle: 'split-editorial',
    borderRadius: 'rounded-3xl',
    heroBadge: 'Board-Certified Aesthetic Specialists & Medical Spa',
    heroHeadline: 'Elevating Your Natural Radiance & Confidence',
    heroSubtitle: 'Bespoke clinical skin therapies, non-invasive rejuvenation, and luxury aesthetic treatments in a serene private sanctuary.',
    quickActionLabel: 'Custom Facials, Anti-Aging Therapies, Skin Health...',
    imagePrompt: (name, city) => `High-end luxury interior photography of a modern medical spa treatment suite at ${name}. Minimalist architectural aesthetic, soft neutral warm travertine textures, soothing ambient recessed lighting, botanical monstera accents, pristine modern clinical aesthetic equipment, peaceful and serene sanctuary atmosphere.`
  },

  MODERN_CLINICAL_DENTISTRY: {
    id: 'clinical-dental',
    name: 'Advanced Family & Cosmetic Dentistry',
    keywords: ['dental', 'dentist', 'dentistry', 'dmd', 'dds', 'teeth', 'smile', 'orthodontics', 'implants', 'hygiene'],
    headingFont: 'Outfit',
    bodyFont: 'Plus Jakarta Sans',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
    colorBases: [
      { primary: '#0284c7', primaryHover: '#0369a1', secondary: '#0f172a', accent: '#06b6d4', bgLight: '#f8fafc', bgDark: '#0a0e17', surfaceLight: '#ffffff', surfaceDark: '#111827', borderLight: '#e2e8f0', borderDark: '#1e293b' },
      { primary: '#059669', primaryHover: '#047857', secondary: '#064e3b', accent: '#10b981', bgLight: '#f0fdf4', bgDark: '#06120d', surfaceLight: '#ffffff', surfaceDark: '#0c2419', borderLight: '#dcfce7', borderDark: '#143828' },
      { primary: '#2563eb', primaryHover: '#1d4ed8', secondary: '#1e3a8a', accent: '#38bdf8', bgLight: '#f0f9ff', bgDark: '#070f1e', surfaceLight: '#ffffff', surfaceDark: '#0d1d3a', borderLight: '#e0f2fe', borderDark: '#162e5c' },
    ],
    layoutStyle: 'split-editorial',
    borderRadius: 'rounded-2xl',
    heroBadge: 'State-of-the-Art Digital Dentistry & Compassionate Care',
    heroHeadline: 'Transformative Smiles, Gentle Modern Dentistry',
    heroSubtitle: 'Comprehensive family preventive care, cosmetic smile makeovers, and same-day restorative treatments designed around your comfort.',
    quickActionLabel: 'Preventative Exams, Invisalign, Teeth Whitening...',
    imagePrompt: (name, city) => `Bright, inviting architectural photo of a state-of-the-art modern dental clinic operatorium for ${name}. Ergonomic designer dental chair, floor-to-ceiling glass windows with natural morning sunlight, clean warm wood ceiling baffles, ultra-high-tech digital displays, welcoming and anxiety-free patient environment.`
  },

  PRECISION_COMMERCIAL_LOGISTICS: {
    id: 'precision-industrial',
    name: 'Heavy Industrial, Commercial Doors & Logistics',
    keywords: ['dock', 'door', 'doors', 'overhead', 'leveler', 'warehouse', 'industrial', 'commercial', 'welding', 'fabrication', 'crane'],
    headingFont: 'Space Grotesk',
    bodyFont: 'Geist',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Geist:wght@400;500;600;700&display=swap',
    colorBases: [
      { primary: '#f97316', primaryHover: '#ea580c', secondary: '#0f172a', accent: '#eab308', bgLight: '#f8fafc', bgDark: '#090d16', surfaceLight: '#ffffff', surfaceDark: '#111726', borderLight: '#e2e8f0', borderDark: '#1d273d' },
      { primary: '#e11d48', primaryHover: '#be123c', secondary: '#18181b', accent: '#f59e0b', bgLight: '#fafafa', bgDark: '#0a0a0c', surfaceLight: '#ffffff', surfaceDark: '#141418', borderLight: '#e4e4e7', borderDark: '#24242c' },
      { primary: '#2563eb', primaryHover: '#1d4ed8', secondary: '#0f172a', accent: '#f97316', bgLight: '#f8fafc', bgDark: '#080c14', surfaceLight: '#ffffff', surfaceDark: '#101728', borderLight: '#e2e8f0', borderDark: '#1a2640' },
    ],
    layoutStyle: 'cinematic-bento',
    borderRadius: 'rounded-xl',
    heroBadge: '24/7 Rapid Response Commercial Fleet & Facility Service',
    heroHeadline: 'Zero Downtime Overhead Door & Dock Solutions',
    heroSubtitle: 'Heavy-duty industrial roll-up doors, hydraulic dock leveler overhauls, and preventative commercial facility maintenance.',
    quickActionLabel: 'Dock Levelers, High-Speed Doors, Emergency Service...',
    imagePrompt: (name, city) => `Hero industrial commercial photography of high-tech logistics warehouse loading docks installed by ${name}. Giant modern steel overhead doors with yellow safety striping, hydraulic dock levelers, pristine industrial concrete floor with clean reflections, crisp architectural lighting, ultra-high reliability industrial environment.`
  },

  COZY_ARTISAN_BAKERY_CAFE: {
    id: 'artisan-bakery',
    name: 'Cozy Artisanal Bakery, Espresso & Brunch Club',
    keywords: ['cafe', 'coffee', 'bakery', 'breakfast', 'brunch', 'pastry', 'deli', 'roasters', 'espresso', 'skillet', 'griddle', 'sandwich'],
    headingFont: 'DM Serif Display',
    bodyFont: 'DM Sans',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,400..800;1,9..40,400..800&display=swap',
    colorBases: [
      { primary: '#854d0e', primaryHover: '#713f12', secondary: '#422006', accent: '#ca8a04', bgLight: '#fefce8', bgDark: '#141108', surfaceLight: '#ffffff', surfaceDark: '#1e1a0e', borderLight: '#fef08a', borderDark: '#2e2614' },
      { primary: '#78350f', primaryHover: '#451a03', secondary: '#292524', accent: '#d97706', bgLight: '#fafaf9', bgDark: '#12100d', surfaceLight: '#ffffff', surfaceDark: '#1c1814', borderLight: '#e7e5e4', borderDark: '#2c251d' },
      { primary: '#0f766e', primaryHover: '#115e59', secondary: '#134e4a', accent: '#ca8a04', bgLight: '#f0fdfa', bgDark: '#081412', surfaceLight: '#ffffff', surfaceDark: '#10221f', borderLight: '#ccfbf1', borderDark: '#18332f' },
    ],
    layoutStyle: 'split-editorial',
    borderRadius: 'rounded-3xl',
    heroBadge: 'Freshly Baked at Dawn & Single-Origin Roasted Brews',
    heroHeadline: 'Artisanal Comfort in Every Sip & Every Crumb',
    heroSubtitle: 'Flaky slow-fermented croissants, locally roasted espresso craft drinks, and warm breakfast favorites made from scratch daily.',
    quickActionLabel: 'Fresh Pastries, Pour-Overs, Breakfast Skillets...',
    imagePrompt: (name, city) => `Warm, inviting lifestyle photograph of a bustling boutique artisanal bakery and coffee house for ${name}. In focus on a rustic oak counter: golden flaky sourdough croissants with visible layers and a ceramic cup of espresso with intricate latte art. Golden morning sunlight streaming through cafe windows, warm nostalgic cozy atmosphere.`
  },

  BOLD_PERFORMANCE_AUTOMOTIVE: {
    id: 'performance-auto',
    name: 'Precision Automotive & Heavy Diesel Performance',
    keywords: ['auto', 'mechanic', 'repair', 'diesel', 'transmission', 'brakes', 'engine', 'truck', 'towing', 'tire', 'garage'],
    headingFont: 'Montserrat',
    bodyFont: 'Inter',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap',
    colorBases: [
      { primary: '#dc2626', primaryHover: '#b91c1c', secondary: '#171717', accent: '#ef4444', bgLight: '#f8fafc', bgDark: '#0a0a0c', surfaceLight: '#ffffff', surfaceDark: '#141416', borderLight: '#e2e8f0', borderDark: '#222228' },
      { primary: '#2563eb', primaryHover: '#1d4ed8', secondary: '#0f172a', accent: '#3b82f6', bgLight: '#f8fafc', bgDark: '#080c14', surfaceLight: '#ffffff', surfaceDark: '#101726', borderLight: '#e2e8f0', borderDark: '#1c263c' },
      { primary: '#d97706', primaryHover: '#b45309', secondary: '#18181b', accent: '#f59e0b', bgLight: '#fafafa', bgDark: '#0c0a06', surfaceLight: '#ffffff', surfaceDark: '#16140e', borderLight: '#f4f4f5', borderDark: '#262218' },
    ],
    layoutStyle: 'bold-action',
    borderRadius: 'rounded-2xl',
    heroBadge: 'Master Certified Technicians & Heavy Diagnostics',
    heroHeadline: 'Uncompromising Automotive & Diesel Precision',
    heroSubtitle: 'Computerized factory diagnostics, full engine swaps, transmission rebuilding, and honest, transparent estimates.',
    quickActionLabel: 'Brakes, Diagnostics, Engine Repair, Transmission...',
    imagePrompt: (name, city) => `Hero commercial automotive photograph inside a clean, high-end professional performance repair bay for ${name}. High-gloss epoxy floor reflecting shop lights, precision diagnostic computers, immaculate vehicle lift bay, bold dynamic automotive tools, professional craftsmanship aesthetic.`
  },

  MODERN_HIGH_TECH_TRADES: {
    id: 'modern-trades',
    name: 'Modern Home Services, Plumbing & Smart HVAC',
    keywords: ['plumbing', 'plumber', 'drain', 'pipe', 'hvac', 'heating', 'cooling', 'air conditioning', 'electric', 'electrician', 'solar', 'roofing'],
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@600;700;800;900&family=Inter:wght@400;500;600;700&display=swap',
    colorBases: [
      { primary: '#0284c7', primaryHover: '#0369a1', secondary: '#0f172a', accent: '#f59e0b', bgLight: '#f8fafc', bgDark: '#080e18', surfaceLight: '#ffffff', surfaceDark: '#10192a', borderLight: '#e2e8f0', borderDark: '#1c2b44' },
      { primary: '#0d9488', primaryHover: '#0f766e', secondary: '#111827', accent: '#f97316', bgLight: '#f0fdfa', bgDark: '#071311', surfaceLight: '#ffffff', surfaceDark: '#0f2220', borderLight: '#ccfbf1', borderDark: '#1a3733' },
      { primary: '#4f46e5', primaryHover: '#4338ca', secondary: '#0f172a', accent: '#06b6d4', bgLight: '#f5f3ff', bgDark: '#0b0a1a', surfaceLight: '#ffffff', surfaceDark: '#15132c', borderLight: '#ede9fe', borderDark: '#232048' },
    ],
    layoutStyle: 'split-editorial',
    borderRadius: 'rounded-2xl',
    heroBadge: 'Licensed, Bonded & Insured Same-Day Priority Service',
    heroHeadline: 'Precision Trade Craftsmanship, Guaranteed Results',
    heroSubtitle: 'Rapid dispatch emergency repairs, non-invasive digital camera diagnostics, and transparent upfront pricing without surprises.',
    quickActionLabel: 'Emergency Leak Check, Drain Clearing, AC Tune-Up...',
    imagePrompt: (name, city) => `Hero commercial service photograph of a modern, equipped professional technician van and specialist at work for ${name}. Clean uniform, high-tech digital diagnostic gauges, bright sunny neighborhood residential background, reliable, trustworthy professional craftsmanship.`
  },

  EARTHY_WELLNESS_PET: {
    id: 'wellness-pet',
    name: 'Holistic Wellness, Pet Sanctuary & Canine Adventures',
    keywords: ['pet', 'dog', 'cat', 'paws', 'puppy', 'veterinary', 'grooming', 'vet', 'boarding', 'animal', 'sitting', 'adventures'],
    headingFont: 'Outfit',
    bodyFont: 'Plus Jakarta Sans',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Outfit:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
    colorBases: [
      { primary: '#15803d', primaryHover: '#166534', secondary: '#1c1917', accent: '#d97706', bgLight: '#f0fdf4', bgDark: '#08140c', surfaceLight: '#ffffff', surfaceDark: '#102216', borderLight: '#dcfce7', borderDark: '#1a3624' },
      { primary: '#0284c7', primaryHover: '#0369a1', secondary: '#1e293b', accent: '#f59e0b', bgLight: '#f0f9ff', bgDark: '#07101a', surfaceLight: '#ffffff', surfaceDark: '#0e1d2e', borderLight: '#e0f2fe', borderDark: '#172e48' },
      { primary: '#854d0e', primaryHover: '#713f12', secondary: '#292524', accent: '#16a34a', bgLight: '#fefce8', bgDark: '#121008', surfaceLight: '#ffffff', surfaceDark: '#1c190e', borderLight: '#fef08a', borderDark: '#2c2714' },
    ],
    layoutStyle: 'split-editorial',
    borderRadius: 'rounded-3xl',
    heroBadge: 'Certified Fear-Free Handlers & Loving Pet Care',
    heroHeadline: 'Unconditional Love & Compassionate Professional Care',
    heroSubtitle: 'Spacious climate-controlled play suites, gentle organic spa grooming, and certified personalized supervision your pets will adore.',
    quickActionLabel: 'Spa Bath & Deshed, Luxury Boarding, Day Play...',
    imagePrompt: (name, city) => `Heartwarming, high-definition photography of a happy, well-groomed golden retriever in a sunlit modern indoor luxury pet suite for ${name}. Warm natural light, clean timber accents, joyful expression, clean and loving pet sanctuary atmosphere.`
  },

  COASTAL_SEAFOOD_GRILL: {
    id: 'coastal-seafood',
    name: 'Fresh Coastal Seafood & Cajun Crab Boil',
    keywords: ['seafood', 'crab', 'cajun', 'shrimp', 'oyster', 'lobster', 'mariner', 'boil', 'coastal', 'bay', 'fish', 'bayside', 'channel'],
    headingFont: 'Cinzel',
    bodyFont: 'Plus Jakarta Sans',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
    colorBases: [
      { primary: '#0284c7', primaryHover: '#0369a1', secondary: '#0c4a6e', accent: '#f97316', bgLight: '#f0f9ff', bgDark: '#05101a', surfaceLight: '#ffffff', surfaceDark: '#0a1d2f', borderLight: '#bae6fd', borderDark: '#122e49' },
      { primary: '#ea580c', primaryHover: '#c2410c', secondary: '#1e293b', accent: '#0284c7', bgLight: '#fff7ed', bgDark: '#120b06', surfaceLight: '#ffffff', surfaceDark: '#1d130c', borderLight: '#ffedd5', borderDark: '#2d1f14' },
    ],
    layoutStyle: 'split-editorial',
    borderRadius: 'rounded-2xl',
    heroBadge: 'Wild-Caught Daily & Signature Cajun Spices',
    heroHeadline: 'From Harbor Waters Directly to Your Table',
    heroSubtitle: 'Fresh snow crab clusters, colossal shrimp, live oysters shucked to order, and rich garlic-butter boil seasonings.',
    quickActionLabel: 'Crab Boils, Fresh Oysters, Grilled Catfish...',
    imagePrompt: (name, city) => `Mouth-watering commercial seafood photography of a grand seafood feast at ${name}. Steaming snow crab legs, jumbo shrimp, and sweet corn on the cob tossed in glistening cajun garlic butter sauce. Rustic dark timber table, lemon wedges, natural ocean harbor aesthetic.`
  },

  SMOKEHOUSE_BBQ_PIT: {
    id: 'smokehouse-bbq',
    name: 'Authentic Wood-Smoked BBQ & Southern Smokehouse',
    keywords: ['bbq', 'barbeque', 'smokehouse', 'pitmaster', 'brisket', 'ribs', 'smoked', 'pulled pork', 'hickory', 'wood-smoked'],
    headingFont: 'Syne',
    bodyFont: 'Inter',
    googleFontsUrl: 'https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=Inter:wght@400;500;600;700&display=swap',
    colorBases: [
      { primary: '#b91c1c', primaryHover: '#991b1b', secondary: '#18181b', accent: '#d97706', bgLight: '#fafaf9', bgDark: '#120c0a', surfaceLight: '#ffffff', surfaceDark: '#1c1410', borderLight: '#e7e5e4', borderDark: '#2c1e18' },
      { primary: '#ea580c', primaryHover: '#c2410c', secondary: '#27272a', accent: '#ca8a04', bgLight: '#fefce8', bgDark: '#140f09', surfaceLight: '#ffffff', surfaceDark: '#1e170f', borderLight: '#fef08a', borderDark: '#2e2316' },
    ],
    layoutStyle: 'bold-action',
    borderRadius: 'rounded-2xl',
    heroBadge: 'Low & Slow 14-Hour Post Oak Smoke',
    heroHeadline: 'Tender Hickory Bark, Deep Mesquite Tradition',
    heroSubtitle: 'Prime Texas-style beef brisket with peppery smoke ring, fall-off-the-bone ribs, and house-crafted molasses glaze.',
    quickActionLabel: 'Prime Brisket, Baby Back Ribs, Pitmaster Platters...',
    imagePrompt: (name, city) => `Hero close-up food photograph of tender sliced smoked prime brisket by ${name}. Crisp black peppery bark with distinct pink smoke ring, glistening juices dripping, resting on craft butcher paper on a rustic dark pitmaster chopping block. Cinematic smoke haze, warm tavern ambient light.`
  }
};

// ============================================================================
// 2. DESIGN RESEARCH & NICHE CLASSIFICATION
// ============================================================================

export function researchNiche(businessName = '', targetUrl = '', explicitArchetype = '', keywords = []) {
  if (explicitArchetype) {
    const matched = Object.values(ARCHETYPES).find(a => 
      a.id.toLowerCase() === explicitArchetype.toLowerCase() || 
      a.name.toLowerCase().includes(explicitArchetype.toLowerCase())
    );
    if (matched) return matched;
  }

  const queryTokens = [
    ...businessName.toLowerCase().split(/[^a-z0-9]+/),
    ...targetUrl.toLowerCase().split(/[^a-z0-9]+/),
    ...keywords.map(k => k.toLowerCase())
  ].filter(t => t.length > 2);

  let bestArchetype = ARCHETYPES.MODERN_HIGH_TECH_TRADES;
  let highestScore = -1;

  for (const [key, archetype] of Object.entries(ARCHETYPES)) {
    let score = 0;
    for (const kw of archetype.keywords) {
      if (queryTokens.includes(kw)) {
        score += 3;
      } else {
        for (const token of queryTokens) {
          if (token.includes(kw) || kw.includes(token)) {
            score += 1;
          }
        }
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestArchetype = archetype;
    }
  }

  return bestArchetype;
}

// ============================================================================
// 3. GENERATIVE DESIGN THEME SYNTHESIZER
// ============================================================================

export function generateDesignTheme(options = {}) {
  const {
    businessName = 'New Client Business',
    targetUrl = '',
    archetypeId = '',
    keywords = [],
    city = ''
  } = options;

  const archetype = researchNiche(businessName, targetUrl, archetypeId, keywords);

  const seedString = `${businessName}-${targetUrl}`;
  const hash = crypto.createHash('md5').update(seedString).digest('hex');
  const paletteIndex = parseInt(hash.slice(0, 2), 16) % archetype.colorBases.length;
  const colorTheme = archetype.colorBases[paletteIndex];

  const layoutVariants = ['split-editorial', 'cinematic-bento', 'bold-action'];
  const layoutIndex = parseInt(hash.slice(2, 4), 16) % layoutVariants.length;
  const selectedLayout = archetype.layoutStyle || layoutVariants[layoutIndex];

  const heroImagePrompt = archetype.imagePrompt(businessName, city);

  return {
    archetypeId: archetype.id,
    archetypeName: archetype.name,
    businessName,
    city,
    fonts: {
      heading: archetype.headingFont,
      body: archetype.bodyFont,
      googleFontsUrl: archetype.googleFontsUrl
    },
    colors: {
      primary: colorTheme.primary,
      primaryHover: colorTheme.primaryHover,
      secondary: colorTheme.secondary,
      accent: colorTheme.accent,
      bgLight: colorTheme.bgLight,
      bgDark: colorTheme.bgDark,
      surfaceLight: colorTheme.surfaceLight,
      surfaceDark: colorTheme.surfaceDark,
      borderLight: colorTheme.borderLight,
      borderDark: colorTheme.borderDark,
      textLight: '#1f2937',
      textDark: '#f9fafb'
    },
    layout: {
      style: selectedLayout,
      borderRadius: archetype.borderRadius
    },
    copyHooks: {
      heroBadge: archetype.heroBadge,
      heroHeadline: archetype.heroHeadline,
      heroSubtitle: archetype.heroSubtitle,
      quickActionLabel: archetype.quickActionLabel
    },
    imageGeneration: {
      heroPosterPrompt: heroImagePrompt,
      conceptMockupPrompt: `Sleek high-converting website UI mockup for ${businessName} showcasing a ${archetype.name} aesthetic. Color palette dominated by ${colorTheme.primary} and ${colorTheme.accent} accents against modern clean dark mode surfaces. Modern typography pairing of ${archetype.headingFont} and ${archetype.bodyFont}, polished cards with subtle drop shadows.`
    }
  };
}

// ============================================================================
// 4. THEME INJECTION ENGINE
// ============================================================================

export function injectDesignTheme(targetDir, theme) {
  if (!fs.existsSync(targetDir)) {
    throw new Error(`Target directory does not exist: ${targetDir}`);
  }

  const dataDir = path.join(targetDir, 'src', 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const themeJsContent = `/**
 * Autonomous Design Agent Theme Specification
 * Synthesized for ${theme.businessName}
 * Archetype: ${theme.archetypeName} (${theme.archetypeId})
 */

export const DESIGN_THEME = ${JSON.stringify(theme, null, 2)};

export default DESIGN_THEME;
`;
  fs.writeFileSync(path.join(dataDir, 'designTheme.js'), themeJsContent, 'utf-8');
  console.log(`   🎨 Injected src/data/designTheme.js [${theme.archetypeName}]`);

  const tailwindPath = path.join(targetDir, 'tailwind.config.js');
  if (fs.existsSync(tailwindPath)) {
    const tailwindContent = `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '${theme.colors.primary}',
          primaryHover: '${theme.colors.primaryHover}',
          secondary: '${theme.colors.secondary}',
          accent: '${theme.colors.accent}',
          bgLight: '${theme.colors.bgLight}',
          bgDark: '${theme.colors.bgDark}',
          surfaceLight: '${theme.colors.surfaceLight}',
          surfaceDark: '${theme.colors.surfaceDark}',
          borderLight: '${theme.colors.borderLight}',
          borderDark: '${theme.colors.borderDark}',
        },
        midnight: {
          DEFAULT: '${theme.colors.bgDark}',
          pure: '${theme.colors.bgDark}',
          card: '${theme.colors.surfaceDark}',
          cardHover: '${theme.colors.surfaceDark}',
          border: '${theme.colors.borderDark}',
          subtle: '${theme.colors.borderDark}',
        },
        shop: {
          red: '${theme.colors.primary}',
          redHover: '${theme.colors.primaryHover}',
          dark: '${theme.colors.bgDark}',
          charcoal: '${theme.colors.surfaceDark}',
          body: '#4a4a4a',
          muted: '#717171',
          light: '${theme.colors.bgLight}',
          border: '${theme.colors.borderLight}',
        }
      },
      fontFamily: {
        heading: ['"${theme.fonts.heading}"', 'system-ui', 'sans-serif'],
        sans: ['"${theme.fonts.body}"', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
`;
    fs.writeFileSync(tailwindPath, tailwindContent, 'utf-8');
    console.log(`   🎨 Updated tailwind.config.js with fonts ("${theme.fonts.heading}") and palette`);
  }

  const indexPath = path.join(targetDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    let indexHtml = fs.readFileSync(indexPath, 'utf-8');
    const fontLinkTag = `\n    <!-- Design Agent Dynamic Typography -->\n    <link rel="preconnect" href="https://fonts.googleapis.com">\n    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n    <link href="${theme.fonts.googleFontsUrl}" rel="stylesheet">\n`;

    if (indexHtml.includes('<!-- Design Agent Dynamic Typography -->')) {
      indexHtml = indexHtml.replace(/<!-- Design Agent Dynamic Typography -->[\s\S]*?<link[^>]*rel="stylesheet"[^>]*>/, fontLinkTag.trim());
    } else if (indexHtml.includes('</head>')) {
      indexHtml = indexHtml.replace('</head>', `${fontLinkTag}  </head>`);
    }
    fs.writeFileSync(indexPath, indexHtml, 'utf-8');
    console.log(`   🎨 Injected Google Fonts into index.html`);
  }

  const cssPath = path.join(targetDir, 'src', 'index.css');
  if (fs.existsSync(cssPath)) {
    let cssContent = fs.readFileSync(cssPath, 'utf-8');
    const cssVars = `
:root {
  --color-primary: ${theme.colors.primary};
  --color-primary-hover: ${theme.colors.primaryHover};
  --color-accent: ${theme.colors.accent};
  --bg-light: ${theme.colors.bgLight};
  --bg-dark: ${theme.colors.bgDark};
}
`;
    if (!cssContent.includes('--color-primary:')) {
      cssContent = cssVars + cssContent;
      fs.writeFileSync(cssPath, cssContent, 'utf-8');
      console.log(`   🎨 Injected CSS custom variables into src/index.css`);
    }
  }

  return theme;
}

// ============================================================================
// 5. CLI RUNNER
// ============================================================================

if (process.argv[1] && process.argv[1].endsWith('design-agent-engine.js')) {
  const args = process.argv.slice(2);
  const nameArg = args[0] || 'Bella Italia Trattoria';
  const urlArg = args.find(a => a.startsWith('--url='))?.replace('--url=', '') || '';
  const archetypeArg = args.find(a => a.startsWith('--archetype='))?.replace('--archetype=', '') || '';

  const theme = generateDesignTheme({
    businessName: nameArg,
    targetUrl: urlArg,
    archetypeId: archetypeArg
  });

  console.log('\n======================================================');
  console.log('🎨 Autonomous Design Agent: Research & Ideation Output');
  console.log('======================================================');
  console.log(`Business Name : ${theme.businessName}`);
  console.log(`Niche Identity: ${theme.archetypeName} (${theme.archetypeId})`);
  console.log(`Typography    : Heading: "${theme.fonts.heading}" | Body: "${theme.fonts.body}"`);
  console.log(`Color Palette : Primary: ${theme.colors.primary} | Accent: ${theme.colors.accent} | Dark: ${theme.colors.bgDark}`);
  console.log(`Layout Concept: ${theme.layout.style} with ${theme.layout.borderRadius}`);
  console.log('------------------------------------------------------');
  console.log('📸 Photorealistic Image Generation Prompt (Hero Poster):');
  console.log(`"${theme.imageGeneration.heroPosterPrompt}"`);
  console.log('======================================================\n');
}
