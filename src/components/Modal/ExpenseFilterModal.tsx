import React, { useState, useEffect } from "react";
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
  Autocomplete,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CancelIcon from "@mui/icons-material/Cancel";
import StyledTextField from "../StyledTextField";
import DateFieldInput from "../DateFieldInput";
import theme from "../../theme";
import api from "../../services/api";

export interface FilterValues {
  description: string;
  date_start: Date | null;
  date_end: Date | null;
  min: number;
  max: number;
  categories: { name: string; id: number }[];
  status: {
    pending: boolean;
    paid: boolean;
    overdue: boolean;
    due_soon: boolean;
  };
}

interface ExpenseFilterModalProps {
  open: boolean;
  onClose: () => void;
  onFilter: (values: FilterValues) => void;
  onError: (error: unknown) => void;
  initialValues: FilterValues;
}

const ExpenseFilterModal: React.FC<ExpenseFilterModalProps> = ({
  open,
  onClose,
  onFilter,
  onError,
  initialValues,
}) => {
  const [values, setValues] = useState<FilterValues>({ ...initialValues });
  const [categories, setCategories] = useState<{ name: string; id: number }[]>(
    []
  );

  const getCategories = async () => {
    try {
      const res = await api.get("/api/categories");
      setCategories(
        res.data.map((cat: { name: string; id: number }) => ({
          name: cat.name,
          id: cat.id,
        }))
      );
    } catch {
      // onError(err);
    }
  };

  useEffect(() => {
    getCategories();
  }, [open]);

  useEffect(() => {
    setValues({ ...initialValues });
  }, [initialValues]);

  const handleChange = (
    field: keyof FilterValues,
    value: string | Date | null | number | { name: string; id: number }[]
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

  const handleCategoryDelete = async (id: number) => {
    try {
      await api.delete(`/api/category/${id}`);
      setCategories((prevCategories) =>
        prevCategories.filter((cat) => cat.id !== id)
      );
    } catch (err) {
      onError(err);
    }
  };

  const handleClearDates = () => {
    setValues((prev) => ({
      ...prev,
      date_start: null,
      date_end: null,
    }));
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
        Filtrar despesas
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
            mb={values.date_start || values.date_end ? 0 : 2}
            sx={{ flexDirection: { xs: "column", md: "row" } }}>
            <DateFieldInput
              label="Data inicial"
              value={values.date_start || undefined}
              onChange={(newValue) => handleChange("date_start", newValue)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <DateFieldInput
              label="Data final"
              value={values.date_end || undefined}
              onChange={(newValue) => handleChange("date_end", newValue)}
              fullWidth
            />
          </Box>
          {(values.date_start || values.date_end) && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb={2}
              sx={{
                flexDirection: { xs: "column", md: "row" },
                mt: { xs: 2, md: 0 },
              }}>
              <Button
                onClick={handleClearDates}
                variant="outlined"
                sx={{
                  mr: 2,
                  fontSize: 10,
                  fontWeight: 600,
                  borderRadius: 999,
                }}>
                Limpar Datas
              </Button>
            </Box>
          )}
          <Autocomplete
            value={values.categories}
            multiple
            filterSelectedOptions
            options={categories}
            getOptionLabel={(option) => option.name}
            onChange={(event, newValue) => handleChange("categories", newValue)}
            slotProps={{
              listbox: {
                sx: {
                  scrollbarWidth: "none",
                },
              },
            }}
            sx={{ mb: 4 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Categorias"
                placeholder="Selecionar categorias"
              />
            )}
            renderOption={(props, option) => {
              const { key, ...rest } = props;
              return (
                <li
                  key={key}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  {...rest}>
                  {option.name}
                  <IconButton
                    edge="end"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      handleCategoryDelete(option.id);
                    }}>
                    <CancelIcon style={{ color: "#d4d4d4" }} />
                  </IconButton>
                </li>
              );
            }}
          />
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
                    checked={values.status.paid}
                    onChange={() => handleStatusChange("paid")}
                  />
                }
                label="Paga"
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
              <FormControlLabel
                control={
                  <Checkbox
                    color="success"
                    checked={values.status.due_soon}
                    onChange={() => handleStatusChange("due_soon")}
                  />
                }
                label="Próxima do vencimento"
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

export default ExpenseFilterModal;
