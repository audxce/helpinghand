// Import necessary modules
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
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";

const VolunteerHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [volunteerData, setVolunteerData] = useState([]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  // Filter the data based on the search query
  const filteredData = volunteerData.filter((row) => {
    const nameMatch = row.volunteer_name.toLowerCase().includes(searchQuery.toLowerCase());
    return nameMatch;
  });

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

  return (
    <MKBox component="section" py={12}>
      <Container>
        <Grid container>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              placeholder="Search by Volunteer Name"
              value={searchQuery}
              onChange={handleSearchChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Volunteer Name</TableCell>
                    <TableCell>Event Name</TableCell>
                    <TableCell>Event Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Duration (Hours)</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Required Skills</TableCell>
                    <TableCell>Urgency</TableCell>
                    <TableCell>Description</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((row) => (
                    <TableRow key={row.volunteer_history_id}>
                      <TableCell>{row.volunteer_name}</TableCell>
                      <TableCell>{row.event_name}</TableCell>
                      <TableCell>{new Date(row.event_date).toLocaleDateString()}</TableCell>
                      <TableCell>{row.participation_status}</TableCell>
                      <TableCell>{row.duration_hours}</TableCell>
                      <TableCell>{row.location}</TableCell>
                      <TableCell>{row.required_skills.join(", ")}</TableCell>{" "}
                      {/* Render skills as a comma-separated list */}
                      <TableCell>{row.urgency}</TableCell>
                      <TableCell>{row.event_description}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Container>
    </MKBox>
  );
};

export default VolunteerHistory;
