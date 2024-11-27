
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Header = ({ onMenuClick }: { onMenuClick: () => void }) => (
  <AppBar position="sticky" sx={{ backgroundColor: "#2C2C2C" }}>
    <Toolbar>
      <IconButton edge="start" color="inherit" aria-label="menu" onClick={onMenuClick}>
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Figma-Like Dashboard
      </Typography>
      <Box>
        {/* Placeholder for Profile Avatar or Icons */}
      </Box>
    </Toolbar>
  </AppBar>
);

export default Header;
