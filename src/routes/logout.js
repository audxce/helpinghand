import axios from "axios";
import MKButton from "components/MKButton";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function Logout({ redirectPath }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });
      navigate(redirectPath || "/"); // Redirect to provided path or default to "/"
    } catch (error) {
      console.error("Logout error:", error.response?.data?.message || error.message);
      alert("Failed to log out.");
    }
  };

  return (
    <MKButton variant="gradient" color="error" onClick={handleLogout}>
      Logout
    </MKButton>
  );
}

Logout.propTypes = {
  redirectPath: PropTypes.string, // Validate redirectPath as a string
};

Logout.defaultProps = {
  redirectPath: "/", // Default to the landing page if not provided
};

export default Logout;
