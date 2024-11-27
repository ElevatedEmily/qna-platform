import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
  /**
   * Handles the login process by signing in with the given email and password
   * via Firebase Authentication. If the login is successful, an alert is shown
   * with a success message. If the login fails, an error message is set that
   * will be shown to the user. The loading state is always set back to false
   * after the login attempt is finished.
   */
    setIsLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in successfully!");
    } catch (err: any) {
      setError(err.message);
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
          Log In
        </Typography>

        {error && (
          <Alert severity="error" sx={{ marginBottom: 2 }}>
            {error}
          </Alert>
        )}

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

        {/* Log In Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
          sx={{ backgroundColor: "#2196f3", marginBottom: 2 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Log In"}
        </Button>

        {/* Sign-Up Link */}
        <Typography variant="body2">
          Don't have an account?{" "}
          <a href="/signup" style={{ color: "#2196f3" }}>
            Sign Up
          </a>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginPage;
