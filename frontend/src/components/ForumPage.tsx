import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
} from "@mui/material";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { motion, AnimatePresence } from "framer-motion";

const ForumPage = () => {
  const [posts, setPosts] = useState<any[]>([]); // Store posts
  const [selectedPost, setSelectedPost] = useState<any | null>(null); // Selected post for display
  const [newPostTitle, setNewPostTitle] = useState(""); // For "Create a Post" box
  const [newPostContent, setNewPostContent] = useState("");

  const fetchPosts = async () => {
    try {
      const postsRef = collection(db, "forumPosts");
      const snapshot = await getDocs(postsRef);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "300px 1fr", // Fixed left column and dynamic right column
        height: "100vh",
        paddingLeft: "240px", // Space for the sidebar
        backgroundColor: "#121212",
      }}
    >
      {/* Posts Column */}
      <Box
        sx={{
          backgroundColor: "#121212",
          borderRight: "2px solid rgba(255, 255, 255, 0.1)", // Divider
          overflowY: "auto",
          padding: 3,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Forum
        </Typography>
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.03 }}
              style={{ marginBottom: "16px" }}
            >
              <Card
                sx={{
                  backgroundColor: "#1E1E1E",
                  borderRadius: 3,
                  cursor: "pointer",
                  padding: 2,
                }}
                onClick={() => setSelectedPost(post)} // Open the selected post
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {post.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      maxHeight: "48px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {post.content}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </Box>

      {/* Right-Side Panel */}
      <motion.div
        layout
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        style={{
          backgroundColor: "#1E1E1E",
          color: "white",
          padding: "2rem",
          overflowY: "auto",
        }}
      >
        {selectedPost ? (
          <>
            {/* Selected Post Details */}
            <Typography variant="h4" gutterBottom>
              {selectedPost.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {selectedPost.content}
            </Typography>
            {selectedPost.image && (
              <Box
                component="img"
                src={selectedPost.image}
                alt="Post Image"
                sx={{
                  marginTop: 2,
                  maxWidth: "100%",
                  borderRadius: 3,
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                }}
              />
            )}
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              sx={{ marginTop: 2 }}
            >
              By {selectedPost.createdBy} on{" "}
              {new Date(selectedPost.createdAt?.seconds * 1000).toLocaleString()}
            </Typography>
            <Button
              variant="outlined"
              sx={{
                marginTop: 3,
                color: "white",
                borderColor: "#8A2BE2",
                ":hover": { backgroundColor: "rgba(138, 43, 226, 0.1)" },
              }}
              onClick={() => setSelectedPost(null)}
            >
              Close
            </Button>
          </>
        ) : (
          <>
            {/* Create a Post */}
            <Typography variant="h4" gutterBottom>
              Create a Post
            </Typography>
            <TextField
              placeholder="Post Title"
              fullWidth
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: 3,
                marginBottom: 2,
                "& input": { color: "white" },
              }}
            />
            <TextField
              placeholder="What's on your mind?"
              multiline
              rows={4}
              fullWidth
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                borderRadius: 3,
                marginBottom: 2,
                "& textarea": { color: "white" },
              }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#8A2BE2",
                color: "white",
                ":hover": { backgroundColor: "#9B30FF" },
              }}
              onClick={() => {
                console.log("Create Post Clicked");
                // Logic to save the post can go here
              }}
            >
              Create Post
            </Button>
          </>
        )}
      </motion.div>
    </Box>
  );
};

export default ForumPage;
