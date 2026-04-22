import { Box, Button, Paper, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { getMyProperties } from "../api/propertyApi";
import { getOwnerApplications } from "../api/applicationApi";

function OwnerDashboardPage() {
  const { user, token } = useAuth();

  const [stats, setStats] = useState({
    properties: 0,
    applications: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const props = await getMyProperties(token);
        const apps = await getOwnerApplications(token);

        setStats({
          properties: props.length,
          applications: apps.length,
        });
      } catch (e) {
        console.log(e);
      }
    };

    if (token) {
      loadStats();
    }
  }, [token]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        Owner Dashboard
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6">Welcome, {user?.name}</Typography>
        <Typography>Email: {user?.email}</Typography>
        <Typography>Role: {user?.role}</Typography>
      </Paper>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography>Total Properties: {stats.properties}</Typography>
        <Typography>Total Applications: {stats.applications}</Typography>
      </Paper>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Button component={Link} to="/dashboard" variant="contained">
          Dashboard
        </Button>

        <Button component={Link} to="/properties/create" variant="contained">
          Add Property
        </Button>

        <Button component={Link} to="/my-properties" variant="outlined">
          My Properties
        </Button>

        <Button component={Link} to="/owner-applications" variant="outlined">
          Property Applications
        </Button>

        <Button component={Link} to="/properties" variant="outlined">
          Browse Catalog
        </Button>

        <Button component={Link} to="/profile" variant="outlined">
          Profile
        </Button>
      </Box>
    </Box>
  );
}

export default OwnerDashboardPage;