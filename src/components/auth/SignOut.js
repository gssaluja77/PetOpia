import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";

const SignOutButton = ({ handleChange }) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    logout();
    handleChange();
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
