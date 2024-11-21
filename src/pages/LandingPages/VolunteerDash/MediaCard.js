import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";
import hhlogo from "assets/images/hhlogo.png";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom"; // Import useNavigate at the top
import AddCircleIcon from "@mui/icons-material/AddCircle"; // Import the AddCircle icon
import DeleteIcon from "@mui/icons-material/Delete"; // Import the Delete icon

// Function to generate a random color from a list
const getRandomColor = () => {
  const colors = ["#e0f7fa", "#ffccbc", "#e1bee7", "#c8e6c9", "#d1c4e9", "#ffe0b2"];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Component to fetch and render multiple MediaCards
export default function MediaCardList() {
  const [cardsData, setCardsData] = useState([]);
  const hasFetchedData = useRef(false); // Use ref to track if data has been fetched
  const navigate = useNavigate(); // Initialize navigate
  useEffect(() => {
    const volunteerCards = [];
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("volunteer-")) {
        const card = JSON.parse(localStorage.getItem(key));
        volunteerCards.push(card);
      }
    });
    setCardsData(volunteerCards); // Display on Volunteer Dashboard
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (!hasFetchedData.current) {
        // Only fetch data if it hasn't been fetched before
        try {
          const response = await axios.get("http://localhost:5000/api/volunteerdashboard/"); // Fetch data from the API endpoint
          setCardsData(response.data); // Update the state with fetched data
          hasFetchedData.current = true; // Mark data as fetched to prevent re-fetching
        } catch (error) {
          console.error("Error fetching data:", error); // Log error if data fetching fails
          // Use fallback data if fetching fails
          setCardsData([
            {
              EventID: 1,
              image: "",
              eventName: "Test Event 1",
              eventDescription: "This is a test eventDescription for event 1.",
              state: "Test Location 1",
              startTime: "10:00 AM",
              endTime: "12:00 PM",
              requiredSkills: ["Skill A", "Skill B"],
            },
            {
              EventID: 2,
              image: "",
              eventName: "Test Event 2",
              eventDescription: "This is a test eventDescription for event 2.",
              state: "Test Location 2",
              startTime: "2:00 PM",
              endTime: "4:00 PM",
              requiredSkills: ["Skill C", "Skill D"],
            },
            {
              EventID: 3,
              image: "",
              eventName: "Test Event 3",
              eventDescription: "This is a test eventDescription for event 3.",
              state: "Test Location 3",
              startTime: "5:00 PM",
              endTime: "7:00 PM",
              requiredSkills: ["Skill E", "Skill F"],
            },
            {
              EventID: 4,
              image: "",
              eventName: "Test Event 4",
              eventDescription: "This is a test eventDescription for event 4.",
              state: "Test Location 4",
              startTime: "8:00 PM",
              endTime: "10:00 PM",
              requiredSkills: ["Skill G", "Skill H"],
            },
            {
              EventID: 5,
              image: "",
              eventName: "Test Event 5",
              eventDescription: "This is a test eventDescription for event 5.",
              state: "Test Location 5",
              startTime: "8:00 PM",
              endTime: "10:00 PM",
              requiredSkills: ["Skill J", "Skill K"],
            },
          ]);
        } finally {
          hasFetchedData.current = true; // Ensure fallback data is only set once
        }
      }
    }
    fetchData(); // Call the function to fetch data
  }, []); // Empty dependency array to ensure this runs once on mount

  console.log(cardsData);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "16px",
        justifyContent: "flex-start",
      }}
    >
      {cardsData.map((card) => (
        <MediaCard
          key={card.EventID}
          EventID={card.EventID}
          image={card.image}
          eventName={card.eventName}
          eventDescription={card.eventDescription}
          state={card.state}
          startTime={card.startTime}
          endTime={card.endTime}
          requiredSkills={card.requiredSkills}
          setCardsData={setCardsData}
        />
      ))}

      {/* Add Event Card */}
      {/* Add Event Card */}
      <Card
        sx={{
          width: 345,
          height: 350,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "16px",
          boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
          transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
          margin: "16px",
          "&:hover": {
            transform: "scale(1.05)",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
          },
          cursor: "pointer",
        }}
        onClick={() => navigate("/pages/LandingPages/EventDash")} // Navigate directly
      >
        <Typography variant="h6" color="teal">
          Go to Event Dashboard
        </Typography>
        <AddCircleIcon style={{ fontSize: 60, color: "teal" }} />
      </Card>
    </div>
  );
}

function formatTimeToStandard(time) {
  // Split the input string (assuming format "HH:MM:SS")
  const [hours, minutes] = time.split(":");

  // Convert hours from string to number for calculations
  let hour = parseInt(hours, 10);
  const suffix = hour >= 12 ? "PM" : "AM"; // Determine AM/PM

  // Convert hour to 12-hour format
  hour = hour % 12 || 12; // Handle 12 PM and 12 AM correctly

  // Return formatted string
  return `${hour}:${minutes} ${suffix}`;
}

