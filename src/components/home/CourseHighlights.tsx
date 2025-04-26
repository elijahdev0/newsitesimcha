import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { courses } from '../../data/courses';
import { formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';

export const CourseHighlights: React.FC = () => {
  // Show only top 3 courses
  const featuredCourses = courses
    .filter(course => course.id !== 'express')
    .slice(0, 3);

  return (
    <section className="py-20 bg-tactical-900">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-tactical-100 mb-4">
            Elite Tactical Training Packages
          </h2>
          <p className="text-tactical-300 text-lg">
            Choose the mission that suits your goals and elevate your tactical capabilities to new heights with our premium training experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              className={`
                bg-tactical-800 border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow
                ${course.isPopular ? 'ring-2 ring-accent-400' : 'border-tactical-700'}
              `}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {course.isPopular && (
                <div className="bg-accent-500 text-white text-center py-2 font-medium text-sm">
                  MOST POPULAR
                </div>
              )}
              
              <div className="p-6">
                <h3 className="font-heading text-2xl font-bold text-tactical-100 mb-2">
                  {course.title}
                </h3>
                <p className="text-tactical-300 mb-4">
                  {course.description}
                </p>
                <div className="text-3xl font-bold text-tactical-100 mb-6">
                  {formatCurrency(course.price)}
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center mb-3">
                    <span className="bg-tactical-700 text-tactical-100 rounded-full px-3 py-1 text-sm font-medium mr-2">
                      {course.duration} days
                    </span>
                    <span className="bg-tactical-700 text-tactical-100 rounded-full px-3 py-1 text-sm font-medium">
                      {course.rounds} rounds
                    </span>
                  </div>
                  
                  <ul className="space-y-2">
                    {course.includes.slice(0, 3).map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-accent-400 mr-2">✓</span>
                        <span className="text-sm text-tactical-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Link to="/courses">
                  <Button variant="primary" fullWidth>
                    View Details
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link to="/courses">
            <Button variant="outline" size="lg" className="inline-flex items-center text-tactical-100 border-tactical-600 hover:bg-tactical-700 hover:text-white">
              View All Training Packages
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};