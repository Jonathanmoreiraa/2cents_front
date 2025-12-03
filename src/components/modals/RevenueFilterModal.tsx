import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Box,
  Typography,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import StyledTextField from "../common/StyledTextField";
import DateFieldInput from "../common/DateFieldInput";
import theme from "../../theme";

export interface FilterValues {
  description: string;
  date_start: Date | null;
  date_end: Date | null;
  min: number;
  max: number;
  status: {
    received: boolean;
    pending: boolean;
    overdue: boolean;
  };
}

interface RevenueFilterModalProps {
  open: boolean;
  onClose: () => void;
  onFilter: (values: FilterValues) => void;
}

const defaultValues: FilterValues = {
  description: "",
  date_start: null,
  date_end: null,
  min: 0,
  max: 0,
  status: {
    received: false,
    pending: false,
    overdue: false,
  },
};

const RevenueFilterModal: React.FC<RevenueFilterModalProps> = ({
  open,
  onClose,
  onFilter,
}) => {
  const [values, setValues] = useState<FilterValues>({ ...defaultValues });

  //TODO: verificar se o valor é um número ou string
  const handleChange = (
    field: keyof FilterValues,
    value: string | Date | null | number
  ) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = (status: keyof FilterValues["status"]) => {
    setValues((prev) => ({
      ...prev,
      status: { ...prev.status, [status]: !prev.status[status] },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(values);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      container={() => document.getElementById("modal-root") || document.body}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(3px)",
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
      aria-labelledby="filter-dialog-title"
      aria-describedby="filter-dialog-description">
      <DialogTitle id="filter-dialog-title" sx={{ fontSize: 28, pb: 0 }}>
        Filtrar receitas
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 16, top: 16 }}
          aria-label="Fechar modal">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          pt: 2,
          scrollbarWidth: "thin",
          scrollbarColor: "#358156 #e6f2ec",
        }}>
        <Box component="form" onSubmit={handleSubmit}>
          <StyledTextField
            label="Descrição"
            value={values.description}
            onChange={(e) => handleChange("description", e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
            sx={{ mb: 4 }}
          />
          <Box
            display="flex"
            justifyContent="space-between"
            mb={2}
            sx={{ flexDirection: { xs: "column", md: "row" } }}>
            <DateFieldInput
              label="Data inicial"
              value={values.date_start || undefined}
              onChange={(newValue) => handleChange("date_start", newValue)}
              sx={{ mb: 2 }}
            />
            <DateFieldInput
              label="Data final"
              value={values.date_end || undefined}
              onChange={(newValue) => handleChange("date_end", newValue)}
            />
          </Box>
          <Box display="flex" gap={2} mb={3}>
            <Box display="flex" flexDirection="column" flex={1}>
              <Typography mb={0.5}>De:</Typography>
              <StyledTextField
                value={values.min}
                onChange={(e) =>
                  handleChange(
                    "min",
                    parseFloat(e.target.value) > 0 ? e.target.value : 0
                  )
                }
                fullWidth
                // TODO: adicionar máscara de dinheiro
              />
            </Box>
            <Box display="flex" flexDirection="column" flex={1}>
              <Typography mb={0.5}>Até:</Typography>
              <StyledTextField
                value={values.max}
                onChange={(e) =>
                  handleChange(
                    "max",
                    parseFloat(e.target.value) > 0 ? e.target.value : 0
                  )
                }
                placeholder="0,00"
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
                fullWidth
                // TODO: adicionar máscara de dinheiro
              />
            </Box>
          </Box>
          <Box mb={2}>
            <Typography align="center" fontWeight={600} fontSize={22} mb={1}>
              Situações
            </Typography>
            <FormGroup
              row
              sx={{ justifyContent: "flex-start", flexDirection: "column" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    color="success"
                    checked={values.status.received}
                    onChange={() => handleStatusChange("received")}
                  />
                }
                label="Recebida"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    color="success"
                    checked={values.status.pending}
                    onChange={() => handleStatusChange("pending")}
                  />
                }
                label="Pendente"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    color="success"
                    checked={values.status.overdue}
                    onChange={() => handleStatusChange("overdue")}
                  />
                }
                label="Em atraso"
              />
            </FormGroup>
          </Box>
          <DialogActions sx={{ justifyContent: "center", pb: 3 }}>
            <Button
              type="submit"
              variant="contained"
              sx={{
                px: 6,
                borderRadius: 999,
                fontWeight: 600,
                fontSize: 18,
                backgroundColor: theme.palette.primary.main,
              }}>
              Filtrar
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RevenueFilterModal;
