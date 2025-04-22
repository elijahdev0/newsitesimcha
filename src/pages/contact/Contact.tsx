import React from 'react';
import { Link } from 'react-router-dom';
import { Header } from '../../components/common/Header';
import { Footer } from '../../components/common/Footer';
import { Button } from '../../components/common/Button';
import { Mail, MessageSquare, MapPin, Search } from 'lucide-react';

const Contact: React.FC = () => {
  const whatsappNumber = '447982369701';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;
  const emailAddress = 'Menahem@baldeagletactical.com';

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-tactical-900 to-tactical-800 pt-24 pb-16">
        {/* Hero Section */}
        <section className="bg-tactical-900 text-white py-20 md:py-28 relative overflow-hidden">
           {/* Optional: Subtle background element */}
           <div className="absolute inset-0 bg-black/20 z-0"></div>
           <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-accent-900/10 to-transparent z-0 opacity-50"></div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <Mail className="w-16 h-16 mx-auto mb-6 text-accent-400 opacity-80" />
            <h1 className="text-4xl md:text-6xl font-heading font-bold mb-4">Contact Us</h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              We're here to help. Whether you have questions about our courses, need booking assistance, or have any other inquiries, please don't hesitate to reach out.
            </p>
          </div>
        </section>

        {/* Contact Methods & Location Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {/* Column 1: Email */}
              <div className="bg-tactical-800 p-6 rounded-lg shadow-lg border border-tactical-700 text-center hover:shadow-xl transition-shadow duration-300">
                <Mail className="w-12 h-12 text-accent-400 mx-auto mb-4" />
                <h3 className="text-xl font-heading font-semibold text-tactical-100 mb-2">Email Support</h3>
                <p className="text-tactical-300 mb-4 text-sm">
                  Send us an email for detailed inquiries.
                </p>
                <a
                  href={`mailto:${emailAddress}`}
                  className="inline-block bg-accent-600 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-accent-700 transition-colors break-all"
                >
                  {emailAddress}
                </a>
              </div>

              {/* Column 2: WhatsApp */}
              <div className="bg-tactical-800 p-6 rounded-lg shadow-lg border border-tactical-700 text-center hover:shadow-xl transition-shadow duration-300">
                <MessageSquare className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-heading font-semibold text-tactical-100 mb-2">WhatsApp Chat</h3>
                <p className="text-tactical-300 mb-4 text-sm">
                  Chat directly with our team for quick questions.
                </p>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-green-500 text-white px-5 py-2 rounded-md text-sm font-medium hover:bg-green-600 transition-colors"
                >
                  Chat Now (+44...701)
                </a>
              </div>

              {/* Column 3: Location */}
              <div className="bg-tactical-800 p-6 rounded-lg shadow-lg border border-tactical-700 text-center hover:shadow-xl transition-shadow duration-300">
                <MapPin className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-heading font-semibold text-tactical-100 mb-2">Our Location</h3>
                <p className="text-tactical-300 mb-1 text-sm">
                  S-Arms Shooting Range, Tallinn, Estonia
                </p>
                <p className="text-xs text-tactical-400 italic mb-4">
                  Estonia's Premier Tactical Training Facility
                </p>
                 {/* Optional: Link to map - replace '#' with actual link if available */}
                 {/* <a href="#" className="text-blue-400 hover:text-blue-300 text-sm font-medium">View on Map (Placeholder)</a> */}
              </div>
            </div>
          </div>
        </section>

        {/* Alternative Actions Section */}
        <section className="py-16 bg-tactical-700">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl font-heading font-bold text-tactical-100 mb-4">Ready to Train?</h2>
            <p className="text-tactical-300 mb-8 max-w-2xl mx-auto">
              Explore our comprehensive tactical training packages to find the perfect fit for your needs.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/courses">
                <Button variant="primary" className="w-full sm:w-auto">
                  <Search className="w-5 h-5 mr-2" />
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Contact; 