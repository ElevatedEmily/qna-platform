import { useState, useEffect, useRef } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Canvas } from "@react-three/fiber";
import { Mesh } from "three";
import { useNavigate } from "react-router-dom";
import { Physics, useBox } from "@react-three/cannon";
import { Slider, Typography, Button, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./LessonPage.css";
import freebody from "../../public/freebodydiagramplane1.png";
import annfreebody from "../../public/annotatedfreebodyincline.png";
import drawing from "../../public/InclinedPlaneDiagram.png";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const InclinedPlane = ({ angle }: { angle: number }) => {
  const [ref, api] = useBox<Mesh>(() => ({
    rotation: [0, -Math.PI / 2, Math.atan(angle)],
    position: [0, -0.25, 0],
    args: [10, 0.5, 5],
    type: "Static",
    material: { friction: 0 },
  }));

  useEffect(() => {
    api.rotation.set(0, -Math.PI / 2, Math.atan(angle));
  }, [angle, api]);

  return (
    <mesh ref={ref} receiveShadow>
      <boxGeometry args={[10, 0.5, 5]} />
      <meshStandardMaterial color="#8A2BE2" />
    </mesh>
  );
};

const SlidingBlock = ({
  mass,
  setApiRef,
  angle,
  resetFlag,
}: {
  mass: number;
  setApiRef: (api: any) => void;
  setDraggable: (isDragging: boolean) => void;
  angle: number;
  gravity: number;
  resetFlag: boolean;
}) => {
  const rampLength = 5;
  const startX = rampLength * 0.5;
  const startY = startX * Math.tan(angle);

  const [ref, api] = useBox<Mesh>(() => ({
    mass,
    position: [startX - 2, startY + 1.5, 3],
    args: [0.5, 0.5, 0.5],
    material: { friction: 0 },
  }));

  useEffect(() => {
    if (resetFlag) {
      api.position.set(startX - 2, startY + 1.5, 3);
      api.velocity.set(0, 0, 0);
    }
  }, [resetFlag, api, startX, startY]);

  useEffect(() => {
    setApiRef(api);
  }, [api, setApiRef]);

  return (
    <mesh ref={ref} castShadow>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#FFD700" />
    </mesh>
  );
};

const Lesson1 = () => {
  const navigate = useNavigate();
  const [angle, setAngle] = useState(0.1);
  const [mass, setMass] = useState(1);
  const [gravity, setGravity] = useState(-9.81);
  const [isDragging, setDraggable] = useState(false);
  const [resetFlag, setResetFlag] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [quizFeedback, setQuizFeedback] = useState("");
  const [timeData, setTimeData] = useState<number[]>([]);
  const [accelerationData, setAccelerationData] = useState<number[]>([]);
  const [velocityData, setVelocityData] = useState<number[]>([]);
  const [positionData, setPositionData] = useState<number[]>([]);

  const intervalRef = useRef<any>(null);

  const calculateMotion = () => {
    const acceleration = Math.abs(gravity) * Math.sin(angle);
    let time = 0;

    const newTimeData: number[] = [];
    const newAccelerationData: number[] = [];
    const newVelocityData: number[] = [];
    const newPositionData: number[] = [];

    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      const velocity = acceleration * time;
      const position = 0.5 * acceleration * time ** 2;

      if (position >= 5) {
        clearInterval(intervalRef.current);
        return;
      }

      newTimeData.push(time);
      newAccelerationData.push(acceleration);
      newVelocityData.push(velocity);
      newPositionData.push(position);

      setTimeData([...newTimeData]);
      setAccelerationData([...newAccelerationData]);
      setVelocityData([...newVelocityData]);
      setPositionData([...newPositionData]);

      time += 0.25;
    }, 250);
  };
  const handleQuizSubmit = () => {
    if (selectedAnswer === "correct") {
      setQuizFeedback("Correct! The motion depends on the angle and gravity.");
    } else {
      setQuizFeedback("Incorrect. Review the concepts and try again.");
    }
  };

  const resetPosition = () => {
    setResetFlag((prev) => !prev);
    setTimeData([]);
    setAccelerationData([]);
    setVelocityData([]);
    setPositionData([]);
    calculateMotion();
  };

  useEffect(() => {
    calculateMotion();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [angle, gravity]);

  const chartData = {
    labels: timeData,
    datasets: [
      {
        label: "Acceleration (m/s²)",
        data: accelerationData,
        borderColor: "#8A2BE2",
      },
      {
        label: "Velocity (m/s)",
        data: velocityData,
        borderColor: "#FFD700",
      },
      {
        label: "Position (m)",
        data: positionData,
        borderColor: "#6495ED",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#FFFFFF",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "#FFFFFF" },
      },
      y: {
        ticks: { color: "#FFFFFF" },
      },
    },
  };

  return (
    <div
      className="lesson-page"
      style={{
        minHeight: "100vh",
        overflowY: "auto", 
        paddingTop: "4rem", 
      }}
    >
      <div
        className="lesson-content lesson-wide"
        style={{
          margin: "0 auto", 
          padding: "1rem 2rem",
          boxSizing: "border-box", 
        }}
      >
        {/* Title Section */}
        <Typography
          variant="h3"
          className="lesson-title"
          style={{
            fontFamily: "Inter",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Intro to Ramps
        </Typography>
  
        <Typography
          variant="body1"
          className="lesson-intro"
          style={{
            fontFamily: "Inter",
            marginBottom: "3rem",
            textAlign: "center",
            lineHeight: 1.8,
          }}
        >
          Welcome to Intro To Ramps! Explore the fascinating physics of inclined planes.
          Adjust the angle, mass, and gravity to see how they affect motion. Study well 
          as there will be a test!
        </Typography>
  
        {/* Simulation Canvas */}
        <div
          className="lesson-canvas"
          style={{
            marginBottom: "2rem", // Add space below the simulation
          }}
        >
          <Canvas shadows camera={{ position: [7, 2, 0], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} castShadow />
            <Physics gravity={[0, gravity, 0]} allowSleep={false}>
              <InclinedPlane angle={angle} />
              <SlidingBlock
                mass={mass}
                setApiRef={() => {}}
                setDraggable={setDraggable}
                angle={angle}
                gravity={gravity}
                resetFlag={resetFlag}
              />
            </Physics>
          </Canvas>
        </div>
  
        {/* Sliders and Controls */}
        <div className="lesson-controls">
          <Typography variant="body1">
            Adjust Inclination Angle: {Math.round((angle * 180) / Math.PI)}°
          </Typography>
          <Slider
            value={angle}
            onChange={(_, value) => setAngle(value as number)}
            min={0}
            max={Math.PI / 4}
            step={0.01}
            sx={{ color: "#8A2BE2" }}
          />
  
          <Typography variant="body1">Adjust Block Mass: {mass.toFixed(1)} kg</Typography>
          <Slider
            value={mass}
            onChange={(_, value) => setMass(value as number)}
            min={0.1}
            max={10}
            step={0.1}
            sx={{ color: "#FFD700" }}
          />
  
          <Typography variant="body1">
            Adjust Gravitational Constant: {gravity.toFixed(1)} m/s²
          </Typography>
          <Slider
            value={gravity}
            onChange={(_, value) => setGravity(value as number)}
            min={-20}
            max={-1}
            step={0.1}
            sx={{ color: "#6495ED" }}
          />
  
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#8A2BE2",
              "&:hover": { backgroundColor: "#7A1FCF" },
              marginTop: "1rem",
            }}
            onClick={resetPosition}
            disabled={isDragging}
          >
            Reset Block Position
          </Button>
        </div>
  
        {/* Chart Section */}
        <div
          className="chart-container"
          style={{
            height: "400px",
            marginTop: "2rem",
          }}
        >
          <Line data={chartData} options={chartOptions} />
        </div>
  
       {/* Post-Simulation Description */}
       <Typography
          variant="body1"
          style={{
            fontFamily: "Inter, sans-serif",
            marginTop: "3rem",
            textAlign: "center",
            lineHeight: 1.8,
          }}
        >
          This experiment demonstrates the dynamics of motion on an inclined plane. Use
          the controls to tweak the variables and observe how the motion changes!
        </Typography>

        {/* Quiz Section */}
        <div
          style={{
            marginTop: "3rem",
            padding: "1rem",
            border: "1px solid #8A2BE2",
            borderRadius: "8px",
            backgroundColor: "#1E1E1E",
          }}
        >
          <Typography
            variant="h5"
            style={{
              fontFamily: "Inter",
              marginBottom: "1rem",
              textAlign: "center",
              color: "#FFD700",
            }}
          >
            Quick Quiz: Motion on an Inclined Plane
          </Typography>
          <Typography
            variant="body1"
            style={{
              fontFamily: "Inter",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            What primarily determines the motion of the block on the inclined plane?
          </Typography>
          <RadioGroup
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(e.target.value)}
            style={{ marginBottom: "1rem", textAlign: "center" }}
          >
            <FormControlLabel
              value="incorrect1"
              control={<Radio />}
              label="Just the mass of the block"
            />
            <FormControlLabel
              value="incorrect2"
              control={<Radio />}
              label="Just gravity"
            />
            <FormControlLabel
              value="incorrect3"
              control={<Radio />}
              label="Just the angle of the plane"
            />
            <FormControlLabel
              value="correct"
              control={<Radio />}
              label="The angle of the plane and gravity"
            />
            
          </RadioGroup>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#6495ED",
              "&:hover": { backgroundColor: "#547AC6" },
              marginBottom: "1rem",
            }}
            onClick={handleQuizSubmit}
          >
            Submit Answer
          </Button>
          {quizFeedback && (
            <Typography
              variant="body1"
              style={{
                fontFamily: "Inter",
                textAlign: "center",
                color: quizFeedback.includes("Correct") ? "#00FF00" : "#FF6347",
              }}
            >
              {quizFeedback}
            </Typography>
          )}
        </div>
        {/* Post Quiz Text */}
        <div
          style={{
            marginTop: "2rem",

          }}
        >
          <Typography
            variant="h5"
            style={{
              marginBottom: "1rem",
              fontFamily: "Inter, sans-serif",
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            Why does it work that way?
          </Typography>
          <Typography
            variant="body1"
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.8,
            }}
          >
            Now that we understand how the block is moving on the ramp and 
            what effects it's motion we can now talk about why it works that way. 
            To answer that question we will need to analyze the underlying physics.
            To make this easier let's start with a simple diagram pictured below!
          </Typography>
        </div>
        {/* Diagram */}
        <div
          style={{
            marginTop: "2rem",
            textAlign: "center", // Center-align the image
          }}
        >
          <img
            src={drawing}
            alt="Next Lesson Preview"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
              marginTop: "1rem",
            }}
          />
          <Typography
            variant="caption"
            style={{
              display: "block",
              marginTop: "0.5rem",
              fontFamily: "Inter, sans-serif",
              color: "#FFFFFF",
            }}
          >
            A very simple diagram!
          </Typography>
        </div>
        {/* Post Quiz Text */}
        <div
          style={{
            marginTop: "2rem",

          }}
        >
          <Typography
            variant="h5"
            style={{
              marginBottom: "1rem",
              fontFamily: "Inter, sans-serif",
              color: "#FFFFFF",
              textAlign: "center",
            }}
          >
            Let's take a closer look!
          </Typography>
          <Typography
            variant="body1"
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.8,
            }}
          >
            Now we are going to break this down into a simpler diagram called a Force Body
            Diagram. We will be break the forces up and draw them as arrows. For convenience
            we will set our coordinates with one axis going down the ramp and another perpendicular to the ramp.

          </Typography>
        </div>
                {/* Diagram */}
                <div
          style={{
            marginTop: "2rem",
            textAlign: "center", // Center-align the image
          }}
        >
          <img
            src= {freebody}
            alt="Next Lesson Preview"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
              marginTop: "1rem",
            }}
          />
          <Typography
            variant="caption"
            style={{
              display: "block",
              marginTop: "0.5rem",
              fontFamily: "Inter, sans-serif",
              color: "#FFFFFF",
            }}
          >
            A free body diagram!
          </Typography>
          </div>
                  {/* More Free Body Stuff */}
        <div
          style={{
            marginTop: "2rem",

          }}
        >
          <Typography
            variant="body1"
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.8,
            }}
          >
            In this system we have two forces: Gravity and the Normal Force. Since we know
            that the block is going to slide down the ramp we know that all of the forces that
            aren't pointing down the ramp must be 0. Let's break gravity down into its forces up 
            and down the ramp.
          </Typography>
        </div>
                {/* Diagram */}
                <div
          style={{
            marginTop: "2rem",
            textAlign: "center", // Center-align the image
          }}
        >
          <img
            src={annfreebody}
            alt="Next Lesson Preview"
            style={{
              maxWidth: "100%",
              height: "auto",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)",
              marginTop: "1rem",
            }}
          />
          <Typography
            variant="caption"
            style={{
              display: "block",
              marginTop: "0.5rem",
              fontFamily: "Inter, sans-serif",
              color: "#FFFFFF",
            }}
          >
            A more detailed free body diagram!
          </Typography>
          </div>
                            {/* More Free Body Stuff Part 2 */}
        <div
          style={{
            marginTop: "2rem",

          }}
        >
          <Typography
            variant="body1"
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.8,
            }}
          >
            What we did was break gravity down to the part that is along the plane and the part perpendicular
            to the plane. To make this easier we rotated the x and y axis by the angle of the ramp. This 
            means that if the angle running along the ramp to the x axis is theta and that the angle of the y axis to the 
            direction perpendicular to the ramp is also theta. 
          </Typography>
        </div>
        {/* More Free Body Stuff Part 2 */}
        <MathJaxContext>
        <div
          style={{
            marginTop: "2rem",

          }}
        >
          <Typography
            variant="body1"
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.8,
            }}
          >
            From analyzing our forces is that since the block isn't leaving the ramp, 
            we know the forces perpendicular to the ramp must be zero. This means that:
          </Typography>
          <Typography
          variant="body1"
          style={{
            marginBottom: "2rem",
            fontWeight: "bold",
          }}
        >
          <MathJax inline={true}>
            {"0 = Fn - mgsin(theta)"}
          </MathJax>
        </Typography>
        </div>
        </MathJaxContext>
        <MathJaxContext>
        <div
          style={{
            marginTop: "2rem",

          }}
        >
          <Typography
            variant="body1"
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.8,
            }}
          >
            This means that:
          </Typography>
          <Typography
          variant="body1"
          style={{
            marginBottom: "2rem",
            fontWeight: "bold",
          }}
        >
          <MathJax inline={true}>
            {"Fn = mgsin(theta)"}
          </MathJax>
        </Typography>
        </div>
        </MathJaxContext>
        <MathJaxContext>
        <div
          style={{
            marginTop: "2rem",

          }}
        >
          <Typography
            variant="body1"
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.8,
            }}
          >
            Note that as you change all of the variables the normal force changes in the same
            way leaving the block always on the ramp. Now that we have investigated the normal 
            force let's look at the forces moving down the ramp using Newton's Second Law.
          </Typography>
          <Typography
          variant="body1"
          style={{
            marginBottom: "2rem",
            fontWeight: "bold",
          }}
        >
          <MathJax inline={true}>
            {"F = ma = mgsin(theta)"}
          </MathJax>
        </Typography>
        </div>
        </MathJaxContext>
        <MathJaxContext>
        <div
          style={{
            marginTop: "2rem",

          }}
        >
          <Typography
            variant="body1"
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.8,
            }}
          >
            Now let's solve for the acceleration down the ramp (a) by dividing both side of the 
            equation by the mass (m).
          </Typography>
          <Typography
          variant="body1"
          style={{
            marginBottom: "2rem",
            fontWeight: "bold",
          }}
        >
          <MathJax inline={true}>
            {"a = gsin(theta)"}
          </MathJax>
        </Typography>
        </div>
        </MathJaxContext>
        <div
          style={{
            marginTop: "2rem",

          }}
        >
          <Typography
            variant="body1"
            style={{
              fontFamily: "Inter, sans-serif",
              color: "#FFFFFF",
              textAlign: "center",
              lineHeight: 1.8,
            }}
          >
            Now that we have solved for the acceleration we can see that the block's acceleration
            down the ramp has nothing to do with that mass at all! If the block were to weigh more
            gravity would pull down harder, but Newton's Second Law tells us that forces depend on mass times 
            acceleration meaning that the more it weights the harder it is to accelerate. All of this is to say
            that the acceleration of the block down the ramp depends on how vertical the ramp is and how strong gravity is. 
            Thank you for playing!
          </Typography>
          <Typography
          variant="body1"
          style={{
            marginBottom: "2rem",
            fontWeight: "bold",
          }}
        >
        </Typography>
        </div>
      </div>
      {/* Return Button */}
      <Button
        variant="contained"
        onClick={() => navigate("/lessons")}
        sx={{
          position: "fixed", // Fixes the button position
          bottom: "20px", // Distance from the bottom
          right: "20px", // Distance from the right
          backgroundColor: "#8A2BE2",
          color: "#FFFFFF",
          "&:hover": { backgroundColor: "#7A1FCF" },
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "18px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        ←
      </Button>
    </div>
  );
};

export default Lesson1;