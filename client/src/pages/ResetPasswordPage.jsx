import { useState } from "react";
import { resetPassword } from "../api/authApi";
import {
  Alert,
  Box,
  Button,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in both password fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await resetPassword(token, password);
      setSuccessOpen(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
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
          Reset Password
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            Reset Password
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={successOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessOpen(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Пароль успішно змінено.
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ResetPasswordPage;