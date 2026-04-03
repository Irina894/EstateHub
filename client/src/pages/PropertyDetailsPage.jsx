import { useEffect, useState } from "react";
import { getPropertyById } from "../api/propertyApi";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

function PropertyDetailsPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const data = await getPropertyById(id);
        setProperty(data);
      } catch (error) {
        console.error("Failed to load property:", error);
      }
    };

    loadProperty();
  }, [id]);

  if (!property) {
    return <Typography sx={{ p: 4 }}>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: 4 }}>
      <Card>
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
        </CardContent>
      </Card>
    </Box>
  );
}

export default PropertyDetailsPage;