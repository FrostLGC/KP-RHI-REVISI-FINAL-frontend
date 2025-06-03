import React from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";
import toast from "react-hot-toast";

const ProfilePhotoSelector = ({ image, setImage, onImageSelected }) => {
  const inputRef = React.useRef(null);
  const [previewUrl, setPreviewUrl] = React.useState(null);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Client-side validation
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(file);

    setImage(file);

    // Immediately upload when image is selected
    if (onImageSelected) {
      await onImageSelected(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onChooseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className="flex justify-center mb-6">
      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
      />
      {!image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer">
          <LuUser className="text-4xl text-primary" onClick={onChooseFile} />
          <button
            type="button"
            onClick={onChooseFile}
            className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer"
          >
            <LuUpload className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="profile preview"
            className="w-20 h-20 object-cover rounded-full"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1"
          >
            <LuTrash className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
