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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 backdrop-blur-sm p-4 md:p-8"
      onClick={onClose} // Close modal on backdrop click
      aria-modal="true"
      role="dialog"
    >
      {/* Modal Content */}
      <div
        className="relative flex flex-col w-full h-full max-w-7xl rounded-xl bg-tactical-900 text-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        {/* Header Row with Optional Title and Close Button */}
        <div className="flex-shrink-0 p-4 md:p-6 flex items-center justify-between border-b border-tactical-700">
          {title ? (
            <h2 className="text-xl font-semibold font-heading">
              {title}
            </h2>
          ) : (
            <div /> // Empty div to maintain flex layout space
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="-mr-2 ml-auto text-tactical-300 hover:text-white hover:bg-tactical-700"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Modal Body - Make it scrollable */}
        <div className="flex-grow p-4 md:p-6 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}; 