import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { Course } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Check, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div 
      className={cn(
        "flex flex-col bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200",
        course.isPopular ? 'border-accent-500 border-2' : ''
      )}
    >
      {course.isPopular && (
        <div className="bg-accent-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 text-center">
          Most Popular
        </div>
      )}
      <div className="p-6 flex-grow">
        <h3 className="font-heading text-xl font-bold text-tactical-900 mb-3">
          {course.title}
        </h3>
        <p className="text-tactical-700 text-sm mb-4 h-16 line-clamp-3">
          {course.description}
        </p>
        
        <div className="mb-5">
          <span className="text-3xl font-bold text-tactical-900">
            {formatCurrency(course.price)}
          </span>
          {/* <span className="text-tactical-600 text-sm ml-1">/ package</span> */}
        </div>

        <ul className="space-y-3 mb-6 text-sm flex-grow">
          <li className="flex items-center">
            <span className="text-green-500 mr-2"><Check size={16} /></span>
            <span className="text-tactical-700">{course.duration} Days Training</span>
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2"><Check size={16} /></span>
            <span className="text-tactical-700">{course.rounds} Rounds Included</span>
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2"><Check size={16} /></span>
            <span className="text-tactical-700">
              {course.hotel ? `Accommodation: ${course.hotel}` : 'Accommodation Not Included'}
            </span>
          </li>
          <li className="flex items-center">
            <span className="text-green-500 mr-2"><Check size={16} /></span>
            <span className="text-tactical-700">
              {course.transport ? `Transport: ${course.transport}` : 'Transport Not Included'}
            </span>
          </li>
        </ul>
      </div>
      
      <div className="bg-gray-50 px-6 py-4 mt-auto">
        <Link to={`/book/${course.id}`}>
          <Button variant="primary" fullWidth>
            Book Now
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
        {/* View Details Button Removed */}
      </div>
    </div>
  );
};