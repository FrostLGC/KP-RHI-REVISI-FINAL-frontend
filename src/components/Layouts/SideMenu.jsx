import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import {
  SIDE_MENU_DATA,
  SIDE_MENU_USER_DATA,
  SIDE_MENU_SUPERADMIN_DATA,
  SIDE_MENU_HRD_DATA,
} from "../../utils/data";
import ProfilePhotoSelector from "../Inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import toast from "react-hot-toast";

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser, updateUser } = useContext(UserContext);
  const [sideMenuData, setSideMenuData] = useState([]);
  const [showSelector, setShowSelector] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();

  // Define default profile image URL
  const DEFAULT_PROFILE_IMAGE =
    "https://res.cloudinary.com/dpehq6hqg/image/upload/v1748965541/rmxfq5klt633rfqqtwke_msqbse.jpg";

  const handleClick = (route) => {
    if (route === "logout") {
      handleLogout();
      return;
    }
    navigate(route);
  };

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      if (user.role === "superadmin") {
        setSideMenuData(SIDE_MENU_SUPERADMIN_DATA);
      } else if (user.role === "admin") {
        setSideMenuData(SIDE_MENU_DATA);
      } else if (user.role === "hrd") {
        setSideMenuData(SIDE_MENU_HRD_DATA);
      } else {
        setSideMenuData(SIDE_MENU_USER_DATA);
      }
    }
  }, [user]);

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      // Upload and update in one request
      const response = await axiosInstance.put(
        API_PATH.AUTH.UPDATE_PROFILE_PHOTO, // Use the defined path
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data) {
        updateUser(response.data);
        toast.success("Profile picture updated successfully");
        setShowSelector(false);
        setSelectedImage(null);
        return true;
      }
    } catch (error) {
      console.error("Profile photo update error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update profile picture"
      );
      return false;
    }
  };

  const handleImageSelected = async (file) => {
    const success = await handleImageUpload(file);
    if (success) {
      setSelectedImage(null);
    }
  };

  return (
    <div className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-200/50 sticky top-[61px] z-20">
      <div className="flex flex-col items-center justify-center mb-7 pt-5">
        <div className="relative">
          {user?.profileImageUrl ? (
            <img
              src={user.profileImageUrl}
              alt="Profile Image"
              className="w-20 h-20 bg-slate-400 rounded-full cursor-pointer object-cover"
              onClick={() => setShowSelector(true)}
            />
          ) : (
            <div
              className="w-20 h-20 bg-slate-400 rounded-full flex items-center justify-center text-white text-lg cursor-pointer"
              onClick={() => setShowSelector(true)}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
          {showSelector && (
            <div className="absolute z-50 top-24 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded shadow-lg border">
              <ProfilePhotoSelector
                image={selectedImage}
                setImage={setSelectedImage}
                onImageSelected={handleImageSelected}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowSelector(false);
                    setSelectedImage(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {user?.position && (
          <div className="text-[10px] font-medium text-white bg-primary px-3 py-0.5 rounded mt-1">
            {user.position}
          </div>
        )}

        <h5 className="text-gray-950 font-medium leading-6 mt-3">
          {user?.name || ""}
        </h5>
        <p className="text-[12px] text-gray-500">{user?.email || ""}</p>
      </div>

      <div>
        {sideMenuData.map((item, index) => (
          <button
            key={`menu_${index}`}
            className={`w-full flex items-center gap-4 text-[15px] ${
              activeMenu === item.label
                ? "text-primary bg-linear-to-r from-blue-50/40 to-blue-100/50 border-r-3"
                : "text-gray-700 hover:bg-gray-100"
            } py-3 px-6 mb-3 cursor-pointer`}
            onClick={() => handleClick(item.path)}
          >
            <item.icon className="text-xl" />
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SideMenu;
