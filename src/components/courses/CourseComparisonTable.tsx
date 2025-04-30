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

// Define the structure for features based on Course properties and desired display logic
const featureConfig = [
  { key: 'price', label: 'Price' },
  { key: 'duration', label: 'Duration (Days)' },
  { key: 'rounds', label: 'Rounds Fired' },
  { key: 'weapon_systems', label: 'Weapon Systems' },
  { key: 'krav_maga', label: 'Krav Maga' },
  { key: 'combat_first_aid', label: 'Combat First Aid' },
  { key: 'helicopter', label: 'Helicopter Ride' },
  { key: 'yacht', label: 'Yacht Cruise' },
  { key: 'horseback', label: 'Horseback Riding' },
  { key: 'spa', label: 'Spa/Recovery' },
  { key: 'cigar_lounge', label: 'Cigar Lounge' },
  { key: 'drone_ops', label: 'Drone Ops' },
  { key: 'hotel', label: 'Accommodation' },
  { key: 'transport', label: 'Transport' },
  { key: 'meals', label: 'Meals (Kosher Available)' },
  { key: 'insurance', label: 'Insurance' },
  { key: 'media_package', label: 'Media Package (Photo/Video)' },
  { key: 'merch_kit', label: 'Merch Kit' },
  { key: 'concierge', label: 'VIP Concierge' },
  { key: 'certificate', label: 'Certificate' },
];

// Keywords for feature checks
const featureKeywords = {
  krav_maga: ['Krav Maga combat sessions', 'Krav Maga tactical sessions', 'Krav Maga defensive tactics', 'Krav Maga crash course'],
  combat_first_aid: ['Full Combat First Aid course', 'Combat First Aid fundamentals', 'Combat First Aid crash course'],
  helicopter: 'helicopter experience',
  yacht: 'yacht cruise',
  horseback: 'Horseback riding session',
  spa: 'Full spa and recovery day',
  cigar_lounge: 'cigar lounge evening',
  drone_ops: 'Drone tactical operations',
  insurance: ['Full insurance', 'Full insurance coverage'],
  media_package: 'Professional media package',
  merch_kit_premium: 'Premium tactical merchandise pack', // For specific text
  concierge: 'VIP concierge service',
  certificate: 'CERTIFICATE OF COMPLETION',
  optional: 'optional',
  meals_gourmet: ['Gourmet breakfasts and luxury dinners', 'Gourmet meals included'],
  meals_standard: 'Buffet-style dining included',
  meals_included_generic: ['meal', 'food', 'dining'], // Fallback check if not gourmet/standard/optional
};

