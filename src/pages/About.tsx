import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Users, Target, Award } from 'lucide-react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';

const About: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 bg-tactical-900">
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
            style={{ 
              backgroundImage: 'url(https://static.vecteezy.com/system/resources/thumbnails/033/350/925/small_2x/wallpaper-dark-urban-surface-background-ai-generated-photo.jpg)' 
            }}
          />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div 
              className="max-w-3xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-block text-accent-400 font-semibold mb-4 tracking-wider text-sm uppercase">
                Our Mission
              </span>
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
                Authentic Tactical Training From The Battlefield
              </h1>
              <p className="text-gray-300 text-lg mb-4">
                At Bald Eagle Tactical , we deliver authentic combat expertise based on real-world battlefield experience. Our mission is to provide elite-level tactical training that works when it matters most.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="py-16 bg-tactical-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-heading text-3xl font-bold text-tactical-100 mb-6">
                  Our Training Philosophy
                </h2>
                <p className="text-tactical-300 mb-4">
                  Unlike conventional training programs, we focus on real-world scenarios and adaptive techniques that work under stress. We don't teach theory—we teach what works when lives are on the line.
                </p>
                <p className="text-tactical-300 mb-8">
                  Our methodology combines military precision with practical application, making advanced tactical skills accessible to anyone committed to learning. Every technique we teach has been battle-tested in real combat situations.
                </p>

                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-tactical-800 p-3 rounded-lg mr-4">
                      <Shield className="w-6 h-6 text-accent-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-tactical-100 text-lg mb-1">Authenticity</h3>
                      <p className="text-tactical-300">Every technique we teach has been battle-tested in real combat situations.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-tactical-800 p-3 rounded-lg mr-4">
                      <Target className="w-6 h-6 text-accent-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-tactical-100 text-lg mb-1">Adaptability</h3>
                      <p className="text-tactical-300">We train you to think tactically in any situation and adapt to any threat or environment.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="bg-tactical-800 p-3 rounded-lg mr-4">
                      <Award className="w-6 h-6 text-accent-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-tactical-100 text-lg mb-1">Excellence</h3>
                      <p className="text-tactical-300">We maintain the highest standards in every aspect of our training.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative">
                  <div className="absolute -top-4 -right-4 w-32 h-32 bg-accent-400/10 rounded-tr-lg z-0"></div>
                  <img 
                    src="https://i.imgur.com/5Fu3qkZ.jpeg" 
                    alt="Tactical Training"
                    className="rounded-lg shadow-xl relative z-10"
                  />
                  <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent-400/10 rounded-bl-lg z-0"></div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Instructor Background */}
        <section className="py-16 bg-tactical-800">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-heading text-3xl font-bold text-tactical-100 mb-6">
                Meet Your Head Instructor
              </h2>
              <p className="text-tactical-300">
                From the battlefields of Israel to missions deep in Africa, Menahem has dedicated his life to mastering and teaching real-world combat and tactical defense.
              </p>
            </div>

            {/* Main Instructor Info Grid: Image + Bio/Quote */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start mb-12">
              {/* Image Column */}
              <div className="relative min-h-[300px] lg:min-h-[500px] rounded-lg overflow-hidden shadow-lg">
                <img
                  src="https://i.imgur.com/nRmngdh.jpeg"
                  alt="Instructor Menahem"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Text Content Column (Bio & Quote) */}
              <div className="p-8 md:p-10 flex flex-col bg-tactical-700/40 rounded-lg shadow-lg min-h-full">
                <h3 className="font-heading text-2xl font-bold text-tactical-100 mb-2">Menahem</h3>
                <p className="text-accent-400 font-medium mb-6">
                  Israeli Special Forces Veteran | Combat Instructor | Global Security Expert
                </p>

                {/* Bio Paragraphs */}
                <div className="mb-8 space-y-4 text-tactical-300 flex-grow">
                  <p>
                    From the battlefields of Israel to missions deep in Africa, Menahem has dedicated his life to mastering and teaching real-world combat and tactical defense.
                  </p>
                  <p>
                    With over five years of experience as a Commander in Israeli Special Forces and extensive work across Africa in high-risk environments, Menahem brings a rare combination of elite military training and authentic operational experience to every session.
                  </p>
                  <p>
                    Specializing in close-quarters combat, firearms proficiency, threat assessment, and executive protection, Menahem's instruction is built on lessons forged in the field — not in a classroom.
                  </p>
                  <p className="text-tactical-200 italic pt-4 border-t border-tactical-600/50">
                    At Bald Eagle Tactical, Menahem's mission is clear: To pass on battle-tested skills that save lives — skills sharpened through years of real-world missions, tactical operations, and front-line leadership.
                  </p>
                </div>

                {/* Blockquote - Removed mt-auto, relies on flex-grow above */}
                <blockquote className="p-6 border-l-4 border-accent-400 bg-tactical-800/70 rounded-r-lg shadow-inner">
                  <p className="text-tactical-200 italic mb-3">
                    "My mission is to pass on the hard-earned lessons of the battlefield — to train warriors, protectors, and those who refuse to be victims. Tactics that work when it matters most — not just on the training ground, but when life is truly on the line."
                  </p>
                  <footer className="text-accent-400 text-right font-medium">— Menahem</footer>
                </blockquote>
              </div>
            </div>

            {/* Separated Background & Expectations Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Background Section */}
              <div className="bg-tactical-700/60 p-6 rounded-lg border border-tactical-600 shadow-md">
                <h4 className="font-semibold text-tactical-100 mb-4 text-lg border-b border-tactical-600 pb-2">
                  Background
                </h4>
                <ul className="space-y-3 list-none text-tactical-300 text-sm pl-2">
                  <li><span className="font-medium text-tactical-200">Israeli Special Forces Veteran:</span> 5+ years in special operations, including counter-terrorism and high-risk missions.</li>
                  <li><span className="font-medium text-tactical-200">Global Security Operative:</span> Real-world operational experience across Africa, specializing in protection, tactical training, and security consulting.</li>
                  <li><span className="font-medium text-tactical-200">Instructor of Elite Teams:</span> Trained military units, security teams, and civilians around the world.</li>
                </ul>
              </div>

              {/* Expectations Section */}
              <div className="bg-tactical-700/60 p-6 rounded-lg border border-tactical-600 shadow-md">
                <h4 className="font-semibold text-tactical-100 mb-4 text-lg border-b border-tactical-600 pb-2">
                  What You Can Expect
                </h4>
                <ul className="space-y-4 text-tactical-300 text-sm pl-2">
                  <li>
                    <strong className="block text-tactical-200 mb-1">Combat-Proven Methodology:</strong>
                    Training built on real missions, where precision and survival were non-negotiable.
                  </li>
                  <li>
                    <strong className="block text-tactical-200 mb-1">Advanced Tactical Certifications:</strong>
                    Expertise in counter-terrorism, executive protection, advanced firearms, and threat mitigation.
                  </li>
                  <li>
                    <strong className="block text-tactical-200 mb-1">Personalized, Real-World Instruction:</strong>
                    Whether you're preparing for a hostile environment or seeking elite-level self-defense skills, every session is tailored to meet real-world threats — not just theoretical training.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Who We Train */}
        <section className="py-16 bg-tactical-900">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-heading text-3xl font-bold text-tactical-100 mb-6">
                Who We Train
              </h2>
              <p className="text-tactical-300">
                Our programs serve a diverse range of clients seeking elite-level tactical training. Whether you're a professional in the security sector or a civilian committed to personal defense, our training is tailored to your needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <motion.div
                className="bg-tactical-800 p-8 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Users className="w-10 h-10 text-accent-400 mb-4" />
                <h3 className="font-heading text-xl font-bold text-tactical-100 mb-3">
                  Security Professionals
                </h3>
                <p className="text-tactical-300">
                  Executive protection specialists, security consultants, and corporate security teams looking to enhance tactical response capabilities.
                </p>
              </motion.div>

              <motion.div
                className="bg-tactical-800 p-8 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Users className="w-10 h-10 text-accent-400 mb-4" />
                <h3 className="font-heading text-xl font-bold text-tactical-100 mb-3">
                  Law Enforcement
                </h3>
                <p className="text-tactical-300">
                  Police officers, tactical units, and specialized law enforcement personnel seeking advanced combat training beyond standard department programs.
                </p>
              </motion.div>

              <motion.div
                className="bg-tactical-800 p-8 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Users className="w-10 h-10 text-accent-400 mb-4" />
                <h3 className="font-heading text-xl font-bold text-tactical-100 mb-3">
                  Military Personnel
                </h3>
                <p className="text-tactical-300">
                  Active duty and veterans looking to refine their tactical skills with specialized training from elite foreign special forces.
                </p>
              </motion.div>

              <motion.div
                className="bg-tactical-800 p-8 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Users className="w-10 h-10 text-accent-400 mb-4" />
                <h3 className="font-heading text-xl font-bold text-tactical-100 mb-3">
                  Civilians
                </h3>
                <p className="text-tactical-300">
                  Responsible civilians committed to high-level self-defense training and tactical firearms expertise.
                </p>
              </motion.div>

              <motion.div
                className="bg-tactical-800 p-8 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Users className="w-10 h-10 text-accent-400 mb-4" />
                <h3 className="font-heading text-xl font-bold text-tactical-100 mb-3">
                  Firearms Enthusiasts
                </h3>
                <p className="text-tactical-300">
                  Experienced shooters looking to train at an elite level with battlefield-proven techniques and tactical applications.
                </p>
              </motion.div>

              <motion.div
                className="bg-tactical-800 p-8 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Users className="w-10 h-10 text-accent-400 mb-4" />
                <h3 className="font-heading text-xl font-bold text-tactical-100 mb-3">
                  Corporate Teams
                </h3>
                <p className="text-tactical-300">
                  Leadership groups and executive teams seeking challenging experiences that build teamwork, decision-making skills, and resilience.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Meet Our Team */}
        <section className="py-16 bg-tactical-800">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="font-heading text-3xl font-bold text-tactical-100 mb-6">
                Meet the Instructors
              </h2>
              <p className="text-tactical-300">
                Our instructor team is made up of professionals from diverse Israeli military and special forces units, each bringing unique tactical knowledge and operational expertise.
              </p>
            </div>

            {/* Placeholder for Team Image and Description */}
            {/* Client will provide the actual image URL */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                {/* Team Image */}
                <div className="relative bg-tactical-700 rounded-lg shadow-xl overflow-hidden h-64 md:h-80">
                  <img 
                    src="https://i.imgur.com/5Fu3qkZ.jpeg"
                    alt="Bald Eagle Tactical Instructor Team"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-tactical-300 space-y-4"
              >
                <p>
                  From elite infantry and counterterror units to intelligence and protection services, every member has trained and operated in high-pressure environments — both in Israel and abroad.
                </p>
                <p>
                  Together, we combine decades of combat-tested skillsets into one unified force, delivering world-class training that is precise, adaptable, and grounded in real experience.
                </p>
              </motion.div>
            </div>
            {/* End Placeholder */}

          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default About;