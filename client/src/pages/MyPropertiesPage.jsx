import { useEffect, useState } from "react";
import { deleteProperty, getMyProperties } from "../api/propertyApi";
import { useAuth } from "../context/AuthContext";
import {
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

  const loadProperties = async () => {
    try {
      const data = await getMyProperties(token);
      setProperties(data);
    } catch (error) {
      console.error("Failed to load my properties:", error);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProperty(id, token);
      loadProperties();
    } catch (error) {
      console.error("Failed to delete property:", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        My Properties
      </Typography>

      {properties.map((property) => (
        <Card key={property._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">{property.title}</Typography>
            <Typography>{property.city}</Typography>
            <Typography>${property.price}</Typography>
            <Typography>Status: {property.status}</Typography>

            <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
              <Button component={Link} to={`/properties/${property._id}`} variant="outlined">
                View
              </Button>

              <Button color="error" variant="contained" onClick={() => handleDelete(property._id)}>
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