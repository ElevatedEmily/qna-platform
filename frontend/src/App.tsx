
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import AppThemeProvider from "./components/ThemeProvider";
import { Box } from "@mui/material";
import { Routes, Route } from "react-router-dom"; // Remove BrowserRouter here

const App = () => {
  return (
    <AppThemeProvider>
      {/* App Layout */}
      <Box sx={{ display: "flex" }}>
        {/* Sidebar (Persistent across all pages) */}
        <Sidebar />

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1, // Take up the remaining width
            backgroundColor: "#121212", // Dark mode background
            color: "white",
            minHeight: "100vh", // Full height
            padding: 3,
          }}
        >
          {/* Route-Specific Content */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
          </Routes>
        </Box>
      </Box>
    </AppThemeProvider>
  );
};

export default App;
