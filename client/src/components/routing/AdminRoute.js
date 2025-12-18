import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-90">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

export default AdminRoute;

