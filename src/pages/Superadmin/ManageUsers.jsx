import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import toast from "react-hot-toast";
import { LuFileSpreadsheet, LuTrash2 } from "react-icons/lu";
import { FaSearch } from "react-icons/fa";
import UserCard from "../../components/Cards/UserCard";

const ManageUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [positionInput, setPositionInput] = useState("");
  const [profilePhotoInput, setProfilePhotoInput] = useState("");
  const [roleInput, setRoleInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const getUsersAndTasks = async () => {
    try {
      const [usersRes, tasksRes] = await Promise.all([
        axiosInstance.get(API_PATH.USERS.GET_ALL_USERS),
        axiosInstance.get(API_PATH.TASK.USERS_TASKS_GROUPED),
      ]);

      if (usersRes.data && tasksRes.data && tasksRes.data.users) {
        // Map tasks by user ID for quick lookup
        const tasksByUserId = {};
        tasksRes.data.users.forEach((user) => {
          tasksByUserId[user._id] = user.tasks || {};
        });

        // Merge user info with task counts
        const mergedUsers = usersRes.data.map((user) => {
          const userTasks = tasksByUserId[user._id] || {};
          return {
            ...user,
            pendingTask: userTasks.Pending ? userTasks.Pending.length : 0,
            inProgressTask: userTasks["In Progress"]
              ? userTasks["In Progress"].length
              : 0,
            completedTask: userTasks.Completed ? userTasks.Completed.length : 0,
          };
        });

        setAllUsers(mergedUsers);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Error fetching users and tasks:", error);
      toast.error("Failed to load users and tasks");
    }
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.REPORT.EXPORT_USER, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "user_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error("Failed to download expense details. Please try again.");
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setPositionInput(user.position || "");
    setProfilePhotoInput(user.profileImageUrl || "");
    setRoleInput(user.role || "");
  };

  const handlePositionChange = (e) => {
    setPositionInput(e.target.value);
  };

  const handleProfilePhotoChange = (e) => {
    setProfilePhotoInput(e.target.value);
  };

  const handleRoleChange = (e) => {
    setRoleInput(e.target.value);
  };

  const handleSave = async () => {
    if (!editingUser) return;

    try {
      if (positionInput !== editingUser.position) {
        await axiosInstance.put(
          `${API_PATH.USERS.GET_USER_BY_ID(editingUser._id)}/position`,
          { position: positionInput }
        );
      }
      if (profilePhotoInput !== editingUser.profileImageUrl) {
        await axiosInstance.put(
          `${API_PATH.USERS.GET_USER_BY_ID(editingUser._id)}/profile-photo`,
          { profileImageUrl: profilePhotoInput }
        );
      }
      if (roleInput !== editingUser.role) {
        await axiosInstance.put(
          `${API_PATH.USERS.GET_USER_BY_ID(editingUser._id)}/role`,
          { role: roleInput }
        );
      }
      toast.success("User updated successfully");
      setEditingUser(null);
      getUsersAndTasks();
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axiosInstance.delete(API_PATH.USERS.GET_USER_BY_ID(userId));
        toast.success("User deleted successfully");
        getUsersAndTasks();
        if (editingUser?._id === userId) {
          setEditingUser(null);
        }
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  React.useEffect(() => {
    getUsersAndTasks();
  }, []);

  return (
    <DashboardLayout activeMenu="Team Members">
      <div className="mt-5 mb-10">
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Team Members</h2>

          <button
            className="flex md:flex download-btn"
            onClick={handleDownloadReport}
          >
            <LuFileSpreadsheet className="text-lg" />
            Download Report
          </button>
        </div>

        <div className="mt-4 w-full max-w-sm">
          <div className="flex items-center w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-md px-3 py-2 placeholder:text-gray-600 placeholder:font-medium focus-within:outline-none focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 hover:border-blue-400 hover:ring-1 hover:ring-blue-100 transition duration-200">
            <FaSearch className="text-gray-500 mr-2 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search users by name or email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none border-none focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {allUsers
            ?.filter(
              (user) =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (user.position &&
                  user.position
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()))
            )
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((user) => (
              <div
                key={user._id}
                className="user-card-container border border-gray-400/50 p-3 rounded shadow"
              >
                {editingUser?._id === user._id && (
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteUser(user._id)}
                    title="Delete user"
                  >
                    <LuTrash2 className="btn-delete-icon" />
                    <span>Delete</span>
                  </button>
                )}

                <UserCard userInfo={user} />
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Position
                  </label>
                  <input
                    type="text"
                    value={
                      editingUser?._id === user._id
                        ? positionInput
                        : user.position || ""
                    }
                    onChange={handlePositionChange}
                    disabled={editingUser?._id !== user._id}
                    className="form-input mt-1 block w-full"
                  />
                </div>
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    value={editingUser?._id === user._id ? roleInput : ""}
                    onChange={handleRoleChange}
                    disabled={editingUser?._id !== user._id}
                    className="form-input mt-1 block w-full"
                  >
                    <option value="" disabled>
                      Select role
                    </option>
                    <option value="superadmin">Superadmin</option>
                    <option value="admin">Admin</option>
                    <option value="hrd">HRD</option>
                    <option value="user">User</option>
                  </select>
                </div>
                {/* <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700">
                  Profile Photo URL
                </label>
                <input
                  type="text"
                  value={
                    editingUser?._id === user._id
                      ? profilePhotoInput
                      : user.profileImageUrl || ""
                  }
                  onChange={handleProfilePhotoChange}
                  disabled={editingUser?._id !== user._id}
                  className="form-input mt-1 block w-full"
                />
              </div> */}
                {editingUser?._id === user._id ? (
                  <div className="mt-2 flex space-x-2">
                    <button
                      className="btn btn-edit-secondary"
                      onClick={() => setEditingUser(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="btn btn-edit-primary"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-edit-primary mt-2"
                    onClick={() => handleEditClick(user)}
                  >
                    Edit
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ManageUsers;
