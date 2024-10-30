// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from "@mui/material";
import axios from "axios"; // Import axios for making HTTP requests

// Material Kit 2 React components
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

const VolunteerHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [volunteerData, setVolunteerData] = useState([]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const MAX_NAME_LENGTH = 50;
  const MAX_EVENT_LENGTH = 100;

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const filteredData = volunteerData.filter(
    (row) =>
      row.name &&
      row.event &&
      row.name.length <= MAX_NAME_LENGTH &&
      row.event.length <= MAX_EVENT_LENGTH &&
      (typeof row.duration === "number" || row.duration === "-") &&
      isValidDate(row.date) &&
      row.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const fetchVolunteerHistory = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/volunteerHistory");
        setVolunteerData(response.data);
      } catch (error) {
        console.error("Error fetching volunteer history:", error);
      }
    };

    fetchVolunteerHistory();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    // You can add any additional logic for form submission if needed
  };

  return (
    <MKBox component="section" py={12}>
      <Container>
        <Grid container item justifyContent="center" xs={10} lg={7} mx="auto" textAlign="center">
          <MKTypography variant="h3" mb={1}>
            Volunteer History
          </MKTypography>
        </Grid>

        <Grid container item xs={12} lg={7} sx={{ mx: "auto" }}>
          <MKBox width="100%" component="form" autoComplete="off" onSubmit={handleSubmit}>
            <MKBox p={3}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <MKTypography variant="h6">Volunteer Name</MKTypography>
                  <TextField
                    fullWidth
                    variant="standard"
                    placeholder="Search by Volunteer Name"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </Grid>
              </Grid>
            </MKBox>
          </MKBox>
        </Grid>

        <Grid container item xs={12} lg={8.5} sx={{ mx: "auto", mt: 4 }}>
          <TableContainer component={Paper}>
            <Table sx={{ tableLayout: "fixed", width: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell>Volunteer Name</TableCell>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Participation Status</TableCell>
                  <TableCell>Duration (Hours)</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Required Skills</TableCell>
                  <TableCell>Urgency</TableCell>
                  <TableCell>Event Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ minWidth: "150px" }}>{row.name}</TableCell>
                    <TableCell style={{ minWidth: "150px" }}>{row.event}</TableCell>
                    <TableCell style={{ minWidth: "150px" }}>{row.date}</TableCell>
                    <TableCell style={{ minWidth: "150px" }}>{row.status}</TableCell>
                    <TableCell style={{ minWidth: "150px" }}>{row.duration}</TableCell>
                    <TableCell style={{ minWidth: "150px" }}>{row.location}</TableCell>
                    <TableCell style={{ minWidth: "150px" }}>{row.skills}</TableCell>
                    <TableCell style={{ minWidth: "150px" }}>{row.urgency}</TableCell>
                    <TableCell style={{ minWidth: "150px" }}>{row.description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Container>
    </MKBox>
  );
};

export default VolunteerHistory;
