import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskInput from "./components/TaskInput";
import TaskList from "./components/TaskList";
import TaskCard from "./components/TaskCard";
import "./App.css";

const API_URL = "http://localhost:3000/tasks"; 

const App = () => {
  const [listName, setListName] = useState("");
  const [tasks, setTasks] = useState([]);
  const [allLists, setAllLists] = useState([]);
  const [showLists, setShowLists] = useState(false);

  useEffect(() => {
    if (listName) fetchTasks(listName);
  }, [listName]);

  const fetchTasks = async (selectedListName) => {
    try {
      const res = await axios.get(`${API_URL}/${selectedListName}`);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  const fetchAllLists = async () => {
    try {
      const res = await axios.get(API_URL);
      if (Array.isArray(res.data)) {
        setAllLists(res.data);
        setShowLists((prev) => !prev);
      } else {
        console.error("Unexpected response format:", res.data);
      }
    } catch (err) {
      console.error("Error fetching all lists:", err);
    }
  };

  const selectList = (selectedList) => {
    setListName(selectedList);
    setShowLists(false);
  };

  const addTask = (taskText) => {
    if (!taskText.trim() || !listName.trim()) return;
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

  const editTask = (index, newText) => {
    if (!newText.trim()) return;
    const updatedTasks = [...tasks];
    updatedTasks[index].text = newText;
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const saveTasks = async (newTasks) => {
    try {
      await axios.post(API_URL, { listName, tasks: newTasks });
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  return (
    <div className="app-container dark-theme full-screen">
      <div className="task-box expanded-box">
        <h1 className="title">📝 To-Do List</h1>
        <TaskInput listName={listName} setListName={setListName} addTask={addTask} />
        
        {listName && (
          <TaskList tasks={tasks} toggleComplete={toggleComplete} deleteTask={deleteTask} editTask={editTask} />
        )}
        
        <button className="show-all-button" onClick={fetchAllLists}>
          {showLists ? "Hide All Lists" : "Show All Lists"}
        </button>
        
        {showLists && (
          <div className="all-lists">
            <h2>All Task Lists</h2>
            <div className="task-card-container">
              {allLists.map((list, index) => (
                <TaskCard key={index} list={list} selectList={selectList} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
