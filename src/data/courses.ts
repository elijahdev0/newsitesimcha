import { Course, Extra } from '../types';

export const courses: Course[] = [
  {
    id: 'black-talon',
    title: 'Black Talon',
    price: 23000,
    duration: 6,
    rounds: 4000,
    hotel: 'Hotel Telegraaf – Executive Room (6 nights)',
    transport: 'Luxury ground transport + 1x helicopter flight',
    description: 'Our premium 6-day high-level tactical training experience with luxury accommodations and exclusive experiences.',
    includes: [
      'Private instruction: pistol, rifle, CQB, first aid, Krav Maga',
      'Night shooting + 1-on-1 combat coaching',
      'Luxury experiences: yacht cruise, horseback riding, spa, cigar lounge, concierge',
      'Full merch kit + professional video/photo package',
      'All meals, insurance, and range fees included'
    ],
    isPopular: true
  },
  {
    id: 'warrior',
    title: 'Warrior',
    price: 15000,
    duration: 5,
    rounds: 3000,
    hotel: 'Hestia Hotel Strand – Standard Room (5 nights)',
    transport: 'Luxury van transfers',
    description: '5 days of group tactical training with quality accommodations and essential tactical instruction.',
    includes: [
      'Group instruction: pistol, rifle, Krav Maga, first aid',
      'One group experience: horseback riding or yacht cruise',
      'Includes meals, insurance, and merch t-shirt'
    ]
  },
  {
    id: 'combat',
    title: 'Combat',
    price: 5700,
    duration: 5,
    rounds: 1200,
    hotel: 'Hestia Hotel Strand – Economy Room (5 nights)',
    transport: 'Shared group transport',
    description: '5 days of basic tactical training covering essential skills with comfortable accommodations.',
    includes: [
      'Group instruction: pistol/rifle basics, intro to CQB, Krav Maga, trauma care',
      'All meals, insurance, and merch t-shirt included'
    ]
  },
  {
    id: 'iron-sight',
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
    id: 'express',
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