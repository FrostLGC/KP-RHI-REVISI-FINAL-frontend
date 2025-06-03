import React from "react";
import loginImage from "../../assets/images/Logo Profile RHI.jpg";

const AuthLayout = ({ children }) => {
  return (
    <div className="flex">
      <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
        <h2 className="text-lg font-medium text-black">
          Project Management RHI Build
        </h2>
        {children}
      </div>

      <div className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-blue-50 overflow-hidden p-8">
        <img
          src={loginImage}
          alt="Ilustrasi Login"
          className="w-full h-full object-cover rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
};

export default AuthLayout;
