import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";
import {
  FaChevronDown,
  FaChevronRight,
  FaFilter,
  FaSort,
  FaBars,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import { toast } from "react-toastify";

const SideMenuSortTask = ({
  isAdmin,
  isSuperadmin,
  isHrd,
  isMyTaskPage,
  onUserSelect,
  onStatusSelect,
  onSortChange,
  onSearchChange,
  selectedUserId: propSelectedUserId,
  selectedStatus: propSelectedStatus,
  sortOption: propSortOption,
  activeStatusTab,
}) => {
  const [users, setUsers] = useState([]);
  const [expandedUserIds, setExpandedUserIds] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(propSelectedUserId);
  const [selectedStatus, setSelectedStatus] = useState(propSelectedStatus);
  const [sortOption, setSortOption] = useState(
    propSortOption || "createdAt_desc"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (isAdmin || isSuperadmin || (isHrd && !isMyTaskPage)) {
      fetchUsersWithTasks();
    }
  }, [isAdmin, isSuperadmin, isHrd, isMyTaskPage]);

  useEffect(() => {
    setSelectedUserId(propSelectedUserId);
  }, [propSelectedUserId]);

  useEffect(() => {
    setSelectedStatus(propSelectedStatus);
  }, [propSelectedStatus]);

  useEffect(() => {
    setSortOption(propSortOption || "createdAt_desc");
  }, [propSortOption]);

  useEffect(() => {
    if (activeStatusTab && activeStatusTab !== selectedStatus) {
      setSelectedStatus(activeStatusTab === "All" ? null : activeStatusTab);
    }
  }, [activeStatusTab]);

  const fetchUsersWithTasks = async () => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATH.TASK.USERS_TASKS_GROUPED
      );

      if (response.data && response.data.users) {
        setUsers(response.data.users);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.error("Failed to fetch users with tasks", error);
      toast.error(error.response?.data?.message || "Failed to load user tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleUserExpand = (userId) => {
    setExpandedUserIds((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleUserSelect = (userId) => {
    const newUserId = userId === selectedUserId ? null : userId;
    setSelectedUserId(newUserId);
    if (onUserSelect) onUserSelect(newUserId);
  };

  const handleStatusSelect = (status) => {
    const newStatus = status === selectedStatus ? null : status;
    setSelectedStatus(newStatus);
    if (onStatusSelect) onStatusSelect(newStatus);
  };

  const handleSortChange = (e) => {
    const newSortOption = e.target.value;
    setSortOption(newSortOption);
    if (onSortChange) onSortChange(newSortOption);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (onSearchChange) onSearchChange(term);
  };

  const resetFilters = () => {
    setSelectedUserId(null);
    setSelectedStatus(null);
    setSortOption("createdAt_desc");
    setSearchTerm("");
    if (onUserSelect) onUserSelect(null);
    if (onStatusSelect) onStatusSelect(null);
    if (onSortChange) onSortChange("createdAt_desc");
    if (onSearchChange) onSearchChange("");
  };

  const statusLabels = ["Pending", "In Progress", "Completed"];

  return (
    <>
      <button
        onClick={toggleCollapse}
        className={`fixed top-20 left-0 z-40 bg-primary text-white p-2 rounded-r-md shadow-lg transition-all duration-300 ${
          isCollapsed ? "" : "ml-64"
        }`}
        aria-label={isCollapsed ? "Show task filters" : "Hide task filters"}
      >
        {isCollapsed ? <FaBars /> : <FaTimes />}
      </button>

      <div
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-300 p-4 overflow-auto z-30 shadow-lg transition-all duration-300 ${
          isCollapsed ? "-translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <FaFilter className="text-primary" />
            Task Filters
          </h2>

          <button
            onClick={resetFilters}
            className="w-full bg-gray-100 hover:bg-gray-200 text-xs py-1 px-2 rounded mb-3"
          >
            Reset All Filters
          </button>

          {/* Search Input */}
          <div className="relative mb-3">
            <input
              type="text"
              placeholder="Search by task title..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full border border-gray-300 rounded px-2 py-1 pl-8 text-xs"
            />
            <FaSearch className="absolute left-2 top-2 text-gray-400 text-xs" />
          </div>

          <div className="mb-4">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <FaSort className="text-primary" />
              Sort By
            </h3>
            <select
              value={sortOption}
              onChange={handleSortChange}
              className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
            >
              <option value="createdAt_desc">Newest Created</option>
              <option value="createdAt_asc">Oldest Created</option>
              <option value="dueDate_asc">Due Date (Soonest)</option>
              <option value="dueDate_desc">Due Date (Latest)</option>
            </select>
          </div>

          {(isAdmin || isSuperadmin || (isHrd && !isMyTaskPage)) ? (
            <div>
              <h3 className="text-sm font-semibold mb-2">Users</h3>
              {isLoading ? (
                <div className="text-center py-4">Loading...</div>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <div key={user._id} className="mb-2">
                    <div
                      className={`flex items-center cursor-pointer ${
                        selectedUserId === user._id ? "bg-gray-100" : ""
                      } p-2 rounded hover:bg-gray-50`}
                      onClick={() => {
                        toggleUserExpand(user._id);
                        handleUserSelect(user._id);
                      }}
                    >
                      {expandedUserIds.includes(user._id) ? (
                        <FaChevronDown className="mr-2 text-xs" />
                      ) : (
                        <FaChevronRight className="mr-2 text-xs" />
                      )}
                      <img
                        src={user.profileImageUrl || "/default-avatar.png"}
                        alt={user.name}
                        className="w-6 h-6 rounded-full mr-2 object-cover"
                      />
                      <span className="text-xs font-medium">{user.name}</span>
                      <span className="ml-auto text-xs text-gray-500">
                        {Object.values(user.tasks).reduce(
                          (sum, tasks) => sum + (tasks?.length || 0),
                          0
                        )}
                      </span>
                    </div>
                    {expandedUserIds.includes(user._id) && (
                      <div className="ml-8 mt-1 space-y-1">
                        {statusLabels.map((status) => (
                          <button
                            key={status}
                            className={`flex items-center justify-between w-full text-left text-xs p-1 px-2 rounded ${
                              selectedStatus === status
                                ? "bg-primary-light text-primary font-medium"
                                : "hover:bg-gray-50"
                            }`}
                            onClick={() => handleStatusSelect(status)}
                          >
                            <span>{status}</span>
                            <span className="bg-gray-200 px-1.5 py-0.5 rounded-full text-xs">
                              {user.tasks[status]?.length || 0}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">No users found</p>
              )}
            </div>
          ) : (
            <div>
              <h3 className="text-sm font-semibold mb-2">Task Status</h3>
              <div className="space-y-1">
                {statusLabels.map((status) => (
                  <button
                    key={status}
                    className={`flex items-center justify-between w-full text-left text-xs p-2 rounded ${
                      selectedStatus === status
                        ? "bg-primary-light text-primary font-medium"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => handleStatusSelect(status)}
                  >
                    <span>{status}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SideMenuSortTask;
