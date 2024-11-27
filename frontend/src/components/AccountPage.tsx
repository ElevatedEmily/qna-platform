import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
} from "@mui/material";
import { auth, db } from "../firebase"; // Firestore and Auth import
import { updateProfile, updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore"; // Firestore methods
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Context for user data

const AccountPage = () => {
  const { user } = useAuth(); // Get user state from context
  const [displayName, setDisplayName] = useState(user?.displayName || ""); // Current name
  const [newPassword, setNewPassword] = useState(""); // New password
  const [error] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleNameChange = async () => {
    // Navigate immediately
    navigate("/");

    try {
      if (!displayName.trim()) throw new Error("Display name cannot be empty.");

      // Update Firebase Auth profile
      await updateProfile(auth.currentUser!, { displayName });

      // Update Firestore user document
      const userRef = doc(db, "users", auth.currentUser!.uid);
      await updateDoc(userRef, { name: displayName });

      setSuccessMessage("Display name updated successfully!");
    } catch (err: any) {
      console.error(err.message || "Failed to update display name.");
    }
  };

  const handlePasswordChange = async () => {
    // Navigate immediately
    navigate("/");

    try {
      if (!newPassword.trim()) throw new Error("Password cannot be empty.");
      if (newPassword.length < 6)
        throw new Error("Password must be at least 6 characters.");

      await updatePassword(auth.currentUser!, newPassword);
      setSuccessMessage("Password updated successfully!");
      setNewPassword("");
    } catch (err: any) {
      console.error(err.message || "Failed to update password.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#121212",
        color: "white",
        paddingLeft: "240px", // Sidebar adjustment
      }}
    >
      {/* Form Container */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 400,
          padding: 4,
          backgroundColor: "#1E1E1E",
          borderRadius: 2,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.8)",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Account Settings
        </Typography>

        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ marginBottom: 2 }}>
            {successMessage}
          </Alert>
        )}

        {/* Change Name */}
        <TextField
          placeholder="Display Name"
          fullWidth
          InputProps={{
            sx: {
              backgroundColor: "#1E1E1E",
              color: "white",
              borderRadius: 1,
              "& input": { color: "white" },
            },
          }}
          sx={{ marginBottom: 2 }}
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handleNameChange}
          sx={{
            backgroundColor: "#8A2BE2", // Electric violet color
            color: "white", // White text
            borderRadius: 3, // Rounded corners
            marginBottom: 2,
            ":hover": {
              backgroundColor: "#9B30FF", // Slightly lighter electric violet on hover
            },
          }}
        >
          Update Name
        </Button>

        {/* Change Password */}
        <TextField
          placeholder="New Password"
          type="password"
          fullWidth
          InputProps={{
            sx: {
              backgroundColor: "#1E1E1E",
              color: "white",
              borderRadius: 1,
              "& input": { color: "white" },
            },
          }}
          sx={{ marginBottom: 2 }}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <Button
          variant="contained"
          fullWidth
          onClick={handlePasswordChange}
          sx={{
            backgroundColor: "#8A2BE2", // Electric violet color
            color: "white", // White text
            borderRadius: 3, // Rounded corners
            marginBottom: 2,
            ":hover": {
              backgroundColor: "#9B30FF", // Slightly lighter electric violet on hover
            },
          }}
        >
          Change Password
        </Button>

        {/* Go Back */}
        <Button
          variant="outlined"
          fullWidth
          onClick={() => navigate("/")}
          sx={{
            color: "white",
            borderColor: "#8A2BE2", // Electric violet border
            borderRadius: 3, // Rounded corners
            ":hover": {
              borderColor: "#9B30FF", // Lighter electric violet on hover
              backgroundColor: "rgba(138, 43, 226, 0.1)", // Faint violet background on hover
            },
          }}
        >
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
};

export default AccountPage;
