import React from "react";
import { Chip } from "@mui/material";

const MAP = {
  available: { label: "Available", bg: "#D1FAE5", color: "#065F46" },
  rented:    { label: "Rented",    bg: "#FEF3C7", color: "#92400E" },
  sold:      { label: "Sold",      bg: "#FEE2E2", color: "#991B1B" },
  reserved:  { label: "Reserved",  bg: "#DBEAFE", color: "#1E40AF" },
};

export default function StatusChip({ status, size = "small" }) {
  const c = MAP[status] || { label: status, bg: "#F2F2F2", color: "#595959" };
  return (
    <Chip
      size={size}
      label={c.label}
      sx={{
        bgcolor: c.bg, color: c.color,
        fontWeight: 700, fontSize: "0.67rem",
        height: size === "small" ? 22 : 26,
        borderRadius: "6px", letterSpacing: "0.05em", textTransform: "uppercase",
        "& .MuiChip-label": { px: 1.2 },
      }}
    />
  );
}