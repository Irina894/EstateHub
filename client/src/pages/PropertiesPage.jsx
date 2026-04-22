import { useEffect, useState } from "react";
import { getAllProperties } from "../api/propertyApi";
import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
  Paper,
  Grid
} from "@mui/material";

import { Link } from "react-router-dom";

function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    city: "",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
  });

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await getAllProperties(filters);
      setProperties(data);
    } catch (error) {
      console.error("Failed to load properties:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <Box sx={{ p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" mb={3} fontWeight="bold">
        Properties Catalog
      </Typography>

      {/* Фільтри */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
          <TextField
            select
            label="City"
            name="city"
            value={filters.city}
            onChange={handleChange}
            sx={{ minWidth: 150 }}
            size="small"
          >
            <MenuItem value="">All Cities</MenuItem>
            <MenuItem value="Chernivtsi">Chernivtsi</MenuItem>
            <MenuItem value="Lviv">Lviv</MenuItem>
            <MenuItem value="Ternopil">Ternopil</MenuItem>
            <MenuItem value="Ivano-Frankivsk">Ivano-Frankivsk</MenuItem>
          </TextField>

          <TextField
            select
            label="Type"
            name="propertyType"
            value={filters.propertyType}
            onChange={handleChange}
            sx={{ minWidth: 150 }}
            size="small"
          >
            <MenuItem value="">All Types</MenuItem>
            <MenuItem value="apartment">Apartment</MenuItem>
            <MenuItem value="house">House</MenuItem>
            <MenuItem value="commercial">Commercial</MenuItem>
            <MenuItem value="land">Land</MenuItem>
          </TextField>

          <TextField
            label="Min Price"
            name="minPrice"
            type="number"
            value={filters.minPrice}
            onChange={handleChange}
            size="small"
            inputProps={{ min: 0 }}
          />

          <TextField
            label="Max Price"
            name="maxPrice"
            type="number"
            value={filters.maxPrice}
            onChange={handleChange}
            size="small"
            inputProps={{ min: 0 }}
          />

          <Button variant="contained" onClick={handleFilter} disabled={loading} sx={{ height: 40 }}>
            {loading ? "Searching..." : "Apply Filters"}
          </Button>
        </Box>
      </Paper>

      {/* Контент */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : properties.length > 0 ? (
        <Grid container spacing={3}>
          {properties.map((property) => (
            // ВИКОРИСТОВУЄМО size ЗАМІСТЬ xs/sm/lg ДЛЯ Grid2
            <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={property._id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                transition: "0.3s",
                "&:hover": { boxShadow: 10 } 
              }}>
                {property.images?.[0] ? (
                  <Box
                    component="img"
                    src={property.images[0]}
                    alt={property.title}
                    sx={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Box sx={{ 
                    height: 200, 
                    bgcolor: '#eee', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                  }}>
                    <Typography color="textSecondary">No Image Available</Typography>
                  </Box>
                )}
                
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom>{property.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    📍 {property.city}, {property.address}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2"><strong>Type:</strong> {property.propertyType}</Typography>
                    <Typography variant="body2"><strong>Rooms:</strong> {property.rooms}</Typography>
                  </Box>
                  
                  <Typography variant="h6" color="primary.main" sx={{ mb: 2 }}>
                    ${property.price?.toLocaleString()}
                  </Typography>

                  <Button
                    component={Link}
                    to={`/properties/${property._id}`}
                    variant="contained"
                    fullWidth
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ textAlign: 'center', mt: 10 }}>
          <Typography variant="h6" color="textSecondary">
            No properties found. Try changing your filters.
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default PropertiesPage;