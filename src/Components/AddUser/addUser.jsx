import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./AddUser.css";

export default function AddUser() {
  const [users, setUsers] = useState([
    { id: 1, name: "Shivansh", age: 23, email: "shivansh@example.com" },
    { id: 2, name: "Simran", age: 22, email: "simran@example.com" },
    { id: 3, name: "Aakash", age: 23, email: "aakash@example.com" },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm();

  const onSubmit = (data) => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map(user => 
        user.id === editingUser.id 
          ? { ...user, ...data, age: parseInt(data.age) } 
          : user
      ));
    } else {
      // Add new user
      setUsers([...users, { 
        id: Date.now(), 
        name: data.name, 
        age: parseInt(data.age),
        email: data.email
      }]);
    }
    reset();
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setValue("name", user.name);
    setValue("age", user.age);
    setValue("email", user.email);
    setIsModalOpen(true);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">User Management System</h1>
        <p className="app-subtitle">React CRUD Application</p>
      </header>

      <main className="app-main">
        <div className="table-container">
          <table className="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.age}</td>
                  <td>{user.email}</td>
                  <td className="actions">
                    <button 
                      className="btn edit-btn" 
                      onClick={() => handleEdit(user)}
                    >
                      <i className="fas fa-edit"></i> Edit
                    </button>
                    <button 
                      className="btn delete-btn" 
                      onClick={() => handleDelete(user.id)}
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="empty-state">
              <i className="fas fa-users empty-icon"></i>
              <p>No users found. Create your first user!</p>
            </div>
          )}
        </div>

        <button 
          className="btn create-btn" 
          onClick={() => {
            reset();
            setEditingUser(null);
            setIsModalOpen(true);
          }}
        >
          <i className="fas fa-plus"></i> Add New User
        </button>
      </main>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{editingUser ? "Edit User" : "Create New User"}</h2>
              <button 
                className="close-btn" 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingUser(null);
                }}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="user-form">
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter full name"
                  {...register("name", { 
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters"
                    }
                  })}
                />
                {errors.name && <span className="error-message">{errors.name.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  id="age"
                  type="number"
                  placeholder="Enter age"
                  {...register("age", {
                    required: "Age is required",
                    min: { 
                      value: 1, 
                      message: "Age must be at least 1" 
                    },
                    max: { 
                      value: 120, 
                      message: "Age must be less than 120" 
                    }
                  })}
                />
                {errors.age && <span className="error-message">{errors.age.message}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter email"
                  {...register("email", { 
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address"
                    }
                  })}
                />
                {errors.email && <span className="error-message">{errors.email.message}</span>}
              </div>

              <div className="form-actions">
                <button type="submit" className="btn submit-btn">
                  {editingUser ? "Update User" : "Create User"}
                </button>
                <button 
                  type="button" 
                  className="btn cancel-btn"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingUser(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}