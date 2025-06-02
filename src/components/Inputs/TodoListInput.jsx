import React, { useState } from "react";
import { HiMiniPlus, HiOutlineTrash } from "react-icons/hi2";

const TodoListInput = ({ todoList, setTodoList }) => {
  const [option, setOption] = useState("");

  const handleAddOption = () => {
    if (option.trim()) {
      setTodoList([...todoList, option.trim()]);
      setOption("");
    }
  };

  const handleDeleteOption = (index) => {
    const updatedArr = todoList.filter((_, idx) => idx !== index);
    setTodoList(updatedArr);
  };

  return (
    <div className="mt-1">
      {todoList.map((item, index) => (
        <div
          key={item}
          className="flex justify-between items-center bg-gray-100 border border-gray-300 rounded-md px-3 py-2 mb-2 hover:border-blue-400 hover:ring-1 hover:ring-blue-100 transition duration-200"
        >
          <p className="text-sm text-gray-700">
            <span className="text-xs text-gray-500 font-medium mr-2">
              {index < 9 ? `0${index + 1}` : index + 1}
            </span>
            {item}
          </p>
          <button
            onClick={() => handleDeleteOption(index)}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <HiOutlineTrash className="text-lg" />
          </button>
        </div>
      ))}

      <div className="flex items-center gap-3 mt-3">
        <input
          type="text"
          placeholder="Enter task item"
          value={option}
          onChange={({ target }) => setOption(target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddOption();
            }
          }}
          className="w-full text-sm text-gray-700 bg-white border border-gray-300 rounded-md px-3 py-2 placeholder:text-gray-600 placeholder:font-medium focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 hover:border-blue-400 hover:ring-1 hover:ring-blue-100 transition duration-200"
        />
        <button className="card-btn text-nowrap" onClick={handleAddOption}>
          <HiMiniPlus className="text-lg" />
          Tambah
        </button>
      </div>
    </div>
  );
};

export default TodoListInput;
