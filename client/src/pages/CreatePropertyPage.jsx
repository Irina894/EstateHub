import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    imageUrl: "", // Тимчасове поле для одного фото
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Формуємо корисне навантаження для API
      const payload = {
        ...formData,
        // Перетворюємо рядок з URL в масив, який очікує бекенд
        images: formData.imageUrl ? [formData.imageUrl] : [],
      };
      
      // Видаляємо допоміжне поле imageUrl перед відправкою
      delete payload.imageUrl;

      const data = await createProperty(payload, token);
      
      // Переходимо на сторінку створеного об'єкта
      if (data?.property?._id) {
        navigate(`/properties/${data.property._id}`);
      } else {
        navigate("/properties");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4, width: "100%", maxWidth: 600 }}>
        <Typography variant="h4" mb={3} textAlign="center">
          Create New Listing
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField 
            label="Title" name="title" fullWidth margin="normal" required
            value={formData.title} onChange={handleChange} 
          />
          
          <TextField 
            label="Description" name="description" fullWidth margin="normal" 
            multiline rows={4} required
            value={formData.description} onChange={handleChange} 
          />

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField 
              label="Price ($)" name="price" type="number" fullWidth margin="normal" required
              value={formData.price} onChange={handleChange} inputProps={{ min: 0 }}
            />
            <TextField 
              label="Area (m²)" name="area" type="number" fullWidth margin="normal" required
              value={formData.area} onChange={handleChange} inputProps={{ min: 0 }}
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField 
              label="City" name="city" fullWidth margin="normal" required
              value={formData.city} onChange={handleChange} 
            />
            <TextField 
              label="Address" name="address" fullWidth margin="normal" required
              value={formData.address} onChange={handleChange} 
            />
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <TextField
              select label="Type" name="propertyType" fullWidth margin="normal"
              value={formData.propertyType} onChange={handleChange}
            >
              <MenuItem value="apartment">Apartment</MenuItem>
              <MenuItem value="house">House</MenuItem>
              <MenuItem value="commercial">Commercial</MenuItem>
              <MenuItem value="land">Land</MenuItem>
            </TextField>

            <TextField 
              label="Rooms" name="rooms" type="number" fullWidth margin="normal" required
              value={formData.rooms} onChange={handleChange} inputProps={{ min: 0 }} 
            />
          </Box>

          <TextField 
            label="Main Image URL" name="imageUrl" fullWidth margin="normal"
            placeholder="https://example.com/photo.jpg"
            value={formData.imageUrl} onChange={handleChange} 
          />

          <TextField
            select label="Initial Status" name="status" fullWidth margin="normal"
            value={formData.status} onChange={handleChange}
          >
            <MenuItem value="available">Available</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="sold">Sold</MenuItem>
            <MenuItem value="hidden">Hidden</MenuItem>
          </TextField>

          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

          <Button 
            type="submit" variant="contained" fullWidth size="large"
            sx={{ mt: 3 }} disabled={loading}
          >
            {loading ? "Creating..." : "Post Listing"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default CreatePropertyPage;