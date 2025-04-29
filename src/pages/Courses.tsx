import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { CourseCard } from '../components/courses/CourseCard';
import CourseComparisonTable from '../components/courses/CourseComparisonTable';
import { courses, extras } from '../data/courses';
import { Button } from '../components/common/Button';
import { formatCurrency } from '../utils/formatters';
import { Extra } from '../types';

interface CoursesProps {
  showLayout?: boolean; // Default to true
}

const Courses: React.FC<CoursesProps> = ({ showLayout = true }) => {
  const [filter, setFilter] = useState<string | null>(null);

  // Always sort by price descending
  const filteredCourses = (filter 
    ? courses.filter(course => {
        if (filter === 'premium' && course.price >= 15000) return true;
        if (filter === 'standard' && course.price >= 2000 && course.price < 15000) return true;
        if (filter === 'basic' && course.price < 2000) return true;
        return false;
      })
    : courses
  ).slice().sort((a, b) => b.price - a.price);

  // Group extras by category
  const groupedExtras = extras.reduce((acc, extra) => {
    const category = extra.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(extra);
    return acc;
  }, {} as Record<string, Extra[]>);

  // Define display order and titles for categories
  const categoryOrder: (keyof typeof groupedExtras)[] = [
    'experience', 
    'tactical', 
    'weapon', 
    'ammo', 
    'media', 
    'hospitality', 
    'accommodation'
  ];

  const categoryTitles: Record<string, string> = {
    experience: 'Experiences',
    tactical: 'Tactical Add-ons',
    weapon: 'Weapon Rentals / Sessions',
    ammo: 'Extra Ammunition',
    media: 'Media & Merchandise',
    hospitality: 'Luxury & Hospitality',
    accommodation: 'Accommodation',
  };

  return (
    <>
      {showLayout && <Header />}
      <main>
        {/* Hero Section - Already dark, adjusted accent */}
        <section className="relative pt-32 pb-16 bg-tactical-900">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ 
              backgroundImage: 'url(https://static.vecteezy.com/system/resources/thumbnails/033/350/925/small_2x/wallpaper-dark-urban-surface-background-ai-generated-photo.jpg)' 
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <span className="inline-block text-accent-400 font-semibold mb-4 tracking-wider text-sm uppercase">
                Training Programs
              </span>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
                Elite Tactical Training Packages
              </h1>
              <p className="text-gray-300 text-lg mb-4">
                Choose the mission that suits your goals and elevate your tactical capabilities to new heights. Each package is designed to deliver authentic combat skills that work in real-world situations.
              </p>
            </div>
          </div>
        </section>

        {/* Courses Section - Changed bg, buttons */}
        <section className="py-16 bg-tactical-900">
          <div className="container mx-auto px-4">
            {/* Filters */}
            <div className="mb-12 flex flex-wrap gap-3 justify-center">
              <Button 
                variant={filter === null ? 'primary' : 'outline'} 
                onClick={() => setFilter(null)}
                className={filter !== null ? "text-tactical-100 border-tactical-600 hover:bg-tactical-700 hover:text-white" : ""}
              >
                All Packages
              </Button>
              <Button 
                variant={filter === 'premium' ? 'primary' : 'outline'} 
                onClick={() => setFilter('premium')}
                className={filter !== 'premium' ? "text-tactical-100 border-tactical-600 hover:bg-tactical-700 hover:text-white" : ""}
              >
                Premium (€15,000+)
              </Button>
              <Button 
                variant={filter === 'standard' ? 'primary' : 'outline'} 
                onClick={() => setFilter('standard')}
                className={filter !== 'standard' ? "text-tactical-100 border-tactical-600 hover:bg-tactical-700 hover:text-white" : ""}
              >
                Standard (€2,000-€15,000)
              </Button>
              <Button 
                variant={filter === 'basic' ? 'primary' : 'outline'} 
                onClick={() => setFilter('basic')}
                className={filter !== 'basic' ? "text-tactical-100 border-tactical-600 hover:bg-tactical-700 hover:text-white" : ""}
              >
                Basic (Under €2,000)
              </Button>
            </div>

            {/* Course List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {filteredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {/* Comparison Table Section - Changed title color */}
            <div className="mb-16">
                <h2 className="font-heading text-3xl font-bold text-tactical-100 mb-8 text-center">
                    Compare Packages
                </h2>
                <CourseComparisonTable courses={courses} />
            </div>

          </div>
        </section>

        {/* Add-ons Section - Changed bg and text/card colors */}
        <section className="py-16 bg-tactical-800">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-heading text-3xl font-bold text-tactical-100 mb-6">
                À La Carte Options
              </h2>
              <p className="text-tactical-300">
                Customize your training experience with additional tactical add-ons, experiences, and equipment options. These can be added to any of our core packages.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Dynamically render categories based on defined order */}
              {categoryOrder.map(categoryKey => {
                const items = groupedExtras[categoryKey];
                // Only render the category if it exists in the data and has items
                if (items && items.length > 0) {
                  return (
                    <div key={categoryKey} className="bg-tactical-700 p-8 rounded-lg">
                      <h3 className="font-heading text-xl font-bold text-tactical-100 mb-6">
                        {categoryTitles[categoryKey] || categoryKey} {/* Fallback to key if title missing */}
                      </h3>
                      <ul className="space-y-4">
                        {items.map(extra => (
                          <li key={extra.id} className="border-b border-tactical-600 pb-3 mb-3 last:border-b-0 last:pb-0 last:mb-0">
                            <div className="flex justify-between items-start mb-1">
                              <span className="text-tactical-100 mr-2 font-medium">{extra.name}</span>
                              <span className="font-semibold text-accent-400 text-right flex-shrink-0">
                                {formatCurrency(extra.price)}
                                {categoryKey === 'ammo' && ' / round'} 
                                {(categoryKey === 'weapon' || categoryKey === 'accommodation' || extra.name.toLowerCase().includes('(per day)') || extra.name.toLowerCase().includes('(per night)')) && ' / day'}
                              </span>
                            </div>
                            {extra.description && (
                              <p className="text-tactical-300 text-sm">{extra.description}</p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }
                return null; // Don't render anything if category is empty or not found
              })}
            </div>
          </div>
        </section>

        {/* Important Details - Changed bg and text/card colors */}
        <section className="py-16 bg-tactical-900">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading text-3xl font-bold text-tactical-100 mb-6 text-center">
                Important Details
              </h2>
              
              <div className="bg-tactical-800 p-8 rounded-lg shadow-md mb-8">
                <h3 className="font-heading text-xl font-bold text-tactical-100 mb-4">Training Requirements</h3>
                <ul className="space-y-2 text-tactical-300">
                  <li className="flex items-center">
                    <span className="text-accent-400 mr-3 font-bold">•</span>
                    <span>Minimum Training Duration: 2 days</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-accent-400 mr-3 font-bold">•</span>
                    <span>Fixed Training Windows: Monthly</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-accent-400 mr-3 font-bold">•</span>
                    <span>Entry-Level Clients may train with local instructors</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-tactical-800 p-8 rounded-lg shadow-md">
                <h3 className="font-heading text-xl font-bold text-tactical-100 mb-4">Booking Policies</h3>
                <ul className="space-y-2 text-tactical-300">
                  <li className="flex items-center">
                    <span className="text-accent-400 mr-3 font-bold">•</span>
                    <span>All deposits are non-refundable</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-accent-400 mr-3 font-bold">•</span>
                    <span>Rescheduling must be done at least 30 days in advance</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-accent-400 mr-3 font-bold">•</span>
                    <span>Full payment due 14 days before training begins</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      {showLayout && <Footer />}
    </>
  );
};

export default Courses;