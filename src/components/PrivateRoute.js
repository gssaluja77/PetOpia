import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const userId = window.localStorage.getItem("userId");
  return userId ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
