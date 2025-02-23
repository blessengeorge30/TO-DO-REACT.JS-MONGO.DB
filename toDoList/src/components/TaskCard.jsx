import React from "react";
import "./TaskCard.css";

const TaskCard = ({ list, selectList }) => {
  return (
    <div className="task-card" onClick={() => selectList(list.listName)}>
      <h3 className="task-card-title">{list.listName}</h3>
      <ul className="task-card-list">
        {list.tasks.map((task, index) => (
          <li key={index} className={task.completed ? "completed-task" : ""}>
            {task.text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskCard;
