import  { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

const PostDetailPage = () => {
  const { id } = useParams(); // Get the post ID from the URL
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState<any>(null); // Current post data
  const [newComment, setNewComment] = useState(""); // New comment input
  const [error, setError] = useState(""); // Error message

  // Fetch the post by ID
  const fetchPost = async () => {
    try {
      const postRef = doc(db, "forumPosts", id!);
      const snapshot = await getDoc(postRef);

      if (snapshot.exists()) {
        setPost({ id: snapshot.id, ...snapshot.data() });
      } else {
        setError("Post not found.");
      }
    } catch (error) {
      setError("Failed to load the post.");
    }
  };

  // Add a new comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    try {
      const postRef = doc(db, "forumPosts", id!);
      const comment = {
        text: newComment,
        createdBy: user.displayName,
        createdAt: serverTimestamp(),
      };

      await updateDoc(postRef, {
        comments: arrayUnion(comment),
      });

      setNewComment(""); // Clear the comment input
      fetchPost(); // Refresh the post to display the new comment
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  if (!post) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#121212",
          color: "white",
        }}
      >
        <Typography variant="h5">
          {error || "Loading..."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "#121212",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <Button
        variant="outlined"
        onClick={() => navigate("/")}
        sx={{
          marginBottom: 2,
          color: "white",
          borderColor: "#8A2BE2",
          borderRadius: 3,
          ":hover": { backgroundColor: "rgba(138, 43, 226, 0.1)" },
        }}
      >
        Back to Forum
      </Button>

      <Card sx={{ backgroundColor: "#1E1E1E", padding: 3, borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            {post.title}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {post.content}
          </Typography>
          {post.image && (
            <Box
              component="img"
              src={post.image}
              alt="Post Image"
              sx={{
                marginTop: 2,
                borderRadius: 3,
                maxWidth: "100%",
                height: "auto",
              }}
            />
          )}
          <Typography
            variant="caption"
            sx={{ display: "block", marginTop: 2 }}
          >
            By {post.createdBy} on{" "}
            {new Date(post.createdAt?.seconds * 1000).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h5" gutterBottom>
          Comments
        </Typography>
        {post.comments && post.comments.length > 0 ? (
          post.comments.map((comment: any, index: number) => (
            <Box
              key={index}
              sx={{
                backgroundColor: "#1E1E1E",
                borderRadius: 3,
                padding: 2,
                marginBottom: 2,
              }}
            >
              <Typography variant="body2">{comment.text}</Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block" }}
              >
                By {comment.createdBy} on{" "}
                {new Date(comment.createdAt?.seconds * 1000).toLocaleString()}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            No comments yet. Be the first to comment!
          </Typography>
        )}
        <TextField
          placeholder="Add a comment"
          fullWidth
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{
            marginTop: 2,
            marginBottom: 2,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: 3,
            "& input": { color: "white" },
          }}
        />
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#8A2BE2",
            color: "white",
            borderRadius: 3,
            ":hover": { backgroundColor: "#9B30FF" },
          }}
          onClick={handleAddComment}
        >
          Comment
        </Button>
      </Box>
    </Box>
  );
};

export default PostDetailPage;