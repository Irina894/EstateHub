import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPropertyById } from "../api/propertyApi";
import { createApplication } from "../api/applicationApi";
import { useAuth } from "../context/AuthContext";
import { addToFavorites } from "../api/favoriteApi";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Paper,
  Snackbar,
  TextField,
  Typography,
  CircularProgress,
  Chip
} from "@mui/material";

function PropertyDetailsPage() {
  const { id } = useParams();
  const { user, token, isAuthenticated } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // States for application form
  const [applicationData, setApplicationData] = useState({ message: "", phone: "" });
  const [applicationError, setApplicationError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // States for favorites
  const [favoriteSuccessOpen, setFavoriteSuccessOpen] = useState(false);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        setLoading(true);
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (err) {
        setError("Failed to load property details. It might have been removed.");
      } finally {
        setLoading(false);
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

    // Валідація ПЕРЕД відправкою
    if (!applicationData.message || applicationData.message.trim().length < 10) {
      setApplicationError("Message must contain at least 10 characters");
      return;
    }
    if (!applicationData.phone || applicationData.phone.trim().length < 8) {
      setApplicationError("Please enter a valid phone number");
      return;
    }

    setSubmitting(true);
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
      setApplicationData({ message: "", phone: "" });
    } catch (err) {
      setApplicationError(
        err.response?.data?.message || "Failed to submit application"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddToFavorites = async () => {
    try {
      await addToFavorites(property._id, token);
      setFavoriteSuccessOpen(true);
    } catch (err) {
      setApplicationError(
        err.response?.data?.message || "Failed to add to favorites"
      );
    }
  };

  // Помічник для кольорів статусів
  const getStatusChip = (status) => {
    const statusMap = {
      available: { label: "Available", color: "success" },
      pending: { label: "Deal in Progress", color: "warning" },
      sold: { label: "Sold", color: "error" },
    };
    const config = statusMap[status] || { label: status, color: "default" };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ m: 4 }}>{error}</Alert>;
  if (!property) return null;

  const isOwner = user?._id === property.ownerId?._id;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1200, margin: "0 auto" }}>
      <Card sx={{ mb: 4, boxShadow: 3, borderRadius: 2, overflow: 'hidden' }}>
        {/* Головне фото */}
        {property.images?.[0] ? (
          <Box
            component="img"
            src={property.images[0]}
            alt={property.title}
            sx={{ width: "100%", height: { xs: 250, md: 400 }, objectFit: "cover" }}
          />
        ) : (
          <Box sx={{ width: "100%", height: 200, bgcolor: "#f0f0f0", display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Typography color="textSecondary">No Image Available</Typography>
          </Box>
        )}

        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
            <Typography variant="h4" fontWeight="bold">{property.title}</Typography>
            {getStatusChip(property.status)}
          </Box>

          <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
            ${property.price.toLocaleString()}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
            <Typography><strong>City:</strong> {property.city}</Typography>
            <Typography><strong>Address:</strong> {property.address}</Typography>
            <Typography><strong>Type:</strong> {property.propertyType}</Typography>
            <Typography><strong>Area:</strong> {property.area} m²</Typography>
            <Typography><strong>Rooms:</strong> {property.rooms}</Typography>
          </Box>

          <Typography sx={{ mt: 3, mb: 2 }}>
            <strong>Description:</strong><br />
            {property.description}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography color="text.secondary" variant="body2" mb={3}>
            <strong>Posted by:</strong> {property.ownerId?.name || "Owner"} ({property.ownerId?.email})
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button component={Link} to="/properties" variant="outlined">
              Back to Catalog
            </Button>

            {/* Додати в обране (Тільки для клієнтів) */}
            {isAuthenticated && user?.role === "client" && (
              <Button 
                variant="contained" 
                color="warning" 
                onClick={handleAddToFavorites}
                sx={{ fontWeight: 'bold' }}
              >
                ⭐ Add to Favorites
              </Button>
            )}

            {/* Редагування (Тільки для власника) */}
            {isOwner && (
              <Button component={Link} to={`/edit-property/${id}`} variant="contained" color="secondary">
                Edit Property
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* ФОРМА ЗАЯВКИ */}
      {isAuthenticated && user?.role === "client" && (
        property.status === "available" ? (
          <Paper sx={{ p: 4, boxShadow: 2, borderRadius: 2 }}>
            <Typography variant="h6" mb={2} fontWeight="bold">Interested in this property?</Typography>
            <Typography variant="body2" mb={3} color="textSecondary">
              Send a message to the owner and they will contact you as soon as possible.
            </Typography>
            <Box component="form" onSubmit={handleApply}>
              <TextField
                fullWidth
                label="Your Message"
                name="message"
                value={applicationData.message}
                onChange={handleApplicationChange}
                margin="normal"
                required
                multiline
                rows={3}
                placeholder="I am interested in this apartment. When can I see it?"
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={applicationData.phone}
                onChange={handleApplicationChange}
                margin="normal"
                required
                placeholder="+380..."
              />
              {applicationError && <Alert severity="error" sx={{ mt: 2 }}>{applicationError}</Alert>}
              <Button 
                type="submit" 
                variant="contained" 
                size="large"
                sx={{ mt: 3, px: 6 }} 
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Submit Application"}
              </Button>
            </Box>
          </Paper>
        ) : (
          <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
            This property is currently <strong>{property.status}</strong> and not accepting new applications.
          </Alert>
        )
      )}

      {/* ЗАКЛИК ДО РЕЄСТРАЦІЇ */}
      {!isAuthenticated && (
        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: '#f9f9f9', borderRadius: 2 }}>
          <Typography variant="h6" mb={1}>Want to apply or save this property?</Typography>
          <Typography mb={3} color="textSecondary">Please log in to your account to access all features.</Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: 'center' }}>
            <Button component={Link} to="/login" variant="contained" sx={{ px: 4 }}>Login</Button>
            <Button component={Link} to="/register" variant="outlined" sx={{ px: 4 }}>Register</Button>
          </Box>
        </Paper>
      )}

      {/* ПОВІДОМЛЕННЯ (SNACKBARS) */}
      <Snackbar
        open={successOpen}
        autoHideDuration={4000}
        onClose={() => setSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          Your application has been sent successfully!
        </Alert>
      </Snackbar>

      <Snackbar
        open={favoriteSuccessOpen}
        autoHideDuration={3000}
        onClose={() => setFavoriteSuccessOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          Property added to your favorites! ⭐
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default PropertyDetailsPage;