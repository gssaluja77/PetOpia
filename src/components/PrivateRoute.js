import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const userId = window.sessionStorage.getItem("userid");
  return userId ? <Outlet /> : <Navigate to='/' />;
};

export default PrivateRoute;
