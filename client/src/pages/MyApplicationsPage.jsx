import { useEffect, useState } from "react";
import { getMyApplications } from "../api/applicationApi";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";

function MyApplicationsPage() {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await getMyApplications(token);
        setApplications(data);
      } catch (error) {
        console.error("Failed to load my applications:", error);
      }
    };

    if (token) {
      loadApplications();
    }
  }, [token]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        My Applications
      </Typography>

      {applications.length === 0 && (
        <Typography>You do not have any applications yet.</Typography>
      )}

      {applications.map((application) => (
        <Card key={application._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">
              {application.propertyId?.title}
            </Typography>

            <Typography>
              <strong>City:</strong> {application.propertyId?.city}
            </Typography>

            <Typography>
              <strong>Price:</strong> ${application.propertyId?.price}
            </Typography>

            <Typography>
              <strong>Owner:</strong> {application.ownerId?.name}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              <strong>Message:</strong> {application.message}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              <strong>Phone:</strong> {application.phone}
            </Typography>

            <Box sx={{ mt: 2 }}>
              <Chip label={application.status} color="primary" />
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default MyApplicationsPage;