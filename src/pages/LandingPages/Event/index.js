import { useState } from "react";

// @mui material components
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import Icon from "@mui/material/Icon";
import MKButton from "components/MKButton";
import MKBox from "components/MKBox";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import Select from "@mui/material/Select";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";

// For date picker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const skillsOptions = ["Leadership", "Teamwork", "Communication", "Problem-Solving", "Technical"];

const timeOptions = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

function Event() {
  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
    location: "",
    requiredSkills: [],
    urgency: "",
    eventDate: new Date(),
    startTime: "10:00 AM", // Default start time
    endTime: "1:00 PM", // Default end time
    repeatEvent: "Daily", // Default repeatability
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      eventDate: date,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  const handleSkillChange = (e, skill) => {
    if (e.target.checked) {
      // Add the skill to the selected skills
      setFormData({
        ...formData,
        requiredSkills: [...formData.requiredSkills, skill],
      });
    } else {
      // Remove the skill from the selected skills
      setFormData({
        ...formData,
        requiredSkills: formData.requiredSkills.filter((s) => s !== skill),
      });
    }
  };

  return (
    <MKBox component="section" py={12}>
      <Container>
        <Grid container item justifyContent="center" xs={10} lg={7} mx="auto" textAlign="center">
          <MKTypography variant="h3" mb={3}>
            Event Management Form
          </MKTypography>
          <MKTypography variant="body1" mb={5} color="textSecondary" sx={{ opacity: 0.7 }}>
            Please fill out the form below to create a new event. All fields are required.
          </MKTypography>
        </Grid>

        <Grid container item xs={12} lg={7} sx={{ mx: "auto" }}>
          <MKBox
            width="100%"
            component="form"
            method="post"
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{
              borderRadius: "16px", // Adds rounded corners
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)", // Adds shadow for card effect
              padding: "24px", // Adds internal padding to the form
              backgroundColor: "white", // Sets the background color to white
            }}
          >
            <MKBox p={3}>
              <Grid container spacing={3}>
                {/* Event Name */}
                <Grid item xs={12}>
                  <MKInput
                    variant="standard"
                    label="Event Name"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    inputProps={{ maxLength: 100 }}
                    required
                    fullWidth
                    sx={{
                      "&:focus": {
                        borderColor: "blue",
                        boxShadow: "0 0 0 2px rgba(33, 150, 243, 0.2)",
                      },
                    }}
                  />
                </Grid>

                {/* Event Description */}
                <Grid item xs={12}>
                  <MKInput
                    variant="standard"
                    label="Event Description"
                    name="eventDescription"
                    value={formData.eventDescription}
                    onChange={handleChange}
                    multiline
                    rows={4}
                    required
                    fullWidth
                  />
                </Grid>

                {/* Location */}
                <Grid item xs={12}>
                  <MKInput
                    variant="standard"
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    fullWidth
                  />
                </Grid>

                <Grid item xs={10}>
                  {/* Date Picker with adjusted font size */}
                  <label style={{ fontSize: "20px", marginBottom: "8px", display: "block" }}>
                    Date
                  </label>
                  <MKBox
                    sx={{
                      borderRadius: "10px",
                      padding: "1px",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <DatePicker
                      selected={formData.eventDate}
                      onChange={handleDateChange}
                      required
                      fullWidth
                      style={{ border: "none", width: "100%", fontSize: "16px" }} // Adjust font size here
                    />
                  </MKBox>
                </Grid>

                {/* Time and Repeatability */}
                <Grid container item xs={12} spacing={2} alignItems="center">
                  {/* Start Time */}
                  <Grid item>
                    <Select
                      name="startTime"
                      value={formData.startTime}
                      onChange={handleChange}
                      sx={{
                        border: "none",
                        backgroundColor: "transparent",
                        width: "80px", // Compact width for time picker
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                        "&:focus": { outline: "none" },
                        textAlign: "center", // Center the text inside the dropdown
                      }}
                    >
                      {timeOptions.map((time) => (
                        <MenuItem key={time} value={time}>
                          {time}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>

                  {/* Dash */}
                  <Grid item>
                    <MKTypography variant="body1" sx={{ mx: 1 }}>
                      -
                    </MKTypography>
                  </Grid>

                  {/* End Time */}
                  <Grid item>
                    <Select
                      name="endTime"
                      value={formData.endTime}
                      onChange={handleChange}
                      sx={{
                        border: "none",
                        backgroundColor: "transparent",
                        width: "80px", // Compact width for time picker
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                        "&:focus": { outline: "none" },
                        textAlign: "center", // Center the text inside the dropdown
                      }}
                    >
                      {timeOptions.map((time) => (
                        <MenuItem key={time} value={time}>
                          {time}
                        </MenuItem>
                      ))}
                    </Select>
                  </Grid>

                  {/* Repeatability Dropdown */}
                  <Grid item>
                    <Select
                      name="repeatEvent"
                      value={formData.repeatEvent}
                      onChange={handleChange}
                      displayEmpty
                      IconComponent={() => <Icon>expand_more</Icon>}
                      sx={{
                        backgroundColor: "transparent",
                        border: "none",
                        width: "100px", // Compact width for repeatability
                        "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                        "&:focus": { outline: "none" },
                      }}
                    >
                      <MenuItem value="" disabled>
                        Select Repeatability
                      </MenuItem>
                      <MenuItem value="None">None</MenuItem>
                      <MenuItem value="Daily">Daily</MenuItem>
                      <MenuItem value="Weekly">Weekly</MenuItem>
                      <MenuItem value="Monthly">Monthly</MenuItem>
                    </Select>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <MKTypography variant="body1" sx={{ marginBottom: "8px" }}>
                    Required Skills
                  </MKTypography>

                  <FormGroup>
                    {skillsOptions.map((skill) => (
                      <FormControlLabel
                        key={skill}
                        control={
                          <Checkbox
                            checked={formData.requiredSkills.includes(skill)}
                            onChange={(e) => handleSkillChange(e, skill)}
                            name={skill}
                            sx={{
                              "& .MuiSvgIcon-root": {
                                fontSize: 28, // Increases size of the checkbox (to give the illusion of a thicker border)
                                border: "2px solid rgba(0, 0, 0, 0.54)", // Adds a thicker border
                                borderRadius: "4px", // Optional: Adds rounded corners
                              },
                              "&:hover .MuiSvgIcon-root": {
                                borderColor: "rgba(0, 0, 0, 0.8)", // Darker border on hover
                              },
                            }}
                          />
                        }
                        label={skill}
                      />
                    ))}
                  </FormGroup>
                </Grid>

                <Grid item xs={3}>
                  <Select
                    name="urgency"
                    value={formData.urgency}
                    displayEmpty
                    fullWidth
                    IconComponent={() => <Icon>expand_more</Icon>} // Adding the arrow icon here
                    sx={{
                      backgroundColor: "transparent",
                      border: "none",
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                      "&:focus": { outline: "none" },
                    }}
                  >
                    <MenuItem value="" disabled>
                      Urgency
                    </MenuItem>
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </Grid>
              </Grid>

              <MKBox display="flex" justifyContent="flex-end" alignItems="center" mt={3}>
                {/* Cancel Button without border */}
                <MKButton
                  variant="outlined"
                  color="secondary"
                  sx={{
                    border: "none", // Remove the border
                    "&:hover": {
                      border: "none", // Ensure no border on hover
                      backgroundColor: "rgba(0, 0, 0, 0.1)", // Optional: Add a subtle hover effect
                    },
                    marginRight: 2,
                    "&:focus": {
                      outline: "none", // Remove the focus outline
                    },
                  }}
                >
                  Cancel
                </MKButton>

                {/* Create Event Button */}
                <MKButton type="submit" variant="gradient" color="info">
                  Create Event
                </MKButton>
              </MKBox>
            </MKBox>
          </MKBox>
        </Grid>
      </Container>
    </MKBox>
  );
}

export default Event;