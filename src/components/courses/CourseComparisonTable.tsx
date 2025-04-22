import React from 'react';
import { Course } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Check, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CourseComparisonTableProps {
  courses: Course[];
}

const CourseComparisonTable: React.FC<CourseComparisonTableProps> = ({ courses }) => {
  // Define the features to compare
  const features = [
    { key: 'price', label: 'Price', format: (val: number) => formatCurrency(val) },
    { key: 'duration', label: 'Duration (Days)' },
    { key: 'rounds', label: 'Rounds Included' },
    { key: 'hotel', label: 'Accommodation' },
    { key: 'transport', label: 'Transport' },
    // Add more features from the 'includes' array if needed, or list some key ones
    { key: 'includes_private', label: 'Private Instruction', checkIncludes: 'Private instruction' },
    { key: 'includes_night', label: 'Night Shooting', checkIncludes: 'Night shooting' },
    { key: 'includes_luxury', label: 'Luxury Experiences', checkIncludes: 'Luxury experiences' },
    { key: 'includes_media', label: 'Media Package', checkIncludes: 'Media package' },
    { key: 'includes_meals', label: 'Meals Included', checkIncludes: 'meals' },
  ];

  return (
    <div className="overflow-x-auto bg-tactical-800 rounded-lg shadow-lg p-6 border border-tactical-700">
      <table className="w-full min-w-[800px] border-collapse text-left">
        <thead>
          <tr className="border-b border-tactical-600">
            <th className="p-4 font-heading text-lg font-semibold text-tactical-100 w-1/6">Feature</th>
            {courses.map(course => (
              <th 
                key={course.id} 
                className={cn(
                  "p-4 font-heading text-base font-semibold text-tactical-200 text-center w-1/6",
                  course.isPopular ? "bg-accent-800/30 text-accent-300" : ""
                )}
              >
                {course.title}
                 {course.isPopular && <span className="block text-xs font-normal text-accent-400">(Most Popular)</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={feature.key} className={cn("border-b border-tactical-700", index % 2 === 0 ? 'bg-tactical-800' : 'bg-tactical-700/50')}>
              <td className="p-4 font-medium text-tactical-200 text-sm w-1/6">{feature.label}</td>
              {courses.map(course => {
                let value: any = (course as any)[feature.key];
                
                // Handle specific include checks
                if (feature.checkIncludes) {
                  const included = course.includes.some(inc => 
                      inc.toLowerCase().includes(feature.checkIncludes!.toLowerCase())
                  );
                   value = included ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />;
                } else if (feature.format) {
                  value = feature.format(value);
                } else if (!value && (feature.key === 'hotel' || feature.key === 'transport')) {
                  value = <span className="text-tactical-500 italic">Not Included</span>;
                } else if (typeof value === 'boolean') {
                  value = value ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />;
                }

                return (
                  <td key={`${course.id}-${feature.key}`} className="p-4 text-center text-sm text-tactical-300 w-1/6">
                    {value}
                  </td>
                );
              })}
            </tr>
          ))}
          {/* Add a row for the booking button */}
          <tr className="bg-tactical-900">
             <td className="p-4 font-medium text-tactical-200 text-sm w-1/6">Ready to Book?</td>
             {courses.map(course => (
                 <td key={`${course.id}-book`} className="p-4 text-center w-1/6">
                    <a href={`/book/${course.id}`} className="inline-block bg-accent-600 text-white px-4 py-1.5 rounded text-xs font-medium hover:bg-accent-700 transition-colors">
                       Book {course.title}
                    </a>
                 </td>
             ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CourseComparisonTable; 