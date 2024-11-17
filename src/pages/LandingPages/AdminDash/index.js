import React, { useEffect, useState } from "react";
// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";

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

// Fetch active events function (assuming the backend is set up)
async function fetchActiveEvents() {
  try {
    const response = await axios.get("http://localhost:5000/api/event/active");

    const data = response.data;

    return data;
  } catch (error) {
    // Log any errors encountered
    console.error("Error fetching active events:", error);

    return [];
  }
}
function Presentation() {
  const [events, setEvents] = useState([]);

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

  useEffect(() => {
    fetchActiveEvents().then((data) => {
      setEvents(data);
    });
  }, []);

  return (
    <>
      <DefaultNavbar routes={routes} />
      <MKBox
        minHeight="75vh"
        width="100%"
        sx={{
          backgroundImage: `url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "top",
          display: "grid",
          placeItems: "center",
        }}
      >
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

          {/* Display each active event */}
          <MKBox
            bgColor="white"
            borderRadius="xl"
            shadow="lg"
            display="flex"
            flexDirection="row"
            justifyContent="left"
            mt={{ xs: 20, sm: 18, md: 5 }}
            mb={{ xs: 20, sm: 18, md: -10 }}
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
        </Container>
      </MKBox>
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default Presentation;
