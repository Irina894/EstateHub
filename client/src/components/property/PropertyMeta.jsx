import React from "react";
import { Box, Typography } from "@mui/material";
import { MapPin, BedDouble, Maximize2 } from "lucide-react";

function Item({ icon, label }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <Box sx={{ color: "#65768C", display: "flex" }}>{icon}</Box>
      <Typography sx={{ color: "#65768C", fontWeight: 500, fontSize: "0.78rem" }}>
        {label}
      </Typography>
    </Box>
  );
}

export default function PropertyMeta({ rooms, area, city, sx = {} }) {
  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", ...sx }}>
      {city  && <Item icon={<MapPin    size={13} />} label={city} />}
      {rooms && <Item icon={<BedDouble size={13} />} label={`${rooms} rooms`} />}
      {area  && <Item icon={<Maximize2 size={13} />} label={`${area} m²`} />}
    </Box>
  );
}