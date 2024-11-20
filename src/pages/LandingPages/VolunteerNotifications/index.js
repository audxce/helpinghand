import DeleteIcon from "@mui/icons-material/Delete"; // Import the delete icon
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Backdrop } from "@mui/material";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import axios from "axios";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import { useEffect, useState } from "react";

function NotificationSystem() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/notifications", {
          withCredentials: true,
        });

        const transformedNotifications = response.data.map((notification) => ({
          id: notification.notificationId,
          message: notification.message,
          timestamp: notification.msgtimestamp,
          type: notification.msgtype,
          read: notification.readmsg === 1, // Map `readmsg` to `read`
        }));

        setNotifications(transformedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const markAllAsRead = async () => {
    try {
      await axios.put(
        "http://localhost:5000/api/notifications/mark-all-read",
        {},
        { withCredentials: true }
      );

      // Update the local state to mark all notifications as read
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error("Error marking notifications as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`http://localhost:5000/api/notifications/${notificationId}`, {
        withCredentials: true,
      });

      // Remove the deleted notification from the local state
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.id !== notificationId)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 6,
    borderRadius: 2,
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={unreadCount > 0 ? unreadCount : null} color="error">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: "rgba(0, 0, 0, 0.5)" },
        }}
      >
        <Box sx={modalStyle}>
          {notifications.length === 0 ? (
            <MKTypography variant="body2">No notifications available</MKTypography>
          ) : (
            notifications.map((notification, index) => (
              <Box
                key={notification.id}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={index < notifications.length - 1 ? 2 : 0}
              >
                <MKTypography variant="button" fontWeight={notification.read ? "regular" : "bold"}>
                  {notification.message}
                </MKTypography>
                <IconButton
                  aria-label="delete"
                  onClick={() => deleteNotification(notification.id)}
                  size="small"
                  sx={{ color: "red" }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))
          )}
          <MKBox display="flex" justifyContent="flex-end" sx={{ mt: 2 }}>
            <MKTypography variant="button" sx={{ cursor: "pointer" }} onClick={markAllAsRead}>
              Mark all as read
            </MKTypography>
          </MKBox>
        </Box>
      </Modal>
    </>
  );
}

export default NotificationSystem;
