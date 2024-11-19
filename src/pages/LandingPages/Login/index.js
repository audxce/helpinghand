import Card from "@mui/material/Card";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid";
import bgImage from "assets/images/hh-bg.jpg";
import axios from "axios";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate(); // Hook for navigation

  const checkSession = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/check-session", {
        withCredentials: true,
      });
      console.log("Session Data:", response.data.session);
    } catch (error) {
      console.error("Session Check Error:", error.response?.data?.message || error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        { email, password },
        { withCredentials: true }
      );

      console.log(response.data.message);
      setSuccessMessage("Login successful! Redirecting...");

      const role = response.data.role;
      if (role === "administrator") {
        navigate("/pages/LandingPages/AdminDash");
      } else if (role === "volunteer") {
        navigate("/pages/LandingPages/VolunteerDash");
      } else {
        setErrorMessage("Unknown role. Please contact support.");
      }

      await checkSession();
    } catch (error) {
      console.error(error.response?.data?.message || "Login error");
      setErrorMessage(error.response?.data?.message || "Login error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <MKBox
      px={1}
      width="100%"
      height="100vh"
      mx="auto"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Grid container spacing={1} justifyContent="center" alignItems="center" height="100%">
        <Grid item xs={11} sm={9} md={5} lg={4} xl={3}>
          <Card>
            <MKBox p={3} textAlign="center">
              <MKTypography variant="h4" fontWeight="medium" color="dark" mt={1}>
                Login
              </MKTypography>
            </MKBox>

            <MKBox pt={2} pb={3} px={3}>
              <MKBox component="form" role="form" onSubmit={handleSubmit}>
                <MKBox mb={2}>
                  <MKInput
                    type="text"
                    label="Email"
                    fullWidth
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </MKBox>

                <MKBox mb={2}>
                  <MKInput
                    type="password"
                    label="Password"
                    fullWidth
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </MKBox>

                <MKBox mt={3} mb={1}>
                  {loading ? (
                    <MKButton fullWidth disabled>
                      <CircularProgress size={24} color="inherit" />
                    </MKButton>
                  ) : (
                    <MKButton type="submit" variant="gradient" color="info" fullWidth>
                      Login
                    </MKButton>
                  )}
                </MKBox>

                {successMessage && (
                  <MKBox mt={2} textAlign="center">
                    <MKTypography color="success" variant="body2">
                      {successMessage}
                    </MKTypography>
                  </MKBox>
                )}
                {errorMessage && (
                  <MKBox mt={2} textAlign="center">
                    <MKTypography color="error" variant="body2">
                      {errorMessage}
                    </MKTypography>
                  </MKBox>
                )}

                <MKBox mt={1} textAlign="center">
                  <MKTypography variant="button" color="secondary" fontWeight="small">
                    Don&apos;t have an account?{" "}
                    <MKTypography
                      component={Link}
                      to="/pages/LandingPages/UserRegistration"
                      variant="button"
                      color="info"
                      fontWeight="medium"
                      textGradient
                    >
                      Register
                    </MKTypography>
                  </MKTypography>
                </MKBox>

                {/* Return to Home Button */}
                <MKBox mt={3} textAlign="center">
                  <MKButton
                    variant="outlined" // Makes the button outlined
                    color="info" // Matches the color of the other buttons
                    onClick={() => navigate("/")}
                    size="small" // Makes the button smaller
                  >
                    Return to Home
                  </MKButton>
                </MKBox>
              </MKBox>
            </MKBox>
          </Card>
        </Grid>
      </Grid>
    </MKBox>
  );
}

export default Login;
