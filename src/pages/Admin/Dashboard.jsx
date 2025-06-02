import React, { useState, useContext, useEffect } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import moment from "moment";
import { addThousandsSeparator } from "../../utils/helper";
import InfoCard from "../../components/Cards/InfoCard";
import { LuArrowRight } from "react-icons/lu";
import TaskListTable from "../../components/TaskListTable";
import CustomPieChart from "../../components/Charts/CustomPieChart";
import CustomBarChart from "../../components/Charts/CustomBarChart";

const COLORS = ["#A855F7", "#06B6D4", "#22C55E"];

const Dashboard = () => {
  useUserAuth();

  const { user } = useContext(UserContext);

  const navigate = useNavigate();

  const [dashboardData, setDashboardData] = useState(null);
  const [pieChartData, setPieChartData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  // chart data
  const prepareChartData = (data) => {
    const taskDistribution = data?.taskDistribution || null;
    const taskPriorityLevels = data?.taskPriorityLevels || null;

    const taskDistributionData = [
      { status: "Pending", count: taskDistribution?.Pending || 0 },
      { status: "In Progress", count: taskDistribution?.InProgress || 0 },
      { status: "Completed", count: taskDistribution?.Completed || 0 },
    ];

    setPieChartData(taskDistributionData);

    // set pieChart
    const PriorityLevelData = [
      { priority: "Low", count: taskPriorityLevels?.Low || 0 },
      { priority: "Medium", count: taskPriorityLevels?.Medium || 0 },
      { priority: "High", count: taskPriorityLevels?.High || 0 },
    ];

    setBarChartData(PriorityLevelData);
  };

  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATH.TASK.GET_DASHBOARD_DATA
      );
      if (response.data) {
        setDashboardData(response.data);
        prepareChartData(response.data?.chart || null);
      }
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const onSeeMore = () => {
    navigate("/admin/tasks");
  };

  useEffect(() => {
    getDashboardData();

    return () => {};
  }, []);

  const [showSelector, setShowSelector] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const { updateUser } = React.useContext(UserContext);

  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast.error("Please select an image first");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      const uploadRes = await axiosInstance.post("/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = uploadRes.data.imageUrl;

      await axiosInstance.put(
        `${API_PATH.USERS.GET_USER_BY_ID(user._id)}/profile-photo`,
        {
          profileImageUrl: imageUrl,
        }
      );

      updateUser({ ...user, profileImageUrl: imageUrl });
      toast.success("Profile picture updated successfully");
      setShowSelector(false);
      setSelectedImage(null);
    } catch (error) {
      toast.error("Failed to update profile picture");
    }
  };

  return (
    <DashboardLayout activeMenu="Dashboard">
      <div className="card my-5">
        <div>
          <div className="col-span-3">
            <h2 className="text-xl md:text-2xl"> Hai, {user?.name}</h2>
            <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
              {moment().format("dddd DD MMM YYYY")}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mt-5">
          <InfoCard
            label="Total Tasks"
            value={addThousandsSeparator(
              dashboardData?.chart?.taskDistribution?.All || 0
            )}
            color="bg-primary"
          />

          <InfoCard
            label="Pending Tasks"
            value={addThousandsSeparator(
              dashboardData?.chart?.taskDistribution?.Pending || 0
            )}
            color="bg-violet-500"
          />

          <InfoCard
            label="In Progress Tasks"
            value={addThousandsSeparator(
              dashboardData?.chart?.taskDistribution?.InProgress || 0
            )}
            color="bg-cyan-500"
          />

          <InfoCard
            label="Completed Tasks"
            value={addThousandsSeparator(
              dashboardData?.chart?.taskDistribution?.Completed || 0
            )}
            color="bg-lime-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-4 md:my-6 ">
        <div>
          <div className="card">
            <div className="flex items-center justify-between ">
              <h5 className="font-medium">Task Distribution</h5>
            </div>
            <CustomPieChart
              data={pieChartData}
              label="Total Balance"
              colors={COLORS}
            />
          </div>
        </div>

        <div>
          <div className="card">
            <div className="flex items-center justify-between ">
              <h5 className="font-medium">Task Priority level</h5>
            </div>
            <CustomBarChart data={barChartData} />
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between">
              <h5 className="text-lg">Recent Task</h5>

              <button className="card-btn" onClick={onSeeMore}>
                See All <LuArrowRight className="text-base" />
              </button>
            </div>

            <TaskListTable tableData={dashboardData?.recentTasks || []} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
