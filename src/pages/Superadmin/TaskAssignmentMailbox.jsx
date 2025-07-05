import React, { useEffect, useState, useContext } from "react";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import toast from "react-hot-toast";
import { UserContext } from "../../context/userContext";

const SuperadminTaskAssignmentMailbox = () => {
  const { user } = useContext(UserContext);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processingRequestId, setProcessingRequestId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      // Fetch all task assignment requests including rejected for superadmin view
      const response = await axiosInstance.get(API_PATH.TASK_ASSIGNMENT.GET_ALL_REQUESTS);
      setRequests(response.data.requests || []);

      // Also fetch all tasks to correlate with assignment requests
      const tasksResponse = await axiosInstance.get(API_PATH.TASK.GET_ALL_TASKS);
      const tasks = tasksResponse.data.tasks || [];

      // Map taskId to task for quick lookup
      const taskMap = {};
      tasks.forEach((task) => {
        taskMap[task._id] = task;
      });

      // Add task details to each request
      const requestsWithTaskDetails = (response.data.requests || []).map((req) => ({
        ...req,
        taskDetails: taskMap[req.taskId] || null,
      }));

      setRequests(requestsWithTaskDetails);
    } catch (error) {
      console.error("Error fetching assignment requests or tasks", error);
      toast.error("Failed to load assignment requests or tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRespond = async (requestId, action) => {
    setProcessingRequestId(requestId);
    try {
      await axiosInstance.put(`${API_PATH.TASK_ASSIGNMENT.RESPOND_TO_REQUEST(requestId)}`, {
        action,
      });
      toast.success(`Request ${action}d successfully`);
      fetchRequests();
    } catch (error) {
      console.error(`Error ${action}ing request`, error);
      toast.error(`Failed to ${action} request`);
    } finally {
      setProcessingRequestId(null);
    }
  };

  return (
    <DashboardLayout activeMenu="Task Mailbox">
      {loading ? (
        <div>Loading assignment requests...</div>
      ) : requests.length === 0 ? (
        <div>No pending task assignment requests.</div>
      ) : (
        <div className="task-assignment-mailbox card p-4 my-4">
          <h3 className="text-lg font-semibold mb-3">
            Task Assignment Requests
          </h3>
          <ul>
            {requests.map((req) => (
              <li key={req._id} className="mb-3 border-b pb-2">
                <p>
                  Task:{" "}
                  <strong>
                    {req.taskId?.title ||
                      req.taskDetails?.title ||
                      "Unknown Task"}
                  </strong>
                </p>
                <p>
                  Assigned to:{" "}
                  <strong>
                    {req.assignedToUserId?.name || "Unknown User"}
                  </strong>
                </p>
                <p>
                  Requested by:{" "}
                  <strong>
                    {req.assignedByAdminId?.name || "Unknown Admin"}
                  </strong>
                </p>
                <p>
                  Status: <strong>{req.status || "Pending"}</strong>
                </p>
                {req.status === "Rejected" && req.rejectionReason && (
                  <p>
                    Rejection Reason: <em>{req.rejectionReason}</em>
                  </p>
                )}
                {req.status === "Pending" &&
                  user &&
                  user._id === req.assignedToUserId?._id && (
                    <div className="flex gap-2 mt-2">
                      <button
                        className="btn btn-success px-3 py-1 rounded bg-green-500 text-white"
                        disabled={processingRequestId === req._id}
                        onClick={() => handleRespond(req._id, "approve")}
                      >
                        Approve
                      </button>
                      <button
                        className="btn btn-danger px-3 py-1 rounded bg-red-500 text-white"
                        disabled={processingRequestId === req._id}
                        onClick={() => handleRespond(req._id, "reject")}
                      >
                        Reject
                      </button>
                    </div>
                  )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </DashboardLayout>
  );
};

export default SuperadminTaskAssignmentMailbox;
