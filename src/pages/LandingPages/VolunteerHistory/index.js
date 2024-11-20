import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import { useEffect, useState } from "react";

import bgImage from "assets/images/hh-bg.jpg";

const VolunteerHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [volunteerData, setVolunteerData] = useState([]);
  const [openDescriptionDialog, setOpenDescriptionDialog] = useState(false);
  const [openSkillsDialog, setOpenSkillsDialog] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const filteredData = volunteerData.filter((row) =>
    row.volunteer_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      renderCell: (params) => {
        const skills = Array.isArray(params.value) ? params.value : [];
        return (
          <span
            style={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              cursor: "pointer",
            }}
            onClick={() => handleOpenSkillsDialog(skills)}
          >
            {skills.length > 30 ? `${skills.slice(0, 30).join(", ")}...` : skills.join(", ")}
          </span>
        );
      },
    },
    { field: "urgency", headerName: "Urgency", width: 130 },
    {
      field: "event_description",
      headerName: "Description",
      width: 250,
      renderCell: (params) => {
        const description = params.value || "";
        return (
          <span
            style={{
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              overflow: "hidden",
              cursor: "pointer",
            }}
            onClick={() => handleOpenDescriptionDialog(description)}
          >
            {description.length > 30 ? `${description.slice(0, 30)}...` : description}
          </span>
        );
      },
    },
  ];

  const rows = filteredData.map((row) => ({
    id: row.volunteer_history_id || "",
    volunteer_name: row.volunteer_name || "",
    event_name: row.event_name || "",
    event_date: row.event_date || "",
    participation_status: row.participation_status || "",
    duration_hours: row.duration_hours || "",
    location: row.location || "",
    required_skills: Array.isArray(row.required_skills) ? row.required_skills : [],
    urgency: row.urgency || "",
    event_description: row.event_description || "",
  }));

  const handleOpenDescriptionDialog = (description) => {
    setSelectedDescription(description);
    setOpenDescriptionDialog(true);
  };

  const handleCloseDescriptionDialog = () => {
    setOpenDescriptionDialog(false);
  };

  const handleOpenSkillsDialog = (skills) => {
    setSelectedSkills(skills);
    setOpenSkillsDialog(true);
  };

  const handleCloseSkillsDialog = () => {
    setOpenSkillsDialog(false);
  };

  const handleDownloadPDF = () => {
    fetch("http://localhost:5000/api/volunteerHistoryPDF", { method: "GET" })
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "volunteer_history.pdf";
        link.click();
      })
      .catch((error) => console.error("Error downloading PDF:", error));
  };

  const handleDownloadCSV = () => {
    const headers = [
      "Volunteer Name",
      "Event Name",
      "Event Date",
      "Status",
      "Duration (Hours)",
      "Location",
      "Required Skills",
      "Urgency",
      "Description",
    ];

    const csvRows = filteredData.map((row) => [
      row.volunteer_name,
      row.event_name,
      isValidDate(row.event_date) ? new Date(row.event_date).toLocaleDateString() : "Invalid Date",
      row.participation_status,
      row.duration_hours,
      row.location,
      Array.isArray(row.required_skills) ? row.required_skills.join(", ") : "",
      row.urgency,
      row.event_description,
    ]);

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += headers.join(",") + "\n";
    csvRows.forEach((row) => {
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "volunteer_history.csv");
    link.click();
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
        position: "relative",
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Container>
        <MKBox
          p={3}
          borderRadius="lg"
          shadow="lg"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.8)",
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
                  pageSize={5}
                  rowsPerPageOptions={[5]}
                  checkboxSelection
                />
              </div>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={3} justifyContent="center">
                <Grid item xs={6}>
                  <Button variant="gradient" color="dark" onClick={handleDownloadPDF} fullWidth>
                    Download PDF
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button variant="gradient" color="dark" onClick={handleDownloadCSV} fullWidth>
                    Download CSV
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MKBox>
      </Container>

      <Dialog open={openDescriptionDialog} onClose={handleCloseDescriptionDialog}>
        <DialogTitle>Event Description</DialogTitle>
        <DialogContent>
          <p>{selectedDescription}</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDescriptionDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openSkillsDialog} onClose={handleCloseSkillsDialog}>
        <DialogTitle>Required Skills</DialogTitle>
        <DialogContent>
          <ul>
            {selectedSkills.map((skill, index) => (
              <li key={index}>{skill}</li>
            ))}
          </ul>
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
