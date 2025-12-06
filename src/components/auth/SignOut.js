import { useNavigate } from "react-router-dom";
import { useAuth } from "../../utils/hooks/useAuth";

const SignOutButton = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSignOut = (e) => {
    e.stopPropagation(); // Prevent click from bubbling to App's handleActivity
    logout();
    navigate("/");
  };

  return (
    <button
      onClick={handleSignOut}
      className="text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out"
    >
      Sign Out
    </button>
  );
};

export default SignOutButton;
