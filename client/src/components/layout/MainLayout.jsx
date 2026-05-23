import React from "react";
import { Box } from "@mui/material";
import AppNavbar from "../layout/AppNavbar";

export default function MainLayout({ children }) {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppNavbar />
      <Box sx={{ pt: { xs: "60px", md: "68px" } }}>
        {children}
      </Box>
    </Box>
  );
}