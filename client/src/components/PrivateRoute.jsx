import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    // Redirect to the appropriate login page based on the current path
    if (location.pathname.startsWith('/staff')) {
        return <Navigate to="/staff/login" state={{ from: location }} replace />;
    }
    if (location.pathname.startsWith('/kepalalpk')) {
        return <Navigate to="/kepalalpk/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userRole = payload.role ? String(payload.role).toUpperCase() : null;

    // Check if the user's role is allowed for this route
    if (allowedRoles && userRole) {
        const uppercaseAllowedRoles = allowedRoles.map(r => String(r).toUpperCase());
        if (!uppercaseAllowedRoles.includes(userRole)) {
            // Redirect to their appropriate dashboard if unauthorized
            if (userRole === 'STAFF') return <Navigate to="/staff/dashboard" replace />;
            if (userRole === 'KEPALA_LPK') return <Navigate to="/kepalalpk/dashboard" replace />;
            return <Navigate to="/admin/dashboard" replace />;
        }
    }

    return children;
  } catch (e) {
    localStorage.removeItem('token');
    return <Navigate to="/admin/login" replace />;
  }
};

export default PrivateRoute;
