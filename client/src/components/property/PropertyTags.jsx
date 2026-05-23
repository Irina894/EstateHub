import React from "react";
import { Box } from "@mui/material";
import { Star, TrendingDown, BadgeCheck } from "lucide-react";

const MAP = {
  TOP:      { label: "TOP",      bg: "linear-gradient(135deg,#B8431A,#D95829)", icon: <Star        size={10} /> },
  Reduced:  { label: "Reduced",  bg: "linear-gradient(135deg,#1D4ED8,#3B82F6)", icon: <TrendingDown size={10} /> },
  Verified: { label: "Verified", bg: "linear-gradient(135deg,#065F46,#059669)", icon: <BadgeCheck   size={10} /> },
};

export default function PropertyTags({ tags = [], sx = {} }) {
  if (!tags?.length) return null;
  return (
    <Box sx={{ display: "flex", gap: 0.6, flexWrap: "wrap", ...sx }}>
      {tags.map((tag) => {
        const c = MAP[tag] || { label: tag, bg: "#595959", icon: null };
        return (
          <Box key={tag} sx={{
            display: "inline-flex", alignItems: "center", gap: "4px",
            px: "8px", height: "21px", borderRadius: "6px",
            background: c.bg, color: "#fff",
            fontWeight: 700, fontSize: "0.63rem",
            letterSpacing: "0.06em", textTransform: "uppercase",
            fontFamily: '"Sora","Inter",sans-serif',
          }}>
            {c.icon}{c.label}
          </Box>
        );
      })}
    </Box>
  );
}