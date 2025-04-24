import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-tactical-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-20 justify-between">
          {/* Brand & Social */}
          <div className="mb-8 lg:mb-0 flex-1 min-w-[220px]">
            <div className="flex items-center mb-6">
              <img src="https://i.imgur.com/0jZnTpQ.png" alt="Elite Tactical Logo" className="h-14 w-auto md:h-16 lg:h-20 max-h-20" style={{ maxWidth: '180px' }} />
            </div>
            <p className="mb-6 text-sm">
              Elite tactical training led by Menahem, former Israeli Special Forces. Providing authentic battlefield expertise to military personnel, security teams, and private individuals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Training Programs */}
          <div className="mb-8 lg:mb-0 flex-1 min-w-[180px]">
            <h3 className="text-white font-semibold text-lg mb-6">Training Programs</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/courses" className="text-sm hover:text-white transition-colors">Black Talon Package</Link>
              </li>
              <li>
                <Link to="/courses" className="text-sm hover:text-white transition-colors">Warrior Package</Link>
              </li>
              <li>
                <Link to="/courses" className="text-sm hover:text-white transition-colors">Combat Package</Link>
              </li>
              <li>
                <Link to="/courses" className="text-sm hover:text-white transition-colors">Iron Sight Package</Link>
              </li>
              <li>
                <Link to="/courses" className="text-sm hover:text-white transition-colors">Express Tactical Retreat</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="flex-1 min-w-[220px]">
            <h3 className="text-white font-semibold text-lg mb-6">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="w-5 h-5 mr-3 text-accent-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm">S-Arms Shooting Range<br />Tallinn, Estonia</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-accent-500 flex-shrink-0" />
                <a href="mailto:Menahem@baldeagletactical.com" className="text-sm hover:text-white transition-colors">
                  Menahem@baldeagletactical.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-accent-500 flex-shrink-0" />
                <a href="tel:+447982369701" className="text-sm hover:text-white transition-colors">
                  +44 7982 369701
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-sm">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Elite Tactical Training. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
          <div className="mt-4 text-center text-xs text-gray-500">
            Designed by <a href="https://elimalka.dev" target="_blank" rel="noopener noreferrer" className="underline hover:text-accent-500">Eli Malka</a> with care
          </div>
        </div>
      </div>
    </footer>
  );
};