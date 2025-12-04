import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  Switch,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StyledTextField from "../common/StyledTextField";
import DateFieldInput from "../common/DateFieldInput";
import ActionButton from "../common/ActionButton";

interface RevenueCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    value: number;
    description: string;
    due_date: string | null;
    received: number;
  }) => void;
}

const RevenueCreateModal: React.FC<RevenueCreateModalProps> = ({
  open,
  onClose,
  onSubmit,
}) => {
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [received, setReceived] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dueDateString = dueDate?.toISOString() || null;
    //TODO: mudar para booleano no backend
    const receivedValue = received ? 1 : 0;
    onSubmit({
      value: Number(value),
      description,
      due_date: dueDateString,
      received: receivedValue,
    });
  };

  useEffect(() => {
    setValue("");
    setDescription("");
    setDueDate(null);
    setReceived(false);
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      PaperProps={{ sx: { borderRadius: 4, p: 0 } }}
    >
      <DialogTitle
        sx={{
          fontWeight: 600,
          fontSize: 28,
          pb: 0,
          pt: 3,
          px: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        Cadastro de receitas
        <IconButton onClick={onClose} sx={{ ml: 2 }} aria-label="Fechar modal">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ my: 1 }} />
      <DialogContent sx={{ pt: 0, px: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Box
            display="flex"
            alignItems={"center"}
            sx={{
              flexDirection: { xs: "column", md: "row" },
              gap: { sm: 0, md: 2 },
            }}
          >
            <StyledTextField
              label="Valor (R$)"
              value={value}
              type="number"
              onChange={(e) => setValue(e.target.value)}
              margin="normal"
              sx={{ width: { xs: "100%", md: "75%" } }}
              required
            />
            <DateFieldInput
              label="Data"
              value={dueDate || null}
              onChange={setDueDate}
              sx={{ mt: 2, mb: 1 }}
              slotProps={{
                textField: {
                  required: true,
                },
              }}
            />
          </Box>
          <StyledTextField
            label="Descrição"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <Box display="flex" alignItems="center" mt={2} mb={3}>
            <Typography mr={2}>Receita já recebida?</Typography>
            <Switch
              color="success"
              checked={received}
              onChange={(e) => setReceived(e.target.checked)}
            />
          </Box>
          <DialogActions sx={{ justifyContent: "center", pb: 2, px: 0 }}>
            <ActionButton
              type="submit"
              variant="contained"
              color="success"
              sx={{ px: 6, borderRadius: 999, fontWeight: 600, fontSize: 18 }}
            >
              Cadastrar
            </ActionButton>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RevenueCreateModal;
