import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { SIDE_MENU_DATA, SIDE_MENU_USER_DATA, SIDE_MENU_SUPERADMIN_DATA, SIDE_MENU_HRD_DATA } from "../../utils/data";
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

  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }
    try {
      // Upload image to server or cloud storage
      const formData = new FormData();
      formData.append("file", selectedImage);
      const uploadRes = await axiosInstance.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = uploadRes.data.url;

      // Update user profile photo
      await axiosInstance.put(`${API_PATH.USERS.GET_USER_BY_ID(user._id)}/profile-photo`, {
        profileImageUrl: imageUrl,
      });

      // Update user context
      updateUser({ ...user, profileImageUrl: imageUrl });
      toast.success("Profile picture updated successfully");
      setShowSelector(false);
      setSelectedImage(null);
    } catch (error) {
      toast.error("Failed to update profile picture");
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
              className="w-20 h-20 bg-slate-400 rounded-full cursor-pointer"
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
            <div className="absolute z-50 top-24 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded shadow-lg">
              <ProfilePhotoSelector image={selectedImage} setImage={setSelectedImage} />
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
                <button className="btn btn-primary" onClick={handleImageUpload}>
                  Upload
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
