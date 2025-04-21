import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { CourseCard } from '../components/courses/CourseCard';
import CourseComparisonTable from '../components/courses/CourseComparisonTable';
import { courses } from '../data/courses';
import { Button } from '../components/common/Button';

const Courses: React.FC = () => {
  const [filter, setFilter] = useState<string | null>(null);

  const filteredCourses = filter 
    ? courses.filter(course => {
        if (filter === 'premium' && course.price >= 15000) return true;
        if (filter === 'standard' && course.price >= 2000 && course.price < 15000) return true;
        if (filter === 'basic' && course.price < 2000) return true;
        return false;
      })
    : courses;

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 bg-tactical-900">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ 
              backgroundImage: 'url(https://images.pexels.com/photos/5365109/pexels-photo-5365109.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)' 
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl">
              <span className="inline-block text-accent-500 font-semibold mb-4 tracking-wider text-sm uppercase">
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

        {/* Courses Section */}
        <section className="py-16 bg-tactical-50">
          <div className="container mx-auto px-4">
            {/* Filters */}
            <div className="mb-12 flex flex-wrap gap-3 justify-center">
              <Button 
                variant={filter === null ? 'primary' : 'outline'} 
                onClick={() => setFilter(null)}
              >
                All Packages
              </Button>
              <Button 
                variant={filter === 'premium' ? 'primary' : 'outline'} 
                onClick={() => setFilter('premium')}
              >
                Premium (€15,000+)
              </Button>
              <Button 
                variant={filter === 'standard' ? 'primary' : 'outline'} 
                onClick={() => setFilter('standard')}
              >
                Standard (€2,000-€15,000)
              </Button>
              <Button 
                variant={filter === 'basic' ? 'primary' : 'outline'} 
                onClick={() => setFilter('basic')}
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

            {/* Comparison Table Section */}
            <div className="mb-16">
                <h2 className="font-heading text-3xl font-bold text-tactical-900 mb-8 text-center">
                    Compare Packages
                </h2>
                <CourseComparisonTable courses={courses} />
            </div>

          </div>
        </section>

        {/* Add-ons Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-heading text-3xl font-bold text-tactical-900 mb-6">
                À La Carte Options
              </h2>
              <p className="text-tactical-700">
                Customize your training experience with additional tactical add-ons, experiences, and equipment options. These can be added to any of our core packages.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Experiences */}
              <div className="bg-tactical-100 p-8 rounded-lg">
                <h3 className="font-heading text-xl font-bold text-tactical-900 mb-6">Experiences</h3>
                <ul className="space-y-4">
                  <li className="flex justify-between">
                    <span className="text-tactical-800">Helicopter Ride</span>
                    <span className="font-semibold">€2,000</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-tactical-800">Yacht Cruise</span>
                    <span className="font-semibold">€2,000</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-tactical-800">Horseback Riding</span>
                    <span className="font-semibold">€300</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-tactical-800">Spa & Massage (1 session)</span>
                    <span className="font-semibold">€300</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-tactical-800">Cigar Lounge (3 cigars + whiskey)</span>
                    <span className="font-semibold">€400</span>
                  </li>
                </ul>
              </div>

              {/* Tactical Add-ons */}
              <div className="bg-tactical-100 p-8 rounded-lg">
                <h3 className="font-heading text-xl font-bold text-tactical-900 mb-6">Tactical Add-ons</h3>
                <ul className="space-y-4">
                  <li className="flex justify-between">
                    <span className="text-tactical-800">Night Shooting</span>
                    <span className="font-semibold">€250</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-tactical-800">Rifle Handling & Reloads</span>
                    <span className="font-semibold">€250</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-tactical-800">Pistol Handling & Malfunctions</span>
                    <span className="font-semibold">€250</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-tactical-800">Krav Maga (Disarms & Weapon Retention)</span>
                    <span className="font-semibold">€300</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-tactical-800">CQB Fundamentals</span>
                    <span className="font-semibold">€300</span>
                  </li>
                </ul>
              </div>

              {/* Media & Merch */}
              <div className="bg-tactical-100 p-8 rounded-lg">
                <h3 className="font-heading text-xl font-bold text-tactical-900 mb-6">Media & Merchandise</h3>
                <ul className="space-y-4">
                  <li className="flex justify-between">
                    <span className="text-tactical-800">Media Package (Photo/Video)</span>
                    <span className="font-semibold">€500</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-tactical-800">Tactical Merch Kit (Knife, Patch, AAR)</span>
                    <span className="font-semibold">€300</span>
                  </li>
                </ul>
              </div>

              {/* Accommodation */}
              <div className="bg-tactical-100 p-8 rounded-lg">
                <h3 className="font-heading text-xl font-bold text-tactical-900 mb-6">Accommodation & Transport</h3>
                <ul className="space-y-4">
                  <li className="flex justify-between">
                    <span className="text-tactical-800">Hotel Upgrade: Telegraaf (per night)</span>
                    <span className="font-semibold">€500</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-tactical-800">Hotel Standard: Hestia (per night)</span>
                    <span className="font-semibold">€180</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-tactical-800">VIP Car Service (per day)</span>
                    <span className="font-semibold">€450</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Important Details */}
        <section className="py-16 bg-tactical-100">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="font-heading text-3xl font-bold text-tactical-900 mb-6 text-center">
                Important Details
              </h2>
              
              <div className="bg-white p-8 rounded-lg shadow-md mb-8">
                <h3 className="font-heading text-xl font-bold text-tactical-900 mb-4">Training Requirements</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-accent-500 mr-3 font-bold">•</span>
                    <span>Minimum Training Duration: 2 days</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-accent-500 mr-3 font-bold">•</span>
                    <span>Fixed Training Windows: Monthly</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-accent-500 mr-3 font-bold">•</span>
                    <span>Entry-Level Clients may train with local instructors</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-lg shadow-md">
                <h3 className="font-heading text-xl font-bold text-tactical-900 mb-4">Booking Policies</h3>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="text-accent-500 mr-3 font-bold">•</span>
                    <span>All deposits are non-refundable</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-accent-500 mr-3 font-bold">•</span>
                    <span>Rescheduling must be done at least 30 days in advance</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-accent-500 mr-3 font-bold">•</span>
                    <span>Full payment due 14 days before training begins</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Courses;