import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import SignUpPage from "./components/SignUpPage";
import AccountPage from "./components/AccountPage";
import ForumPage from "./components/ForumPage";
import CreatePostPage from "./components/CreatePostPage";
import PostDetailPage from "./components/PostDetailPage";
import AppThemeProvider from "./components/ThemeProvider";
import LessonsPage from "./components/LessonsPage"; 
import Lesson1 from "./components/lessons/Lesson1"; 
import Lesson2 from "./components/lessons/Lesson2";
import { Box } from "@mui/material";
import { Routes, Route, useLocation } from "react-router-dom";

const App = () => {
  const location = useLocation();

  // Check if the current route is specifically for lessons
  const isSpecificLessonRoute = ["/lessons/1", "/lessons/2"].includes(location.pathname);

  return (
    <AppThemeProvider>
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: "#121212", // Dark background for the entire app
          color: "white", // Ensure consistent text color
        }}
      >
        {/* Sidebar: Visible for all routes except specific lessons */}
        {!isSpecificLessonRoute && <Sidebar />}

        {/* Main Content Area */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: isSpecificLessonRoute ? "center" : "flex-start", // Center content for specific lessons
            alignItems: isSpecificLessonRoute ? "center" : "flex-start", // Align to the center for specific lessons
            minHeight: "100vh", // Full height for the main content
            padding: isSpecificLessonRoute ? 0 : 3, // Remove padding for specific lesson pages
            flexDirection: "column", // For block and lesson content flow
          }}
        >
          {/* Define routes */}
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/create-post" element={<CreatePostPage />} />
            <Route path="/post/:id" element={<PostDetailPage />} />
            <Route path="/lessons" element={<LessonsPage />} />
            <Route path="/lessons/1" element={<Lesson1 />} />
            <Route path="/lessons/2" element={<Lesson2 />} />
          </Routes>
        </Box>
      </Box>
    </AppThemeProvider>
  );
};

export default App;
