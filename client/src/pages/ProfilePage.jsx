import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../api/authApi";
import { useAuth } from "../context/AuthContext";
import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

function ProfilePage() {
  const { token, login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile(token);
        setFormData({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      } catch {
        setError("Failed to load profile");
      }
    };

    if (token) loadProfile();
  }, [token]);

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
      const res = await updateProfile(
        {
          name: formData.name,
          phone: formData.phone,
        },
        token
      );

      login(res.user, token);
      setSuccessOpen(true);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography variant="h4" mb={3}>
          Profile
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            value={formData.name}
            onChange={handleChange}
          />

          <TextField
            label="Email"
            fullWidth
            margin="normal"
            value={formData.email}
            disabled
          />

          <TextField
            label="Phone"
            name="phone"
            fullWidth
            margin="normal"
            value={formData.phone}
            onChange={handleChange}
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Save Changes
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={successOpen}
        autoHideDuration={2000}
        onClose={() => setSuccessOpen(false)}
      >
        <Alert severity="success">Profile updated</Alert>
      </Snackbar>
    </Box>
  );
}

export default ProfilePage;