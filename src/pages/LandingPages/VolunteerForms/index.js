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

  // Hardcoded data for volunteers and events
  const volunteers = {
    "Volunteer 1": { name: "John Doe", location: "Houston", skills: "Cleaning" },
    "Volunteer 2": { name: "Jane Smith", location: "Katy", skills: "Sorting" },
  };

  const events = {
    "Event 1": {
      event_name: "Community Clean-Up",
      event_date: "2024-5-15",
      duration_hours: 4.5,
      location: "Houston",
      required_skills: "Cleaning",
      urgency: "Medium",
      event_description: "A community effort to clean up local parks",
    },
    "Event 2": {
      event_name: "Food Bank Volunteer",
      event_date: "2024-6-10",
      duration_hours: 3,
      location: "Katy",
      required_skills: "Sorting",
      urgency: "Medium",
      event_description: "Help sort and distribute food to families in need.",
    },
  };

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
      // Don't reset volunteerName or eventName so the info stays displayed
    } catch (error) {
      setMatchMessage("Failed to match. Incompatible skill, location, etc."); // Set failure message
    }
  };

  // Info to display for selected volunteer
  const selectedVolunteer = volunteerName ? volunteers[volunteerName] : null;
  // Info to display for selected event
  const selectedEvent = eventName ? events[eventName] : null;

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
        maxWidth="2000px"
        height="80vh"
        p={4}
        borderRadius="lg"
        boxShadow="lg"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <MKTypography variant="h3" textAlign="center" mb={3}>
          Volunteer Matching Form
        </MKTypography>
        <Grid container spacing={3}>
          {/* Volunteer Container */}
          <Grid item xs={12} md={4}>
            <MKBox
              p={3}
              borderRadius="lg"
              boxShadow="lg"
              sx={{
                backgroundColor: "white",
                border: "1px solid #B0B0B0", // Gray border
              }}
            >
              <MKTypography variant="h5" textAlign="center" mb={2}>
                Volunteer Selection
              </MKTypography>
              <Select
                value={volunteerName}
                onChange={handleVolunteerNameChange}
                fullWidth
                variant="standard"
              >
                <MenuItem value="Volunteer 1">Volunteer 1</MenuItem>
                <MenuItem value="Volunteer 2">Volunteer 2</MenuItem>
              </Select>
            </MKBox>
          </Grid>
          {/* Event Container */}
          <Grid item xs={12} md={8}>
            <MKBox
              p={3}
              borderRadius="lg"
              boxShadow="lg"
              sx={{
                backgroundColor: "white",
                border: "1px solid #B0B0B0", // Gray border
              }}
            >
              <MKTypography variant="h5" textAlign="center" mb={2}>
                Event Selection
              </MKTypography>
              <Select
                value={eventName}
                onChange={handleEventNameChange}
                fullWidth
                variant="standard"
              >
                <MenuItem value="Event 1">Event 1</MenuItem>
                <MenuItem value="Event 2">Event 2</MenuItem>
              </Select>
            </MKBox>
          </Grid>
        </Grid>

        {/* Volunteer Info Box */}
        {selectedVolunteer && (
          <MKBox mt={3} p={3} borderRadius="lg" boxShadow="lg" sx={{ backgroundColor: "white" }}>
            <MKTypography variant="h6" mb={2}>
              Volunteer Info
            </MKTypography>
            <MKTypography>Name: {selectedVolunteer.name}</MKTypography>
            <MKTypography>Location: {selectedVolunteer.location}</MKTypography>
            <MKTypography>Skills: {selectedVolunteer.skills}</MKTypography>
          </MKBox>
        )}

        {/* Event Info Box */}
        {selectedEvent && (
          <MKBox mt={3} p={3} borderRadius="lg" boxShadow="lg" sx={{ backgroundColor: "white" }}>
            <MKTypography variant="h6" mb={2}>
              Event Info
            </MKTypography>
            <MKTypography>Event Name: {selectedEvent.event_name}</MKTypography>
            <MKTypography>Event Date: {selectedEvent.event_date}</MKTypography>
            <MKTypography>Duration: {selectedEvent.duration_hours} hours</MKTypography>
            <MKTypography>Location: {selectedEvent.location}</MKTypography>
            <MKTypography>Required Skills: {selectedEvent.required_skills}</MKTypography>
            <MKTypography>Urgency: {selectedEvent.urgency}</MKTypography>
            <MKTypography>Description: {selectedEvent.event_description}</MKTypography>
          </MKBox>
        )}

        {/* Match Button Positioned at the Bottom */}
        <MKBox mt={3} sx={{ marginTop: "auto" }}>
          <MKButton type="submit" variant="gradient" color="dark" fullWidth onClick={handleSubmit}>
            Match
          </MKButton>
        </MKBox>

        {/* Match Message */}
        {matchMessage && (
          <MKTypography variant="h6" color="success.main" textAlign="center" mt={2}>
            {matchMessage}
          </MKTypography>
        )}
      </MKBox>
    </MKBox>
  );
}

export default VolunteerForms;
