import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATH } from "../../utils/apiPath";
import DashboardLayout from "../../components/Layouts/DashboardLayout";
import AvatarGroup from "../../components/AvatarGroup";
import moment from "moment";
import { LuSquareArrowOutUpRight } from "react-icons/lu";
import { FaMapMarkerAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { UserContext } from "../../context/userContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ViewTaskDetails = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const { user } = useContext(UserContext);

  const getStatusTagColor = (status) => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";

      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";

      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  // Format address display for map section
  const formatAddress = () => {
    if (!task?.location?.address) return "Location not specified";

    if (/^-?\d+\.\d+\s+-?\d+\.\d+$/.test(task.location.address)) {
      const [lat, lng] = task.location.address.split(" ");
      return `Near ${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`;
    }

    return task.location.address;
  };

  // get task info by id
  const getTaskDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATH.TASK.GET_TASK_BY_ID(id)
      );

      if (response.data) {
        const taskInfo = response.data;
        setTask(taskInfo);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  // handle todo check
  const updateTodoChecklist = async (index) => {
    if (!task) return;

    // Check if current user is assigned to this task
    const isUserAssigned = task.assignedTo.some(
      (assignedUser) => assignedUser._id === user._id
    );

    if (!isUserAssigned) {
      toast.error("You are not authorized to update this todo checklist.");
      return;
    }

    const todoChecklist = [...task?.todoChecklist];
    const taskId = id;

    if (todoChecklist && todoChecklist[index]) {
      todoChecklist[index].completed = !todoChecklist[index].completed;

      try {
        const response = await axiosInstance.put(
          API_PATH.TASK.UPDATE_TODO_CHECKLIST(taskId),
          { todoChecklist }
        );
        if (response.status === 200) {
          setTask(response.data?.task || task);
        } else {
          // Optionally revert the toggle if the API call fails.
          todoChecklist[index].completed = !todoChecklist[index].completed;
        }
      } catch (error) {
        todoChecklist[index].completed = !todoChecklist[index].completed;
        const message =
          error.response?.data?.message || "Failed to update todo checklist";
        toast.error(message);
      }
    }
  };

  // Handle attachment link lick
  const handleLinkClick = (link) => {
    if (!/^https?:\/\//i.test(link)) {
      link = "https://" + link; //Default to https
    }
    window.open(link, "_blank");
  };

  useEffect(() => {
    if (id) {
      getTaskDetailsByID();
    }
    return () => {};
  }, [id]);

  return (
    <DashboardLayout activeMenu="Manage Tasks">
      <div className="mt-5">
        {task && (
          <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
            <div className="form-card col-span-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm md:text-xl font-medium">
                  {task?.title}
                </h2>

                <div
                  className={`text-[11px] md:text-[13px] font-medium ${getStatusTagColor(
                    task?.status
                  )} px-4 py-0.5 rounded `}
                >
                  {task?.status}
                </div>
              </div>

              <div className="mt-4">
                <InfoBox label="Description" value={task?.description} />
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4">
                <div className="col-span-6 md:col-span-4">
                  <InfoBox label="Priority" value={task?.priority} />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <InfoBox
                    label="Due Date"
                    value={
                      task?.dueDate
                        ? moment(task?.dueDate).format("DD MMM YYYY")
                        : "N/A"
                    }
                  />
                </div>
                <div className="col-span-6 md:col-span-4">
                  <label className="text-xs font-medium text-slate-500">
                    Assigned To
                  </label>

                  <div className="mt-1">
                    {task?.assignedTo && task.assignedTo.length > 0 ? (
                      <div className="flex flex-col gap-2">
                        {task.assignedTo.map((user, index) => (
                          <div
                            key={user._id || index}
                            className="flex items-center gap-2"
                          >
                            {user.profileImageUrl ? (
                              <img
                                src={user.profileImageUrl}
                                alt={user.name}
                                className="w-6 h-6 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center text-white text-xs">
                                {user.name?.charAt(0).toUpperCase() || "?"}
                              </div>
                            )}
                            <span className="text-sm font-medium text-gray-700">
                              {user.name || "Unknown User"}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">
                        No users assigned
                      </span>
                    )}
                  </div>
                </div>
                <div className="col-span-6 md:col-span-4 mt-4">
                  <label className="text-xs font-medium text-slate-500">
                    Updated By
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    {task?.updatedBy ? (
                      <>
                        <img
                          src={task.updatedBy.profileImageUrl}
                          alt={task.updatedBy.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          {task.updatedBy.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">
                        No updates yet
                      </span>
                    )}
                  </div>
                </div>

                {/* Update History Timeline */}
                <div className="col-span-6 md:col-span-4 mt-6">
                  <label className="text-xs font-medium text-slate-500">
                    Update History Timeline
                  </label>
                  <div className="mt-2 max-h-48 overflow-y-auto border border-gray-200 rounded-md p-2 bg-white">
                    {task?.updateHistory && task.updateHistory.length > 0 ? (
                      task.updateHistory
                        .slice()
                        .reverse()
                        .map((update, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 py-1 border-b last:border-b-0"
                          >
                            <img
                              src={update.user?.profileImageUrl}
                              alt={update.user?.name}
                              className="w-6 h-6 rounded-full object-cover"
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-700">
                                {update.user?.name || "Unknown User"}
                              </p>
                              <p className="text-xs text-gray-500">
                                {update.updatedAt
                                  ? moment(update.updatedAt).format(
                                      "DD MMM YYYY, HH:mm:ss"
                                    )
                                  : "Unknown Date"}
                              </p>
                            </div>
                          </div>
                        ))
                    ) : (
                      <p className="text-xs text-gray-500">
                        No update history available.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Map Section */}
              {task?.location && (
                <div className="mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <FaMapMarkerAlt className="text-red-500 text-sm" />
                    <label className="text-xs font-medium text-slate-500">
                      Task Location
                    </label>
                  </div>

                  <div className="mb-3">
                    <InfoBox label="Address" value={formatAddress()} />
                  </div>

                  {task.location.lat && task.location.lng ? (
                    <div className="h-[350px] w-full rounded-lg border border-gray-300 overflow-hidden">
                      <MapContainer
                        center={[task.location.lat, task.location.lng]}
                        zoom={15}
                        scrollWheelZoom={true}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker
                          position={[task.location.lat, task.location.lng]}
                        >
                          <Popup>
                            <div className="text-sm">
                              <strong>{task.title}</strong>
                              <br />
                              {formatAddress()}
                            </div>
                          </Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  ) : (
                    <div className="h-[200px] bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center">
                      <div className="text-center">
                        <FaMapMarkerAlt className="text-gray-400 text-2xl mx-auto mb-2" />
                        <p className="text-sm text-gray-500">
                          No map coordinates available
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-2">
                <label className="text-xs font-medium text-slate-500">
                  Todo Checklist
                </label>

                {task?.todoChecklist?.map((item, index) => (
                  <div key={`todo_${index}`} className="mb-4">
                    <TodoCheckList
                      text={item.text}
                      isChecked={item?.completed}
                      onChange={() => updateTodoChecklist(index)}
                    />
                    <textarea
                      className="w-full mt-1 p-2 border border-gray-300 rounded-md text-sm resize-none"
                      placeholder="Add a note or describe the problem..."
                      value={item.note || ""}
                      onChange={(e) => {
                        // Check if current user is assigned to this task
                        const isUserAssigned = task.assignedTo.some(
                          (assignedUser) => assignedUser._id === user._id
                        );
                        if (!isUserAssigned) {
                          toast.error(
                            "You are not authorized to update this todo note."
                          );
                          return;
                        }
                        const newNote = e.target.value;
                        const updatedTodoChecklist = [...task.todoChecklist];
                        updatedTodoChecklist[index] = {
                          ...updatedTodoChecklist[index],
                          note: newNote,
                        };
                        setTask({
                          ...task,
                          todoChecklist: updatedTodoChecklist,
                        });
                      }}
                      onBlur={async (e) => {
                        // Check if current user is assigned to this task
                        const isUserAssigned = task.assignedTo.some(
                          (assignedUser) => assignedUser._id === user._id
                        );
                        if (!isUserAssigned) {
                          toast.error(
                            "You are not authorized to update this todo note."
                          );
                          return;
                        }
                        const updatedTodoChecklist = [...task.todoChecklist];
                        try {
                          const response = await axiosInstance.put(
                            API_PATH.TASK.UPDATE_TODO_CHECKLIST(task._id),
                            { todoChecklist: updatedTodoChecklist }
                          );
                          if (response.status === 200) {
                            setTask(response.data.task);
                          }
                        } catch (error) {
                          console.error("Failed to update todo note", error);
                          const message =
                            error.response?.data?.message ||
                            "Failed to update todo note";
                          toast.error(message);
                        }
                      }}
                      rows={3}
                    />
                  </div>
                ))}
              </div>

              {task?.attachments?.length > 0 && (
                <div className="mt-2">
                  <label className="text-xs font-medium text-slate-500">
                    Attachments
                  </label>

                  {task?.attachments?.map((link, index) => (
                    <Attachment
                      key={`link_${index}`}
                      link={link}
                      index={index}
                      onClick={() => handleLinkClick(link)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ViewTaskDetails;

const InfoBox = ({ label, value }) => {
  return (
    <>
      <label className="text-xs font-medium text-slate-500">{label}</label>

      <p className="text-[12px] md:text-[13px] font-medium text-gray-700 mt-0.5">
        {value}
      </p>
    </>
  );
};

const TodoCheckList = ({ text, isChecked, onChange }) => {
  return (
    <div className="flex items-center gap-3 p-3">
      <input
        type="checkbox"
        checked={isChecked}
        onChange={onChange}
        className="w-4 h-4 text-primary bg-gray-100 border border-gray-300 rounded-sm outline-none cursor-pointer"
      />

      <p className="text-[13px] text-gray-800">{text}</p>
    </div>
  );
};

const Attachment = ({ link, index, onClick }) => {
  return (
    <div
      className="flex justify-between bg-gray-50 border border-gray-100 px-3 py-2 rounded-md mb-3 mt-2 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex-1 flex items-center gap-3">
        <span className="text-xs text-gray-400 font-semibold mr-2">
          {index < 9 ? `0${index + 1}` : index + 1}
        </span>

        <p className="text-xs text-black">{link}</p>
      </div>

      <LuSquareArrowOutUpRight className="text-gray-400" />
    </div>
  );
};
