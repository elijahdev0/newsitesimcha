import { Course, Extra } from '../types';

export const courses: Course[] = [
  {
    id: 'bb5f1b98-0c56-481b-8372-95bf28a006e7',
    title: 'Black Talon',
    price: 26000,
    duration: 6,
    rounds: 4000,
    hotel: 'Presidential Suite at Hotel Telegraaf (6 nights)',
    transport: 'Private luxury chauffeur transport & Private helicopter experience',
    description: 'Experience the highest level of tactical training fused with absolute luxury.',
    includes: [
      '6 Days elite instruction',
      '4000 rounds of live fire',
      'Weapons Access: 10 systems (AR-15, Glock 17, AK-47, SCAR, Sniper Rifle, Revolver, Tactical Pistols, Shotgun, CQB weapons)',
      'Private Krav Maga combat sessions',
      'Full Combat First Aid course',
      'Private helicopter experience',
      'Private yacht cruise',
      'Horseback riding session',
      'Full spa and recovery day',
      'Private cigar lounge evening',
      'Drone tactical operations',
      'Professional media package (photos/videos)',
      'Premium tactical merchandise pack',
      'Presidential Suite at Hotel Telegraaf',
      'Private luxury chauffeur transport',
      'Gourmet breakfasts and luxury dinners',
      'VIP concierge service',
      'Full insurance coverage',
      'CERTIFICATE OF COMPLETION'
    ],
    kosherAvailable: true
  },
  {
    id: '9199210c-ba5d-45af-a5f4-e717a3f0a803',
    title: 'Warrior',
    price: 16000,
    duration: 5,
    rounds: 3000,
    hotel: 'Deluxe Room at Hotel Telegraaf (5 nights)',
    transport: 'Private or group luxury transport',
    description: 'Train like an elite operator while enjoying powerful luxury experiences.',
    includes: [
      '5 Days tactical rifle, pistol, CQB training',
      '3000 rounds fired',
      'Weapons Access: 5 systems (AR-15, Glock 17, AK-47, SCAR, Sniper Rifle)',
      'Semi-private Krav Maga tactical sessions',
      'Full Combat First Aid course',
      'Horseback riding session',
      'Choice between: Helicopter ride, Yacht cruise, or Cigar lounge evening',
      'Deluxe Room at Hotel Telegraaf',
      'Private or group luxury transport',
      'Gourmet meals included',
      'Full insurance coverage',
      'CERTIFICATE OF COMPLETION'
    ],
    isPopular: true,
    kosherAvailable: true
  },
  {
    id: '88b5c562-5df0-4d35-bd04-918d2d0156db',
    title: 'Combat',
    price: 5700,
    duration: 5,
    rounds: 1200,
    hotel: 'Standard Room at Hestia Hotel Strand (5 nights)',
    transport: 'Group/shared transport',
    description: 'Solid and intense tactical foundation for those ready to push limits.',
    includes: [
      '5 Days rifle and pistol training',
      '1200 rounds fired',
      'Weapons Access: AR-15 + Glock 17',
      'Group Krav Maga defensive tactics',
      'Combat First Aid fundamentals',
      'Standard Room at Hestia Hotel Strand',
      'Buffet-style dining included',
      'Group/shared transport',
      'Full insurance',
      'CERTIFICATE OF COMPLETION'
    ],
    kosherAvailable: true
  },
  {
    id: '4cc83f19-67a4-4f5b-b11b-19c865d32405',
    title: 'Iron Sight',
    price: 1000,
    duration: 3,
    rounds: 600,
    hotel: 'Accommodation optional',
    transport: undefined,
    description: 'Pure rifle live-fire excellence - no distractions.',
    includes: [
      '3 Days focused AR-15 training',
      '600 rounds fired',
      'Weapons Access: AR-15',
      'Accommodation optional',
      'Meals optional',
      'Insurance optional',
      'CERTIFICATE OF COMPLETION'
    ]
  },
  {
    id: 'a1c784da-0d1b-42c4-8338-10ad3eeeba82',
    title: '2-Day Tactical Package',
    price: 2900,
    duration: 2,
    rounds: 700,
    hotel: 'Standard Room at Hestia Hotel Strand (2 nights)',
    transport: 'Group/shared transport',
    description: 'Rapid growth in core tactical skills in just two days.',
    includes: [
      '2 Days focused tactical training',
      '500-700 rounds fired',
      'Weapons Access: AR-15 + Glock 17',
      'Krav Maga crash course',
      'Combat First Aid crash course',
      'Standard Room at Hestia Hotel Strand',
      'Buffet-style meals included',
      'Group/shared transport',
      'Full insurance',
      'CERTIFICATE OF COMPLETION'
    ]
  }
];

