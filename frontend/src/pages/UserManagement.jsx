import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function UserManagement() {
  const navigate = useNavigate();

  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem("netflixUsers");
    return savedUsers ? JSON.parse(savedUsers) : [];
  });

  const deleteUser = (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) return;

    const updatedUsers = users.filter((_, i) => i !== index);

    setUsers(updatedUsers);
    localStorage.setItem("netflixUsers", JSON.stringify(updatedUsers));
  };

  return (
    <div className="admin-dashboard-wrapper">
      <Navbar />

      <main className="admin-dashboard">
        {/* Header */}
        <div className="admin-header">
          <div>
            <p className="admin-label">ADMIN PANEL</p>
            <h1>User Management</h1>
            <p>View and manage registered users.</p>
          </div>

          <button
            className="admin-back-button"
            onClick={() => navigate("/admin")}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* User Stats */}
        <section className="admin-stats">
          <div className="admin-stat-card">
            <span className="admin-stat-icon">👥</span>

            <div>
              <p>Total Users</p>
              <h2>{users.length}</h2>
            </div>
          </div>

          <div className="admin-stat-card">
            <span className="admin-stat-icon">👤</span>

            <div>
              <p>Registered Accounts</p>
              <h2>{users.length}</h2>
            </div>
          </div>
        </section>

        {/* Users Table */}
        <section className="admin-section">
          <div className="admin-section-header">
            <div>
              <p className="admin-section-label">USERS</p>
              <h2>Registered Users</h2>
            </div>

            <span className="admin-count">
              {users.length} users
            </span>
          </div>

          {users.length > 0 ? (
            <div className="user-management-table-wrapper">
              <table className="user-management-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>

                      <td>
                        {user.email || "No email"}
                      </td>

                      <td>
                        {user.name ||
                          user.displayName ||
                          "User"}
                      </td>

                      <td>
                        <button
                          className="user-delete-button"
                          onClick={() => deleteUser(index)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-admin-state">
              <div className="empty-admin-icon">👥</div>

              <h2>No users found</h2>

              <p>
                Registered users will appear here.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default UserManagement;