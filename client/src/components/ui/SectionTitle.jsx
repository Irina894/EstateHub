import React from "react";
import { Box, Typography } from "@mui/material";

export default function SectionTitle({ title, subtitle, align = "left", sx = {} }) {
  return (
    <Box sx={{ mb: 3.5, textAlign: align, ...sx }}>
      <Typography variant="h5" sx={{ fontWeight: 800, color: "#262626", letterSpacing: "-0.02em", lineHeight: 1.15 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="body2" sx={{ color: "#595959", mt: 0.5, fontWeight: 400 }}>
          {subtitle}
        </Typography>
      )}
      <Box sx={{
        width: 32, height: 3, borderRadius: 99,
        background: "linear-gradient(90deg,#D95829,#E8673A)",
        mt: 1.5, mx: align === "center" ? "auto" : 0,
      }} />
    </Box>
  );
}