export const BUSINESS_INFO = {
  name: "Szine Detailing",
  legalName: "Szine Detailing LLC",
  tagline: "Arizona's Premier Ceramic Coatings, Multi-Stage Paint Correction & Supercar Detailing",
  instagram: {
    handle: "@szinedetailing",
    url: "https://www.instagram.com/szinedetailing/",
    followers: "42.2k",
    posts: "29,600+",
  },
  address: {
    street: "Serving Phoenix Metro & East Valley",
    city: "Phoenix",
    state: "AZ",
    zip: "85001",
    formatted: "Mobile White-Glove Rig & Studio Finishing — Phoenix, Scottsdale, Gilbert, Chandler, Queen Creek, AZ",
    serviceAreas: [
      "Phoenix",
      "Scottsdale",
      "Paradise Valley",
      "Gilbert",
      "Chandler",
      "Queen Creek",
      "Mesa",
      "Tempe",
      "Glendale",
      "Peoria"
    ]
  },
  phone: "(602) 880-9822",
  secondaryPhone: "(602) 880-9822",
  website: "szinedetailing.com",
  email: "bookings@szinedetailing.com",
  googleMapsLink: "https://www.google.com/maps/search/Szine+Detailing+Phoenix+AZ",
  googleMapsEmbedUrl: "https://maps.google.com/maps?q=Phoenix%20Scottsdale%20Gilbert%20Chandler%20AZ&t=&z=11&ie=UTF8&iwloc=&output=embed",
  
  hours: [
    { day: "Monday", open: "7:30 AM", close: "6:30 PM", note: "Mobile & Studio" },
    { day: "Tuesday", open: "7:30 AM", close: "6:30 PM", note: "Mobile & Studio" },
    { day: "Wednesday", open: "7:30 AM", close: "6:30 PM", note: "Mobile & Studio" },
    { day: "Thursday", open: "7:30 AM", close: "6:30 PM", note: "Mobile & Studio" },
    { day: "Friday", open: "7:30 AM", close: "6:30 PM", note: "Mobile & Studio" },
    { day: "Saturday", open: "8:00 AM", close: "5:00 PM", note: "By Appointment" },
    { day: "Sunday", open: "9:00 AM", close: "3:00 PM", note: "Exotic Preservation By Appt" },
  ],

  history: [
    {
      year: "2021",
      title: "The 17-Year-Old Obsession",
      description: "At just 17 years old, founder Tomas Williams started detailing vehicles with a single pressure washer, two polishing pads, and an uncompromising standard for paint clarity that turned heads across the East Valley."
    },
    {
      year: "2023",
      title: "Supercar & Ceramic Specialization",
      description: "Earned multi-tier certification in commercial ceramic and graphene coating applications, becoming the trusted paint preservation specialist for Ferrari, Porsche, and McLaren owners."
    },
    {
      year: "2024",
      title: "42K+ Viral Automotive Community",
      description: "Built Arizona's most active car detailing community on Instagram (@szinedetailing), amassing over 42,000 car lovers and documenting over 29,000 transformation updates."
    },
    {
      year: "Present",
      title: "Phoenix's Apex Detailing Authority",
      description: "Now at 20 years old, Tomas leads Szine Detailing with a full mobile white-glove fleet and climate-controlled studio finishing bay, servicing over 300+ 5-star happy car collectors and daily drivers."
    }
  ],

  owner: {
    name: "Tomas Williams",
    age: 20,
    role: "Founder & Master Detail Specialist",
    bio: "Starting Szine Detailing at 17, Tomas built Arizona's premier high-end vehicle preservation brand purely on obsessive craft, relentless work ethic, and surgical attention to paint correction. Now at 20, he oversees care for multi-million dollar exotic collections, track builds, and daily drivers across the Valley.",
    quote: "Paint correction isn't just washing a car—it's optical engineering. When a client hands me the keys to an F8 Tributo or a daily driver they've worked years to buy, my job is to deliver depth, gloss, and ceramic protection that looks deeper than showroom glass."
  },

  stats: {
    followers: "42.2K+",
    reviews: "300+",
    rating: "5.0",
    yearsActive: "4+",
    vehiclesProtected: "1,200+"
  },

  reviews: [
    {
      author: "Domenic P.",
      location: "Scottsdale, AZ",
      vehicle: "Ferrari F8 Tributo",
      source: "Instagram DM / Google",
      rating: 5,
      date: "2 weeks ago",
      comment: "Tomas at Szine Detailing is the real deal. Most detailers won't touch Nero Daytona black paint because it shows every micro-marring flaw. Tomas performed a 2-stage correction and 5-year ceramic coating on my F8 and it looks wetter and deeper than factory delivery in Maranello. Incredible work ethic for a young business owner!"
    },
    {
      author: "Brandon M.",
      location: "Gilbert, AZ",
      vehicle: "Porsche 911 GT3 RS",
      source: "Google Review",
      rating: 5,
      date: "1 month ago",
      comment: "Unbelievable attention to detail. Tomas showed up with his mobile rig equipped with deionized spot-free water, top-tier Rupes machines, and spent 8 hours perfecting every carbon blade and fin. 300+ 5-star reviews are 100% earned."
    },
    {
      author: "Jessica T.",
      location: "Chandler, AZ",
      vehicle: "Range Rover SV",
      source: "Google Review",
      rating: 5,
      date: "3 weeks ago",
      comment: "I have 3 kids and two Golden Retrievers. I thought our interior leather was ruined beyond saving. Tomas did a full steam sanitation and leather conditioning, plus an exterior ceramic gloss. My husband thought we bought a new truck. Tomas is polite, punctual, and wildly skilled."
    },
    {
      author: "Arman K.",
      location: "Queen Creek, AZ",
      vehicle: "Corvette C8 Z06",
      source: "Instagram Review",
      rating: 5,
      date: "2 months ago",
      comment: "Found Szine Detailing on Instagram (@szinedetailing) seeing his daily reels. Booked his Stage 2 paint correction and ceramic package. Seeing water bead and slide off at 65 MPH without touching the wipers is pure magic. Tomas is 20 with the craft and discipline of a 30-year veteran."
    }
  ]
};

export const isOpenNow = () => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  
  if (day >= 1 && day <= 5) {
    return hour >= 7 && hour < 19;
  }
  if (day === 6) {
    return hour >= 8 && hour < 17;
  }
  return hour >= 9 && hour < 15;
};
