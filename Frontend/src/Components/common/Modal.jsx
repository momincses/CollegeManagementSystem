import React from 'react';

// Modal component that accepts four props:
// - isOpen: boolean to control modal visibility
// - onClose: function to handle closing the modal
// - title: string for modal header
// - children: React nodes to render inside modal body
const Modal = ({ isOpen, onClose, title, children }) => {
  // Early return if modal shouldn't be shown
  if (!isOpen) return null;

  return (
    // Backdrop - covers entire screen with semi-transparent black background
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      // Modal container - white box with rounded corners
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        // Header section with title and close button
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          // Close button with X icon
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"  // Creates an X shape
              />
            </svg>
          </button>
        </div>
        // Content section - renders whatever is passed as children
        <div className="modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal; 