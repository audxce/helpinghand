import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import bgImage from "assets/images/hh-bg.jpg";
import hhlogo from "assets/images/hhlogo.png";
import axios from "axios";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import DefaultFooter from "examples/Footers/SimpleFooter";
import NewNavbar from "examples/Navbars/DefaultNavbar/index2";
import footerRoutes from "footer.routes";
import { useEffect, useRef, useState } from "react";
import routes from "routes.volunteer";
import MediaCardList from "./MediaCard"; // Import MediaCardList component

function Presentation() {
  const [cardsData, setCardsData] = useState([]);
  const hasFetchedData = useRef(false);

  useEffect(() => {
    async function fetchData() {
      if (!hasFetchedData.current) {
        try {
          const response = await axios.get("http://localhost:5000/api/volunteerdashboard/");
          setCardsData(response.data);
          hasFetchedData.current = true;
        } catch (error) {
          console.error("Error fetching data:", error);
          // Fallback data
          setCardsData([
            {
              id: 1,
              image: "",
              title: "Test Event 1",
              description: "This is a test description for event 1.",
              location: "Test Location 1",
              startTime: "10:00 AM",
              endTime: "12:00 PM",
              requiredSkills: ["Skill A", "Skill B"],
            },
            // Add other fallback data as needed
          ]);
        }
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <NewNavbar routes={routes} />
      <MKBox
        minHeight="75vh"
        width="100%"
        sx={{
          backgroundImage: `url(${bgImage})`,
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
        <MKBox
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="flex-start"
          mb={2}
        >
          <MKTypography variant="h4" color="textPrimary" ml={1}>
            Your Dashboard
          </MKTypography>
        </MKBox>

        <MediaCardList cardsData={cardsData} setCardsData={setCardsData} />
      </MKBox>

      <MKBox pt={6} px={1} mt={6}>
        <DefaultFooter content={footerRoutes} />
      </MKBox>
    </>
  );
}

export default Presentation;
