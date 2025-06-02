import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import { useNavigate } from "react-router-dom";
import { LuFileSpreadsheet } from "react-icons/lu";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";
import { toast } from "react-toastify";
import { Spinner } from "@heroui/spinner";

const ManageTasks = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [sortOption, setSortOption] = useState("createdAt_desc");
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const getAllTasks = async (
    userId = null,
    status = null,
    sort = "createdAt_desc",
    search = ""
  ) => {
    setIsLoading(true);
    try {
      const params = {};
      if (status && status !== "All") {
        params.status = status;
      }
      if (sort) {
        const [sortBy, sortOrder] = sort.split("_");
        params.sortBy = sortBy;
        params.sortOrder = sortOrder;
      }
      if (userId) {
        params.assignedTo = userId;
      }
      if (search) {
        params.search = search;
      }

      const response = await axiosInstance.get(API_PATH.TASK.GET_ALL_TASKS, {
        params,
      });

      let tasks = response.data?.tasks || [];
      const [sortBy, sortOrder] = sort.split("_");

      tasks = tasks.sort((a, b) => {
        if (sortBy === "dueDate") {
          return sortOrder === "asc"
            ? new Date(a.dueDate) - new Date(b.dueDate)
            : new Date(b.dueDate) - new Date(a.dueDate);
        } else {
          return sortOrder === "asc"
            ? new Date(a.createdAt) - new Date(b.createdAt)
            : new Date(b.createdAt) - new Date(a.createdAt);
        }
      });

      setAllTasks(tasks);

      const statusSummary = response.data?.statusSummary || {};
      const statusArray = [
        { label: "All", count: statusSummary.all || 0 },
        { label: "Pending", count: statusSummary.pendingTasks },
        { label: "In Progress", count: statusSummary.inProgressTasks || 0 },
        { label: "Completed", count: statusSummary.completedTasks || 0 },
      ];
      setTabs(statusArray);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStatus !== null) {
      setFilterStatus(selectedStatus);
    }
  }, [selectedStatus]);

  useEffect(() => {
    getAllTasks(
      selectedUserId,
      selectedStatus || filterStatus,
      sortOption,
      searchTerm
    );
  }, [selectedUserId, selectedStatus, filterStatus, sortOption, searchTerm]);

  const handleClick = (taskData) => {
    // Navigate to task detail page (read-only)
    navigate(`/hrd/tasks-details/${taskData._id}`);
  };

  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATH.REPORT.EXPORT_TASK, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "task_details.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading task details:", error);
      toast.error("Failed to download task details. Please try again.");
    }
  };

  const handleAllTabClick = () => {
    setFilterStatus("All");
    setSelectedStatus(null);
    setSelectedUserId(null);
  };

  return (
    <DashboardLayout
      activeMenu="Manage Tasks"
      onUserSelect={setSelectedUserId}
      onStatusSelect={setSelectedStatus}
      onSortChange={setSortOption}
      onSearchChange={setSearchTerm}
      selectedUserId={selectedUserId}
      selectedStatus={selectedStatus}
      sortOption={sortOption}
      activeStatusTab={filterStatus}
    >
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-xl font-medium">Manage Tasks</h2>
            <button
              className="flex lg:hidden download-btn"
              onClick={handleDownloadReport}
            >
              <LuFileSpreadsheet className="text-lg" />
              Download Report
            </button>
          </div>

          {tabs?.[0]?.count > 0 && (
            <div className="flex items-center gap-3">
              <TaskStatusTabs
                tabs={tabs}
                activeTab={filterStatus}
                setActiveTab={(tab) => {
                  if (tab === "All") {
                    handleAllTabClick();
                  } else {
                    setFilterStatus(tab);
                    setSelectedStatus(tab);
                  }
                }}
              />

              <button
                className="hidden lg:flex download-btn"
                onClick={handleDownloadReport}
              >
                <LuFileSpreadsheet className="text-lg" />
                Download Report
              </button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <Spinner
              classNames={{ label: "text-center" }}
              label="Loading"
              variant="simple"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {allTasks.length > 0 ? (
              allTasks.map((item) => (
                <TaskCard
                  key={item._id}
                  title={item.title}
                  description={item.description}
                  priority={item.priority}
                  status={item.status}
                  progress={item.progress}
                  createdAt={item.createdAt}
                  dueDate={item.dueDate}
                  assignedTo={item.assignedTo}
                  assignedBy={item.assignedBy}
                  attachmentCount={item.attachments.length || 0}
                  completedTodoCount={item.completedTodoCount || 0}
                  todoChecklist={item.todoChecklist || []}
                  location={item.location}
                  onClick={() => handleClick(item)}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-10 text-gray-500">
                No tasks found matching your criteria
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ManageTasks;

