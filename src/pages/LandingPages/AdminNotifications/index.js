import axios from "axios";
import MKBox from "components/MKBox";
import MKButton from "components/MKButton";
import MKInput from "components/MKInput";
import MKTypography from "components/MKTypography";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

function NotificationPage() {
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("general");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const navigate = useNavigate();

  // Fetch available events for event notifications
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events"); // Adjust route if needed
        setEvents(
          response.data.map((event) => ({
            value: event.eventId,
            label: event.eventName,
          }))
        );
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        message,
        msgtype: msgType,
        ...(msgType === "event" && { eventId: selectedEvent?.value }),
      };

      await axios.post("http://localhost:5000/api/notifications", payload, {
        withCredentials: true,
      });

      alert("Notification sent successfully!");
      setMessage("");
      setMsgType("general");
      setSelectedEvent(null);
    } catch (error) {
      console.error("Error sending notification:", error.response?.data || error.message);
      alert("Failed to send notification.");
    }
  };

  //const navigate = useNavigate(); // Initialize navigate

  return (
    <MKBox
      bgColor="white"
      borderRadius="xl"
      shadow="lg"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      p={3}
      mx={10}
      mt={5}
    >
      <MKTypography variant="h4" fontWeight="bold" mb={3}>
        Send Notifications
      </MKTypography>

      <MKBox component="form" onSubmit={handleSubmit}>
        {/* Message Input */}
        <MKBox mb={3}>
          <MKTypography variant="body2" color="text">
            Message
          </MKTypography>
          <MKInput
            type="text"
            placeholder="Enter your notification message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </MKBox>

        {/* Notification Type */}
        <MKBox mb={3}>
          <MKTypography variant="body2" color="text">
            Notification Type
          </MKTypography>
          <Select
            options={[
              { value: "general", label: "General" },
              { value: "event", label: "Event" },
            ]}
            value={{ value: msgType, label: msgType.charAt(0).toUpperCase() + msgType.slice(1) }}
            onChange={(selected) => setMsgType(selected.value)}
            placeholder="Select Notification Type"
          />
        </MKBox>

        {/* Event Selector (only visible for event notifications) */}
        {msgType === "event" && (
          <MKBox mb={3}>
            <MKTypography variant="body2" color="text">
              Select Event
            </MKTypography>
            <Select
              options={events}
              value={selectedEvent}
              onChange={(selected) => setSelectedEvent(selected)}
              placeholder="Select Event"
            />
          </MKBox>
        )}

        {/* Submit Button */}
        <MKBox mt={4} textAlign="center">
          <MKButton type="submit" variant="gradient" color="info">
            Send Notification
          </MKButton>
        </MKBox>
      </MKBox>

      <MKBox mt={4} textAlign="center">
        <MKButton
          color="secondary"
          onClick={() => navigate("/pages/LandingPages/AdminDash")} // Adjust the route as needed
        >
          Return to Home
        </MKButton>
      </MKBox>
    </MKBox>
  );
}

export default NotificationPage;
