import { Box, Typography } from "@mui/material";

function ContactsPage() {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={2}>
        Contacts
      </Typography>
      <Typography>Email: support@estatehub.local</Typography>
      <Typography>Phone: +380 00 000 00 00</Typography>
    </Box>
  );
}

export default ContactsPage;