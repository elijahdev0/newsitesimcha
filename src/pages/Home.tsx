import React from 'react';
import { Hero } from '../components/home/Hero';
import { WhatWeOfferSection } from '../components/home/WhatWeOfferSection';
import { Features } from '../components/home/Features';
import { Instructor } from '../components/home/Instructor';
import { CourseHighlights } from '../components/home/CourseHighlights';
import { CallToAction } from '../components/home/CallToAction';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';

export const Home: React.FC = () => {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <WhatWeOfferSection />
        <Features />
        <Instructor />
        <CourseHighlights />
        <CallToAction />
      </main>
      <Footer />
    </>
  );
};

export default Home;