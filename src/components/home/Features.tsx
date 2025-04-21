import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Target, Users, Award, Repeat, Zap } from 'lucide-react';

const features = [
  {
    icon: <Shield className="w-10 h-10 text-accent-500" />,
    title: 'Authenticity',
    description: 'Every technique we teach has been battle-tested in real combat situations. We don\'t teach theory—we teach what works when lives are on the line.'
  },
  {
    icon: <Repeat className="w-10 h-10 text-accent-500" />,
    title: 'Adaptability',
    description: 'We train you to think tactically in any situation. Combat is unpredictable—our goal is to make you capable of adapting to any threat or environment.'
  },
  {
    icon: <Award className="w-10 h-10 text-accent-500" />,
    title: 'Excellence',
    description: 'We maintain the highest standards in every aspect of our training. From equipment to instruction, we accept nothing less than excellence.'
  },
  {
    icon: <Target className="w-10 h-10 text-accent-500" />,
    title: 'Precision Training',
    description: 'Develop pinpoint accuracy under stress. Our firearms training focuses on practical shooting scenarios that simulate real-world conditions.'
  },
  {
    icon: <Users className="w-10 h-10 text-accent-500" />,
    title: 'Small Group Focus',
    description: 'Limited class sizes ensure personalized attention and maximum skill development. Every trainee receives hands-on coaching.'
  },
  {
    icon: <Zap className="w-10 h-10 text-accent-500" />,
    title: 'High-Stress Drills',
    description: 'We create challenging scenarios that push your limits. Learn to maintain tactical clarity when your body\'s stress response is activated.'
  }
];

export const Features: React.FC = () => {
  return (
    <section className="py-20 bg-tactical-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-tactical-900 mb-4">
            Our Training Methodology
          </h2>
          <p className="text-tactical-600 text-lg">
            Unlike conventional training programs, we focus on real-world scenarios and adaptive techniques that work under stress. Our methodology is built on three core principles:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="font-heading text-xl font-semibold text-tactical-800 mb-3">{feature.title}</h3>
              <p className="text-tactical-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};