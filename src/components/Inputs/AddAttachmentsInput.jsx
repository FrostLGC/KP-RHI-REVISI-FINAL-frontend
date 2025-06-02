import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";
import { LuPaperclip } from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const AddAttachmentsInput = ({ attachments, setAttachments }) => {
  const [option, setOption] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleAddOption = () => {
    if (option.trim()) {
      setAttachments([...attachments, option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index) => {
    const updatedArr = attachments.filter((_, idx) => idx !== index);
    setAttachments(updatedArr);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await axiosInstance.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data?.url) {
        setAttachments([...attachments, response.data.url]);
        toast.success("File uploaded successfully");
      } else {
        toast.error("Failed to upload file");
      }
    } catch (error) {
      console.error("File upload error:", error);
      toast.error("File upload failed");
    } finally {
      setUploading(false);
      e.target.value = null;
    }
  };

  return (
    <div className="mt-1">
      {attachments.map((item, index) => (
        <div
          key={item}
          className="flex justify-between items-center bg-gray-100 border border-gray-300  rounded-md px-3 py-2 mb-2 hover:border-blue-400 hover:ring-1 hover:ring-blue-100 transition duration-200"
        >
          <div className="flex items-center gap-2 flex-1">
            <LuPaperclip className="text-gray-500 flex-shrink-0" />
            <p className="text-sm text-gray-700 truncate">{item}</p>
          </div>
          <button
            onClick={() => handleDeleteOption(index)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <HiOutlineTrash className="text-lg" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-3 mt-3">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-300 rounded-md px-3 py-2 hover:border-blue-400 hover:ring-1 hover:ring-blue-100 transition duration-200">
          <LuPaperclip className="text-gray-500" />
          <input
            type="text"
            placeholder="Enter file link"
            value={option}
            onChange={({ target }) => setOption(target.value)}
            className="w-full text-sm text-gray-700 outline-none placeholder:text-gray-600 placeholder:font-medium"
            disabled={uploading}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddOption();
              }
            }}
          />
        </div>

        <button
          className="card-btn text-nowrap"
          onClick={handleAddOption}
          disabled={uploading}
        >
          <HiMiniPlus className="text-lg" /> Tambah Link
        </button>

        <label
          htmlFor="file-upload"
          className={`cursor-pointer card-btn text-nowrap flex items-center gap-1 ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <HiMiniPlus className="text-lg" />
          {uploading ? "Uploading..." : "Tambah File"}
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />
        </label>
      </div>
    </div>
  );
};

export default AddAttachmentsInput;
