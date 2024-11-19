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

function UserRegistration() {
  // Define all necessary state variables
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [addressTwo, setAddressTwo] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [skills, setSkills] = useState("");
  const [availability, setAvailability] = useState("");
  const [preferences, setPreferences] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear previous messages
    setError("");
    setSuccessMessage("");

    // Basic validation to check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true); // Start loading when request is made
      const response = await axios.post("http://localhost:5000/api/user_registration", {
        email,
        password,
        confirmPassword,
        fullName,
        address,
        addressTwo,
        city,
        state,
        zipcode,
        skills,
        availability,
        preferences,
      });

      // Handle success
      setSuccessMessage("Registration successful! Redirecting...");
      console.log(response.data.message);
    } catch (error) {
      // Handle error
      setError(error.response?.data?.message || "Registration error");
      console.error(error.response?.data?.message || "Registration error");
    } finally {
      setLoading(false); // Stop loading after the request finishes
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
        <Grid item xs={11} sm={9} md={5} lg={6} xl={5}>
          <Card>
            <MKBox p={3} textAlign="center">
              <MKTypography variant="h4" fontWeight="medium" color="dark" mt={1}>
                User Registration
              </MKTypography>
            </MKBox>

            <MKBox pt={2} pb={3} px={3}>
              <MKBox component="form" role="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  {/* Input fields */}
                  <Grid item xs={12}>
                    <MKInput
                      type="email"
                      label="Email"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <MKInput
                      type="password"
                      label="Password"
                      fullWidth
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <MKInput
                      type="password"
                      label="Confirm Password"
                      fullWidth
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MKInput
                      type="text"
                      label="Full Name"
                      fullWidth
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MKInput
                      type="text"
                      label="Address"
                      fullWidth
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MKInput
                      type="text"
                      label="Address Line 2"
                      fullWidth
                      value={addressTwo}
                      onChange={(e) => setAddressTwo(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <MKInput
                      type="text"
                      label="City"
                      fullWidth
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <MKInput
                      type="text"
                      label="State"
                      fullWidth
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={3}>
                    <MKInput
                      type="text"
                      label="Zipcode"
                      fullWidth
                      value={zipcode}
                      onChange={(e) => setZipcode(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MKInput
                      type="text"
                      label="Skills"
                      fullWidth
                      value={skills}
                      onChange={(e) => setSkills(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MKInput
                      type="text"
                      label="Availability"
                      fullWidth
                      value={availability}
                      onChange={(e) => setAvailability(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <MKInput
                      type="text"
                      label="Preferences"
                      fullWidth
                      value={preferences}
                      onChange={(e) => setPreferences(e.target.value)}
                    />
                  </Grid>
                </Grid>

                {/* Error message */}
                {error && (
                  <MKBox mt={2} textAlign="center">
                    <MKTypography variant="caption" color="error">
                      {error}
                    </MKTypography>
                  </MKBox>
                )}

                {/* Success message */}
                {successMessage && (
                  <MKBox mt={2} textAlign="center">
                    <MKTypography variant="caption" color="success">
                      {successMessage}
                    </MKTypography>
                  </MKBox>
                )}

                {/* Register button or loading spinner */}
                <MKBox mt={3} mb={1}>
                  {loading ? (
                    <MKButton fullWidth disabled>
                      <CircularProgress size={24} color="inherit" />
                    </MKButton>
                  ) : (
                    <MKButton type="submit" variant="gradient" color="info" fullWidth>
                      Register
                    </MKButton>
                  )}
                </MKBox>

                <MKBox mt={1} textAlign="center">
                  <MKTypography variant="button" color="secondary" fontWeight="small">
                    Already have an account?{" "}
                    <MKTypography
                      component={Link}
                      to="/pages/LandingPages/Login"
                      variant="button"
                      color="info"
                      fontWeight="medium"
                      textGradient
                    >
                      Login
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

export default UserRegistration;
