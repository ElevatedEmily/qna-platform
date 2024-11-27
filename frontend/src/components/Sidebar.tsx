import { useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Button,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ForumIcon from "@mui/icons-material/Forum";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SettingsIcon from "@mui/icons-material/Settings";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Mock login state
  const navigate = useNavigate(); // For navigation

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <Box
      sx={{
        width: 240, // Fixed width for the sidebar
        height: "100vh", // Full height
        backgroundColor: "#1E1E1E", // Dark theme background
        color: "white", // White text for contrast
        display: "flex",
        flexDirection: "column",
        padding: 2,
      }}
    >
      {/* Profile Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          marginBottom: 2,
          flexDirection: "column",
        }}
      >
        {isLoggedIn ? (
          <>
            {/* Logged-in User's Profile */}
            <Avatar
              sx={{ width: 48, height: 48, marginBottom: 1 }}
              src="https://via.placeholder.com/150" // Replace with actual profile pic URL
              alt="User Profile"
            />
            <Typography variant="body1">John Doe</Typography>
            <Button
              sx={{ marginTop: 1, color: "gray" }}
              onClick={handleLogout}
              size="small"
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            {/* Not Logged In */}
            <Typography variant="h6" gutterBottom>
              Login or Signup
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="contained"
                onClick={() => navigate("/login")}
                sx={{ backgroundColor: "#2196f3", flex: 1 }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => navigate("/signup")}
                sx={{ backgroundColor: "#4caf50", flex: 1 }}
              >
                Signup
              </Button>
            </Box>
          </>
        )}
      </Box>

      {/* Navigation Links */}
      <List>
        {/* Home */}
        <ListItem
          component="li"
          sx={{
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)", // Light grey/opaque white on hover
            },
          }}
          onClick={() => navigate("/")}
        >
          <ListItemIcon>
            <HomeIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>

        {/* Forum */}
        <ListItem
          component="li"
          sx={{
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)", // Light grey/opaque white on hover
            },
          }}
          onClick={() => navigate("/forum")}
        >
          <ListItemIcon>
            <ForumIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Forum" />
        </ListItem>

        {/* Lessons */}
        <ListItem
          component="li"
          sx={{
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)", // Light grey/opaque white on hover
            },
          }}
          onClick={() => navigate("/lessons")}
        >
          <ListItemIcon>
            <MenuBookIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Lessons" />
        </ListItem>

        {/* Account */}
        <ListItem
          component="li"
          sx={{
            cursor: "pointer",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.1)", // Light grey/opaque white on hover
            },
          }}
          onClick={() => navigate("/account")}
        >
          <ListItemIcon>
            <SettingsIcon sx={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Account" />
        </ListItem>
      </List>

      {/* Footer */}
      <Box sx={{ marginTop: "auto", paddingTop: 2 }}>
        <Typography variant="caption" color="gray">
          © 2024 Tutoring Platform
        </Typography>
      </Box>
    </Box>
  );
};

export default Sidebar;
