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
    id: '71501e82-9b2b-4e09-af4a-1d270343df96',
    name: 'Helicopter Ride',
    price: 2000,
    category: 'experience',
    description: 'Experience an adrenaline-filled helicopter flight over the Estonian landscape.'
  },
  {
    id: '53624a6e-2e9c-44ea-9c69-9c638479e573',
    name: 'Yacht Cruise',
    price: 2000,
    category: 'experience',
    description: 'Relax on a luxury yacht cruise along the picturesque Baltic coast.'
  },
  {
    id: '64196261-3aa6-486d-99d9-8d560dabf260',
    name: 'Horseback Riding',
    price: 300,
    category: 'experience',
    description: 'Explore the Estonian countryside on horseback with a guided tour.'
  },
  {
    id: 'f6ea5afb-4a6a-4b7f-96d6-a92c6e4f53ed',
    name: 'Spa & Massage',
    price: 300,
    category: 'experience',
    description: 'Unwind with a professional spa treatment and massage session.'
  },
  {
    id: 'fc7ce555-7815-4a81-891f-dc076894c424',
    name: 'Cigar Lounge',
    price: 400,
    category: 'experience',
    description: 'Enjoy premium cigars and whiskey in an exclusive lounge setting.'
  },
  
  // Tactical Add-ons
  {
    id: 'e5e85d41-faab-4b2c-b326-c61365c605c4',
    name: 'Night Shooting',
    price: 250,
    category: 'tactical',
    description: 'Master the art of shooting in low-light and nighttime conditions.'
  },
  {
    id: '55ff54f5-d3b8-4fc7-a120-3785682a99ae',
    name: 'Rifle Handling & Reloads',
    price: 250,
    category: 'tactical',
    description: 'Advance your rifle skills with specialized handling and reload techniques.'
  },
  {
    id: '3fcc4ba7-624d-4a40-b6a9-24a28f98c4c1',
    name: 'Pistol Handling & Malfunctions',
    price: 250,
    category: 'tactical',
    description: 'Learn professional pistol handling and how to clear various malfunctions quickly.'
  },
  {
    id: '91297a3f-1aeb-4917-8f08-e807725f85b3',
    name: 'Krav Maga (Disarms & Weapon Retention)',
    price: 300,
    category: 'tactical',
    description: 'Master Israeli combat techniques for disarming threats and retaining your weapon.'
  },
  
  // Media & Merch
  {
    id: 'fd31c89e-c1db-4b8c-b057-e147331c92d2',
    name: 'Media Package (Photo/Video)',
    price: 500,
    category: 'media',
    description: 'Professional photo and video documentation of your training experience.'
  },
  {
    id: '9593a7bf-b5d9-48f6-a247-758da406f7a4',
    name: 'Tactical Merch Kit',
    price: 300,
    category: 'media',
    description: 'Exclusive tactical merchandise kit including knife, patch, and AAR.'
  },
  
  // Accommodation
  {
    id: '0c5222c5-ffeb-4b2b-af5c-a4031fb70ec0',
    name: 'Hotel Upgrade: Telegraaf (per night)',
    price: 500,
    category: 'accommodation',
    description: 'Upgrade your stay to the luxurious Hotel Telegraaf.'
  },
  
  // Ammo
  {
    id: '9e4a6821-bf4a-492d-b5ca-e6bf86822f0c',
    name: 'Extra 9mm Ammo (per 100 rounds)',
    price: 60,
    category: 'ammo',
    description: 'Additional 9mm ammunition for extended practice sessions.'
  },
  {
    id: 'e45abc7c-c567-48de-b02e-f786246455ef',
    name: 'Extra 7.62mm Ammo (per 100 rounds)',
    price: 90,
    category: 'ammo',
    description: 'Additional 7.62mm ammunition for extended practice sessions.'
  }
];