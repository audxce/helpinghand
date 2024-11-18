import React, { useEffect, useState } from "react";
// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

// Material Kit 2 React examples
import DefaultFooter from "examples/Footers/SimpleFooter";
import DefaultNavbar from "examples/Navbars/DefaultNavbar";

// Routes
import footerRoutes from "footer.routes";
import routes from "routes.admin";

// Images
import bgImage from "assets/images/hh-bg.jpg";
import hhlogo from "assets/images/hhlogo.png";

import axios from "axios";

// Fetch active events function
async function fetchActiveEvents() {
  try {
    const response = await axios.get("http://localhost:5000/api/event/active");
    return response.data;
  } catch (error) {
    console.error("Error fetching active events:", error);
    return [];
  }
}

// Fetch volunteer users function
async function fetchUsers() {
  try {
    const response = await axios.get("http://localhost:5000/api/profileEdit/volunteer");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Fetch admin users function
async function fetchAdmin() {
  try {
    const response = await axios.get("http://localhost:5000/api/profileEdit/admin");
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

const formatArray = (value) => {
  return Array.isArray(value) ? value.join(", ") : "N/A";
};

function Presentation() {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [showVolunteers, setShowVolunteers] = useState(false);
  const [showAdmins, setShowAdmins] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [message, setMessage] = useState("");

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "Low":
        return "green";
      case "Medium":
        return "orange";
      case "High":
        return "red";
      default:
        return "black";
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
  };

  const handleClose = () => {
    setSelectedUser(null);
    setMessage("");
  };

  const handleSendMessage = () => {
    console.log(`Message to ${selectedUser.fullName}: ${message}`);
    handleClose();
  };

  useEffect(() => {
    fetchActiveEvents().then((data) => {
      setEvents(data);
    });
    fetchUsers().then((data) => {
      setUsers(data);
    });
    fetchAdmin().then((data) => {
      setAdmins(data);
    });
  }, []);

  return (
    <>
      <DefaultNavbar routes={routes} />
      <MKBox
        minHeight="90vh"
        width="100%"
        sx={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          display: "grid",
          placeItems: "center",
        }}
      >
        {/* Toggle Volunteer List */}
        <MKBox position="absolute" left="4%" top="50%" transform="translateY(-50%)" zIndex="1000">
          <Button
            variant="contained"
            color="white"
            onClick={() => {
              // Close admin list if open
              setShowAdmins(false);
              setShowVolunteers((prev) => !prev);
            }}
          >
            {showVolunteers ? "Hide Volunteer List" : "Show Volunteer List"}
          </Button>
        </MKBox>

        {/* Toggle Admin List */}
        <MKBox position="absolute" right="4%" top="50%" transform="translateY(-50%)" zIndex="1000">
          <Button
            variant="contained"
            color="white"
            onClick={() => {
              setShowVolunteers(false);
              setShowAdmins((prev) => !prev);
            }}
          >
            {showAdmins ? "Hide Admin List" : "Show Admin List"}
          </Button>
        </MKBox>

        <Container>
          <Grid container item xs={12} lg={7} justifyContent="center" mx="auto">
            <MKBox display="flex" alignItems="center" justifyContent="center" mt={-6} mb={1}>
              <MKBox
                component="img"
                src={hhlogo}
                alt="Helping Hands Logo"
                width="50px"
                height="50px"
                mr={2}
              />
            </MKBox>
            <MKTypography
              variant="h1"
              color="dark gray"
              mt={-6}
              mb={1}
              sx={({ breakpoints, typography: { size } }) => ({
                [breakpoints.down("md")]: {
                  fontSize: size["3xl"],
                },
              })}
            >
              Welcome to Helping Hands{" "}
            </MKTypography>
            <MKTypography
              variant="body1"
              color="light gray"
              textAlign="center"
              px={{ xs: 6, lg: 12 }}
              mt={1}
            >
              Admin View
            </MKTypography>
          </Grid>

          {/* Display active events */}
          <MKBox
            bgColor="white"
            borderRadius="xl"
            shadow="lg"
            display="flex"
            flexDirection="row"
            justifyContent="left"
            mt={{ xs: 20, sm: 18, md: 3 }}
            mb={{ xs: 20, sm: 18, md: 0 }}
            mx={2}
            flexWrap="wrap"
          >
            {events.map((event) => (
              <MKBox
                key={event.EventID}
                bgColor="white"
                borderRadius="xl"
                shadow="lg"
                display="flex"
                flexDirection="column"
                justifyContent="center"
                p={5}
                mx={2}
                my={2}
              >
                <MKTypography variant="h6" color="textPrimary" textAlign="center" p={-5}>
                  {event.eventName}
                </MKTypography>
                <MKTypography variant="body2" color="textSecondary" textAlign="center" p={-5}>
                  {event.eventDescription}
                </MKTypography>
                <MKTypography
                  variant="body2"
                  textAlign="center"
                  p={-5}
                  sx={{ color: getUrgencyColor(event.urgency) }}
                >
                  Urgency: {event.urgency}
                </MKTypography>
                <MKTypography variant="body2" color="textSecondary" textAlign="center" p={-5}>
                  {event.startTime} - {event.endTime} | Repeat: {event.repeatEvent}
                </MKTypography>
                <MKTypography variant="body2" color="textSecondary" textAlign="center" p={-5}>
                  Location: {event.state}
                </MKTypography>
                <MKTypography variant="body2" color="textSecondary" textAlign="center" p={-5}>
                  Skills Needed: {event.requiredSkills}
                </MKTypography>
              </MKBox>
            ))}
          </MKBox>

          {/* Collapsible user profiles (Volunteers) */}
          {showVolunteers && (
            <MKBox
              bgColor="white"
              borderRadius="xl"
              shadow="lg"
              display="flex"
              flexDirection="row"
              justifyContent="left"
              mt={3}
              mx={2}
              flexWrap="wrap"
            >
              {users.map((user) => (
                <MKBox
                  key={user.user_id}
                  bgColor="white"
                  borderRadius="xl"
                  shadow="lg"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  p={3}
                  mx={1}
                  my={1}
                  width="250px"
                  height="150px"
                  onClick={() => handleUserClick(user)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                >
                  <MKTypography variant="h6" color="textPrimary" textAlign="center" p={-5}>
                    Name: {user.fullName}
                  </MKTypography>
                  <MKTypography variant="body2" color="textSecondary" textAlign="center" p={-5}>
                    Skills: {formatArray(user.skills)}
                  </MKTypography>
                  <MKTypography variant="body2" color="textSecondary" textAlign="center" p={-5}>
                    Availability: {formatArray(user.availability)}
                  </MKTypography>
                  <MKTypography variant="body2" color="textSecondary" textAlign="center" p={-5}>
                    Preferences: {user.preferences ? user.preferences : "N/A"}
                  </MKTypography>
                </MKBox>
              ))}
            </MKBox>
          )}

          {/* Collapsible user profiles (Admins) */}
          {showAdmins && (
            <MKBox
              bgColor="white"
              borderRadius="xl"
              shadow="lg"
              display="flex"
              flexDirection="row"
              justifyContent="left"
              mt={3}
              mx={2}
              flexWrap="wrap"
            >
              {admins.map((admin) => (
                <MKBox
                  key={admin.user_id}
                  bgColor="white"
                  borderRadius="xl"
                  shadow="lg"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  p={3}
                  mx={1}
                  my={1}
                  width="250px"
                  height="150px"
                  onClick={() => handleUserClick(admin)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                >
                  <MKTypography variant="h6" color="textPrimary" textAlign="center" p={-5}>
                    Name: {admin.fullName}
                  </MKTypography>
                  <MKTypography variant="body2" color="textSecondary" textAlign="center" p={-5}>
                    Skills: {formatArray(admin.skills)}
                  </MKTypography>
                  <MKTypography variant="body2" color="textSecondary" textAlign="center" p={-5}>
                    Availability: {formatArray(admin.availability)}
                  </MKTypography>
                  <MKTypography variant="body2" color="textSecondary" textAlign="center" p={-5}>
                    Preferences: {admin.preferences ? admin.preferences : "N/A"}
                  </MKTypography>
                </MKBox>
              ))}
            </MKBox>
          )}
        </Container>
      </MKBox>

      {/* Modal for sending a notification */}
      {selectedUser && (
        <Box
          position="fixed"
          top={0}
          left={0}
          width="100%"
          height="100%"
          bgcolor="rgba(0,0,0,0.5)"
          display="flex"
          justifyContent="center"
          alignItems="center"
          zIndex={1200}
          onClick={handleClose}
        >
          <Box
            width="300px"
            bgcolor="white"
            borderRadius="8px"
            p={3}
            onClick={(e) => e.stopPropagation()}
          >
            <MKTypography variant="h6" textAlign="center" mb={2} color="black">
              Send Notification to {selectedUser.fullName}
            </MKTypography>
            <TextField
              fullWidth
              label="Notification Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              multiline
              rows={4}
              variant="outlined"
              InputLabelProps={{
                style: { color: "black" },
              }}
              InputProps={{
                style: { color: "black" },
              }}
              sx={{
                "& .MuiInputLabel-root": {
                  color: "black",
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: "black",
                },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "black",
                  },
                  "&:hover fieldset": {
                    borderColor: "black",
                  },
                },
              }}
            />
            <Button
              fullWidth
              variant="contained"
              color="white"
              sx={{ mt: 2 }}
              onClick={handleSendMessage}
            >
              Send Message
            </Button>
          </Box>
        </Box>
      )}

      <MKBox pt={6} px={1} mt={-1.5}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default Presentation;
