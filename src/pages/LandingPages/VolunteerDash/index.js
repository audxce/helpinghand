import * as React from "react";
import MediaCard from "./MediaCard"; // Assuming MediaCard is defined in a separate file
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
import routes from "routes.volunteer";

// Images
import bgImage from "assets/images/hh-bg.jpg";
import hhlogo from "assets/images/hhlogo.png";

function Presentation() {
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
          display: "flex",
          placeItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
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
              Let&apos;s make the world a better place
            </MKTypography>
          </Grid>
        </Container>
      </MKBox>
      <MKBox
        id="events-section"
        bgColor="white"
        shadow="lg"
        display="flex"
        flexDirection="row"
        justifyContent="left"
        mb={{ xs: 20, sm: 18, md: 20 }}
        width="100%" // Fills the width of the parent container
        height="100%"
      >
        {/* Replace event boxes with MediaCard components */}
        <MediaCard />
        <MediaCard />
      </MKBox>
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default Presentation;