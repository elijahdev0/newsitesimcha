import React from 'react';

export const WhatWeOfferSection: React.FC = () => (
  <section className="py-16 md:py-24 bg-tactical-900 text-white">
    <div className="container mx-auto px-4">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        {/* Left: Text Content */}
        <div className="flex-1 lg:max-w-lg xl:max-w-xl">
          <div className="mb-10">
            <div className="flex items-center mb-5">
              <span className="w-2 h-8 bg-accent-500 rounded mr-4"></span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-accent-500">What We Offer</h2>
            </div>
            <p className="text-gray-300 text-lg mb-4">
              Bald Eagle Tactical is based in Estonia and led by Israeli Special Forces veterans.
            </p>
            <p className="text-gray-300 text-lg mb-4">
              We offer fully <span className="font-semibold text-white">all-inclusive</span> 2–6 day tactical experiences — live-fire shooting, Krav Maga, combat fitness, and first aid — with <span className="font-semibold text-white">everything covered</span>: hotel, food, transport, gear, ammo, and instruction.
            </p>
            <p className="text-gray-300 text-lg mb-4">
              Choose from <span className="font-semibold text-white">5 exclusive packages</span>, or <span className="font-semibold text-white">build your own</span> with our buffet-style add-ons: helicopter, yacht, luxury hotels, and more.
            </p>
            <p className="text-accent-500 font-semibold text-lg mt-6 italic">
              Train like your life depends on it — because one day, it might.
            </p>
          </div>
          <div className="mb-8 lg:mb-0">
            <div className="flex items-center mb-4">
              <span className="w-2 h-7 bg-accent-500 rounded mr-4"></span>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-white">Experience it for yourself</h3>
            </div>
            <p className="text-gray-300 mb-6 text-lg italic pl-6 border-l-2 border-tactical-700">
              Everything you see is real. Everything can be part of your journey.
            </p>
          </div>
        </div>
        {/* Right: Responsive Photo Grid & Callout */}
        <div className="flex-1 flex flex-col w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border border-tactical-700/50 rounded-lg overflow-hidden p-1 bg-tactical-800/20 shadow-lg">
            <img src="https://i.imgur.com/DLTO8py.jpeg" alt="Experience 1" className="object-cover aspect-[4/3] w-full hover:scale-105 transition-transform duration-300 rounded" />
            <img src="https://i.imgur.com/LaUcU1x.jpeg" alt="Experience 2" className="object-cover aspect-[4/3] w-full hover:scale-105 transition-transform duration-300 rounded" />
            <img src="https://i.imgur.com/snXFArN.jpeg" alt="Experience 3" className="object-cover aspect-[4/3] w-full hover:scale-105 transition-transform duration-300 rounded" />
            <img src="https://i.imgur.com/dPhrIAV.jpeg" alt="Experience 4" className="object-cover aspect-[4/3] w-full hover:scale-105 transition-transform duration-300 rounded" />
            <img src="https://i.imgur.com/KOZyy4O.jpeg" alt="Experience 5" className="object-cover aspect-[4/3] w-full hover:scale-105 transition-transform duration-300 rounded" />
            <img src="https://i.imgur.com/cizfBFF.jpeg" alt="Experience 6" className="object-cover aspect-[4/3] w-full hover:scale-105 transition-transform duration-300 rounded" />
          </div>
          <div className="mt-8 w-full">
            <div className="border-l-4 border-accent-500 pl-6 py-5 bg-tactical-800/40 rounded-r-lg shadow-md">
              <p className="text-gray-300 text-base md:text-lg font-medium text-center md:text-left leading-relaxed">
                These moments are included in our <span className="text-accent-500 font-semibold">core packages</span> or available as <span className="text-accent-500 font-semibold">add-ons</span>.<br className="hidden md:block" />
                <span className="block mt-2 text-accent-400 font-bold text-lg md:text-xl">
                  Train hard, rest well, and live the experience.
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
