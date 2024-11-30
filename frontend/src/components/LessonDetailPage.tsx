import { useParams } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Box, Typography } from "@mui/material";
import { Suspense } from "react";

// Basic spinning cube component
const SpinningCube = () => {
  return (
    <mesh rotation={[1, 1, 0]}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

const lessonContent: Record<number, { title: string; description: string }> = {
    1: { title: "Lesson 1: Introduction to Ramps", description: "Learn the basics of ramps." },
    2: { title: "Lesson 2: Basics of React Three Fiber", description: "Explore React Three Fiber." },
    3: { title: "Lesson 3: Building a 3D Scene", description: "Build your first 3D scene." },
  };

const LessonDetailPage = () => {
  const { id } = useParams();
  const lesson = lessonContent[Number(id) || 1]; // Fallback to the first lesson

  return (
    <Box>
      <Typography variant="h4" sx={{ marginBottom: 3 }}>
        {lesson.title}
      </Typography>
      <Typography variant="body1" sx={{ marginBottom: 3 }}>
        {lesson.description}
      </Typography>
      <Canvas style={{ height: 400, background: "#121212" }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 5]} />
        <Suspense fallback={null}>
          <SpinningCube />
        </Suspense>
      </Canvas>
    </Box>
  );
};

export default LessonDetailPage;
