import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { API_PATH } from "../utils/apiPath";
import toast from "react-hot-toast";

const TaskAssignmentMailbox = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedRequestId, setSelectedRequestId] = useState(null);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATH.TASK_ASSIGNMENT.GET_USER_REQUESTS);
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error("Error fetching assignment requests", error);
      toast.error("Failed to load assignment requests");
    } finally {
      setLoading(false);
    }
  };

  const respondToRequest = async (requestId, action, reason = null) => {
    try {
      await axiosInstance.put(`${API_PATH.TASK_ASSIGNMENT.RESPOND_TO_REQUEST(requestId)}`, {
        action,
        rejectionReason: reason,
      });
      toast.success(`Request ${action}ed successfully`);
      fetchRequests();
      setRejectReason("");
      setShowRejectModal(false);
      setSelectedRequestId(null);
    } catch (error) {
      console.error(`Error ${action}ing request`, error);
      toast.error(`Failed to ${action} request`);
    }
  };

  const handleRejectClick = (requestId) => {
    setSelectedRequestId(requestId);
    setShowRejectModal(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    respondToRequest(selectedRequestId, "reject", rejectReason);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (loading) {
    return <div>Loading assignment requests...</div>;
  }

  if (requests.length === 0) {
    return <div>No pending task assignment requests.</div>;
  }

  return (
    <div className="task-assignment-mailbox card p-4 my-4">
      <h3 className="text-lg font-semibold mb-3">Task Assignment Requests</h3>
      <ul>
        {requests.map((req) => (
          <li key={req._id} className="mb-3 border-b pb-2">
            <p>
              Task: <strong>{req.taskId?.title || "Unknown Task"}</strong>
            </p>
            <p>
              Assigned by: <strong>{req.assignedByAdminId?.name || "Unknown Admin"}</strong>
            </p>
            <div className="flex gap-2 mt-2">
              <button
                className="btn btn-success px-3 py-1 rounded bg-green-500 text-white"
                onClick={() => respondToRequest(req._id, "approve")}
              >
                Approve
              </button>
              <button
                className="btn btn-danger px-3 py-1 rounded bg-red-500 text-white"
                onClick={() => handleRejectClick(req._id)}
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>

      {showRejectModal && (
        <div className="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="modal-content bg-white p-6 rounded shadow-lg w-96">
            <h4 className="text-lg font-semibold mb-4">Reject Task Assignment</h4>
            <textarea
              className="w-full border border-gray-300 rounded p-2 mb-4"
              rows={4}
              placeholder="Enter reason for rejection"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                className="btn btn-secondary px-4 py-1 rounded bg-gray-300"
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                  setSelectedRequestId(null);
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary px-4 py-1 rounded bg-red-600 text-white"
                onClick={handleRejectSubmit}
              >
                Submit Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskAssignmentMailbox;
