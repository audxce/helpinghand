import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import bgImage from "assets/images/hh-bg.jpg";
import hhlogo from "assets/images/hhlogo.png";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import DefaultFooter from "examples/Footers/SimpleFooter";
import NewNavbar from "examples/Navbars/DefaultNavbar/index2";
import footerRoutes from "footer.routes";
import { useState } from "react";
import routes from "routes.eventdash";
import MediaCardList from "./MediaCard"; // Import MediaCardList component

function Presentation() {
  const [cardsData, setCardsData] = useState([]);

  return (
    <>
      <NewNavbar routes={routes} />
      <MKBox
        minHeight="75vh"
        width="100%"
        sx={{
          backgroundImage: `url(${bgImage})`, // Use backticks and wrap in curly braces
          backgroundSize: "cover",
          backgroundPosition: "top",
          backgroundAttachment: "fixed",
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
            <MKTypography variant="h1" color="dark gray" mt={-6} mb={1}>
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
        flexDirection="column"
        justifyContent="left"
        mb={{ xs: 20, sm: 18, md: 20 }}
        width="100%"
        height="100%"
        p={5}
      >
        <MKTypography variant="h4" color="textPrimary" mb={2}>
          Upcoming Events
        </MKTypography>
        <MediaCardList cardsData={cardsData} setCardsData={setCardsData} />
      </MKBox>
      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default Presentation;
