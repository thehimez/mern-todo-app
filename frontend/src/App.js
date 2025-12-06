import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");

  const loadTodos = async () => {
    const res = await fetch(`${API_URL}/todos`);
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const addTodo = async () => {
    if (!text.trim()) return;

    await fetch(`${API_URL}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    setText("");
    loadTodos();
  };

  const toggleTodo = async (id) => {
    await fetch(`${API_URL}/todos/${id}`, { method: "PUT" });
    loadTodos();
  };

  const deleteTodo = async (id) => {
    await fetch(`${API_URL}/todos/${id}`, { method: "DELETE" });
    loadTodos();
  };

  return (
    <div className="app-container">
      <h2>MERN TODO App</h2>

      <div className="input-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter todo"
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className="todo-item">
            <span
              className={`todo-text ${todo.completed ? "completed" : ""}`}
              onClick={() => toggleTodo(todo._id)}
            >
              {todo.text}
            </span>

            <button
              className="delete-btn"
              onClick={() => deleteTodo(todo._id)}
            >
              X
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
