import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Medal, CheckCircle } from 'lucide-react';

export const Instructor: React.FC = () => {
  return (
    <section className="py-20 bg-tactical-900 text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-accent-500 rounded-tl-lg z-0"></div>
              <img 
                src="https://i.imgur.com/nRmngdh.jpeg" 
                alt="Instructor Menahem"
                className="rounded-lg object-cover w-full h-[500px] relative z-10"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent-500 rounded-br-lg z-0"></div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center mb-4">
              <Shield className="w-6 h-6 text-accent-500 mr-2" />
              <span className="text-accent-500 font-semibold uppercase tracking-wider text-sm">Meet Your Instructor</span>
            </div>

            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
              Menahem, Former Israeli Special Forces Commander
            </h2>

            <p className="text-gray-300 mb-6">
              With over five years of experience in Israeli Special Forces, Menahem has trained elite military personnel, security teams, and private individuals in tactical combat and defense strategies.
            </p>

            <p className="text-gray-300 mb-8">
              Specializing in close-quarters combat, firearms training, and threat assessment, Menahem brings authentic battlefield expertise to every session, ensuring you receive real-world skills that can save lives.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <Medal className="text-accent-500 w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Elite Military Background</h4>
                  <p className="text-gray-400 text-sm">5+ years in special operations and high-risk missions</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="text-accent-500 w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Combat-Proven Methodology</h4>
                  <p className="text-gray-400 text-sm">Training philosophy combining military precision with practical application</p>
                </div>
              </div>
              <div className="flex items-start">
                <Shield className="text-accent-500 w-5 h-5 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-white">Advanced Certifications</h4>
                  <p className="text-gray-400 text-sm">Specialized in counter-terrorism, executive protection, and advanced weapons handling</p>
                </div>
              </div>
            </div>

            <blockquote className="italic text-gray-300 border-l-4 border-accent-500 pl-4 mb-4">
              "My mission is to bring authentic combat expertise to those committed to mastering tactical skills that work in real-world situations, not just on the training ground."
            </blockquote>
            <p className="text-accent-500 font-semibold">— Menahem</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};