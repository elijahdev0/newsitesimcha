import React from 'react';
import { X } from 'lucide-react';
import { Button } from './Button'; // Assuming Button component exists

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string; // Optional title
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm"
      onClick={onClose} // Close modal on backdrop click
      aria-modal="true"
      role="dialog"
    >
      {/* Modal Content */}
      <div
        className="relative w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header Row with Optional Title and Close Button */}
        <div className="mb-4 flex items-center justify-between border-b pb-3">
          {title ? (
            <h2 className="text-xl font-semibold font-heading text-tactical-800">
              {title}
            </h2>
          ) : (
            <div /> // Empty div to maintain flex layout space
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="-mr-2 ml-auto" // Use ml-auto to push button right
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Modal Body */}
        <div>{children}</div>
      </div>
    </div>
  );
}; 