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

// Function to generate a random color from a list
const getRandomColor = () => {
  const colors = ["#e0f7fa", "#ffccbc", "#e1bee7", "#c8e6c9", "#d1c4e9", "#ffe0b2"];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Component to fetch and render multiple MediaCards
export default function MediaCardList() {
  const [cardsData, setCardsData] = useState([]);
  const hasFetchedData = useRef(false); // Use ref to track if data has been fetched

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
              id: 1,
              image: "",
              title: "Test Event 1",
              description: "This is a test description for event 1.",
              location: "Test Location 1",
              startTime: "10:00 AM",
              endTime: "12:00 PM",
              skills: ["Skill A", "Skill B"],
            },
            {
              id: 2,
              image: "",
              title: "Test Event 2",
              description: "This is a test description for event 2.",
              location: "Test Location 2",
              startTime: "2:00 PM",
              endTime: "4:00 PM",
              skills: ["Skill C", "Skill D"],
            },
            {
              id: 3,
              image: "",
              title: "Test Event 3",
              description: "This is a test description for event 3.",
              location: "Test Location 3",
              startTime: "5:00 PM",
              endTime: "7:00 PM",
              skills: ["Skill E", "Skill F"],
            },
            {
              id: 4,
              image: "",
              title: "Test Event 4",
              description: "This is a test description for event 4.",
              location: "Test Location 4",
              startTime: "8:00 PM",
              endTime: "10:00 PM",
              skills: ["Skill G", "Skill H"],
            },
            {
              id: 5,
              image: "",
              title: "Test Event 5",
              description: "This is a test description for event 5.",
              location: "Test Location 5",
              startTime: "8:00 PM",
              endTime: "10:00 PM",
              skills: ["Skill J", "Skill K"],
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
          key={card.id}
          image={card.image}
          title={card.title}
          description={card.description}
          location={card.location}
          startTime={card.startTime}
          endTime={card.endTime}
          skills={card.skills}
        />
      ))}
    </div>
  );
}

function MediaCard({ image, title, description, location, startTime, endTime, skills }) {
  const randomColor = getRandomColor();

  return (
    <Card
      sx={{
        flexGrow: 0,
        maxWidth: 345,
        m: 2,
        boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.5)",
        borderRadius: "16px",
        position: "relative",
        transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.1)",
          boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.3)",
        },
      }}
    >
      <div
        style={{
          backgroundColor: randomColor,
          width: "100%",
          display: "flex",
          justifyContent: "center",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          borderBottomLeftRadius: "0px",
          borderBottomRightRadius: "0px",
        }}
      >
        <CardMedia
          sx={{
            height: 140,
            objectFit: "scale-down",
            width: "50%",
            alignSelf: "center",
          }}
          image={image ? image : hhlogo}
          title={title}
        />
      </div>

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {title}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {description}
        </Typography>
      </CardContent>

      <CardActions
        sx={{
          position: "absolute",
          bottom: 48,
          left: 8,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        <LocationOnIcon sx={{ fontSize: 18, color: "text.secondary" }} />
        <Typography variant="caption" sx={{ color: "text.secondary", marginRight: "8px" }}>
          {location}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {startTime} - {endTime}
        </Typography>
      </CardActions>

      <div style={{ marginTop: "10px", paddingLeft: "16px", paddingBottom: "16px" }}>
        {skills &&
          skills.map((skill, index) => (
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
              }}
            >
              {skill}
            </Typography>
          ))}
      </div>
    </Card>
  );
}

MediaCard.propTypes = {
  image: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  location: PropTypes.string,
  startTime: PropTypes.string,
  endTime: PropTypes.string,
  skills: PropTypes.arrayOf(PropTypes.string),
};
