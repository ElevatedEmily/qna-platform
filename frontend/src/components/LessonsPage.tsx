import { useNavigate } from "react-router-dom";
import {  Typography, Card, CardActionArea, CardMedia, CardContent } from "@mui/material";
import "./LessonPage.css";
import lesson1Img from "../public/lesson1.png"
const lessons = [
  { id: 1, title: "Lesson 1: Introduction to Ramps", image: lesson1Img },
  { id: 2, title: "Lesson 2: Basics of React Three Fiber", image: "/images/lesson2.jpg" },
  { id: 3, title: "Lesson 3: Building a 3D Scene", image: "/images/lesson3.jpg" },
];

const LessonsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="lesson-page">
      {/* Page Title */}
      <Typography variant="h4" className="lesson-title">
        Lessons
      </Typography>

      {/* Lessons Grid */}
      <div className="lesson-grid full-width">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="lesson-card">
            <CardActionArea onClick={() => navigate(`/lessons/${lesson.id}`)}>
              <CardMedia
                component="img"
                height="180"
                image={lesson.image}
                alt={lesson.title}
                className="lesson-card-media"
              />
              <CardContent>
                <Typography variant="h6" className="lesson-card-title">
                  {lesson.title}
                </Typography>
                <Typography variant="body2" className="lesson-card-description">
                  Click to learn more about {lesson.title}.
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LessonsPage;
