import { useState } from "react";
import { forgotPassword } from "../api/authApi";
import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await forgotPassword(email);
      setSuccessOpen(true);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset email");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 6,
      }}
    >
      <Paper sx={{ p: 4, width: 420 }}>
        <Typography variant="h4" mb={3}>
          Forgot Password
        </Typography>

        <Typography variant="body1" mb={2}>
          Enter your email address and we will send you a password reset link.
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Send Reset Link
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Лист для відновлення пароля успішно відправлено.
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ForgotPasswordPage;