import React, { useState } from "react";
import { AiOutlineDelete, AiOutlineCheckCircle, AiOutlineEdit } from "react-icons/ai";

const TaskList = ({ tasks, toggleComplete, deleteTask, editTask }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [newText, setNewText] = useState("");

  const handleEditClick = (index, text) => {
    setEditingIndex(index);
    setNewText(text);
  };

  const handleSaveClick = (index) => {
    editTask(index, newText);
    setEditingIndex(null);
  };

  return (
    <ul>
      {tasks.map((task, index) => (
        <li 
          key={index} 
          style={{ 
            textDecoration: task.completed ? "line-through" : "none", 
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          {editingIndex === index ? (
            <input 
              type="text" 
              value={newText} 
              onChange={(e) => setNewText(e.target.value)}
              style={{ flex: 1, marginRight: "10px", padding: "11px", fontSize: "16px", marginTop: "13px"}}
            />
          ) : (
            <span>{task.text}</span>
          )}

          <div style={{ display: "flex", gap: "5px", marginLeft: "auto"}}>
            {editingIndex === index ? (
              <button onClick={() => handleSaveClick(index)}>
                ✅
              </button>
            ) : (
              <>
                <button onClick={() => toggleComplete(index)}>
                  <AiOutlineCheckCircle size={20} color="white" />
                </button>
                <button onClick={() => handleEditClick(index, task.text)}>
                  <AiOutlineEdit size={20} color="yellow" />
                </button>
                <button onClick={() => deleteTask(index)}>
                  <AiOutlineDelete size={20} color="red" />
                </button>
              </>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
