import { useState } from "react";
import { auth, db } from "../firebase"; // Firestore import
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore"; // Firestore methods
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  const [name, setName] = useState(""); // Name input
  const [email, setEmail] = useState(""); // Email input
  const [password, setPassword] = useState(""); // Password input
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Step 1: Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Step 2: Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: name,
      });

      // Step 3: Save additional user info in Firestore
      const userId = userCredential.user.uid;
      await setDoc(doc(db, "users", userId), {
        name,
        email,
        createdAt: new Date(),
      });

      alert("Account created successfully!");
      navigate("/"); // Redirect to home or login page
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
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
          maxWidth: 400, // Limit maximum width of the form
          padding: 4,
          backgroundColor: "#1E1E1E",
          borderRadius: 2,
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.8)",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Create Account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}

        {/* Name Field */}
        <TextField
          placeholder="Name"
          fullWidth
          InputProps={{
            sx: {
              backgroundColor: "#1E1E1E",
              color: "white",
              borderRadius: 1,
              "& input": { color: "white" },
            },
          }}
          sx={{
            marginBottom: 2,
          }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email Field */}
        <TextField
          placeholder="Email"
          fullWidth
          InputProps={{
            sx: {
              backgroundColor: "#1E1E1E",
              color: "white",
              borderRadius: 1,
              "& input": { color: "white" },
            },
          }}
          sx={{
            marginBottom: 2,
          }}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password Field */}
        <TextField
          placeholder="Password"
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
          sx={{
            marginBottom: 2,
          }}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Sign Up Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleSignUp}
          sx={{ backgroundColor: "#2196f3", marginBottom: 2 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
        </Button>

        {/* Log In Link */}
        <Typography variant="body2">
          Already have an account?{" "}
          <a href="/login" style={{ color: "#2196f3" }}>
            Log In
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUpPage;
