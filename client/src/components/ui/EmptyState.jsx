import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Inbox } from "lucide-react";

export default function EmptyState({ icon, title = "Nothing here yet", description, actionLabel, onAction }) {
  return (
    <Box sx={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", py: { xs: 10, md: 14 }, px: 3, textAlign: "center",
    }}>
      <Box sx={{
        width: 84, height: 84, borderRadius: "50%", mb: 3,
        background: "linear-gradient(135deg,rgba(217,88,41,0.1),rgba(217,88,41,0.04))",
        border: "1.5px solid rgba(217,88,41,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {icon || <Inbox size={34} color="#D95829" strokeWidth={1.5} />}
      </Box>
      <Typography variant="h6" fontWeight={800} color="#262626" sx={{ mb: 0.8, letterSpacing: "-0.01em" }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="#595959" sx={{ maxWidth: 360, lineHeight: 1.7 }}>
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="contained" color="primary" onClick={onAction} sx={{ mt: 3.5 }}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}