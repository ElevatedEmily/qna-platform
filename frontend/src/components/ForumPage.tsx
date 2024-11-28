import { useRef, useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Modal,
  TextField,
} from "@mui/material";
import { db } from "../firebase";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { Excalidraw } from "@excalidraw/excalidraw";

const ForumPage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [newPostTitle, setNewPostTitle] = useState("");
  const [openModal, setOpenModal] = useState(false);

  const excalidrawStateRef = useRef<{
    elements: readonly any[];
    appState: Record<string, unknown>;
  }>({
    elements: [],
    appState: {},
  });

  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: "<p>Write your content here...</p>",
  });

  // Fetch posts from Firestore
  const fetchPosts = async () => {
    try {
      const postsRef = collection(db, "forumPosts");
      const snapshot = await getDocs(postsRef);
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // Create a new post
  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !editor?.getHTML().trim()) {
      console.error("Post title or content cannot be empty");
      return;
    }

    try {
      const { elements, appState } = excalidrawStateRef.current;

      const postData = {
        title: newPostTitle,
        content: editor.getHTML(),
        createdBy: "Current User",
        createdAt: serverTimestamp(),
        drawing: JSON.stringify({ elements, appState }), // Save drawing data
      };

      const postsRef = collection(db, "forumPosts");
      await addDoc(postsRef, postData);

      setNewPostTitle("");
      editor.commands.clearContent();
      setOpenModal(false);
      fetchPosts();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  // Fetch posts on component mount
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "400px 4fr",
          height: "100vh",
          backgroundColor: "#121212",
          gap: "16px",
          overflow: "hidden",
        }}
      >
        {/* Sidebar */}
        <Box
          sx={{
            backgroundColor: "#1E1E1E",
            borderRadius: 3,
            overflowY: "auto",
            padding: 3,
            borderRight: "2px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <Typography variant="h4" gutterBottom sx={{ color: "white" }}>
            Forum
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {posts.map((post) => (
              <Card
                key={post.id}
                sx={{ backgroundColor: "#1E1E1E", borderRadius: 3 }}
                onClick={() => setSelectedPost(post)}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ color: "white" }}>
                    {post.title}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "gray" }}>
                    By {post.createdBy || "Anonymous"}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
          <Button
            variant="contained"
            onClick={() => setOpenModal(true)}
            sx={{
              marginTop: "16px",
              backgroundColor: "#8A2BE2",
              ":hover": { backgroundColor: "#9B30FF" },
            }}
          >
            Create Post
          </Button>
        </Box>

        {/* Main Content */}
        <Box sx={{ backgroundColor: "#2E2E2E", padding: 3 }}>
          {selectedPost ? (
            <>
              <Typography variant="h5" sx={{ color: "white" }}>
                {selectedPost.title}
              </Typography>
              <Typography
                variant="body1"
                dangerouslySetInnerHTML={{ __html: selectedPost.content }}
                sx={{ color: "rgba(255, 255, 255, 0.8)", marginTop: "8px" }}
              />
              {selectedPost.drawing && (
                <Box
                  sx={{
                    marginTop: "16px",
                    backgroundColor: "#1E1E1E",
                    borderRadius: "4px",
                    padding: "8px",
                  }}
                >
                  <Excalidraw
                    initialData={JSON.parse(selectedPost.drawing)}
                    viewModeEnabled
                  />
                </Box>
              )}
            </>
          ) : (
            <Typography
              variant="h6"
              sx={{ color: "rgba(255, 255, 255, 0.6)", textAlign: "center" }}
            >
              Select a post to view details
            </Typography>
          )}
        </Box>
      </Box>

      {/* Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            height: "90%",
            backgroundColor: "#1E1E1E",
            borderRadius: 3,
            boxShadow: 24,
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <Typography variant="h5" sx={{ color: "white", textAlign: "center" }}>
            Create a Post
          </Typography>

          {/* Post Title */}
          <TextField
            placeholder="Post Title"
            fullWidth
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            sx={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              borderRadius: 3,
              "& input": { color: "white" },
            }}
          />

          {/* Rich Text Editor */}
          <Box
            sx={{
              flex: 1,
              backgroundColor: "#2E2E2E",
              borderRadius: "4px",
              padding: "8px",
            }}
          >
            <EditorContent editor={editor} />
          </Box>

          {/* Excalidraw */}
          <Box
            sx={{
              flex: 4,
              backgroundColor: "#2E2E2E",
              borderRadius: "4px",
              overflow: "hidden",
            }}
          >
            <Excalidraw
              onChange={(elements, appState) => {
                excalidrawStateRef.current = { elements, appState };
              }}
            />
          </Box>

          {/* Create Post Button */}
          <Button
            variant="contained"
            onClick={handleCreatePost}
            sx={{
              backgroundColor: "#8A2BE2",
              color: "white",
              fontSize: "16px",
              ":hover": { backgroundColor: "#9B30FF" },
            }}
          >
            Create Post
          </Button>
        </Box>
      </Modal>
    </>
  );
};

export default ForumPage;