const CourseComparisonTable: React.FC<CourseComparisonTableProps> = ({ courses }) => {

  // Function to render the cell value based on feature key and course data
  const renderCellValue = (featureKey: string, course: Course) => {
    let value: any = '-'; // Default value

    switch (featureKey) {
      case 'price':
        value = formatCurrency(course.price);
        break;
      case 'duration':
        value = course.duration;
        break;
      case 'rounds':
        value = course.rounds;
        break;
      case 'weapon_systems':
        value = getWeaponDetails(course.includes);
        break;
      case 'hotel':
        if (course.hotel?.toLowerCase().includes(featureKeywords.optional)) {
           value = <span className="text-tactical-500 italic">Optional</span>;
        } else if (course.hotel) {
           value = course.hotel;
        } else {
           value = <span className="text-tactical-500 italic">Not Included</span>;
        }
        break;
      case 'transport':
        // Transport is implicitly optional/not included for Iron Sight based on undefined value and lack of 'optional' string
        if (course.title === 'Iron Sight') {
             value = <span className="text-tactical-500 italic">Not Included</span>;
        } else if (course.transport) {
            value = course.transport;
        } else {
            // Should not happen for other courses based on data, but good fallback
            value = <span className="text-tactical-500 italic">Not Included</span>;
        }
        break;
      case 'meals':
        let mealText = 'Not Included'; // Default value
        let isKosher = course.kosherAvailable ? <Check className="w-4 h-4 text-green-400 inline-block ml-1" /> : null;

        // Check for specific known meal strings first
        if (course.includes.some(inc => inc.toLowerCase() === 'meals optional')) {
            mealText = 'Optional';
        } else if (course.includes.some(inc => inc === 'Gourmet breakfasts and luxury dinners')) {
            mealText = 'Gourmet breakfasts and luxury dinners';
        } else if (course.includes.some(inc => inc === 'Gourmet meals included')) {
            mealText = 'Gourmet meals included';
        } else if (course.includes.some(inc => inc === 'Buffet-style dining included')) {
            mealText = 'Buffet-style dining included';
        } else if (course.includes.some(inc => inc === 'Buffet-style meals included')) {
            mealText = 'Buffet-style meals included';
        }
        // If no specific known string matched, try the regex as a fallback (shouldn't be needed with current data)
        else {
            const mealLine = course.includes.find(inc =>
              /\b(meal|meals|dining|breakfast|dinner)\b/i.test(inc)
            );
             if (mealLine) {
                mealText = mealLine;
             }
        }

        // Render based on the determined mealText
        if (mealText === 'Optional' || mealText === 'Not Included') {
            value = <span className="text-tactical-500 italic">{mealText}</span>;
        } else {
            value = <span>{mealText} {isKosher}</span>;
        }
        break;
      case 'insurance':
         if (checkFeature(course.includes, featureKeywords.optional)) {
             value = <span className="text-tactical-500 italic">Optional</span>;
         } else {
             value = checkFeature(course.includes, featureKeywords.insurance)
                 ? <Check className="w-5 h-5 text-green-400 mx-auto" />
                 : <X className="w-5 h-5 text-red-400 mx-auto" />;
         }
         break;
      case 'merch_kit':
        if (checkFeature(course.includes, featureKeywords.merch_kit_premium)) {
          value = 'Premium Kit';
        } else {
          // Check if ANY merch is included, otherwise default to '-'
          // Currently, only Black Talon has explicit merch. Add other checks if needed.
          value = '-';
        }
        break;
      // Handle boolean checks based on keywords
      case 'krav_maga':
      case 'combat_first_aid':
      case 'helicopter':
      case 'yacht':
      case 'horseback':
      case 'spa':
      case 'cigar_lounge':
      case 'drone_ops':
      case 'media_package':
      case 'concierge':
      case 'certificate':
        const keywords = featureKeywords[featureKey as keyof typeof featureKeywords];
        value = checkFeature(course.includes, keywords)
          ? <Check className="w-5 h-5 text-green-400 mx-auto" />
          : <X className="w-5 h-5 text-red-400 mx-auto" />;
        break;
      // Default case for any direct properties not handled above (if featureConfig expanded)
      default:
         if (featureKey in course) {
             const directValue = (course as any)[featureKey];
             if (typeof directValue === 'boolean') {
                 value = directValue ? <Check className="w-5 h-5 text-green-400 mx-auto" /> : <X className="w-5 h-5 text-red-400 mx-auto" />;
             } else if (directValue !== undefined && directValue !== null && directValue !== '') {
                 value = directValue;
             }
         }
         break; // Keep default '-' if key not in course or value is empty/null/undefined
    }

     // Ensure numeric values are displayed (like duration, rounds)
     if (typeof value === 'number') {
        return value.toString();
     }

    return value;
  };


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
          {featureConfig.map((feature, index) => (
            <tr key={feature.key} className={cn("border-b border-tactical-700", index % 2 === 0 ? 'bg-tactical-800' : 'bg-tactical-700/50')}>
              <td className="p-4 font-medium text-tactical-200 text-sm align-top w-1/6">{feature.label}</td>
              {courses.map(course => {
                const cellValue = renderCellValue(feature.key, course);

                return (
                  <td key={`${course.id}-${feature.key}`} className="p-4 text-center text-xs align-top text-tactical-300 w-1/6">
                    {/* Wrap long strings for better readability */}
                    {(typeof cellValue === 'string' && cellValue.length > 20) ?
                        <span className="block whitespace-normal">{cellValue}</span> :
                        cellValue
                    }
                  </td>
                );
              })}
            </tr>
          ))}
          {/* Row for the booking button remains the same */}
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