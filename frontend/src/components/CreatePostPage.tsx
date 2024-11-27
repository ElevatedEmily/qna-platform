import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const CreatePostPage = () => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const navigate = useNavigate();

  const handlePostCreation = async () => {
    if (!title.trim() || !content.trim()) return;

    try {
      const postsRef = collection(db, "forumPosts");
      await addDoc(postsRef, {
        title,
        content,
        image: image ? URL.createObjectURL(image) : null,
        createdBy: user.displayName,
        userId: user.uid,
        createdAt: serverTimestamp(),
        comments: [],
      });
      navigate("/");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImage(event.target.files?.[0] || null);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#121212", // Background color
        color: "white",
        padding: 4,
      }}
    >
      <Box
        sx={{
          width: "100%",
          maxWidth: 800, // Max width for the form box
          backgroundColor: "#1E1E1E", // Light gray box color
          padding: 4,
          borderRadius: 3,
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.5)",
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
          Create a New Post
        </Typography>
        <TextField
          placeholder="Post Title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            color: "white",
            borderRadius: 3,
            marginBottom: 3,
          }}
          InputProps={{
            sx: { color: "white" },
          }}
        />
        <TextField
          placeholder="What's on your mind?"
          multiline
          rows={6}
          fullWidth
          value={content}
          onChange={(e) => setContent(e.target.value)}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: 3,
            marginBottom: 3,
          }}
          InputProps={{
            sx: { color: "white" },
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 3,
          }}
        >
          <Button
            variant="contained"
            component="label"
            sx={{
              backgroundColor: "#8A2BE2",
              color: "white",
              borderRadius: 50,
              ":hover": { backgroundColor: "#9B30FF" },
            }}
          >
            Upload Image
            <input type="file" hidden onChange={handleImageUpload} />
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#8A2BE2",
              color: "white",
              borderRadius: 50,
              ":hover": { backgroundColor: "#9B30FF" },
            }}
            onClick={handlePostCreation}
          >
            Post
          </Button>
        </Box>
        <Button
          variant="outlined"
          fullWidth
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
  );
};

export default CreatePostPage;
