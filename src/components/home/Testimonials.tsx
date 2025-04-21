import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'James M.',
    role: 'Private Security Professional',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    content: 'The Black Talon program was transformative. Menahem\'s instruction combines technical precision with practical applications that simply work. As someone in executive protection, these skills have become invaluable in my day-to-day operations.',
    rating: 5
  },
  {
    id: 2,
    name: 'Sarah K.',
    role: 'Law Enforcement Officer',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    content: 'My shooting and CQB fundamentals improved dramatically after just five days. The Combat package was intense but extremely rewarding. Menahem\'s instruction is clear, direct, and built on real-world experience.',
    rating: 5
  },
  {
    id: 3,
    name: 'Michael T.',
    role: 'Military Veteran',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    content: 'Having served in multiple deployments myself, I can attest that Menahem teaches authentic tactics that work under pressure. The Warrior program was worth every penny and elevated my skills to a level I didn\'t think possible as a civilian.',
    rating: 5
  }
];

export const Testimonials: React.FC = () => {
  return (
    <section className="py-20 bg-tactical-100">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-tactical-900 mb-4">
            What Our Trainees Say
          </h2>
          <p className="text-tactical-600 text-lg">
            Hear from those who have completed our programs and experienced the difference of authentic tactical training.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white p-8 rounded-lg shadow-lg relative"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="absolute -top-5 left-6 bg-accent-500 text-white p-2 rounded-md">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M11.192 15.757c0-.88-.23-1.618-.69-2.217-.326-.412-.768-.683-1.327-.812-.55-.128-1.07-.137-1.54-.028-.16-.95.1-1.95.78-3 .53-.81 1.24-1.52 2.11-2.13L9.695 6c-.92.63-1.72 1.27-2.43 1.91-.71.65-1.3 1.3-1.78 1.97-.48.67-.83 1.34-1.05 2.02-.22.67-.33 1.35-.33 2.02 0 .83.17 1.58.52 2.27.36.69.86 1.23 1.5 1.63.64.39 1.38.59 2.22.59.88 0 1.64-.21 2.3-.62.65-.41 1.15-.98 1.51-1.68.35-.71.53-1.52.53-2.44zm8.13 0c0-.88-.23-1.618-.69-2.217-.326-.42-.768-.695-1.327-.83-.55-.13-1.07-.14-1.54-.03-.16-.95.1-1.95.78-3 .53-.81 1.24-1.52 2.11-2.13L18.695 6c-.92.63-1.72 1.27-2.43 1.91-.71.65-1.3 1.3-1.78 1.97-.48.67-.83 1.34-1.05 2.02-.22.67-.33 1.35-.33 2.02 0 .83.17 1.58.52 2.27.36.69.86 1.23 1.5 1.63.64.39 1.38.59 2.22.59.88 0 1.64-.21 2.3-.62.65-.41 1.15-.98 1.51-1.68.35-.71.53-1.52.53-2.44z" />
                </svg>
              </div>

              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              <p className="text-tactical-700 mb-6">{testimonial.content}</p>

              <div className="flex items-center">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-tactical-900">{testimonial.name}</h4>
                  <p className="text-sm text-tactical-600">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};