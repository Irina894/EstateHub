import { useEffect, useState } from "react";
import {
  getOwnerApplications,
  updateApplicationStatus,
} from "../api/applicationApi";
import { useAuth } from "../context/AuthContext";
import {
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";

function OwnerApplicationsPage() {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);

  const loadApplications = async () => {
    try {
      const data = await getOwnerApplications(token);
      setApplications(data);
    } catch (error) {
      console.error("Failed to load owner applications:", error);
    }
  };

  useEffect(() => {
    if (token) {
      loadApplications();
    }
  }, [token]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateApplicationStatus(id, newStatus, token);
      loadApplications();
    } catch (error) {
      console.error("Failed to update application status:", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3}>
        Applications for My Properties
      </Typography>

      {applications.length === 0 && (
        <Typography>No applications yet.</Typography>
      )}

      {applications.map((application) => (
        <Card key={application._id} sx={{ mb: 2 }}>
          <CardContent>
            <Typography variant="h6">
              {application.propertyId?.title}
            </Typography>

            <Typography>
              <strong>Client:</strong> {application.clientId?.name}
            </Typography>

            <Typography>
              <strong>Email:</strong> {application.clientId?.email}
            </Typography>

            <Typography>
              <strong>Phone:</strong> {application.phone}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              <strong>Message:</strong> {application.message}
            </Typography>
            
<Typography sx={{ mt: 1 }}>
  <strong>Created:</strong> {new Date(application.createdAt).toLocaleString()}
</Typography>
            <Box sx={{ mt: 2, maxWidth: 220 }}>
              <TextField
                select
                label="Status"
                fullWidth
                value={application.status}
                onChange={(e) =>
                  handleStatusChange(application._id, e.target.value)
                }
              >
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="in_review">In Review</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </TextField>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default OwnerApplicationsPage;