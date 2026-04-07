import { useEffect, useState } from "react";
import { getPropertyById, updateProperty } from "../api/propertyApi";
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
import { useNavigate, useParams } from "react-router-dom";

function EditPropertyPage() {
  const { id } = useParams();
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
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const data = await getPropertyById(id);

        setFormData({
          title: data.title || "",
          description: data.description || "",
          price: data.price || "",
          city: data.city || "",
          address: data.address || "",
          propertyType: data.propertyType || "apartment",
          rooms: data.rooms || "",
          area: data.area || "",
          status: data.status || "available",
        });
      } catch (err) {
        setError("Failed to load property");
      } finally {
        setLoading(false);
      }
    };

    loadProperty();
  }, [id]);

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
      await updateProperty(id, formData, token);
      navigate("/my-properties");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update property");
    }
  };

  if (loading) {
    return <Typography sx={{ p: 4 }}>Loading...</Typography>;
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
      <Paper sx={{ p: 4, width: 500 }}>
        <Typography variant="h4" mb={3}>
          Edit Property
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Title"
            name="title"
            fullWidth
            margin="normal"
            value={formData.title}
            onChange={handleChange}
          />

          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={formData.description}
            onChange={handleChange}
          />

          <TextField
            label="Price"
            name="price"
            type="number"
            fullWidth
            margin="normal"
            value={formData.price}
            onChange={handleChange}
          />

          <TextField
            label="City"
            name="city"
            fullWidth
            margin="normal"
            value={formData.city}
            onChange={handleChange}
          />

          <TextField
            label="Address"
            name="address"
            fullWidth
            margin="normal"
            value={formData.address}
            onChange={handleChange}
          />

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

          <TextField
            label="Rooms"
            name="rooms"
            type="number"
            fullWidth
            margin="normal"
            value={formData.rooms}
            onChange={handleChange}
          />

          <TextField
            label="Area"
            name="area"
            type="number"
            fullWidth
            margin="normal"
            value={formData.area}
            onChange={handleChange}
          />

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
            Save Changes
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default EditPropertyPage;