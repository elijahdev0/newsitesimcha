import { Course, Extra } from '../types';

export const courses: Course[] = [
  {
    id: 'bb5f1b98-0c56-481b-8372-95bf28a006e7',
    title: 'Black Talon',
    price: 26000,
    duration: 6,
    rounds: 4000,
    hotel: 'Presidential/Executive Suite - Hotel Telegraaf (6 nights)',
    transport: 'VIP chauffeur service & Private helicopter ride',
    description: 'The most exclusive tactical training package in Europe. For those who demand nothing but the best - in training, lifestyle, and execution.',
    includes: [
      '6 Days Elite Tactical Training',
      '4,000 rounds & 10+ weapon systems',
      'Private instructor (1-on-1)',
      'Training: CQB, transitions, malfunctions, stress drills, Krav Maga, night shooting, drone operations',
      'Premium Experiences: Helicopter, Yacht, Horseback Riding, Cigar Lounge',
      'Hospitality: Presidential/Executive Suite, All meals at finest restaurants (kosher available), VIP chauffeur, Full insurance, Concierge support',
      'Media package (photo & video)',
      'Tactical merch kit'
    ],
    isPopular: true,
    kosherAvailable: true
  },
  {
    id: '9199210c-ba5d-45af-a5f4-e717a3f0a803',
    title: 'Warrior',
    price: 16000,
    duration: 5,
    rounds: 3000,
    hotel: 'Deluxe Room - Hotel Telegraaf (5 nights)',
    transport: 'VIP chauffeur service',
    description: 'Designed for high-level teams or individuals seeking elite training with powerful extras - without stepping into ultra-luxury territory. The Warrior Package is where sharp skills meet elite living.',
    includes: [
      '5 Days Tactical Training',
      '3,000 rounds & 5 weapon systems',
      'Group instruction (semi-private)',
      'Training: CQB, malfunctions, stress drills, Krav Maga',
      'Experiences: Horseback riding, Choice of Helicopter ride OR Yacht cruise',
      'Hospitality: Deluxe Room, 3 high-quality meals/day (kosher available), VIP chauffeur, Insurance',
      'Media package (photos & edited video)',
      'Tactical merch kit',
      'Certificate of Tactical Excellence'
    ],
    kosherAvailable: true
  },
  {
    id: '88b5c562-5df0-4d35-bd04-918d2d0156db',
    title: 'Combat',
    price: 5700,
    duration: 5,
    rounds: 1200,
    hotel: 'Economy Room - Hestia Hotel Strand (5 nights)',
    transport: 'Shared/Uber-style transport',
    description: 'A solid entry into the Bald Eagle Tactical system - five days of focused live training designed for those ready to commit to growth. Fast, focused, and grounded.',
    includes: [
      '5 Days Tactical Training',
      '1,200 rounds & 3-5 firearms',
      'Group instruction',
      'Training: CQB, malfunction clearing, movement drills, self-defense',
      'Hospitality: Economy Room, Daily meals provided (kosher available), Shared transport, Insurance',
      'Small tactical merch item (patch or ID tag)'
    ],
    kosherAvailable: true
  },
  {
    id: '4cc83f19-67a4-4f5b-b11b-19c865d32405',
    title: 'Iron Sight',
    price: 1000,
    duration: 3,
    rounds: 600,
    description: '3-day live-fire training with rifle-dominant drills for entry-level clients.',
    includes: [
      'Focus: handling, reloads, accuracy under stress',
      'Outdoor range access + rental firearms',
      'Instructor-led CQB & movement drills',
      'No food or accommodation included'
    ]
  },
  {
    id: 'a1c784da-0d1b-42c4-8338-10ad3eeeba82',
    title: 'Express Tactical Retreat',
    price: 2900,
    duration: 2,
    rounds: 400,
    hotel: 'Hotel accommodation (2 nights)',
    transport: 'Transport included',
    description: '2 days of intensive tactical training, ideal for those seeking a short, high-impact experience.',
    includes: [
      'All meals, insurance, and transport included',
      'Focused instruction: pistol/rifle basics, Krav Maga, CQB'
    ]
  }
];

export const extras: Extra[] = [
  // Experiences
  {
    id: 'helicopter-ride',
    name: 'Helicopter Ride',
    price: 2000,
    category: 'experience',
    description: 'Experience an adrenaline-filled helicopter flight over the Estonian landscape.'
  },
  {
    id: 'yacht-cruise',
    name: 'Yacht Cruise',
    price: 2000,
    category: 'experience',
    description: 'Relax on a luxury yacht cruise along the picturesque Baltic coast.'
  },
  {
    id: 'horseback-riding',
    name: 'Horseback Riding',
    price: 300,
    category: 'experience',
    description: 'Explore the Estonian countryside on horseback with a guided tour.'
  },
  {
    id: 'spa-massage',
    name: 'Spa & Massage',
    price: 300,
    category: 'experience',
    description: 'Unwind with a professional spa treatment and massage session.'
  },
  {
    id: 'cigar-lounge',
    name: 'Cigar Lounge',
    price: 400,
    category: 'experience',
    description: 'Enjoy premium cigars and whiskey in an exclusive lounge setting.'
  },
  
  // Tactical Add-ons
  {
    id: 'night-shooting',
    name: 'Night Shooting',
    price: 250,
    category: 'tactical',
    description: 'Master the art of shooting in low-light and nighttime conditions.'
  },
  {
    id: 'rifle-handling',
    name: 'Rifle Handling & Reloads',
    price: 250,
    category: 'tactical',
    description: 'Advance your rifle skills with specialized handling and reload techniques.'
  },
  {
    id: 'pistol-handling',
    name: 'Pistol Handling & Malfunctions',
    price: 250,
    category: 'tactical',
    description: 'Learn professional pistol handling and how to clear various malfunctions quickly.'
  },
  {
    id: 'krav-maga',
    name: 'Krav Maga (Disarms & Weapon Retention)',
    price: 300,
    category: 'tactical',
    description: 'Master Israeli combat techniques for disarming threats and retaining your weapon.'
  },
  
  // Media & Merch
  {
    id: 'media-package',
    name: 'Media Package (Photo/Video)',
    price: 500,
    category: 'media',
    description: 'Professional photo and video documentation of your training experience.'
  },
  {
    id: 'tactical-merch',
    name: 'Tactical Merch Kit',
    price: 300,
    category: 'media',
    description: 'Exclusive tactical merchandise kit including knife, patch, and AAR.'
  },
  
  // Accommodation
  {
    id: 'hotel-upgrade',
    name: 'Hotel Upgrade: Telegraaf (per night)',
    price: 500,
    category: 'accommodation',
    description: 'Upgrade your stay to the luxurious Hotel Telegraaf.'
  },
  
  // Ammo
  {
    id: 'ammo-9mm',
    name: 'Extra 9mm Ammo (per 100 rounds)',
    price: 60,
    category: 'ammo',
    description: 'Additional 9mm ammunition for extended practice sessions.'
  },
  {
    id: 'ammo-762',
    name: 'Extra 7.62mm Ammo (per 100 rounds)',
    price: 90,
    category: 'ammo',
    description: 'Additional 7.62mm ammunition for extended practice sessions.'
  }
];