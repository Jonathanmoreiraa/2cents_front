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
import theme from "../../theme";

export interface FilterValues {
  description: string;
  status: {
    completed: boolean;
    pending: boolean;
  };
}

interface SavingFilterModalProps {
  open: boolean;
  onClose: () => void;
  onFilter: (values: FilterValues) => void;
  initialValues?: FilterValues;
}

const defaultValues: FilterValues = {
  description: "",
  status: {
    completed: false,
    pending: false,
  },
};

const SavingFilterModal: React.FC<SavingFilterModalProps> = ({
  open,
  onClose,
  onFilter,
  initialValues,
}) => {
  const [values, setValues] = useState<FilterValues>(
    initialValues ?? defaultValues,
  );

  const handleChange = (
    field: keyof FilterValues,
    value: string | Date | null | number,
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
      aria-describedby="filter-dialog-description"
    >
      <DialogTitle id="filter-dialog-title" sx={{ fontSize: 28, pb: 0 }}>
        Filtrar caixinhas
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 16, top: 16 }}
          aria-label="Fechar modal"
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          pt: 2,
          scrollbarWidth: "thin",
          scrollbarColor: `${theme.palette.primary.main} ${theme.palette.primary.contrastText}`,
        }}
      >
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
          <Box mb={2}>
            <Typography align="center" fontWeight={600} fontSize={22} mb={1}>
              Situação da caixinha
            </Typography>
            <FormGroup
              row
              sx={{ justifyContent: "flex-start", flexDirection: "column" }}
            >
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
                    checked={values.status.completed}
                    onChange={() => handleStatusChange("completed")}
                  />
                }
                label="Concluída"
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
              }}
            >
              Filtrar
            </Button>
          </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SavingFilterModal;
