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
        "flex flex-col bg-tactical-800 rounded-lg shadow-lg overflow-hidden border border-tactical-700",
        course.isPopular ? 'border-accent-400 border-2' : ''
      )}
    >
      {course.isPopular && (
        <div className="bg-accent-500 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 text-center">
          Most Popular
        </div>
      )}
      <div className="p-6 flex-grow">
        <h3 className="font-heading text-xl font-bold text-tactical-100 mb-3">
          {course.title}
        </h3>
        <p className="text-tactical-300 text-sm mb-4 h-16 line-clamp-3">
          {course.description}
        </p>
        
        <div className="mb-5">
          <span className="text-3xl font-bold text-tactical-100">
            {formatCurrency(course.price)}
          </span>
          {/* <span className="text-tactical-400 text-sm ml-1">/ package</span> */}
        </div>

        <ul className="space-y-3 mb-6 text-sm flex-grow">
          <li className="flex items-center">
            <span className="text-green-400 mr-2"><Check size={16} /></span>
            <span className="text-tactical-300">{course.duration} Days Training</span>
          </li>
          <li className="flex items-center">
            <span className="text-green-400 mr-2"><Check size={16} /></span>
            <span className="text-tactical-300">{course.rounds} Rounds Included</span>
          </li>
          <li className="flex items-center">
            <span className="text-green-400 mr-2"><Check size={16} /></span>
            <span className="text-tactical-300">
              {course.hotel ? `Accommodation: ${course.hotel}` : 'Accommodation Not Included'}
            </span>
          </li>
          <li className="flex items-center">
            <span className="text-green-400 mr-2"><Check size={16} /></span>
            <span className="text-tactical-300">
              {course.transport ? `Transport: ${course.transport}` : 'Transport Not Included'}
            </span>
          </li>
        </ul>
      </div>
      
      <div className="bg-tactical-700 px-6 py-4 mt-auto">
        <Link to={`/book/${course.id}`}> 
          <Button 
            variant="primary" 
            fullWidth 
            className="transition-all duration-150 shadow-md hover:shadow-xl hover:bg-accent-700 hover:text-white hover:scale-[1.03] focus:ring-2 focus:ring-accent-400 focus:outline-none border-2 border-accent-700"
            style={{
              background: 'linear-gradient(90deg, #7c1d1d 0%, #b91c1c 100%)',
              color: '#fff',
              borderColor: '#b91c1c',
            }}
          >
            Book Now
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
        {/* View Details Button Removed */}
      </div>
    </div>
  );
};