import { useNavigate } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Button,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ForumIcon from "@mui/icons-material/Forum";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SettingsIcon from "@mui/icons-material/Settings";
import { useAuth } from "../context/AuthContext"; // Context to manage user state
import { auth } from "../firebase"; // Firebase auth

const Sidebar = () => {
  const { user } = useAuth(); // Get user state from AuthContext
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut(); // Logout the user
    navigate("/login");
  };

  return (
    <Box
      sx={{
        width: 240,
        height: "100vh",
        backgroundColor: "#1E1E1E",
        color: "white",
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
        {user ? (
          <>
            {/* Logged-in User's Profile */}
            <Avatar
              sx={{ width: 48, height: 48, marginBottom: 1 }}
              src={user.photoURL || "https://via.placeholder.com/150"} // User's profile photo or placeholder
              alt="User Profile"
            />
            <Typography variant="body1">{user.displayName || "User"}</Typography>
            <Button
              sx={{
                marginTop: 1,
                color: "gray",
                textTransform: "none", // Prevents uppercase text
              }}
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

      {/* Divider */}
      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)", marginY: 1 }} />

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
