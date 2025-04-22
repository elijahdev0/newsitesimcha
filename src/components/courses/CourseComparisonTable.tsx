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
    { key: 'instructor', label: 'Instructor Type', checkIncludes: ['Private instructor', 'Group instruction'] },
    { key: 'hotel', label: 'Accommodation' },
    { key: 'transport', label: 'Transport' },
    { key: 'meals', label: 'Meals', checkIncludes: ['All meals', '3 high-quality meals/day', 'Daily meals'] },
    { key: 'kosherAvailable', label: 'Kosher Meals Available' },
    { key: 'private_helicopter', label: 'Private Helicopter', checkIncludes: 'Private helicopter ride' },
    { key: 'yacht_cruise', label: 'Yacht Cruise', checkIncludes: 'Yacht cruise' },
    { key: 'horseback_riding', label: 'Horseback Riding', checkIncludes: 'Horseback riding' },
    { key: 'cigar_lounge', label: 'Cigar Lounge', checkIncludes: 'Cigar lounge' },
    { key: 'media_package', label: 'Media Package', checkIncludes: 'Media package' },
    { key: 'merch_kit', label: 'Merch Kit', checkIncludes: ['Tactical merch kit', 'Small tactical merch item'] },
    { key: 'night_shooting', label: 'Night Shooting Included', checkIncludes: 'night shooting' },
    { key: 'drone_ops', label: 'Drone Ops Course', checkIncludes: 'drone operations' },
    { key: 'certificate', label: 'Certificate', checkIncludes: 'Certificate of Tactical Excellence' },
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
                
                // Handle specific include checks or direct boolean
                if (feature.checkIncludes) {
                  let included = false;
                  if (Array.isArray(feature.checkIncludes)) {
                    // Check if any of the keywords are present
                    included = feature.checkIncludes.some(keyword => 
                      course.includes.some(inc => inc.toLowerCase().includes(keyword.toLowerCase()))
                    );
                  } else {
                    // Check if the single keyword is present (feature.checkIncludes must be a string here)
                    const keyword = feature.checkIncludes; // Explicitly treat as string
                    included = course.includes.some(inc => 
                      inc.toLowerCase().includes(keyword.toLowerCase())
                    );
                  }
                  value = included ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />;
                } else if (feature.key === 'kosherAvailable') {
                  value = course.kosherAvailable ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />;
                } else if (feature.format) {
                  value = feature.format(value);
                } else if (!value && (feature.key === 'hotel' || feature.key === 'transport')) {
                  value = <span className="text-tactical-500 italic">Not Included</span>;
                } else if (typeof value === 'boolean') { // Keep generic boolean check just in case
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