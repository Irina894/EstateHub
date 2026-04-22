import { Box, Typography } from "@mui/material";

function AboutPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={2}>
        About Us
      </Typography>
      <Typography>
        EstateHub is a platform for browsing properties, submitting applications,
        and connecting clients with owners and realtors.
      </Typography>
    </Box>
  );
}

export default AboutPage;