import { useEffect, useState } from "react";
import { deleteProperty, getMyProperties } from "../api/propertyApi";
import { useAuth } from "../context/AuthContext";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

function MyPropertiesPage() {
  const { token } = useAuth();
  const [properties, setProperties] = useState([]);
  const [error, setError] = useState("");

  const loadProperties = async () => {
    if (!token) return;

    try {
      const data = await getMyProperties(token);
      setProperties(data);
    } catch (error) {
      console.error("Failed to load my properties:", error);
      setError("Failed to load my properties");
    }
  };

  useEffect(() => {
    loadProperties();
  }, [token]);

  const handleDelete = async (id) => {
    try {
      await deleteProperty(id, token);
      loadProperties();
    } catch (error) {
      console.error("Failed to delete property:", error);
      setError("Failed to delete property");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        My Properties
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {properties.length === 0 && (
        <Typography>You do not have any properties yet.</Typography>
      )}

      {properties.map((property) => (
        <Card key={property._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{property.title}</Typography>
            <Typography>{property.city}</Typography>
            <Typography>${property.price}</Typography>
            <Typography>Status: {property.status}</Typography>

            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button
                component={Link}
                to={`/properties/${property._id}`}
                variant="outlined"
              >
                View
              </Button>

              <Button
                component={Link}
                to={`/properties/edit/${property._id}`}
                variant="contained"
              >
                Edit
              </Button>

              <Button
                color="error"
                variant="contained"
                onClick={() => handleDelete(property._id)}
              >
                Delete
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default MyPropertiesPage;