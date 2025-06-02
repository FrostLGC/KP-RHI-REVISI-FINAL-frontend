import React, { useEffect, useState, useContext } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import { useNavigate } from "react-router-dom";
import TaskStatusTabs from "../../components/TaskStatusTabs";
import TaskCard from "../../components/Cards/TaskCard";
import { toast } from "react-toastify";
import { Spinner } from "@heroui/spinner";
import { UserContext } from "../../context/userContext";

const MyTask = () => {
  const [allTasks, setAllTasks] = useState([]);
  const [tabs, setTabs] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [sortOption, setSortOption] = useState("createdAt_desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const getAllTasks = async (
    status = null,
    sort = "createdAt_desc",
    search = ""
  ) => {
    if (!user) return;
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
      if (user._id) {
        params.assignedTo = user._id;
      }
      if (search) {
        params.search = search;
      }

      const response = await axiosInstance.get(API_PATH.TASK.GET_ALL_TASKS, {
        params,
      });

      let tasks = response.data?.tasks || [];
      if (tasks.length > 0) {
        const [sortBy, sortOrder] = sort.split("_");
        tasks = tasks.sort((a, b) => {
          if (sortBy === "dueDate") {
            const dateA = new Date(a.dueDate);
            const dateB = new Date(b.dueDate);
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
          } else {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
          }
        });
      }

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
      toast.error(error.response?.data?.message || "Failed to load tasks");
      setAllTasks([]);
      setTabs([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClick = (taskId) => {
    navigate(`/superadmin/view-task-detail/${taskId}`);
  };

  useEffect(() => {
    getAllTasks(selectedStatus || filterStatus, sortOption, searchTerm);
  }, [selectedStatus, filterStatus, sortOption, searchTerm, user]);

  return (
    <DashboardLayout
      activeMenu="My Tasks"
      onStatusSelect={setSelectedStatus}
      onSortChange={setSortOption}
      onSearchChange={setSearchTerm}
      activeStatusTab={filterStatus}
    >
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">My Tasks</h2>

          {tabs?.[0]?.count > 0 && (
            <TaskStatusTabs
              tabs={tabs}
              activeTab={filterStatus}
              setActiveTab={setFilterStatus}
            />
          )}
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-screen">
            <Spinner
              classNames={{ label: "text-center" }}
              label="Loading..."
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
                  location={item.location}
                  attachmentCount={item.attachments.length || 0}
                  completedTodoCount={item.completedTodoCount || 0}
                  todoChecklist={item.todoChecklist || []}
                  onClick={() => handleClick(item._id)}
                />
              ))
            ) : (
              <div className="col-span-3 text-center py-10 text-gray-500">
                {isLoading
                  ? "Loading tasks..."
                  : "No tasks found matching your criteria"}
              </div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyTask;
