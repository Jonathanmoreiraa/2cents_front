import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
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
import PersonIcon from "@mui/icons-material/Person";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { register, clearError } from "../store/slices/auth-slice";
import { AppDispatch, RootState } from "../store";
import logo from "../assets/logo_2cents_white.svg";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    birthDate?: string;
  }>({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"error" | "success">(
    "error"
  );
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, success } = useSelector(
    (state: RootState) => state.auth
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  useEffect(() => {
    if (error) {
      setSnackbarMessage(error);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  }, [error]);

  useEffect(() => {
    if (success && !error) {
      setSnackbarMessage(
        "Cadastro realizado com sucesso! Redirecionando para o login..."
      );
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
      setRegistrationSuccess(true);

      const timer = setTimeout(() => {
        navigate("/login");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [success, error, navigate]);

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

  const formatBirthDate = (date: string): string => {
    if (!date) return "";
    return `${date}T00:00:00Z`;
  };

  const validateForm = (): boolean => {
    const errors: {
      name?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
      birthDate?: string;
    } = {};
    let isValid = true;

    if (!name.trim()) {
      errors.name = "Nome é obrigatório";
      isValid = false;
    }

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

    if (!confirmPassword) {
      errors.confirmPassword = "Confirme sua senha";
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "As senhas não coincidem";
      isValid = false;
    }

    if (!birthDate) {
      errors.birthDate = "Data de nascimento é obrigatória";
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());

    if (validateForm()) {
      dispatch(
        register({
          name,
          email,
          password,
          birth_date: formatBirthDate(birthDate),
        })
      );
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
            bgcolor: "#358156",
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
              placeholder="Nome"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!formErrors.name}
              helperText={formErrors.name}
              disabled={loading || registrationSuccess}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "#358156" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              placeholder="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!formErrors.email}
              helperText={formErrors.email}
              disabled={loading || registrationSuccess}
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
              placeholder="Data de Nascimento"
              type="date"
              fullWidth
              margin="normal"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              error={!!formErrors.birthDate}
              helperText={formErrors.birthDate}
              disabled={loading || registrationSuccess}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon sx={{ color: "#358156" }} />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: true,
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
              disabled={loading || registrationSuccess}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#358156" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />

            <TextField
              placeholder="Confirme a senha"
              type="password"
              fullWidth
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              disabled={loading || registrationSuccess}
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
              disabled={loading || registrationSuccess}
              sx={{
                bgcolor: "#358156",
                color: "white",
                borderRadius: "50px",
                textTransform: "none",
                mt: 3,
                mb: 2,
                "&:hover": { bgcolor: "#2c6b47" },
              }}>
              {loading ? <CircularProgress size={24} /> : "Registrar"}
            </Button>

            <Typography variant="body2" align="center" sx={{ color: "#666" }}>
              Já possui conta?{" "}
              <Link
                component={RouterLink}
                to="/login"
                sx={{
                  color: "#358156",
                  textDecoration: "none",
                  "&:hover": { textDecoration: "underline" },
                }}>
                Entrar
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
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
          icon={
            snackbarSeverity === "success" ? <CheckCircleIcon /> : undefined
          }>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Register;
