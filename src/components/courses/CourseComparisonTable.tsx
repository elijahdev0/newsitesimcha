import React from 'react';
import { Course } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { Check, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CourseComparisonTableProps {
  courses: Course[];
}

// Helper function to extract weapon system count or details
const getWeaponDetails = (includes: string[]): string => {
  const weaponLine = includes.find(line => line.toLowerCase().startsWith('weapons access:'));
  if (weaponLine) {
    return weaponLine.replace(/weapons access:/i, '').trim();
  }
  return '-'; // Or indicate not specified
};

// Helper function to check for specific features
const checkFeature = (includes: string[], keywords: string | string[]) => {
  const searchTerms = Array.isArray(keywords) ? keywords : [keywords];
  return searchTerms.some(term => 
    includes.some(inc => inc.toLowerCase().includes(term.toLowerCase()))
  );
};

const CourseComparisonTable: React.FC<CourseComparisonTableProps> = ({ courses }) => {
  // Define the features to compare based on PDF data
  const features = [
    { key: 'price', label: 'Price', format: (val: number) => formatCurrency(val) },
    { key: 'duration', label: 'Duration (Days)' },
    { key: 'rounds', label: 'Rounds Fired' },
    { 
      key: 'weapon_systems', 
      label: 'Weapon Systems', 
      getValue: (course: Course) => getWeaponDetails(course.includes)
    },
    { 
      key: 'krav_maga', 
      label: 'Krav Maga', 
      checkIncludes: ['Krav Maga combat sessions', 'Krav Maga tactical sessions', 'Krav Maga defensive tactics', 'Krav Maga crash course'] 
    },
    { 
      key: 'combat_first_aid', 
      label: 'Combat First Aid', 
      checkIncludes: ['Full Combat First Aid course', 'Combat First Aid fundamentals', 'Combat First Aid crash course']
    },
    { key: 'helicopter', label: 'Helicopter Ride', checkIncludes: 'helicopter experience' },
    { key: 'yacht', label: 'Yacht Cruise', checkIncludes: 'yacht cruise' },
    { key: 'horseback', label: 'Horseback Riding', checkIncludes: 'Horseback riding session' },
    { key: 'spa', label: 'Spa/Recovery', checkIncludes: 'Full spa and recovery day' }, // Specific to Black Talon
    { key: 'cigar_lounge', label: 'Cigar Lounge', checkIncludes: 'cigar lounge evening' },
    { key: 'drone_ops', label: 'Drone Ops', checkIncludes: 'Drone tactical operations' }, // Specific to Black Talon
    { key: 'hotel', label: 'Accommodation' },
    { key: 'transport', label: 'Transport' },
    { 
      key: 'meals', 
      label: 'Kosher Meals Included',
      getValue: (course: Course) => {
        return course.kosherAvailable 
               ? <Check className="w-5 h-5 text-green-400 mx-auto" /> 
               : <X className="w-5 h-5 text-red-400 mx-auto" />;
      }
    },
    { key: 'insurance', label: 'Insurance', checkIncludes: 'Full insurance coverage' },
    { key: 'media_package', label: 'Media Package (Photo/Video)', checkIncludes: 'Professional media package' },
    { 
      key: 'merch_kit', 
      label: 'Merch Kit', 
      getValue: (course: Course) => {
        if (checkFeature(course.includes, 'Premium tactical merchandise pack')) {
          return 'Premium Kit';
        }
        // Based on current data, only Black Talon has merch explicitly listed.
        // Add checks here if Warrior/Combat merch data is re-introduced later.
        return '-'; // Default if no specific merch is found
      }
    },
    { key: 'concierge', label: 'VIP Concierge', checkIncludes: 'VIP concierge service' }, // Specific to Black Talon
    { key: 'certificate', label: 'Certificate', checkIncludes: 'CERTIFICATE OF COMPLETION' },
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
              <td className="p-4 font-medium text-tactical-200 text-sm align-top w-1/6">{feature.label}</td>
              {courses.map(course => {
                let value: any;
                
                // Prioritize custom getValue function if present
                if (feature.getValue) {
                  value = feature.getValue(course);
                } 
                // Handle checks based on keywords in 'includes' array
                else if (feature.checkIncludes) {
                  const included = checkFeature(course.includes, feature.checkIncludes);
                  // Render check/cross for boolean results from checkFeature unless getValue already returned JSX
                  if (typeof value !== 'object') { // Avoid double-wrapping if getValue returned JSX
                     value = included ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />;
                  } else if (!value) {
                     // Handle cases where getValue might return null/undefined but checkIncludes exists (shouldn't happen with current structure)
                     value = included ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />;
                  }
                }
                // Handle direct property access
                else {
                  value = (course as any)[feature.key];
                  if (feature.format) {
                    value = feature.format(value);
                  } else if (value === undefined || value === null || value === '') {
                      // Specific handling for optional text fields like hotel/transport
                      if (feature.key === 'hotel' || feature.key === 'transport') {
                          // Check if 'includes' mention optionality for Iron Sight
                          if (course.title === 'Iron Sight' && (feature.key === 'hotel' || feature.key === 'transport') && checkFeature(course.includes, 'optional')) {
                              value = <span className="text-tactical-500 italic">Optional</span>;
                          } else {
                              value = <span className="text-tactical-500 italic">Not Included</span>; 
                          } 
                      } else {
                          // Default for other potentially missing direct keys
                          value = '-';
                      }
                  } else if (typeof value === 'boolean') { // Generic boolean fallback (e.g., isPopular, though not used in table now)
                      value = value ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />;
                  }
                }

                // Special case for Iron Sight 'optional' text fields
                if (course.title === 'Iron Sight' && (feature.key === 'hotel' || feature.key === 'meals' || feature.key === 'insurance')){
                   if (checkFeature(course.includes, 'optional')) {
                     value = <span className="text-tactical-500 italic">Optional</span>;
                   } else if (!checkFeature(course.includes, 'optional') && !value) {
                       // If not optional and no value provided by other means
                       value = <X className="w-5 h-5 text-red-400 mx-auto" />;
                   }
                }
                
                // Ensure Hotel/Transport display text if provided directly
                if ((feature.key === 'hotel' || feature.key === 'transport') && typeof (course as any)[feature.key] === 'string' && (course as any)[feature.key]) {
                    value = (course as any)[feature.key];
                }

                return (
                  <td key={`${course.id}-${feature.key}`} className="p-4 text-center text-xs align-top text-tactical-300 w-1/6">
                    {/* Wrap text values for better readability */} 
                    {(typeof value === 'string' && value.length > 20) ? 
                        <span className="block whitespace-normal">{value}</span> : 
                        value
                    }
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