function MediaCard({
  EventID,
  image,
  eventName,
  eventDescription,
  state,
  startTime,
  endTime,
  requiredSkills,
  setCardsData,
}) {
  const randomColor = getRandomColor();
  const navigate = useNavigate(); // Initialize navigate

  // Parse `requiredSkills` if it's a string
  let skillsArray = [];
  if (typeof requiredSkills === "string") {
    try {
      skillsArray = JSON.parse(requiredSkills); // Attempt to parse the string
    } catch (error) {
      console.error("Error parsing requiredSkills:", error);
    }
  } else if (Array.isArray(requiredSkills)) {
    skillsArray = requiredSkills; // If it's already an array, use it directly
  }

  return (
    <Card
      sx={{
        width: 345, // Set a fixed width
        height: 350, // Set a fixed height
        m: 2,
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
        borderRadius: "16px",
        position: "relative",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.1)",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
        },
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // Ensure content is spaced out within the card
      }}
    >
      <div
        style={{
          backgroundColor: randomColor,
          width: "100%",
          height: 140, // Fixed height for the media container
          display: "flex",
          justifyContent: "center",
          alignItems: "center", // Center content vertically
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
        }}
      >
        <CardMedia
          sx={{
            height: "100%", // Make it fill the container height
            objectFit: "contain",
            width: "auto", // Maintain aspect ratio
          }}
          image={image ? image : hhlogo}
          eventName={eventName}
        />
      </div>

      <CardContent sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
        <Typography gutterBottom variant="h5" component="div" noWrap>
          {eventName}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "text.secondary", overflow: "hidden", textOverflow: "ellipsis" }}
          noWrap
        >
          {eventDescription}
        </Typography>
      </CardContent>

      <CardActions
        sx={{
          position: "relative",
          bottom: 0,
          left: 8,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <LocationOnIcon sx={{ fontSize: 18, color: "text.secondary" }} />
        <Typography variant="caption" sx={{ color: "text.secondary", marginRight: "8px" }}>
          {state}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {formatTimeToStandard(startTime)} - {formatTimeToStandard(endTime)}
        </Typography>
      </CardActions>

      <div
        style={{
          marginTop: "10px",
          paddingLeft: "16px",
          paddingBottom: "16px",
          overflow: "hidden",
        }}
      >
        {skillsArray.length > 0 ? (
          skillsArray.map((skill, index) => (
            <Typography
              key={index}
              variant="caption"
              sx={{
                display: "inline-block",
                backgroundColor: randomColor,
                padding: "4px 8px",
                borderRadius: "4px",
                marginRight: "8px",
                marginBottom: "4px",
                color: "#000",
                overflow: "hidden", // Prevent text overflow
                textOverflow: "ellipsis",
              }}
            >
              {skill}
            </Typography>
          ))
        ) : (
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            No skills listed
          </Typography>
        )}
      </div>
      <CardActions
        sx={{
          position: "relative",
          bottom: 0,
          right: 0,
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px", // Space between buttons
          marginRight: 2,
          marginBottom: 1,
        }}
      >
        {/* Add to Volunteer Dashboard Button */}
        <IconButton
          aria-label="navigate-to-eventdashboard"
          color="primary"
          sx={{
            "&:hover": {
              color: "green",
            },
          }}
          onClick={() => {
            // Optionally store data or perform any necessary logic before navigation

            navigate("/pages/LandingPages/EventDash"); // Replace with the actual route for your Event Dashboard
          }}
        >
          <AddCircleIcon />
        </IconButton>
        {/* Delete Button */}
        <IconButton
          aria-label="delete"
          color="error"
          sx={{
            "&:hover": {
              color: "darkred", // Optional: Add hover color change
            },
          }}
          onClick={async () => {
            const confirmed = window.confirm("Are you sure you want to delete this event?");
            if (confirmed) {
              try {
                // Make DELETE request to backend
                await axios.delete(`http://localhost:5000/api/eventdashboard/${EventID}`);
                // Remove the card from the UI
                setCardsData((prevCards) => prevCards.filter((card) => card.EventID !== EventID));
                console.log(`Event deleted: ${eventName}`); // Correctly use backticks for template literal
              } catch (error) {
                console.error("Error deleting event:", error);
              }
            } else {
              console.log("Deletion cancelled");
            }
          }}
        >
          <DeleteIcon />
        </IconButton>
        {/* Add Event Button Styled as a Card */}
      </CardActions>
    </Card>
  );
}

MediaCard.propTypes = {
  EventID: PropTypes.number.isRequired,
  image: PropTypes.string,
  eventName: PropTypes.string,
  eventDescription: PropTypes.string,
  state: PropTypes.string,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  requiredSkills: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.string), PropTypes.string]),
  setCardsData: PropTypes.func.isRequired,
};
