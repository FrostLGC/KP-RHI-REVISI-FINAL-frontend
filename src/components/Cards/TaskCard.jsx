import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { FaMapMarkerAlt } from "react-icons/fa";
import Progress from "../Progress";
import { LuPaperclip } from "react-icons/lu";
import moment from "moment";
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

const TaskCard = ({
  title,
  description,
  priority,
  status,
  progress,
  createdAt,
  dueDate,
  assignedTo,
  assignedBy,
  attachmentCount,
  completedTodoCount,
  todoChecklist,
  location,
  onClick,
}) => {
  // Format address display
  const formatAddress = () => {
    if (!location?.address) return "Location not specified";

    if (/^-?\d+\.\d+\s+-?\d+\.\d+$/.test(location.address)) {
      const [lat, lng] = location.address.split(" ");
      return `Near ${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}`;
    }

    return location.address;
  };

  const getStatusTagColor = () => {
    switch (status) {
      case "In Progress":
        return "text-cyan-500 bg-cyan-50 border border-cyan-500/10";
      case "Completed":
        return "text-lime-500 bg-lime-50 border border-lime-500/20";
      case "Rejected":
        return "text-red-600 bg-red-50 border border-red-600/20";
      case "Pending":
        return "text-purple-600 bg-purple-50 border border-purple-600/20";
      default:
        return "text-violet-500 bg-violet-50 border border-violet-500/10";
    }
  };

  const getPriorityTagColor = () => {
    switch (priority) {
      case "Low":
        return "text-emerald-500 bg-emerald-50 border border-emerald-500/10";
      case "Medium":
        return "Text-amber-500 bg-amber-50 border border-amber-500/10";
      default:
        return "text-rose-500 bg-rose-50 border border-rose-500/10";
    }
  };

  // Handler for map interactions
  const handleMapInteraction = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      className={`bg-white rounded-xl py-4 shadow-md shadow-gray-100 border cursor-pointer ${
        status === "Rejected"
          ? "border-red-500 bg-red-50"
          : status === "Pending"
          ? "border-purple-500 bg-purple-50"
          : status === "Completed"
          ? "border-lime-500 bg-lime-50"
          : status === "Pending Approval"
          ? "border-violet-500 bg-violet-50"
          : "border-cyan-500 bg-cyan-50"
      }`}
      onClick={(e) => {
        // Only trigger onClick if the click wasn't on the map container
        if (!e.target.closest(".leaflet-container")) {
          onClick();
        }
      }}
    >
      {/* Header with status and priority */}
      <div className="flex items-end gap-3 px-4">
        <div
          className={`text-[11px] font-medium ${getStatusTagColor()} px-4 py-0.5 rounded`}
        >
          {status}
        </div>
        <div
          className={`text-[11px] font-medium ${getPriorityTagColor()} px-4 py-0.5 rounded`}
        >
          {priority} Priority
        </div>
      </div>

      {/* Task content */}
      <div
        className={`px-4 border-l-[3px] ${
          status === "In Progress"
            ? "border-cyan-500"
            : status === "Completed"
            ? "border-lime-500"
            : status === "Rejected"
            ? "border-red-500"
            : "border-violet-500"
        }`}
      >
        <p className="text-sm font-medium text-gray-800 mt-4 line-clamp-2">
          {title}
        </p>
        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-[18px]">
          {description}
        </p>

        <p className="text-[13px] text-gray-700/80 font-medium mt-2 mb-2 leading-[18px]">
          Task Done:{" "}
          <span className="font-semibold text-gray-700">
            {completedTodoCount} / {todoChecklist.length || 0}
          </span>
        </p>

        <Progress progress={progress} status={status} />
      </div>

      {/* Task metadata */}
      <div className="px-4">
        <div className="flex items-center justify-between my-1">
          <div>
            <label className="text-xs text-gray-590">Start Date</label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment(createdAt).format("DD MMMM YYYY")}
            </p>
          </div>
          <div>
            <label className="text-xs text-gray-500">Due Date</label>
            <p className="text-[13px] font-medium text-gray-900">
              {moment(dueDate).format("DD MMMM YYYY")}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex flex-col gap-1">
            <div className="flex flex-col gap-1">
              {(assignedTo || []).map((user) => (
                <div key={user._id} className="flex items-center gap-2">
                  {user.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={user.name}
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <div className="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center text-white text-xs">
                      {user.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                  )}
                  <div className="text-xs font-medium text-gray-700">
                    {user.name}
                    {user.rejected && (
                      <span className="ml-2 text-red-600 font-semibold">
                        (Rejected)
                      </span>
                    )}
                  </div>
                  {user.rejected && user.rejectionReason && (
                    <div className="text-xs italic text-red-500 ml-6 max-w-xs line-clamp-2">
                      Reason: {user.rejectionReason}
                    </div>
                  )}

                  {/* Show pending status */}
                  {user.pending && (
                    <div className="text-xs italic text-blue-600 mt-1 ml-6 max-w-xs line-clamp-2">
                      Note: Pending approval
                    </div>
                  )}
                </div>
              ))}
            </div>
            {assignedBy && (
              <div className="flex items-center gap-2">
                {assignedBy.profileImageUrl ? (
                  <img
                    src={assignedBy.profileImageUrl}
                    alt={assignedBy.name}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 bg-slate-400 rounded-full flex items-center justify-center text-white text-xs">
                    {assignedBy.name?.charAt(0).toUpperCase() || "?"}
                  </div>
                )}
                <div className="text-xs font-medium text-gray-700">
                  Assigned by: {assignedBy.name}
                </div>
              </div>
            )}
          </div>

          {attachmentCount > 0 && (
            <div className="flex items-center gap-2 bg-blue-50 px-2.5 py-1.5 rounded-lg">
              <LuPaperclip className="text-primary" />
              <span className="text-xs text-gray-900">{attachmentCount}</span>
            </div>
          )}
        </div>

        {/* Location section - now with interactive map */}
        {location && (
          <div className="mt-3 px-4">
            <div className="flex items-center gap-1 mb-1">
              <FaMapMarkerAlt className="text-red-500" />
              <span className="text-xs font-medium text-slate-600">
                Location
              </span>
            </div>
            <p className="text-xs text-gray-700 line-clamp-1 mb-2">
              {formatAddress()}
            </p>

            {location.lat && location.lng ? (
              <div
                className="h-[250px] w-full rounded border border-gray-300 overflow-hidden relative z-0"
                onClick={handleMapInteraction}
              >
                <MapContainer
                  center={[location.lat, location.lng]}
                  zoom={15}
                  scrollWheelZoom={false}
                  style={{ height: "100%", width: "100%" }}
                  onClick={handleMapInteraction}
                  onDragStart={handleMapInteraction}
                  onMouseDown={handleMapInteraction}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[location.lat, location.lng]}>
                    <Popup>{formatAddress()}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            ) : (
              <div className="h-[150px] bg-gray-100 rounded border border-gray-300 flex items-center justify-center">
                <p className="text-xs text-gray-500">No map available</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Todo Checklist with notes */}
      {todoChecklist && todoChecklist.length > 0 && (
        <div className="px-4 mt-3">
          <label className="text-xs font-medium text-slate-500 mb-1 block">
            Todo Checklist
          </label>
          <ul className="max-h-40 overflow-y-auto">
            {todoChecklist.map((item, idx) => (
              <li
                key={`todo_note_${idx}`}
                className="mb-1 flex items-start gap-2"
              >
                <input
                  type="checkbox"
                  checked={item.completed}
                  readOnly
                  className="mt-1 w-4 h-4 cursor-default"
                />
                <div className="flex flex-col">
                  <span
                    className={`font-semibold ${
                      item.completed ? "line-through text-gray-500" : ""
                    }`}
                  >
                    {item.text}
                  </span>
                  {item.note && item.note.trim() !== "" && (
                    <span className="text-xs text-red-600 italic mt-0.5 ml-1 block">
                      Note: {item.note}
                    </span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
