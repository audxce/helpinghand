import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import {
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios"; // Import axios for making HTTP requests
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import { DataGrid } from "@mui/x-data-grid"; // Import DataGrid

import bgImage from "assets/images/hh-bg.jpg"; // Background image import

const VolunteerHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [volunteerData, setVolunteerData] = useState([]);
  const [openDescriptionDialog, setOpenDescriptionDialog] = useState(false); // State for opening/closing description dialog
  const [openSkillsDialog, setOpenSkillsDialog] = useState(false); // State for opening/closing skills dialog
  const [selectedDescription, setSelectedDescription] = useState(""); // To hold selected description
  const [selectedSkills, setSelectedSkills] = useState([]); // To hold selected skills

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  // Filter the data based on the search query
  const filteredData = volunteerData.filter((row) =>
    row.volunteer_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define columns for the DataGrid
  const columns = [
    { field: "volunteer_name", headerName: "Volunteer Name", width: 180 },
    { field: "event_name", headerName: "Event Name", width: 180 },
    {
      field: "event_date",
      headerName: "Event Date",
      width: 180,
      renderCell: (params) =>
        isValidDate(params.value) ? new Date(params.value).toLocaleDateString() : "Invalid Date",
    },
    { field: "participation_status", headerName: "Status", width: 130 },
    { field: "duration_hours", headerName: "Duration (Hours)", width: 180 },
    { field: "location", headerName: "Location", width: 180 },
    {
      field: "required_skills",
      headerName: "Required Skills",
      width: 200,
      renderCell: (params) => (
        <span
          style={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={() => handleOpenSkillsDialog(params.value)}
        >
          {params.value.length > 30
            ? `${params.value.slice(0, 30).join(", ")}...`
            : params.value.join(", ")}
        </span>
      ),
    },
    { field: "urgency", headerName: "Urgency", width: 130 },
    {
      field: "event_description",
      headerName: "Description",
      width: 250,
      renderCell: (params) => (
        <span
          style={{
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            overflow: "hidden",
            cursor: "pointer",
          }}
          onClick={() => handleOpenDescriptionDialog(params.value)}
        >
          {params.value.length > 30 ? `${params.value.slice(0, 30)}...` : params.value}
        </span>
      ),
    },
  ];

  // Convert filtered data to rows for DataGrid
  const rows = filteredData.map((row) => ({
    id: row.volunteer_history_id,
    volunteer_name: row.volunteer_name,
    event_name: row.event_name,
    event_date: row.event_date,
    participation_status: row.participation_status,
    duration_hours: row.duration_hours,
    location: row.location,
    required_skills: row.required_skills,
    urgency: row.urgency,
    event_description: row.event_description,
  }));

  const handleOpenDescriptionDialog = (description) => {
    setSelectedDescription(description); // Set selected description
    setOpenDescriptionDialog(true); // Open the description dialog
  };

  const handleCloseDescriptionDialog = () => {
    setOpenDescriptionDialog(false); // Close the description dialog
  };

  const handleOpenSkillsDialog = (skills) => {
    setSelectedSkills(skills); // Set selected skills
    setOpenSkillsDialog(true); // Open the skills dialog
  };

  const handleCloseSkillsDialog = () => {
    setOpenSkillsDialog(false); // Close the skills dialog
  };

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
    <MKBox
      component="section"
      py={12}
      sx={{
        position: "relative", // Ensures proper layering
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh", // Ensures the background spans the full height of the viewport
        overflow: "hidden", // Prevents content from spilling
      }}
    >
      <Container>
        <MKBox
          p={3}
          borderRadius="lg"
          shadow="lg"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.8)", // Slightly transparent white box
            border: "1px solid #ddd",
          }}
        >
          <Grid container spacing={3} textAlign="center">
            <Grid item xs={12}>
              <MKTypography variant="h3" mb={2}>
                Volunteer History
              </MKTypography>
            </Grid>
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
              <div style={{ height: 400, width: "100%" }}>
                <DataGrid
                  rows={rows}
                  columns={columns}
                  pageSize={5} // You can adjust this for pagination
                  rowsPerPageOptions={[5]} // This adds pagination controls
                  checkboxSelection // Adds checkboxes to rows
                />
              </div>
            </Grid>
          </Grid>
        </MKBox>
      </Container>

      {/* Dialog to show full description */}
      <Dialog
        open={openDescriptionDialog}
        onClose={handleCloseDescriptionDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Full Description</DialogTitle>
        <DialogContent>
          <MKTypography variant="body1">{selectedDescription}</MKTypography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDescriptionDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog to show full skills */}
      <Dialog open={openSkillsDialog} onClose={handleCloseSkillsDialog} maxWidth="md" fullWidth>
        <DialogTitle>Required Skills</DialogTitle>
        <DialogContent>
          <MKTypography variant="body1">{selectedSkills.join(", ")}</MKTypography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSkillsDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </MKBox>
  );
};

export default VolunteerHistory;
