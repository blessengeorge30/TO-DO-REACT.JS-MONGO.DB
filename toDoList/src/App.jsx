import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import "./App.css";

const API_URL = "http://localhost:3000/tasks";

const App = () => {
  const [listName, setListName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [allLists, setAllLists] = useState([]);
  const [showLists, setShowLists] = useState(false);

  // Fetch tasks when a list is selected
  useEffect(() => {
    if (listName) {
      fetchTasks(listName);
    }
  }, [listName]);

  // Fetch all lists on initial render
  useEffect(() => {
    fetchAllLists();
  }, []);

  // Fetch tasks for a specific list
  const fetchTasks = async (selectedListName) => {
    try {
      const res = await axios.get(`${API_URL}/${selectedListName}`);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  // Fetch all lists
  const fetchAllLists = async () => {
    try {
      const res = await axios.get(API_URL);
      
      if (Array.isArray(res.data)) {
        // If API returns an array directly, use it
        setAllLists(res.data);
      } else if (res.data.lists && Array.isArray(res.data.lists)) {
        // If API returns { lists: [...] }, use the lists array
        setAllLists(res.data.lists);
      } else {
        console.error("Unexpected response format:", res.data);
        setAllLists([]);
      }
    } catch (error) {
      console.error("Error fetching lists:", error);
    }
  };

  const addTask = (taskText) => {
    if (!taskText.trim()) return;
    const newTasks = [...tasks, { text: taskText, completed: false }];
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const toggleComplete = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const deleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const saveTasks = async (newTasks) => {
    try {
      await axios.post(API_URL, { listName, tasks: newTasks });
      fetchAllLists(); // Refresh lists after saving
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  return (
    <div className="app-container dark-theme full-screen">
      <div className="task-box expanded-box">
        <h1 className="title">📝 To Do List</h1>
        <TaskInput listName={listName} setListName={setListName} addTask={addTask} />
        {listName && <TaskList tasks={tasks} toggleComplete={toggleComplete} deleteTask={deleteTask} />}

        {/* Show All Lists Button */}
        <button onClick={() => { setShowLists(!showLists); fetchAllLists(); }}>
          {showLists ? "Hide All Lists" : "Show All Lists"}
        </button>

        {/* All To-Do Lists Section */}
        {showLists && (
          <div className="all-lists-container">
            <h2>📋 All To-Do Lists</h2>
            {allLists.length > 0 ? (
              allLists.map((list, index) => (
                <div key={index} className="list-box">
                  <h3>📌 {list.listName || "Unnamed List"}</h3> {/* Ensure listName exists */}
                  <ul>
                    {list.tasks && list.tasks.length > 0 ? (
                      list.tasks.map((task, i) => (
                        <li key={i} className={task.completed ? "completed" : ""}>
                          {task.text}
                        </li>
                      ))
                    ) : (
                      <p>No tasks in this list.</p>
                    )}
                  </ul>
                </div>
              ))
            ) : (
              <p>No lists available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
