import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import { LuUsers, LuSearch } from "react-icons/lu";
import Modal from "../ModalUser";

const SelectUsers = ({
  selectedUsers,
  setSelectedUsers,
  excludeRoles = [],
  excludeCurrentUser = true, // New prop to control excluding current user
}) => {
  const [allUsers, setAllUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempSelectedUsers, setTempSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Get current user info
  const getCurrentUser = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.AUTH.GET_PROFILE);
      if (response.data) {
        setCurrentUser(response.data);
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      // If there's no specific endpoint, try to get from localStorage or other auth storage
      const userFromStorage =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (userFromStorage) {
        try {
          setCurrentUser(JSON.parse(userFromStorage));
        } catch (parseError) {
          console.error("Error parsing user from storage:", parseError);
        }
      }
    }
  };

  const getAllUsers = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        let filteredUsers = response.data
          .filter((user) => !excludeRoles.includes(user.role))
          .map((user) => ({
            ...user,
            nameLower: user.name.toLowerCase(),
          }));

        // Exclude current user if excludeCurrentUser is true
        if (excludeCurrentUser && currentUser) {
          filteredUsers = filteredUsers.filter(
            (user) => user._id !== currentUser._id
          );
        }

        setAllUsers(filteredUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // Memoized sorted and filtered users
  const filteredUsers = useMemo(() => {
    return allUsers
      .filter(
        (user) =>
          user.nameLower.includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [allUsers, searchQuery]);

  const toggleUserSelection = (userId) => {
    setTempSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleAssign = () => {
    setSelectedUsers(tempSelectedUsers);
    setIsModalOpen(false);
  };

  const selectedUserAvatars = useMemo(
    () =>
      allUsers
        .filter((user) => selectedUsers.includes(user._id))
        .map((user) => ({
          profileImageUrl: user.profileImageUrl,
          name: user.name,
        })),
    [allUsers, selectedUsers]
  );

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      getAllUsers();
    }
  }, [currentUser, excludeRoles, excludeCurrentUser]);

  useEffect(() => {
    setTempSelectedUsers(selectedUsers);
  }, [selectedUsers]);

  return (
    <div className="space-y-4 mt-2">
      {selectedUserAvatars.length === 0 ? (
        <button className="card-btn" onClick={() => setIsModalOpen(true)}>
          <LuUsers className="text-sm" /> Tambah Anggota
        </button>
      ) : (
        <div className="cursor-pointer" onClick={() => setIsModalOpen(true)}>
          <div className="flex items-center gap-4">
            {selectedUserAvatars.slice(0, 3).map((user, index) => (
              <div key={index} className="flex items-center gap-1">
                <img
                  src={user.profileImageUrl}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <span className="text-sm font-medium">{user.name}</span>
              </div>
            ))}
            {selectedUserAvatars.length > 3 && (
              <span className="text-sm font-medium">
                +{selectedUserAvatars.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Select Users"
      >
        {/* Enhanced Search Input with dark mode */}
        <div className="relative mb-4 flex-shrink-0">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <LuSearch className="text-gray-400 dark:text-gray-500" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition duration-200 hover:border-blue-400 hover:ring-1 hover:ring-blue-100 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:hover:border-blue-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Enhanced user list with better dark mode contrast - now using flex-1 for proper height */}
        <div className="space-y-2 flex-1 overflow-y-auto min-h-0">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <div
                key={user._id}
                className="flex items-center gap-4 p-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150"
              >
                <img
                  src={user.profileImageUrl || "/default-avatar.png"}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                />
                <div className="flex-1 flex flex-col">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {user.name}
                    </p>
                    {user.position && (
                      <span className="text-green-700 dark:text-green-300 text-xs font-semibold bg-green-100 dark:bg-green-800 px-2 py-0.5 rounded-md">
                        {user.position}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-gray-600 dark:text-gray-300">
                    {user.email}
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={tempSelectedUsers.includes(user._id)}
                  onChange={() => toggleUserSelection(user._id)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-500 rounded focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-2"
                />
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <LuUsers className="mx-auto mb-2 text-2xl" />
              <p>No users found matching your search</p>
            </div>
          )}
        </div>

        {/* Enhanced buttons with better dark mode styling - now flex-shrink-0 */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-600 flex-shrink-0">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors duration-150"
            onClick={() => setIsModalOpen(false)}
          >
            CANCEL
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-500 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800 transition-colors duration-150"
            onClick={handleAssign}
          >
            DONE ({tempSelectedUsers.length})
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SelectUsers;
