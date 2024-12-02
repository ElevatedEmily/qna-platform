import  { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { Mesh } from "three";
import { Triplet } from "@react-three/cannon";

import { useNavigate } from "react-router-dom";
import { Physics, useBox, useSphere } from "@react-three/cannon";
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
import freebody from "../../public/frictionincline1.png";
import rotation from "../../public/frictionincline2.png";
import FBD from "../../public/frictionFBD.png";
import solve from "../../public/frictionsolve.png";
// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const InclinedPlane = ({ angle, friction }: { angle: number; friction: number }) => {
  const [ref, api] = useBox<Mesh>(() => ({
    rotation: [0, -Math.PI / 2, Math.atan(angle)],
    position: [0, -0.25, 0],
    args: [10, 0.5, 5],
    type: "Static",
    material: { friction },
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

const SlidingSphere = ({
  mass,
  angle,
  friction,
  acceleration,
  resetFlag,
}: {
  mass: number;
  angle: number;
  friction: number;
  acceleration: number;
  resetFlag: boolean;
}) => {
  const rampLength = 5;
  const startX = rampLength * 0.5;
  const startY = startX * Math.tan(angle);

  const [ref, api] = useSphere<Mesh>(() => ({
    mass,
    position: [startX - 2, startY + 1.5, 3],
    args: [0.5], // Radius of the sphere
    material: { friction },
  }));

  useEffect(() => {
    if (resetFlag) {
      api.position.set(startX - 2, startY + 1.5, 3);
      api.velocity.set(0, 0, 0);
    }
  }, [resetFlag, api, startX, startY]);

  useEffect(() => {
    if (acceleration === 0) {
      api.velocity.set(0, 0, 0);
      api.angularVelocity.set(0, 0, 0);
    } else {
      const force = mass * acceleration;
      const forceDirection: Triplet = [
        force * Math.sin(angle),
        -force * Math.cos(angle),
        0,
      ];
      api.applyForce(forceDirection, [0, 0, 0]);
    }
  }, [acceleration, api, mass, angle]);

  return (
    <mesh ref={ref} castShadow>
      <sphereGeometry args={[0.5]} />
      <meshStandardMaterial color="#FFD700" />
    </mesh>
  );
};

const Lesson2 = () => {
  const [angle, setAngle] = useState(0.1);
  const navigate = useNavigate();
  const [mass, setMass] = useState(1);
  const [gravity, setGravity] = useState(-9.81);
  const [friction, setFriction] = useState(0.1);
  const [resetFlag, setResetFlag] = useState(false);
  const [timeData, setTimeData] = useState<number[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [quizFeedback, setQuizFeedback] = useState("");
  const [accelerationData, setAccelerationData] = useState<number[]>([]);
  const [velocityData, setVelocityData] = useState<number[]>([]);
  const [positionData, setPositionData] = useState<number[]>([]);
  const [calculatedAcceleration, setCalculatedAcceleration] = useState(0);

  const intervalRef = useRef<any>(null);

  const calculateMotion = () => {
    const g = Math.abs(gravity);
    const sinAngle = Math.sin(angle);

    const acceleration = g * sinAngle * (1 - friction) / (1 + 2 / 5);

    setCalculatedAcceleration(acceleration);

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
      setQuizFeedback("Correct! The motion depends on the angle, coefficient of friction, and gravity.");
    } else {
      setQuizFeedback("Incorrect. Please experiment with the simulation and try again.");
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
  }, [angle, gravity, friction]);

  useEffect(() => {
    resetPosition();
  }, [friction]);

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
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#121212", // Page background
    }}
  >
      <div
        style={{
          backgroundColor: "#1e1e1e", // Dark gray background for the box
          borderRadius: "15px", // Rounded corners
          padding: "2rem",
          maxWidth: "1600px", // Constrain content width
          width: "80%", // Ensure responsiveness
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.5)", // Optional: Add a shadow for a sleek effect
        }}
      >
        <Typography
          variant="h3"
          className="lesson-title"
          style={{
            fontFamily: "Inter",
            marginBottom: "2rem",
            textAlign: "center",
          }}
        >
          Intermediate Ramps
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
          Welcome to Intermediate Ramps! I recommend viewing Intro to Ramps first, but here we are 
          experimenting with adding friction and seeing how it affects objects on the ramp. Feel free 
          to play with the simulation! 
        </Typography>
        <div className="lesson-canvas" style={{ marginBottom: "2rem", width: "100%" }}>
          <Canvas shadows camera={{ position: [7, 2, 0], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 10, 5]} castShadow />
            <Physics gravity={[0, gravity, 0]} allowSleep={false}>
              <InclinedPlane angle={angle} friction={friction} />
              <SlidingSphere
                mass={mass}
                angle={angle}
                friction={friction}
                acceleration={calculatedAcceleration}
                resetFlag={resetFlag}
              />
            </Physics>
          </Canvas>
        </div>

        <div
          className="lesson-controls"
          style={{
            width: "100%",
            marginBottom: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
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

          <Typography variant="body1">Adjust Sphere Mass: {mass.toFixed(1)} kg</Typography>
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

          <Typography variant="body1">
            Adjust Friction Coefficient: {friction.toFixed(2)}
          </Typography>
          <Slider
            value={friction}
            onChange={(_, value) => setFriction(value as number)}
            min={0}
            max={1}
            step={0.01}
            sx={{ color: "#FF4500" }}
          />

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#8A2BE2",
              "&:hover": { backgroundColor: "#7A1FCF" },
            }}
            onClick={resetPosition}
          >
            Reset Sphere Position
          </Button>
        </div>

        <div
          className="chart-container"
          style={{
            height: "400px",
            width: "100%",
            marginBottom: "2rem",
          }}
        >
          <Line data={chartData} options={chartOptions} />
        </div>
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
            Quiz: Understanding Friction and Motion
          </Typography>
          <Typography
            variant="body1"
            style={{
              fontFamily: "Inter",
              marginBottom: "1rem",
              textAlign: "center",
            }}
          >
            What determines the sphere's acceleration down the ramp?
          </Typography>
          <RadioGroup
            value={selectedAnswer}
            onChange={(e) => setSelectedAnswer(e.target.value)}
            style={{ marginBottom: "1rem", textAlign: "center" }}
          >
            <FormControlLabel
              value="incorrect1"
              control={<Radio />}
              label="the coefficient of friction, angle, and mass"
            />
            <FormControlLabel
              value="incorrect2"
              control={<Radio />}
              label="the coefficient of friction, angle, mass, and gravity"
            />
            <FormControlLabel
              value="correct"
              control={<Radio />}
              label="the coefficient of friction, angle, and gravity"
            />
            <FormControlLabel
              value="incorrect3"
              control={<Radio />}
              label="the coefficient of friction, angle, mass, radius of the sphere, and gravity"
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

        {/* Text Section */}
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
            Why Does the Sphere Roll? 
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
            If we recall Intro to Ramps we had a block on a frictionless plane which slid down the ramp.
            Now, we have a ramp with friction and a sphere which rolls down the ramp. It would seem that by
            simply adding friction we now cause objects to roll down the ramp. Let's explore why that is! 
          </Typography>
        </div>

        {/* Image Section */}
        <div
          style={{
            marginTop: "2rem",
            textAlign: "center", // Center-align the image
          }}
        >
          <img
            src={freebody}
            alt="Friction Diagram"
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
            A simple free body diagram!
          </Typography>
        </div>
                {/* Text Section */}
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
            So... Why is the Sphere Rolling? 
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
            If we look at the sphere and think about the total torque being applied to the 
            sphere by these forces we can see that they are not zero meaning the sphere must
            roll. Torque occurs when a force is applied off the center of mass of an object that
            is not pointing towards the center of that object. It is the rotational equivalent of force.
            Torque is described by being equal to the magnitude of the force (F) times the distance from the center 
            of the object (r) times the sine of the angle of the force from the center. In this example the force normal
            is zero because it is pointed at the center of the sphere. Gravity is also zero as it occurs at the center 
            of the sphere while friction is positive as it is away from the center and is pointed away from the center.
          </Typography>
        </div>
        {/* Image Section */}
        <div
          style={{
            marginTop: "2rem",
            textAlign: "center", // Center-align the image
          }}
        >
          <img
            src={rotation}
            alt="Friction Diagram"
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
            A  free body diagram and a little math!
          </Typography>
        </div>
                {/* Text Section */}
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
            The Sphere is Rolling Because of Friction 
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
            When we write down the equations and analyze all of the torques on the sphere we see that 
            the only force causing the ball to roll is friction. If this simulation where to not have friction
            the ball would simply slide down the ramp similar to the block in Intro to Ramps. Now to determine
            how fast the sphere rolls we need to consider Newton's Second Law of Rotation stating the net torque
            is equal to intertial momentum times angular acceleration. So, to solve for our torque and angular acceleration 
            we need to solve for the force normal. Let's consider a force body diagram.
          </Typography>
        </div>
                {/* Image Section */}
                <div
          style={{
            marginTop: "2rem",
            textAlign: "center", // Center-align the image
          }}
        >
          <img
            src={FBD}
            alt="Friction Diagram"
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
            A new free body diagram and a little more math!
          </Typography>
        </div>
                {/* Text Section */}
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
            Solving for Force Normal 
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
            Since the sphere is staying on the ramp we know in the direction pointing away from the ramp
            must have a net force of 0 meaning the force normal plus the component due to gravity must equal 0
            allowing us to solve for our force normal. Now let's solve for our angular acceleration and the 
            linear acceleration down the ramp by putting our two equations together.
          </Typography>
        </div>
                        {/* Image Section */}
                        <div
          style={{
            marginTop: "2rem",
            textAlign: "center", // Center-align the image
          }}
        >
          <img
            src={solve}
            alt="Friction Diagram"
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
            Solving for Acceleration!
          </Typography>
        </div>
                {/* Text Section */}
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
            Bringing It All Together 
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
            Now we can do some simple algebra with our rotational equations to find that our 
            acceleration depends on the coefficient of friction, the angle of the ramp, and the acceleration due to gravity. 
            We also learnd that objects roll because of friction. Thank you for playing!
          </Typography>
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
      
    </div>
  );
};

export default Lesson2;
