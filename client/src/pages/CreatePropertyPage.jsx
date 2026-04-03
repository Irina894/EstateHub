import { useState } from "react";
import { createProperty } from "../api/propertyApi";
import { useAuth } from "../context/AuthContext";
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function CreatePropertyPage() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    city: "",
    address: "",
    propertyType: "apartment",
    rooms: "",
    area: "",
    status: "available",
    images: [],
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await createProperty(formData, token);
      navigate(`/properties/${data.property._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create property");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Paper sx={{ p: 4, width: 500 }}>
        <Typography variant="h4" mb={3}>
          Create Property
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField label="Title" name="title" fullWidth margin="normal" value={formData.title} onChange={handleChange} />
          <TextField label="Description" name="description" fullWidth margin="normal" multiline rows={4} value={formData.description} onChange={handleChange} />
          <TextField label="Price" name="price" type="number" fullWidth margin="normal" value={formData.price} onChange={handleChange} />
          <TextField label="City" name="city" fullWidth margin="normal" value={formData.city} onChange={handleChange} />
          <TextField label="Address" name="address" fullWidth margin="normal" value={formData.address} onChange={handleChange} />

          <TextField
            select
            label="Property Type"
            name="propertyType"
            fullWidth
            margin="normal"
            value={formData.propertyType}
            onChange={handleChange}
          >
            <MenuItem value="apartment">Apartment</MenuItem>
            <MenuItem value="house">House</MenuItem>
            <MenuItem value="commercial">Commercial</MenuItem>
            <MenuItem value="land">Land</MenuItem>
          </TextField>

          <TextField label="Rooms" name="rooms" type="number" fullWidth margin="normal" value={formData.rooms} onChange={handleChange} />
          <TextField label="Area" name="area" type="number" fullWidth margin="normal" value={formData.area} onChange={handleChange} />

          <TextField
            select
            label="Status"
            name="status"
            fullWidth
            margin="normal"
            value={formData.status}
            onChange={handleChange}
          >
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="sold">Sold</MenuItem>
            <MenuItem value="hidden">Hidden</MenuItem>
          </TextField>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Create Property
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default CreatePropertyPage;