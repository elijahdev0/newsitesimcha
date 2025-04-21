import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';
import { formatCurrency } from '../../utils/formatters';
import { Course } from '../../types';

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <div 
      className={`
        bg-white border rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300
        ${course.isPopular ? 'ring-2 ring-accent-500' : 'border-gray-200'}
      `}
    >
      {course.isPopular && (
        <div className="bg-accent-500 text-white text-center py-2 font-medium text-sm">
          MOST POPULAR
        </div>
      )}
      
      <div className="p-6">
        <h3 className="font-heading text-xl font-bold text-tactical-900 mb-2">
          {course.title}
        </h3>
        
        <div className="text-2xl font-bold text-tactical-900 mb-4">
          {formatCurrency(course.price)}
        </div>
        
        <p className="text-tactical-600 text-sm mb-6">
          {course.description}
        </p>
        
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-tactical-100 text-tactical-800 rounded-full px-3 py-1 text-xs font-medium">
              {course.duration} days
            </span>
            <span className="bg-tactical-100 text-tactical-800 rounded-full px-3 py-1 text-xs font-medium">
              {course.rounds} rounds
            </span>
            {course.hotel && (
              <span className="bg-tactical-100 text-tactical-800 rounded-full px-3 py-1 text-xs font-medium">
                Accommodation
              </span>
            )}
          </div>
          
          <ul className="space-y-2">
            {course.includes.map((feature, i) => (
              <li key={i} className="flex items-start">
                <span className="text-accent-500 mr-2 font-bold">✓</span>
                <span className="text-sm text-tactical-700">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="space-y-3">
          <Link to={`/courses/${course.id}`} className="block">
            <Button variant="primary" fullWidth>
              View Details
            </Button>
          </Link>
          <Link to={`/book/${course.id}`} className="block">
            <Button variant="outline" fullWidth>
              Book Now
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};