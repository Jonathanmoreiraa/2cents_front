import {
  Box,
  Typography,
  TextField,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ActionButton from "../components/common/ActionButton";
import DateFieldInput from "../components/common/DateFieldInput";
import authService from "../services/auth-service";
import api from "../services/api";

const Settings: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [userId, setUserId] = useState<number>(0);
  const [openError, setOpenError] = useState(false);
  const [error, setError] = useState("");
  const handleCloseError = () => setOpenError(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const successMessage = "Usuário editado com sucesso!";
  const handleCloseSuccess = () => setOpenSuccess(false);

  const handleSave = async () => {
    try {
      const userUpdated = await api.put(`/api/user/${userId}`, {
        name,
        email,
        birth_date: birthDate,
      });
      if (userUpdated) {
        setOpenSuccess(true);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    const errorMessage =
      error && typeof error === "object"
        ? (error as { response: { data: { message: string } } }).response.data
            .message
        : "Erro ao efetuar a ação, tente novamente.";
    setError(errorMessage);
    setOpenError(true);
  };

  const getUserData = async () => {
    try {
      const response = await authService.getCurrentUser();
      if (response) {
        setEmail(response.email);
        setName(response.name);
        setUserId(response.id);

        const date = new Date(response.birth_date);
        setBirthDate(date);
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  return (
    <Box
      sx={{
        p: 3,
        width: "100%",
        minHeight: "100%",
        background: "#fff",
        overflow: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "#358156 #e6f2ec",
        "@media (max-width: 900px)": {
          p: 2,
          pb: 4,
        },
      }}>
      <Box sx={{ maxWidth: 600, mx: "auto", textAlign: "center" }}>
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{ mb: 4, fontWeight: 600, color: "#358156" }}>
          Configurações do Usuário
        </Typography>

        {/* Formulário de Edição */}
        <Stack spacing={3}>
          {/* 1 - Nome */}
          <TextField
            fullWidth
            label="Nome*"
            name="name"
            value={name}
            onChange={(v) => setName(v.target.value)}
            variant="outlined"
            size="medium"
          />

          {/* 2 - Email */}
          <TextField
            fullWidth
            label="Email*"
            name="email"
            type="email"
            value={email}
            onChange={(v) => setEmail(v.target.value)}
            variant="outlined"
            size="medium"
          />

          {/* 3 - Data de Nascimento */}
          <DateFieldInput
            label="Data de Nascimento"
            value={birthDate}
            onChange={setBirthDate}
            sx={{ mt: 2, mb: 1 }}
            slotProps={{
              textField: {
                required: true,
              },
            }}
          />

          {/* Botão de Salvar */}
          <Box>
            <ActionButton
              type="submit"
              variant="contained"
              color="success"
              sx={{ px: 8, borderRadius: 999, fontWeight: 600, fontSize: 15 }}
              onClick={handleSave}>
              Salvar
            </ActionButton>
          </Box>
        </Stack>

        <Snackbar
          open={openError}
          autoHideDuration={4000}
          onClose={handleCloseError}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}>
          <Alert
            onClose={handleCloseError}
            severity="error"
            sx={{ width: "100%" }}>
            {error}
          </Alert>
        </Snackbar>

        <Snackbar
          open={openSuccess}
          autoHideDuration={4000}
          onClose={handleCloseSuccess}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}>
          <Alert
            onClose={handleCloseSuccess}
            severity="success"
            sx={{ width: "100%" }}>
            {successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default Settings;
