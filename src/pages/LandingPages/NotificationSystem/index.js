import NotificationsIcon from "@mui/icons-material/Notifications";
import { Backdrop } from "@mui/material";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Modal from "@mui/material/Modal";
import MKBox from "components/MKBox";
import MKTypography from "components/MKTypography";
import { useState } from "react";

function NotificationSystem() {
  // Sample notifications
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New event assignment", read: false },
    { id: 2, message: "Reminder: Meeting at 3 PM", read: false },
    { id: 3, message: "Update: Event postponed", read: true }, // Read notification
  ]);

  // To handle opening the notification modal
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Mark notifications as read
  const markAllAsRead = () => {
    setNotifications((prevNotifications) => prevNotifications.map((n) => ({ ...n, read: true })));
    handleClose();
  };

  // Count unread notifications
  const unreadCount = notifications.filter((n) => !n.read).length;

  // Style for the modal pop-up box
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
      {/* Notification Bell with Badge */}
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge
          badgeContent={unreadCount > 0 ? " " : null} // Show red dot if there are unread notifications
          color="error"
          variant={unreadCount > 0 ? "dot" : null} // Red dot disappears when unreadCount is 0
        >
          <NotificationsIcon />
        </Badge>
      </IconButton>

      {/* Modal Pop-Up for Notifications */}
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: "rgba(0, 0, 0, 0.5)" }, // Darkened background
        }}
      >
        <Box sx={modalStyle}>
          {/* Notification List */}
          {notifications.length === 0 ? (
            <MKTypography variant="body2">No new notifications</MKTypography>
          ) : (
            notifications.map((notification, index) => (
              <div key={notification.id}>
                <MKTypography variant="button" fontWeight={notification.read ? "regular" : "bold"}>
                  {notification.message}
                </MKTypography>
                {/* Add a divider between notifications */}
                {index < notifications.length - 1 && <Divider sx={{ my: 2 }} />}
              </div>
            ))
          )}
          {/* Mark all as read button */}
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
