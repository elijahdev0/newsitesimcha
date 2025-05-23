export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'user' | 'admin';
  createdAt: string;
};

export type Course = {
  id: string;
  title: string;
  price: number;
  duration: number; // days
  description: string;
  rounds: number;
  hotel?: string;
  transport?: string;
  includes: string[];
  isPopular?: boolean;
  kosherAvailable?: boolean;
};

export type CourseDate = {
  id: string;
  courseId: string;
  startDate: string;
  endDate: string;
  maxParticipants: number;
  currentParticipants?: number;
};

export type Booking = {
  id: string;
  userId: string;
  courseId: string;
  courseDateId: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'deposit_paid';
  totalAmount: number;
  createdAt: string;
  extras: BookingExtra[];
};

export type BookingExtra = {
  id: string;
  name: string;
  price: number;
  category: 'experience' | 'tactical' | 'media' | 'accommodation' | 'transport' | 'ammo';
};

export type Extra = {
  id: string;
  name: string;
  price: number;
  category: 'experience' | 'tactical' | 'media' | 'accommodation' | 'transport' | 'ammo' | 'weapon' | 'hospitality';
  description?: string;
};

// Blog Post Types
export type Post = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};