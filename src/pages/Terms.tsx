import React from "react";
import { Header } from '../components/common/Header';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-tactical-900 text-white">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="h-8" />
        <h1 className="text-3xl font-bold mb-6">Terms & Conditions</h1>
        <p className="mb-4">Effective Date: April 24, 2025</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">1. Acceptance of Terms</h2>
        <p className="mb-4">By using our website and services, you agree to these Terms & Conditions. If you do not agree, please do not use our services.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">2. Services</h2>
        <p className="mb-4">Elite Tactical Training provides tactical training programs. We reserve the right to modify or discontinue any service at any time.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">3. Bookings & Payments</h2>
        <p className="mb-4">All bookings are subject to availability. Payment must be completed to confirm your booking. Cancellations and refunds are subject to our policies.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">4. User Conduct</h2>
        <p className="mb-4">You agree not to misuse our website or services. We may terminate access for violations.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">5. Limitation of Liability</h2>
        <p className="mb-4">Elite Tactical Training is not liable for any damages arising from the use of our services, except as required by law.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">6. Changes to Terms</h2>
        <p className="mb-4">We may update these Terms & Conditions at any time. Continued use of our services means you accept the new terms.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">7. Contact</h2>
        <p>If you have any questions about these Terms & Conditions, please contact us at Menahem@baldeagletactical.com.</p>
      </div>
    </div>
  );
};

export default Terms;
