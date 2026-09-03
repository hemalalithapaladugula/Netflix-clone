import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ADMIN_EMAIL = "admin@gmail.com";

function ProtectedAdminRoute({ children }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="admin-loading">
        <p>Loading...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.email !== ADMIN_EMAIL) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedAdminRoute;