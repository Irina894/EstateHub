import { Box, Button, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ClientDashboardPage() {
  const { user } = useAuth();

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        Client Dashboard
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6">Welcome, {user?.name}</Typography>
        <Typography>Email: {user?.email}</Typography>
        <Typography>Role: {user?.role}</Typography>
      </Paper>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button component={Link} to="/properties" variant="contained">
          Browse Properties
        </Button>

        <Button component={Link} to="/my-applications" variant="outlined">
          My Applications
        </Button>

        <Button component={Link} to="/my-favorites" variant="outlined">
         My Favorites
        </Button>
      </Box>
    </Box>
  );
}

export default ClientDashboardPage;