export const extras: Extra[] = [
  // Buffet Options / Experiences
  {
    id: '71501e82-9b2b-4e09-af4a-1d270343df96',
    name: 'Private Helicopter Tour',
    price: 2000,
    category: 'experience',
    description: 'Soar above Estonia\'s coastlines. Minimum 2 participants.'
  },
  {
    id: '53624a6e-2e9c-44ea-9c69-9c638479e573',
    name: 'Private Yacht Cruise',
    price: 2000,
    category: 'experience',
    description: 'Sail the Baltic Sea. Minimum 4 participants.'
  },
  {
    id: '64196261-3aa6-486d-99d9-8d560dabf260',
    name: 'Horseback Riding Adventure',
    price: 300,
    category: 'experience',
    description: 'Ride through scenic trails. Solo experience available.'
  },
  {
    id: 'f6ea5afb-4a6a-4b7f-96d6-a92c6e4f53ed',
    name: 'Spa & Massage Recovery Day',
    price: 300,
    category: 'experience',
    description: 'Full wellness access. Solo experience available.'
  },
  {
    id: 'fc7ce555-7815-4a81-891f-dc076894c424',
    name: 'Exclusive Cigar Lounge Evening',
    price: 400,
    category: 'experience',
    description: 'Premium cigars and whiskey. Solo or small group.'
  },

  // Tactical Add-ons
  {
    id: 'e5e85d41-faab-4b2c-b326-c61365c605c4',
    name: 'Night Shooting Session',
    price: 400,
    category: 'tactical',
    description: 'Master the art of shooting in low-light and nighttime conditions.'
  },
  {
    id: '55ff54f5-d3b8-4fc7-a120-3785682a99ae',
    name: 'Rifle Handling & Reload Masterclass',
    price: 400,
    category: 'tactical',
    description: 'Advance your rifle skills with specialized handling and reload techniques.'
  },
  {
    id: '3fcc4ba7-624d-4a40-b6a9-24a28f98c4c1',
    name: 'Pistol Handling & Malfunction Management',
    price: 400,
    category: 'tactical',
    description: 'Learn professional pistol handling and how to clear various malfunctions quickly.'
  },
  {
    id: '91297a3f-1aeb-4917-8f08-e807725f85b3',
    name: 'Krav Maga Disarm & Weapon Retention',
    price: 400,
    category: 'tactical',
    description: 'Master Israeli combat techniques for disarming threats and retaining your weapon.'
  },
  {
    id: 'b2a8c7d5-1e0c-4f8a-a3d9-f1e9b5c2d7a1',
    name: 'CQB Fundamentals',
    price: 400,
    category: 'tactical',
    description: 'Learn the essentials of Close Quarters Battle.'
  },

  // Weapons Expansion Menu
  {
    id: '72ef2c01-1f9c-4bd9-9c06-27cd2ef1b241',
    name: 'SCAR Rifle Rental (per day)',
    price: 120,
    category: 'weapon',
    description: 'Rent a SCAR rifle for your training day.'
  },
  {
    id: '83ef3d12-2f9d-4cd0-0d17-38de3ef2c352',
    name: 'Precision Sniper Rifle Rental (per day)',
    price: 150,
    category: 'weapon',
    description: 'Rent a precision sniper rifle for your training day.'
  },
  {
    id: '94ef4e23-3f0e-4de1-9e28-49ef4ef3d463',
    name: 'AK-47 Additional Session (per day)',
    price: 100,
    category: 'weapon',
    description: 'Add an extra session focused on the AK-47 platform.'
  },
  {
    id: '05ef5f34-4f1f-4ef2-9f39-50fd5ef4e574',
    name: 'Revolver Pistol Experience (per day)',
    price: 80,
    category: 'weapon',
    description: 'Gain experience handling and shooting revolvers.'
  },
  {
    id: '16ef6f45-5f2f-4ff3-af40-61fe6ef5f685',
    name: 'Tactical Pistols (CZ, SIG) Rental (per day)',
    price: 90,
    category: 'weapon',
    description: 'Rent tactical pistols like CZ or SIG models.'
  },
  {
    id: '27ef7f56-6f3f-4ff4-bf51-72ff7ef6f796',
    name: 'Shotgun Session (per day)',
    price: 90,
    category: 'weapon',
    description: 'Add a session focused on shotgun handling and use.'
  },

  // Capture the Moment / Media & Merch
  {
    id: 'fd31c89e-c1db-4b8c-b057-e147331c92d2',
    name: 'Professional Tactical Media Package',
    price: 500,
    category: 'media',
    description: 'Professional photo and video documentation of your training experience.'
  },
  {
    id: '9593a7bf-b5d9-48f6-a247-758da406f7a4',
    name: 'Premium Tactical Merchandise Kit',
    price: 300,
    category: 'media',
    description: 'Exclusive tactical merchandise kit including Knife, Patch, and After Action Report (AAR).'
  },

  // Luxury Hospitality Enhancements
  {
    id: '38ef8f67-7f4f-4ff5-bf62-83af8ef7f807',
    name: 'Private Chef Fine Dining Experience',
    price: 600,
    category: 'hospitality',
    description: 'Enjoy a fine dining experience prepared by a private chef. Minimum 2 participants.'
  },
  {
    id: '49ef9f78-8f5f-4ff6-cf73-94af9ef8f918',
    name: 'Wine Tasting Premium Evening',
    price: 300,
    category: 'hospitality',
    description: 'Participate in a premium wine tasting evening. Minimum 2 participants.'
  },
  {
    id: '50ef0f89-9f6f-4ff7-df84-05af0ef9f029',
    name: 'Full Gourmet Meal Plan',
    price: 1200,
    category: 'hospitality',
    description: 'Includes all gourmet meals for the entire seminar duration.'
  },
  {
    id: '0c5222c5-ffeb-4b2b-af5c-a4031fb70ec0',
    name: 'VIP Hotel Upgrade (Telegraaf Pres/Exec Suite per night)',
    price: 500,
    category: 'accommodation',
    description: 'Upgrade your stay to the luxurious Telegraaf Presidential/Executive Suite.'
  },
  {
    id: '61ef1f90-0f7f-4ff8-ef95-16af1ef0f130',
    name: 'VIP Transport (Chauffeur Luxury Vehicle per day)',
    price: 450,
    category: 'hospitality',
    description: 'Utilize a private luxury vehicle with a chauffeur.'
  },
  {
    id: '72ef2f01-1f8f-4ff9-ff06-27af2ef1f241',
    name: 'Standard Hotel Night (Hestia Strand per night)',
    price: 180,
    category: 'accommodation',
    description: 'Add extra nights at the standard Hestia Hotel Strand.'
  },
  {
    id: '83ef3f12-2f9f-4ff0-0f17-38af3ef2f352',
    name: 'Full Stay Personal VIP Concierge Assistance',
    price: 500,
    category: 'hospitality',
    description: 'Receive personal VIP concierge support throughout your stay.'
  },

  // Extra Ammunition Menu
  {
    id: '9e4a6821-bf4a-492d-b5ca-e6bf86822f0c',
    name: 'Extra 9mm Ammo (per round)',
    price: 0.60,
    category: 'ammo',
    description: 'Additional 9mm ammunition for extended practice sessions.'
  },
  {
    id: '94ef4f23-3f0f-4ff1-1f28-49af4ef3f463',
    name: 'Extra 5.56mm (AR-15) Ammo (per round)',
    price: 1.00,
    category: 'ammo',
    description: 'Additional 5.56mm ammunition for AR-15 platforms.'
  },
  {
    id: 'e45abc7c-c567-48de-b02e-f786246455ef',
    name: 'Extra 7.62x39mm (AK) Ammo (per round)',
    price: 1.00,
    category: 'ammo',
    description: 'Additional 7.62x39mm ammunition for AK platforms.'
  },
  {
    id: '05ef5f34-4f1f-4ff2-2f39-50af5ef4f574',
    name: 'Extra .22LR Ammo (per round)',
    price: 0.25,
    category: 'ammo',
    description: 'Additional .22LR ammunition.'
  }
];