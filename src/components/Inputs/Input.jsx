import React from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6';

const Input = ({ value, onChange, label, placeholder, type }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col">
      <label className="text-[13px] text-slate-800 mb-1">{label}</label>
      <div className="relative flex items-center border border-gray-300 rounded p-2">
        <input
          value={value}
          onChange={onChange}
          type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none"
        />
        {type === 'password' && (
          <button type="button" onClick={toggleShowPassword} className="absolute right-3">
            {showPassword ? (
              <FaRegEye size={22} className="text-primary cursor-pointer" />
            ) : (
              <FaRegEyeSlash size={22} className="text-slate-400 cursor-pointer" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;