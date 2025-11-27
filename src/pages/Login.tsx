import React, { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Alert,
  CircularProgress,
  InputAdornment,
  useTheme,
  useMediaQuery,
  Snackbar,
  IconButton,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import CloseIcon from "@mui/icons-material/Close";
import { login, clearError } from "../store/slices/authSlice";
import { AppDispatch, RootState } from "../store";
import logo from "../assets/logo_2cents_white.svg";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, token } = useSelector(
    (state: RootState) => state.auth
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (token) {
      window.location.href = "/";
    }
  }, [token]);

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setOpenSnackbar(true);
    }
  }, [error]);

  const handleCloseSnackbar = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
    dispatch(clearError());
  };

  const validateForm = (): boolean => {
    const errors: {
      email?: string;
      password?: string;
    } = {};
    let isValid = true;

    if (!email) {
      errors.email = "Email é obrigatório";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email inválido";
      isValid = false;
    }

    if (!password) {
      errors.password = "Senha é obrigatória";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (validateForm()) {
      dispatch(login({ email, password }));
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        minWidth: "100vw",
        flexDirection: isMobile ? "column" : "row",
      }}>
      {isMobile && (
        <Box
          sx={{
            width: "100%",
            height: "200px",
            bgcolor: theme.palette.primary.main,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
          }}>
          <img src={logo} alt="Logo 2Cents" style={{ height: "auto" }} />
        </Box>
      )}

      <Box
        sx={{
          width: isMobile ? "100%" : "60%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}>
        <Box
          sx={{
            width: isMobile ? "100%" : "70%",
            p: 4,
            borderRadius: 2,
          }}>
          <form onSubmit={handleSubmit}>
            <TextField
              placeholder="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon sx={{ color: "#358156" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              placeholder="Senha"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!formErrors.password}
              helperText={formErrors.password}
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#358156" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                bgcolor: "#358156",
                color: "white",
                borderRadius: "50px",
                textTransform: "none",
                mt: 3,
                mb: 2,
                "&:hover": { bgcolor: "#2c6b47" },
              }}>
              {loading ? <CircularProgress size={24} /> : "Entrar"}
            </Button>

            <Typography variant="body2" align="center" sx={{ color: "#666" }}>
              Não possui conta?{" "}
              <Link
                component={RouterLink}
                to="/register"
                sx={{
                  color: "#358156",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}>
                Registre-se
              </Link>
            </Typography>
          </form>
        </Box>
      </Box>

      {!isMobile && (
        <Box
          sx={{
            width: "40%",
            bgcolor: "#358156",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
          }}>
          <img
            src={logo}
            alt="Logo Planejja"
            style={{ maxWidth: "80%", height: "auto" }}
          />
        </Box>
      )}

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
