import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Badge,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

const ForumPage = () => {
  const [posts, setPosts] = useState<any[]>([]); // Store posts
  const navigate = useNavigate();

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
        padding: 3,
        backgroundColor: "#121212",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Forum
      </Typography>

      {/* Create Post Button */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: "#8A2BE2",
          color: "white",
          borderRadius: 50,
          ":hover": { backgroundColor: "#9B30FF" },
          marginBottom: 3,
        }}
        onClick={() => navigate("/create-post")}
      >
        Create a Post
      </Button>

      {/* Forum Posts Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 3,
        }}
      >
        {posts.map((post) => (
          <Card
            key={post.id}
            sx={{
              backgroundColor: "#1E1E1E",
              borderRadius: 3,
              padding: 2,
              cursor: "pointer",
              transition: "transform 0.2s",
              ":hover": {
                transform: "scale(1.02)",
              },
            }}
            onClick={() => navigate(`/post/${post.id}`)}
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
                  maxHeight: 48,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "wrap",
                }}
              >
                {post.content}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 2,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  By {post.createdBy} on{" "}
                  {new Date(post.createdAt?.seconds * 1000).toLocaleString()}
                </Typography>
                <IconButton sx={{ color: "#8A2BE2" }}>
                  <Badge badgeContent={post.comments?.length || 0} color="primary">
                    <ChatBubbleOutlineIcon />
                  </Badge>
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default ForumPage;
