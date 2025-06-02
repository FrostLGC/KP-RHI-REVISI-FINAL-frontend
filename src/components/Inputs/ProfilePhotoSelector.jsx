import React from 'react';
import { LuUser, LuUpload, LuTrash } from 'react-icons/lu';

const ProfilePhotoSelector = ({ image, setImage }) => {
  const inputRef = React.useRef(null);
  const [previewUrl, setPreviewUrl] = React.useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreviewUrl(null);
  };

  const onChoseFile = () => {
    inputRef.current.click();
  };

  return (
    <div className='flex justify-center mb-6'>
      <input type="file" accept="image/*" ref={inputRef} onChange={handleImageChange} className='hidden' />
      {!image ? (
        <div className="w-20 h-20 flex items-center justify-center bg-blue-100/50 rounded-full relative cursor-pointer">
          <LuUser className="text-4xl text-primary" onClick={onChoseFile} />
          <button
            type="button"
            onClick={onChoseFile}
            className='w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full absolute -bottom-1 -right-1 cursor-pointer'
          >
            <LuUpload className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <img src={previewUrl} alt="photo profile" className="w-20 h-20 object-cover rounded-full" />
          <button
            type="button"
            onClick={handleRemoveImage}
            className='w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full absolute -bottom-1 -right-1'
          >
            <LuTrash className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoSelector;
