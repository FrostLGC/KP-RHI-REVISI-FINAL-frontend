import React, { useState } from "react";
import { LuChevronDown } from "react-icons/lu";

const SelectDropdown = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };

  // Find the currently selected option
  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="relative w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-sm text-gray-700 border border-gray-300 rounded-md px-3 py-2 mt-1 flex justify-between items-center
          placeholder:text-gray-600 placeholder:font-medium 
          focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
          hover:border-blue-400 hover:ring-1 hover:ring-blue-100 
          transition duration-200
          ${selectedOption ? "bg-gray-100" : "bg-white"}`}
      >
        <span className="truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <LuChevronDown
          className={`ml-2 text-gray-500 ${
            isOpen ? "rotate-180" : ""
          } transition-transform duration-200`}
        />
      </button>

      {isOpen && (
        <div className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg z-10">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`px-3 py-2 text-sm cursor-pointer 
                hover:bg-blue-50 hover:text-blue-600 
                transition duration-150 ${
                  value === option.value ? "bg-blue-50 text-blue-600" : ""
                }`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectDropdown;
