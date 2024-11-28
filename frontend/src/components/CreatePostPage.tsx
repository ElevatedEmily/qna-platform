import { useState, useRef } from "react";
import { Box, Button, Typography, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { Excalidraw, serializeAsJSON } from "@excalidraw/excalidraw";

/**
 * CreatePostPage component
 *
 * Allows users to create a new post, including input fields for title, content, and an Excalidraw canvas for drawing.
 * When the user clicks the "Post" button, the post is uploaded to the Firestore database and the user is redirected to the home page.
 */
const CreatePostPage = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [drawingData, setDrawingData] = useState<string | null>(null);

  const excalidrawStateRef = useRef<{
    elements: readonly any[];
    appState: Record<string, unknown>;
  }>({
    elements: [],
    appState: {},
  });

  const navigate = useNavigate();

  const handlePostCreation = async () => {
    if (!title.trim() || !content.trim()) {
      console.error("Post title or content cannot be empty");
      return;
    }

    try {
      const postsRef = collection(db, "forumPosts");
      await addDoc(postsRef, {
        title,
        content,
        drawing: drawingData, // Serialized Excalidraw drawing data
        createdBy: user?.displayName || "Anonymous",
        userId: user?.uid,
        createdAt: serverTimestamp(),
        comments: [],
      });
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleSaveDrawing = () => {
    const { elements, appState } = excalidrawStateRef.current;

    // Serialize the drawing data without files
    const drawingJSON = serializeAsJSON(elements, appState, {}, "local");
    setDrawingData(drawingJSON);
    console.log("Drawing saved:", drawingJSON);
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
        padding: 4,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 800,
          backgroundColor: "#1E1E1E",
          padding: 4,
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
          Create a New Post
        </Typography>

        {/* Title Input */}
        <TextField
          placeholder="Post Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            marginBottom: "16px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: 3,
            "& input": { color: "white" },
          }}
        />

        {/* Content Input */}
        <TextField
          placeholder="Write your content here..."
          fullWidth
          multiline
          minRows={4}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{
            marginBottom: "16px",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: 3,
            "& textarea": { color: "white" },
          }}
        />

        {/* Excalidraw Canvas */}
        <Box
          sx={{
            width: "100%",
            height: "400px",
            backgroundColor: "#2E2E2E",
            borderRadius: "4px",
            padding: "16px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Typography variant="body1" sx={{ color: "white", marginBottom: 2 }}>
            Drawing Area:
          </Typography>
          <Excalidraw
            onChange={(elements, appState) => {
              excalidrawStateRef.current = { elements, appState };
            }}
            initialData={{ appState: { theme: "dark" } }}
            viewModeEnabled={false}
          />
          <Box
            sx={{
              display: "flex",
              gap: "16px",
              alignItems: "center",
              marginTop: "16px",
            }}
          >
            <Button
              variant="contained"
              onClick={handleSaveDrawing}
              sx={{ backgroundColor: "#8A2BE2", color: "white" }}
            >
              Save Drawing
            </Button>
          </Box>
        </Box>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="contained"
            onClick={handlePostCreation}
            sx={{
              backgroundColor: "#8A2BE2",
              color: "white",
              borderRadius: 50,
              ":hover": { backgroundColor: "#9B30FF" },
            }}
          >
            Post
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/")}
            sx={{
              color: "white",
              borderColor: "#8A2BE2",
              borderRadius: 50,
              ":hover": { backgroundColor: "rgba(138, 43, 226, 0.1)" },
            }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CreatePostPage;
