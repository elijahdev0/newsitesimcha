import React, { useState } from 'react';
import { Button } from '../common/Button';
import { Input } from '../common/Input'; // Assuming you have an Input component
// import { Textarea } from '../common/Textarea'; // Assuming you have a Textarea component
// import { Select } from '../common/Select'; // Assuming you have a Select component

interface BookingInformationFormProps {
  bookingId: string;
  onClose: () => void;
  onSubmit: (formData: any) => void; // Replace 'any' with a proper type later
}

// Helper component for form sections
const FormSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6 border-b border-gray-700 pb-4">
    <h3 className="text-lg font-semibold text-tactical-300 mb-3">{title}</h3>
    {children}
  </div>
);

export const BookingInformationForm: React.FC<BookingInformationFormProps> = ({ bookingId, onClose, onSubmit }) => {
  // --- State for Form Fields ---
  // Personal Details
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthday, setBirthday] = useState(''); // Use string for date input
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  // Emergency Contact
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyRelationship, setEmergencyRelationship] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');

  // Medical Information
  const [hasMedicalConditions, setHasMedicalConditions] = useState<boolean | null>(null);
  const [medicalConditionsDetails, setMedicalConditionsDetails] = useState('');
  const [takesMedications, setTakesMedications] = useState<boolean | null>(null);
  const [medicationsDetails, setMedicationsDetails] = useState('');
  const [hasDietaryRestrictions, setHasDietaryRestrictions] = useState<boolean | null>(null);
  const [dietaryRestrictionsDetails, setDietaryRestrictionsDetails] = useState('');

  // Signature & Date
  const [signature, setSignature] = useState('');
  const [signatureDate, setSignatureDate] = useState(''); // Use string for date input

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation example (add more comprehensive validation)
    if (!firstName || !lastName || !birthday || !country || !address || !city || !zipCode || !phone || !email ||
        !emergencyName || !emergencyRelationship || !emergencyPhone ||
        hasMedicalConditions === null || takesMedications === null || hasDietaryRestrictions === null ||
        !signature || !signatureDate) {
      alert('Please fill out all required fields marked with *');
      return;
    }

    const formData = {
      bookingId,
      personal: { firstName, lastName, birthday, country, address, city, zipCode, phone, email },
      emergencyContact: { name: emergencyName, relationship: emergencyRelationship, phone: emergencyPhone },
      medical: {
        hasConditions: hasMedicalConditions,
        conditionsDetails: hasMedicalConditions ? medicalConditionsDetails : '',
        takesMedications: takesMedications,
        medicationsDetails: takesMedications ? medicationsDetails : '',
        hasDietaryRestrictions: hasDietaryRestrictions,
        dietaryRestrictionsDetails: hasDietaryRestrictions ? dietaryRestrictionsDetails : '',
      },
      signature: {
        name: signature,
        date: signatureDate,
      }
    };
    console.log('Form Data:', formData); // Log for now
    onSubmit(formData); // Pass data up
    // onClose(); // Close modal after successful submission
    alert('Form submitted successfully (check console for data).'); // Placeholder
  };

  // Helper for required label
  const RequiredLabel: React.FC<{ label: string; htmlFor?: string }> = ({ label, htmlFor }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-300 mb-1">
      {label} <span className="text-red-500">*</span>
    </label>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* --- Personal Details --- */}
      <FormSection title="Personal Details">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <RequiredLabel label="First Name" htmlFor="firstName" />
            <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required 
                   className="bg-tactical-800 border-tactical-600 text-white placeholder-gray-400 focus:ring-accent-500 focus:border-accent-500"/>
          </div>
          <div>
            <RequiredLabel label="Last Name" htmlFor="lastName" />
            <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required 
                   className="bg-tactical-800 border-tactical-600 text-white placeholder-gray-400 focus:ring-accent-500 focus:border-accent-500"/>
          </div>
          <div>
            <RequiredLabel label="Birthday" htmlFor="birthday" />
            {/* Style date input for dark mode */}
            <Input id="birthday" type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} required 
                   className="bg-tactical-800 border-tactical-600 text-white placeholder-gray-400 focus:ring-accent-500 focus:border-accent-500 appearance-none" 
                   style={{ colorScheme: 'dark' }} />
          </div>
          <div>
             {/* TODO: Replace with a proper country select component if available */}
            <RequiredLabel label="Country/Region" htmlFor="country" />
            <Input id="country" value={country} onChange={(e) => setCountry(e.target.value)} required placeholder="e.g., Estonia"
                   className="bg-tactical-800 border-tactical-600 text-white placeholder-gray-400 focus:ring-accent-500 focus:border-accent-500"/>
          </div>
          <div className="md:col-span-2">
            <RequiredLabel label="Address" htmlFor="address" />
            <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required 
                   className="bg-tactical-800 border-tactical-600 text-white placeholder-gray-400 focus:ring-accent-500 focus:border-accent-500"/>
          </div>
          <div>
            <RequiredLabel label="City" htmlFor="city" />
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} required 
                   className="bg-tactical-800 border-tactical-600 text-white placeholder-gray-400 focus:ring-accent-500 focus:border-accent-500"/>
          </div>
          <div>
            <RequiredLabel label="Zip / Postal code" htmlFor="zipCode" />
            <Input id="zipCode" value={zipCode} onChange={(e) => setZipCode(e.target.value)} required 
                   className="bg-tactical-800 border-tactical-600 text-white placeholder-gray-400 focus:ring-accent-500 focus:border-accent-500"/>
          </div>
          <div>
            <RequiredLabel label="Phone" htmlFor="phone" />
            <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required 
                   className="bg-tactical-800 border-tactical-600 text-white placeholder-gray-400 focus:ring-accent-500 focus:border-accent-500"/>
          </div>
          <div>
            <RequiredLabel label="Email" htmlFor="email" />
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                   className="bg-tactical-800 border-tactical-600 text-white placeholder-gray-400 focus:ring-accent-500 focus:border-accent-500"/>
          </div>
        </div>
      </FormSection>

      {/* --- Emergency Contact Details --- */}
      <FormSection title="Emergency Contact Details">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="md:col-span-1">
              <RequiredLabel label="Full Name" htmlFor="emergencyName" />
              <Input id="emergencyName" value={emergencyName} onChange={(e) => setEmergencyName(e.target.value)} required 
                     className="bg-tactical-800 border-tactical-600 text-white placeholder-gray-400 focus:ring-accent-500 focus:border-accent-500"/>
           </div>
           <div className="md:col-span-1">
              <RequiredLabel label="Relationship" htmlFor="emergencyRelationship" />
              <Input id="emergencyRelationship" value={emergencyRelationship} onChange={(e) => setEmergencyRelationship(e.target.value)} required 
                     className="bg-tactical-800 border-tactical-600 text-white placeholder-gray-400 focus:ring-accent-500 focus:border-accent-500"/>
            </div>
           <div className="md:col-span-1">
              <RequiredLabel label="Phone" htmlFor="emergencyPhone" />
              <Input id="emergencyPhone" type="tel" value={emergencyPhone} onChange={(e) => setEmergencyPhone(e.target.value)} required 
                     className="bg-tactical-800 border-tactical-600 text-white placeholder-gray-400 focus:ring-accent-500 focus:border-accent-500"/>
            </div>
         </div>
      </FormSection>

      {/* --- Medical Information --- */}
      <FormSection title="Medical Information">
         {/* Conditions */}
         <div className="mb-4">
            <RequiredLabel label="Do you have any medical conditions or allergies we should be aware of?" />
            <div className="flex items-center space-x-4 mt-1">
                 <label className="flex items-center">
                    <input type="radio" name="hasMedicalConditions" value="yes" checked={hasMedicalConditions === true} onChange={() => setHasMedicalConditions(true)} className="form-radio h-4 w-4 text-accent-500 bg-tactical-700 border-tactical-600 focus:ring-accent-500 focus:ring-offset-tactical-900"/>
                    <span className="ml-2 text-sm text-gray-300">Yes</span>
                 </label>
                 <label className="flex items-center">
                     <input type="radio" name="hasMedicalConditions" value="no" checked={hasMedicalConditions === false} onChange={() => setHasMedicalConditions(false)} className="form-radio h-4 w-4 text-accent-500 bg-tactical-700 border-tactical-600 focus:ring-accent-500 focus:ring-offset-tactical-900"/>
                     <span className="ml-2 text-sm text-gray-300">No</span>
                 </label>
            </div>
            {hasMedicalConditions === true && (
                 <div className="mt-2">
                    <label htmlFor="medicalConditionsDetails" className="block text-sm font-medium text-gray-300 mb-1">If yes, please specify:</label>
                    <textarea id="medicalConditionsDetails" value={medicalConditionsDetails} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMedicalConditionsDetails(e.target.value)} rows={3} 
                              className="block w-full px-3 py-2 border border-tactical-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm bg-tactical-800 text-white"/>
                 </div>
             )}
         </div>
         {/* Medications */}
         <div className="mb-4">
             <RequiredLabel label="Are you currently taking any medications?" />
             <div className="flex items-center space-x-4 mt-1">
                 <label className="flex items-center">
                    <input type="radio" name="takesMedications" value="yes" checked={takesMedications === true} onChange={() => setTakesMedications(true)} className="form-radio h-4 w-4 text-accent-500 bg-tactical-700 border-tactical-600 focus:ring-accent-500 focus:ring-offset-tactical-900"/>
                    <span className="ml-2 text-sm text-gray-300">Yes</span>
                 </label>
                 <label className="flex items-center">
                     <input type="radio" name="takesMedications" value="no" checked={takesMedications === false} onChange={() => setTakesMedications(false)} className="form-radio h-4 w-4 text-accent-500 bg-tactical-700 border-tactical-600 focus:ring-accent-500 focus:ring-offset-tactical-900"/>
                     <span className="ml-2 text-sm text-gray-300">No</span>
                 </label>
             </div>
             {takesMedications === true && (
                 <div className="mt-2">
                    <label htmlFor="medicationsDetails" className="block text-sm font-medium text-gray-300 mb-1">If yes, please specify:</label>
                    <textarea id="medicationsDetails" value={medicationsDetails} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMedicationsDetails(e.target.value)} rows={3} 
                              className="block w-full px-3 py-2 border border-tactical-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm bg-tactical-800 text-white"/>
                 </div>
             )}
         </div>
         {/* Dietary Restrictions */}
         <div>
             <RequiredLabel label="Do you have any dietary restrictions or food allergies?" />
             <div className="flex items-center space-x-4 mt-1">
                 <label className="flex items-center">
                    <input type="radio" name="hasDietaryRestrictions" value="yes" checked={hasDietaryRestrictions === true} onChange={() => setHasDietaryRestrictions(true)} className="form-radio h-4 w-4 text-accent-500 bg-tactical-700 border-tactical-600 focus:ring-accent-500 focus:ring-offset-tactical-900"/>
                    <span className="ml-2 text-sm text-gray-300">Yes</span>
                 </label>
                 <label className="flex items-center">
                     <input type="radio" name="hasDietaryRestrictions" value="no" checked={hasDietaryRestrictions === false} onChange={() => setHasDietaryRestrictions(false)} className="form-radio h-4 w-4 text-accent-500 bg-tactical-700 border-tactical-600 focus:ring-accent-500 focus:ring-offset-tactical-900"/>
                     <span className="ml-2 text-sm text-gray-300">No</span>
                 </label>
             </div>
             {hasDietaryRestrictions === true && (
                 <div className="mt-2">
                    <label htmlFor="dietaryRestrictionsDetails" className="block text-sm font-medium text-gray-300 mb-1">If yes, please specify:</label>
                    <textarea id="dietaryRestrictionsDetails" value={dietaryRestrictionsDetails} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDietaryRestrictionsDetails(e.target.value)} rows={3} 
                              className="block w-full px-3 py-2 border border-tactical-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-accent-500 focus:border-accent-500 sm:text-sm bg-tactical-800 text-white"/>
                 </div>
             )}
         </div>
      </FormSection>

      {/* --- Criminal Background Check Info --- */}
      <FormSection title="Criminal Background Check">
        <p className="text-sm text-gray-300 mb-2">
          Participants must submit a criminal background check from their country of residence.
        </p>
        {/* Adjusted styling for dark mode note */}
        <p className="text-sm font-medium text-blue-200 bg-blue-900 bg-opacity-50 border border-blue-700 p-3 rounded-md">
          <span className="font-bold">Please Note:</span> You do <span className="font-bold underline">not</span> upload the background check file here. Please use the "Upload Docs" button on your dashboard booking card to upload the required document.
        </p>
      </FormSection>

       {/* --- Seminar Inclusions & Terms --- */}
      <FormSection title="Seminar Information & Agreements">
         {/* Adjusted prose styles for dark mode */}
         <div className="prose prose-sm prose-invert max-w-none text-gray-300 space-y-3">
             <h4 className="font-semibold text-tactical-300">Seminar Inclusions</h4>
             {/* Add specific inclusions here if needed, otherwise keep it general */}
             <p>Refer to the course description for specific inclusions.</p>

             <h4 className="font-semibold text-tactical-300">Additional Terms & Conditions</h4>
             <ul>
                <li><strong>Photography & Media Release:</strong> I grant Bald Eagle Tactical permission to use my image in promotional materials.</li>
                <li><strong>Code of Conduct:</strong> Participants are expected to follow all safety protocols and instructions.</li>
                <li><strong>Force Majeure:</strong> Bald Eagle Tactical is not liable for seminar disruptions beyond its control.</li>
                <li><strong>Personal Equipment:</strong> Participants are responsible for their personal equipment.</li>
                <li><strong>Refund Policy:</strong> All deposits are non-refundable. Cancellations within 30 days are not eligible for refunds.</li>
             </ul>

             <h4 className="font-semibold text-tactical-300">Liability Waiver and Release of Claims</h4>
              <ul>
                 <li><strong>Acknowledgment of Risk:</strong> Participation involves live-fire exercises and physical activities with inherent risks.</li>
                 <li><strong>Release of Liability:</strong> I release Bald Eagle Tactical, its instructors, and affiliates from any liability for injuries, damages, or incidents occurring during or related to the seminar.</li>
                 <li><strong>Insurance:</strong> Platinum-level insurance coverage is included as part of the seminar package.</li>
                 <li><strong>Criminal Background Check Confirmation:</strong> I confirm I will provide a valid criminal background check from my country of residence before attending the seminar. Failure to do so may result in cancellation without refund.</li>
              </ul>
         </div>
       </FormSection>

       {/* --- Signature --- */}
       <FormSection title="Confirmation & Signature">
          <p className="text-sm text-gray-300 mb-3">
             By signing below, I confirm that I have read, understood, and agreed to all the terms, conditions, and waivers outlined above.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
             <div>
                <RequiredLabel label="Signature (Type Full Name)" htmlFor="signature" />
                <div className="flex items-center">
                    <Input id="signature" value={signature} onChange={(e) => setSignature(e.target.value)} required 
                           className="flex-grow bg-tactical-800 border-tactical-600 text-white placeholder-gray-400 focus:ring-accent-500 focus:border-accent-500"/>
                    {/* Adjusted clear button for dark mode */}
                    <Button type="button" variant="ghost" size="sm" onClick={() => setSignature('')} className="ml-2 text-xs text-tactical-300 hover:text-white">
                       Clear
                    </Button>
                </div>
             </div>
             <div>
                <RequiredLabel label="Date" htmlFor="signatureDate" />
                <Input id="signatureDate" type="date" value={signatureDate} onChange={(e) => setSignatureDate(e.target.value)} required 
                       className="bg-tactical-800 border-tactical-600 text-white placeholder-gray-400 focus:ring-accent-500 focus:border-accent-500 appearance-none" 
                       style={{ colorScheme: 'dark' }}/>
             </div>
          </div>
       </FormSection>


      {/* --- Form Actions --- */}
      {/* Ensure buttons have appropriate contrast/style for dark mode */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
        <Button type="button" variant="outline" onClick={onClose} className="border-tactical-600 text-tactical-300 hover:bg-tactical-700 hover:text-white">
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Submit Information
        </Button>
      </div>
    </form>
  );
};

// Basic Input Component (replace with your actual component or style appropriately)
// const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
//   <input
//     {...props}
//     className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-tactical-500 focus:border-tactical-500 sm:text-sm ${props.className}`}
//   />
// );

// Basic Textarea Component (replace or style)
// const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
//    <textarea
//      {...props}
//      className={`block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-tactical-500 focus:border-tactical-500 sm:text-sm ${props.className}`}
//   />
// );

// Note: You might need to create or import actual Input, Textarea, Select components
// with proper styling matching your project's design system.
// The radio buttons use default browser styling + form-radio from @tailwindcss/forms plugin (ensure it's installed/configured).

export default BookingInformationForm; 