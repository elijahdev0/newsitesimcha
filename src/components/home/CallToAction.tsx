import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '../common/Button';

export const CallToAction: React.FC = () => {
  return (
    <section className="py-16 bg-tactical-900 relative overflow-hidden">
      {/* Background image with overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/2199293/pexels-photo-2199293.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)'
        }}
      />
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="bg-tactical-800/80 backdrop-blur-sm p-10 lg:p-16 rounded-lg max-w-5xl mx-auto shadow-xl">
          <div className="text-center">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Train Like The Elite?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Whether you're a civilian seeking self-defense skills, a security professional upgrading your capabilities, or a firearms enthusiast looking to train like the elite, our programs will challenge you, transform you, and elevate your tactical readiness to new heights.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/courses">
                <Button variant="accent" size="lg">
                  View Training Packages
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="text-white border-white/30">
                  Contact Us
                </Button>
              </Link>
            </div>
            
            <p className="mt-8 text-gray-400">
              Limited spots available. Training sessions fill up quickly.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};