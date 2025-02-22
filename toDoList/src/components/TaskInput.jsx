import React, { useState } from "react";

const TaskInput = ({ listName, setListName, addTask }) => {
  const [taskText, setTaskText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(taskText);
    setTaskText("");
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter List Name"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Add a Task"
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
      />
      <button onClick={handleSubmit}>Add Task</button>
    </div>
  );
};

export default TaskInput;
