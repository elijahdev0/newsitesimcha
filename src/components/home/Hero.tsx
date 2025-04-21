import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center bg-tactical-900 overflow-hidden">
      {/* Background overlay with image */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(https://images.pexels.com/photos/6498305/pexels-photo-6498305.jpeg?auto=compress&cs=tinysrgb&w=1600)', 
          filter: 'brightness(0.3)'
        }}
      />
      
      {/* Content */}
      <div className="container mx-auto px-4 py-20 z-10 relative">
        <div className="max-w-3xl">
          <motion.span 
            className="inline-block text-accent-500 font-semibold mb-4 tracking-wider text-sm uppercase"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Israeli Special Forces Expertise
          </motion.span>
          
          <motion.h1 
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Elite Tactical Training For The <span className="text-accent-500">Modern Warrior</span>
          </motion.h1>
          
          <motion.p 
            className="text-gray-300 text-lg mb-8 max-w-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Led by Menahem, former Israeli Special Forces operator with over two decades of battlefield experience. Master authentic combat skills that work when lives are on the line.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link to="/courses">
              <Button variant="accent" size="lg" className="font-medium">
                Explore Training Packages
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" size="lg" className="text-white border-white/30">
                Learn About Our Methodology
              </Button>
            </Link>
          </motion.div>
          
          <motion.div 
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-accent-500 font-heading font-bold text-4xl mb-2">20+</span>
              <span className="text-white text-sm">Years Special Forces Experience</span>
            </div>
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-accent-500 font-heading font-bold text-4xl mb-2">500+</span>
              <span className="text-white text-sm">Elite Operators Trained</span>
            </div>
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <span className="text-accent-500 font-heading font-bold text-4xl mb-2">100%</span>
              <span className="text-white text-sm">Real-World Combat Tested</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};