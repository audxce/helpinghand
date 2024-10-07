// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useState } from "react"; // Import useState

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKTypography from "components/MKTypography";

function VolunteerForms() {
  const [volunteerName, setVolunteerName] = useState("");
  const [eventName, setEventName] = useState("");

  const handleVolunteerNameChange = (event) => {
    setVolunteerName(event.target.value);
  };

  const handleEventNameChange = (event) => {
    setEventName(event.target.value);
  };

  return (
    <MKBox component="section" py={12}>
      <Container>
        <Grid container item justifyContent="center" xs={10} lg={7} mx="auto" textAlign="center">
          <MKTypography variant="h3" mb={1}>
            Volunteer Matching Form
          </MKTypography>
        </Grid>
        <Grid container item xs={12} lg={7} sx={{ mx: "auto" }}>
          <MKBox width="100%" component="form" method="post" autoComplete="off">
            <MKBox p={3}>
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
              <Grid container item justifyContent="center" xs={12} my={30}>
                <MKButton type="submit" variant="gradient" color="dark" fullWidth>
                  Match
                </MKButton>
              </Grid>
            </MKBox>
          </MKBox>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default VolunteerForms;
