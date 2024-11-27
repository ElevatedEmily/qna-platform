
import { Box, Typography, Grid, Card, CardContent, CardMedia } from "@mui/material";

const Dashboard = () => {
  const recentItems = [
    { title: "Figma Basics", description: "Learn the basics of Figma.", image: "/images/figma-basics.png" },
    { title: "Team Library", description: "Build your own team library.", image: "/images/team-library.png" },
    { title: "Untitled", description: "Your latest project.", image: "/images/placeholder.png" },
  ];

  return (
    <Box p={3} sx={{ backgroundColor: "#121212", minHeight: "100vh" }}>
      <Typography variant="h4" gutterBottom color="white">
        Recents
      </Typography>
      <Grid container spacing={3}>
        {recentItems.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ backgroundColor: "#1E1E1E" }}>
              <CardMedia
                component="img"
                height="140"
                image={item.image}
                alt={item.title}
                sx={{ objectFit: "cover" }}
              />
              <CardContent>
                <Typography variant="h6" color="white">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="gray">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
