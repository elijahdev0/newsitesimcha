import React from "react";
import { Header } from '../components/common/Header';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-tactical-900 text-white">
      <Header />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="h-8" />
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="mb-4">Effective Date: April 24, 2025</p>
        <p className="mb-4">We value your privacy. This Privacy Policy explains how Elite Tactical Training collects, uses, and protects your information when you use our website and services.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Information We Collect</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>Personal information you provide (such as name, email, phone number, etc.)</li>
          <li>Booking and payment details</li>
          <li>Usage data (such as pages visited, browser type, etc.)</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">How We Use Your Information</h2>
        <ul className="list-disc ml-6 mb-4">
          <li>To provide and improve our services</li>
          <li>To process bookings and payments</li>
          <li>To communicate with you about your bookings or inquiries</li>
          <li>To comply with legal obligations</li>
        </ul>
        <h2 className="text-xl font-semibold mt-6 mb-2">Your Rights</h2>
        <p className="mb-4">You have the right to access, update, or delete your personal information. Contact us at Menahem@baldeagletactical.com for any privacy-related requests.</p>
        <h2 className="text-xl font-semibold mt-6 mb-2">Contact</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at Menahem@baldeagletactical.com.</p>
      </div>
    </div>
  );
};

export default Privacy;
