import React from 'react';
import { MessageSquare } from 'lucide-react'; // Using MessageSquare as a placeholder for WhatsApp

const WhatsappFAB: React.FC = () => {
  const whatsappNumber = '447982369701'; // Ensure no + or spaces for wa.me link
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-3 shadow-lg transition-transform duration-200 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2"
      aria-label="Chat on WhatsApp"
    >
      <MessageSquare className="w-6 h-6" />
    </a>
  );
};

export default WhatsappFAB; 