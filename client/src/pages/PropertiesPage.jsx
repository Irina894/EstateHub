import { useEffect, useState } from "react";
import { getAllProperties } from "../api/propertyApi";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({
    city: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
  });

  const loadProperties = async () => {
    try {
      const data = await getAllProperties(filters);
      setProperties(data);
    } catch (error) {
      console.error("Failed to load properties:", error);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const handleChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFilter = () => {
    loadProperties();
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        Properties Catalog
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4 }}>
        <TextField
          label="City"
          name="city"
          value={filters.city}
          onChange={handleChange}
        />

        <TextField
          select
          label="Type"
          name="propertyType"
          value={filters.propertyType}
          onChange={handleChange}
          sx={{ minWidth: 180 }}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="apartment">Apartment</MenuItem>
          <MenuItem value="house">House</MenuItem>
          <MenuItem value="commercial">Commercial</MenuItem>
          <MenuItem value="land">Land</MenuItem>
        </TextField>

        <TextField
          label="Min price"
          name="minPrice"
          type="number"
          value={filters.minPrice}
          onChange={handleChange}
        />

        <TextField
          label="Max price"
          name="maxPrice"
          type="number"
          value={filters.maxPrice}
          onChange={handleChange}
        />

        <Button variant="contained" onClick={handleFilter}>
          Apply Filters
        </Button>
      </Box>

      <Grid container spacing={3}>
        {properties.map((property) => (
          <Grid item xs={12} md={6} lg={4} key={property._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{property.title}</Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {property.city}, {property.address}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Type: {property.propertyType}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1 }}>
                  Rooms: {property.rooms}
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  Price: ${property.price}
                </Typography>

                <Button
                  component={Link}
                  to={`/properties/${property._id}`}
                  variant="outlined"
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default PropertiesPage;