import { Navigate, useLocation } from 'react-router-dom';
import {
  clearAuthSession,
  getLoginPath,
  getToken,
  getTokenPayload,
  isRoleAllowed,
} from '../utils/adminAuth';

const PrivateRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const token = getToken(location.pathname);

  if (!token) {
    return <Navigate to={getLoginPath(location.pathname)} state={{ from: location }} replace />;
  }

  try {
    const payload = getTokenPayload(location.pathname);
    const userRole = payload?.role || null;

    if (allowedRoles && userRole) {
      if (!isRoleAllowed(location.pathname, allowedRoles)) {
        if (userRole === 'STAFF') return <Navigate to="/staff/dashboard" replace />;
        if (userRole === 'KEPALA_LPK') return <Navigate to="/kepalalpk/dashboard" replace />;
        return <Navigate to="/admin/dashboard" replace />;
      }
    }

    return children;
  } catch (_error) {
    clearAuthSession(location.pathname);
    return <Navigate to={getLoginPath(location.pathname)} replace />;
  }
};

export default PrivateRoute;
