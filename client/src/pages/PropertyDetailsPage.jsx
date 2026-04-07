import { useEffect, useState } from "react";
import { getPropertyById } from "../api/propertyApi";
import { createApplication } from "../api/applicationApi";
import { useAuth } from "../context/AuthContext";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";

function PropertyDetailsPage() {
  const { id } = useParams();
  const { user, token, isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [error, setError] = useState("");
  const [applicationError, setApplicationError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const [applicationData, setApplicationData] = useState({
    message: "",
    phone: "",
  });

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        setError("Failed to load property");
      }
    };

    loadProperty();
  }, [id]);

  const handleApplicationChange = (e) => {
    setApplicationData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleApply = async (e) => {
    e.preventDefault();
    setApplicationError("");

    try {
      await createApplication(
        {
          propertyId: property._id,
          message: applicationData.message,
          phone: applicationData.phone,
        },
        token
      );

      setSuccessOpen(true);
      setApplicationData({
        message: "",
        phone: "",
      });
    } catch (err) {
      setApplicationError(
        err.response?.data?.message || "Failed to submit application"
      );
    }
  };

  if (error) {
    return (
      <Typography sx={{ p: 4 }} color="error">
        {error}
      </Typography>
    );
  }

  if (!property) {
    return <Typography sx={{ p: 4 }}>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h4" mb={2}>
            {property.title}
          </Typography>

          <Typography mb={1}>
            <strong>Description:</strong> {property.description}
          </Typography>

          <Typography mb={1}>
            <strong>City:</strong> {property.city}
          </Typography>

          <Typography mb={1}>
            <strong>Address:</strong> {property.address}
          </Typography>

          <Typography mb={1}>
            <strong>Type:</strong> {property.propertyType}
          </Typography>

          <Typography mb={1}>
            <strong>Rooms:</strong> {property.rooms}
          </Typography>

          <Typography mb={1}>
            <strong>Area:</strong> {property.area} m²
          </Typography>

          <Typography mb={1}>
            <strong>Price:</strong> ${property.price}
          </Typography>

          <Typography mb={1}>
            <strong>Status:</strong> {property.status}
          </Typography>

          <Typography mt={2}>
            <strong>Owner:</strong> {property.ownerId?.name} ({property.ownerId?.email})
          </Typography>

          <Box sx={{ mt: 3 }}>
            <Button component={Link} to="/properties" variant="outlined">
              Back to Catalog
            </Button>
          </Box>
        </CardContent>
      </Card>

      {isAuthenticated && user?.role === "client" && (
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" mb={2}>
            Apply for this Property
          </Typography>

          <Box component="form" onSubmit={handleApply}>
            <TextField
              label="Message"
              name="message"
              fullWidth
              multiline
              rows={4}
              margin="normal"
              value={applicationData.message}
              onChange={handleApplicationChange}
            />

            <TextField
              label="Phone"
              name="phone"
              fullWidth
              margin="normal"
              value={applicationData.phone}
              onChange={handleApplicationChange}
            />

            {applicationError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {applicationError}
              </Alert>
            )}

            <Button type="submit" variant="contained" sx={{ mt: 3 }}>
              Submit Application
            </Button>
          </Box>
        </Paper>
      )}

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Заявку успішно відправлено.
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PropertyDetailsPage;