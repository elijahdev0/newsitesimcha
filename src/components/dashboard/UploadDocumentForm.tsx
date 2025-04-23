import React, { useState, useRef, ChangeEvent } from 'react';
import { Button } from '../common/Button';
import { UploadCloud, File, ShieldCheck, AlertTriangle } from 'lucide-react';

interface UploadDocumentFormProps {
  bookingId: string;
  onClose: () => void;
  uploadFile: (bookingId: string, file: File) => void; // Renamed from onSubmit
  isSubmitting: boolean;
}

export const UploadDocumentForm: React.FC<UploadDocumentFormProps> = ({ bookingId, onClose, uploadFile, isSubmitting = false }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Supported file types (adjust as needed)
  const acceptedFileTypes = '.pdf,.jpg,.jpeg,.png,.doc,.docx';
  const maxFileSizeMB = 10;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null); // Clear previous errors
    const file = event.target.files?.[0];

    if (file) {
      // Basic validation (type and size)
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`;
      if (!acceptedFileTypes.includes(fileExtension)) {
        setError(`Invalid file type. Please upload one of: ${acceptedFileTypes}`);
        setSelectedFile(null);
        return;
      }

      if (file.size > maxFileSizeMB * 1024 * 1024) {
        setError(`File size exceeds the ${maxFileSizeMB}MB limit.`);
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleUploadClick = () => {
    if (!selectedFile) {
      setError('Please select a file to upload.');
      return;
    }
    // Call the passed uploadFile function to handle the actual upload logic
    uploadFile(bookingId, selectedFile); // Changed from onSubmit
    // Optionally close modal immediately or wait for onSubmit to finish
    // onClose();
    // Keep the alert for now, or remove if the parent handles feedback
    alert('Upload initiated (placeholder - check console). In a real app, this would upload the file.');
  };

  // Trigger hidden file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 text-gray-300">
      {/* Security Message */}
      <div className="flex items-start p-4 rounded-lg bg-tactical-800 border border-tactical-600">
        <ShieldCheck className="w-6 h-6 mr-3 text-green-400 flex-shrink-0 mt-1" />
        <div>
          <h4 className="font-semibold text-white mb-1">Security is Our Utmost Priority</h4>
          <p className="text-sm text-gray-400">
            Your documents are handled securely. This background check is a mandatory requirement for participation.
          </p>
        </div>
      </div>

      {/* Upload Area */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Upload Criminal Background Check Document
        </label>
        <div
          className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-tactical-600 border-dashed rounded-md cursor-pointer hover:border-accent-500 transition-colors ${selectedFile ? 'bg-tactical-700' : 'bg-tactical-800'}`}
          onClick={triggerFileInput}
        >
          <div className="space-y-1 text-center">
            {selectedFile ? (
              <>
                <File className="mx-auto h-12 w-12 text-green-400" />
                <p className="text-sm font-medium text-white">File Selected:</p>
                <p className="text-xs text-gray-400">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                <Button variant="ghost" size="sm" className="text-accent-400 hover:text-accent-300 underline text-xs mt-2" onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}>
                  Change file
                </Button>
              </>
            ) : (
              <>
                <UploadCloud className="mx-auto h-12 w-12 text-gray-500" />
                <div className="flex text-sm text-gray-400 justify-center">
                  <span className="relative font-medium text-accent-400 hover:text-accent-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-tactical-900 focus-within:ring-accent-500">
                    Click to upload a file
                  </span>
                  {/* Hidden actual file input */}
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                    accept={acceptedFileTypes} // Set accepted file types
                  />
                </div>
                <p className="text-xs text-gray-500">PDF, JPG, PNG, DOC(X) up to {maxFileSizeMB}MB</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center p-3 rounded-md bg-red-900 bg-opacity-50 border border-red-700">
          <AlertTriangle className="w-5 h-5 mr-2 text-red-400 flex-shrink-0" />
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-700">
        <Button type="button" variant="outline" onClick={onClose} className="border-tactical-600 text-tactical-300 hover:bg-tactical-700 hover:text-white">
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary" // Or use 'accent' if preferred
          onClick={handleUploadClick}
          disabled={!selectedFile || isSubmitting} // Disable if no file is selected or loading
        >
          <UploadCloud className="w-4 h-4 mr-2" />
          {isSubmitting ? 'Uploading...' : 'Upload Document'}
        </Button>
      </div>
    </div>
  );
}; 