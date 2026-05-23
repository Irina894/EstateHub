import { Box, Paper, Typography } from "@mui/material";

function StatsCard({ title, value, subtitle, icon }) {
  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: "#fff",
        borderRadius: 4,
        boxShadow: "0px 8px 24px rgba(0,0,0,0.08)",
        transition: "0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0px 14px 34px rgba(0,0,0,0.12)",
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography
            sx={{
              color: "text.secondary",
              fontSize: 14,
              fontWeight: 600,
              mb: 1,
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{
              color: "#010440",
              fontSize: 30,
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {value}
          </Typography>

          {subtitle && (
            <Typography
              sx={{
                color: "text.secondary",
                fontSize: 13,
                mt: 1,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>

        {icon && (
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              bgcolor: "#F2DFDF",
              color: "#BF4124",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        )}
      </Box>
    </Paper>
  );
}

export default StatsCard;