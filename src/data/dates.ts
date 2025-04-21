import { CourseDate } from '../types';
import { addDays } from 'date-fns';

// Helper to create dates for the next few months
const generateCourseDates = (courseId: string, durationDays: number, maxParticipants = 10): CourseDate[] => {
  const dates: CourseDate[] = [];
  const today = new Date();
  
  // Generate dates for the next 6 months
  for (let i = 1; i <= 6; i++) {
    // Two dates per month
    const startDate1 = new Date(today.getFullYear(), today.getMonth() + i, 5);
    const endDate1 = addDays(startDate1, durationDays - 1);
    
    const startDate2 = new Date(today.getFullYear(), today.getMonth() + i, 20);
    const endDate2 = addDays(startDate2, durationDays - 1);
    
    dates.push({
      id: `${courseId}-${i}-1`,
      courseId,
      startDate: startDate1.toISOString(),
      endDate: endDate1.toISOString(),
      maxParticipants,
      currentParticipants: Math.floor(Math.random() * (maxParticipants / 2))
    });
    
    dates.push({
      id: `${courseId}-${i}-2`,
      courseId,
      startDate: startDate2.toISOString(),
      endDate: endDate2.toISOString(),
      maxParticipants,
      currentParticipants: Math.floor(Math.random() * (maxParticipants / 2))
    });
  }
  
  return dates;
};

export const courseDates: CourseDate[] = [
  ...generateCourseDates('black-talon', 6, 6),
  ...generateCourseDates('warrior', 5, 8),
  ...generateCourseDates('combat', 5, 12),
  ...generateCourseDates('iron-sight', 3, 15),
  ...generateCourseDates('express', 2, 10)
];