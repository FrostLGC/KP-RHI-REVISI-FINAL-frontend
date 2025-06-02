import React from "react";

const Modal = ({ children, isOpen, onClose, title }) => {
  if (!isOpen) return null;

  return (
    <>
      {/* Fixed backdrop - ensures full viewport coverage */}
      <div
        className="fixed inset-0 bg-black/50 dark:bg-black/70 z-40 transition-opacity duration-200 min-h-screen"
        onClick={onClose}
        style={{ minHeight: "max(100vh, 100dvh)" }}
      />

      {/* Modal container - improved positioning */}
      <div className="fixed inset-0 z-50 flex justify-center items-center w-full min-h-screen p-4 overflow-y-auto">
        <div className="relative w-full max-w-2xl my-auto">
          {/* Modal Content with enhanced dark mode styling */}
          <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-2xl border border-gray-200 dark:border-gray-600 animate-in fade-in-0 zoom-in-95 duration-200 flex flex-col max-h-[90vh] min-h-0 overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-t-lg flex-shrink-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                {title}
              </h3>
              <button
                className="text-gray-400 dark:text-gray-300 bg-transparent hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-900 dark:hover:text-gray-100 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center transition-colors duration-150"
                type="button"
                onClick={onClose}
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>

            {/* Modal Body - improved flex layout */}
            <div className="p-4 md:p-5 space-y-4 bg-white dark:bg-gray-800 flex-1 flex flex-col min-h-0 overflow-hidden">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
