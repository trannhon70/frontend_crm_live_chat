import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

const ProtectedRoute = ({ allowedRoles }: { allowedRoles: string[] }) => {
   const { authenticated } = useContext(AuthContext);
    const role = useSelector((state: RootState) => state.users.user.role);
   

  if (!authenticated) return <Navigate to="/login" replace />;
  if(role){
    if (!allowedRoles.includes(role.id.toString())) return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
