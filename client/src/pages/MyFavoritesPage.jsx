import { useEffect, useState } from "react";
import { getMyFavorites, removeFromFavorites } from "../api/favoriteApi";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";

function MyFavoritesPage() {
  const { token } = useAuth();
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = async () => {
    try {
      const data = await getMyFavorites(token);
      setFavorites(data);
    } catch (error) {
      console.error("Failed to load favorites:", error);
    }
  };

  useEffect(() => {
    if (token) {
      loadFavorites();
    }
  }, [token]);

  const handleRemove = async (propertyId) => {
    try {
      await removeFromFavorites(propertyId, token);
      loadFavorites();
    } catch (error) {
      console.error("Failed to remove favorite:", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        My Favorites
      </Typography>

      {favorites.length === 0 && (
        <Typography>You do not have favorite properties yet.</Typography>
      )}

      {favorites.map((favorite) => {
        const property = favorite.propertyId;

        if (!property) return null;

        return (
          <Card key={favorite._id} sx={{ mb: 2 }}>
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
                  variant="contained"
                  color="error"
                  onClick={() => handleRemove(property._id)}
                >
                  Remove
                </Button>
              </Box>
            </CardContent>
          </Card>
        );
      })}
    </Box>
  );
}

export default MyFavoritesPage;