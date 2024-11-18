// @mui material components
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useState } from "react";
import axios from "axios"; // Import axios for making HTTP requests

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";

// Background image
import bgImage from "assets/images/hh-bg.jpg";

function VolunteerForms() {
  const [volunteerName, setVolunteerName] = useState("");
  const [eventName, setEventName] = useState("");
  const [matchMessage, setMatchMessage] = useState(""); // New state for match message

  const handleVolunteerNameChange = (event) => {
    setVolunteerName(event.target.value);
  };

  const handleEventNameChange = (event) => {
    setEventName(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    try {
      const response = await axios.post("http://localhost:5000/api/volunteer", {
        volunteerName,
        eventName,
      });
      setMatchMessage(response.data.message); // Set message from response
      setVolunteerName("");
      setEventName("");
    } catch (error) {
      setMatchMessage("Failed to match. Incompatible skill, location, etc."); // Set failure message
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
      <MKBox
        width="90%"
        maxWidth="600px"
        p={4}
        borderRadius="lg"
        boxShadow="lg"
        sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }} // Slightly transparent white background for contrast
      >
        <MKTypography variant="h3" textAlign="center" mb={3}>
          Volunteer Matching Form
        </MKTypography>
        <MKBox component="form" onSubmit={handleSubmit} autoComplete="off">
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <MKTypography variant="h6">Volunteer Name</MKTypography>
              <Select
                value={volunteerName}
                onChange={handleVolunteerNameChange}
                fullWidth
                variant="standard"
              >
                <MenuItem value="Volunteer 1">Volunteer 1</MenuItem>
                <MenuItem value="Volunteer 2">Volunteer 2</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <MKTypography variant="h6">Event Name</MKTypography>
              <Select
                value={eventName}
                onChange={handleEventNameChange}
                fullWidth
                variant="standard"
              >
                <MenuItem value="Event 1">Event 1</MenuItem>
                <MenuItem value="Event 2">Event 2</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <MKBox mt={3}>
            <MKButton type="submit" variant="gradient" color="dark" fullWidth>
              Match
            </MKButton>
          </MKBox>
          {matchMessage && (
            <MKTypography variant="h6" color="success.main" textAlign="center" mt={2}>
              {matchMessage}
            </MKTypography>
          )}
        </MKBox>
      </MKBox>
    </MKBox>
  );
}

export default VolunteerForms;
