import {
  Box,
  useMediaQuery,
  IconButton,
  Stack,
  Snackbar,
  Alert,
  Typography,
} from "@mui/material";
import GenericCardList, {
  GenericCardListHeader,
} from "../components/data-table/GenericCardList";
import DataTable, { DataTableHeader } from "../components/data-table/DataTable";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ActionButton from "../components/common/ActionButton";
import { useEffect, useState } from "react";
import theme from "../theme";
import api from "../services/api";
import { StatusTypography } from "../components/data-table/data-table.styles";
import { Expense } from "../types";
import ExpenseCreateModal from "../components/modals/ExpenseCreateModal";
import FilterListIcon from "@mui/icons-material/FilterList";
import ExpenseFilterModal from "../components/modals/ExpenseFilterModal";
import { FilterValues } from "../components/modals/ExpenseFilterModal";
import ExpenseEditModal from "../components/modals/ExpenseEditModal";
import { getFirstAndLastDayOfMonth } from "../utils/get-first-last-days-month";

const headers: GenericCardListHeader<Expense>[] = [
  { label: "Situação", key: "situation" },
  { label: "Descrição", key: "description" },
  { label: "Categoria", key: "category" },
  { label: "Data", key: "due_date" },
  { label: "Valor", key: "value" },
];

const tableHeaders: DataTableHeader<Expense>[] = [
  { label: "Situação", key: "situation" },
  { label: "Descrição", key: "description" },
  { label: "Categoria", key: "category" },
  { label: "Data", key: "due_date" },
  { label: "Valor", key: "value", align: "right" },
];

const formatDate = (date: Date | null) => {
  if (date == null) return null;
  return date.toISOString().split("T")[0];
};

const Expenses = () => {
  const ITEMS_PER_PAGE = 10;
  const isMobile = useMediaQuery("(max-width:900px)");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openError, setOpenError] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const paginated = expenses.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );
  const { firstDay, lastDay } = getFirstAndLastDayOfMonth();
  const [filterValues, setFilterValues] = useState<FilterValues>({
    description: "",
    date_start: firstDay,
    date_end: lastDay,
    min: 0,
    max: 0,
    categories: [],
    status: {
      pending: false,
      paid: false,
      overdue: false,
      due_soon: false,
    },
  });
  const [modalEditValues, setModalEditValues] = useState<Expense>(
    {} as Expense,
  );
  const totalPages = Math.max(1, Math.ceil(expenses.length / ITEMS_PER_PAGE));

  const handleGetExpenses = async () => {
    try {
      const res = await api.post("/api/expense/filter", {
        ...filterValues,
        date_start: formatDate(filterValues.date_start),
        date_end: formatDate(filterValues.date_end),
      });
      setExpenses(formatExpenses(res.data));
    } catch (err) {
      handleError(err);
    }

    setLoading(false);
  };

  const handleError = (error: unknown) => {
    const errorMessage =
      error && typeof error === "object"
        ? (error as { response: { data: { message: string } } }).response.data
            .message
        : "Erro ao efetuar a ação, tente novamente.";
    setError(errorMessage);
    setOpenError(true);
    setOpenError(false);
  };

  const handleCloseSuccess = () => setOpenSuccess(false);

  const handleFilter = async (values: FilterValues) => {
    try {
      setFilterValues(values);
      const categoryIds = values.categories.map((cat) => cat.id);
      const res = await api.post("/api/expense/filter", {
        categories: categoryIds,
        date_start: formatDate(values.date_start),
        date_end: formatDate(values.date_end),
      });
      setExpenses(formatExpenses(res.data));
    } catch (err) {
      handleError(err);
    }
  };

  const handleOpenAddModal = () => setModalAddOpen(true);
  const handleCloseError = () => setOpenError(false);

  const handleCreateExpense = async (data: object) => {
    try {
      const newData = data as Expense;
      const payload = {
        ...newData,
        multiple_payments: newData.multiple_payments || false,
        num_installments: newData.num_installments || 0,
        payment_day: newData.payment_day || 0,
      };

      const response = await api.post("/api/expense/add", payload);
      if (response.data) {
        setModalAddOpen(false);
        setOpenSuccess(true);
        setSuccess(response.data.message);

        if (filterValues) {
          handleGetExpenses();
        }
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleEditOpen = (data: Expense) => {
    setModalEditValues(data);
    setModalEditOpen(true);
  };

  const handleEditSubmit = async (data: {
    value: number;
    description: string;
    due_date: string | null;
    paid: number;
    category_id: number;
  }) => {
    try {
      const response = await api.put(`/api/expense/${modalEditValues.id}`, {
        ...data,
      });
      if (response.data) {
        setModalEditOpen(false);
        handleGetExpenses();
        setOpenSuccess(true);
        setSuccess(response.data.message);
      }
    } catch (err) {
      handleError(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      if (!window.confirm("Tem certeza que deseja deletar esta despesa?")) {
        return;
      }
      const response = await api.delete(`/api/expense/${id}`);
      if (response.data) {
        setModalEditOpen(false);
        handleGetExpenses();
        setOpenSuccess(true);
        setSuccess(response.data.message);
      }
    } catch (err) {
      handleError(err);
    }
  };

  const formatExpenses = (data: Expense[]) => {
    const today = new Date();
    return data.map((item) => {
      const dueDate = new Date(item.due_date);
      let situation = "Pendente";

      if (item.paid === 1) {
        situation = "Paga";
      } else if (dueDate < today) {
        situation = "Em atraso";
      } else if (
        item.paid === 0 &&
        (dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24) <= 2 &&
        (dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24) > 0
      ) {
        situation = "Próxima do vencimento";
      }

      return {
        ...item,
        situation,
      };
    });
  };

  useEffect(() => {
    setLoading(true);
    handleGetExpenses();
  }, []);

  return (
    <Box sx={{ p: 3, width: "100%", minHeight: "100%", background: "#fff" }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Stack direction="row" spacing={2}>
          <ActionButton
            variant="outlined"
            color="success"
            endIcon={<FilterListIcon />}
            onClick={() => setFilterOpen(true)}
          >
            Filtrar
          </ActionButton>
        </Stack>
        <Stack direction="row" spacing={2}>
          <ActionButton
            onClick={handleOpenAddModal}
            variant="outlined"
            color="success"
          >
            Cadastrar
          </ActionButton>
        </Stack>
      </Stack>
      <ExpenseFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onFilter={handleFilter}
        onError={handleError}
        initialValues={filterValues}
      />
      <ExpenseCreateModal
        open={modalAddOpen}
        onClose={() => setModalAddOpen(false)}
        onSubmit={handleCreateExpense}
        onError={handleError}
      />
      <ExpenseEditModal
        open={modalEditOpen}
        onClose={() => setModalEditOpen(false)}
        onSubmit={handleEditSubmit}
        onError={handleError}
        initialValues={{
          value: Number(modalEditValues.value),
          description: modalEditValues.description,
          due_date: modalEditValues.due_date,
          paid: modalEditValues.paid,
          category_id: modalEditValues.category_id,
          category: modalEditValues.category,
        }}
      />
      {isMobile ? (
        <GenericCardList
          items={paginated}
          headers={headers}
          renderItem={(item, key) => {
            if (key === "situation") {
              return (
                <StatusTypography fontSize={14} status={item.situation}>
                  {item.situation === "Pendente" && "Pendente"}
                  {item.situation === "Próxima do vencimento" &&
                    "Próxima do vencimento"}
                  {item.situation === "Em atraso" && "Em atraso"}
                  {item.situation === "Paga" && "Paga"}
                </StatusTypography>
              );
            }
            if (key === "value") {
              return `R$ ${Number(item.value).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}`;
            }
            if (key === "due_date") {
              return new Date(item.due_date).toLocaleDateString("pt-BR");
            }
            return item[key];
          }}
          actions={(item) => (
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleEditOpen(item)}
              >
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(item.id)}
              >
                <DeleteIcon
                  fontSize="small"
                  sx={{ color: theme.palette.error.main }}
                />
              </IconButton>
            </Stack>
          )}
          emptyMessage="Nenhum resultado encontrado."
        />
      ) : (
        <DataTable
          items={paginated}
          headers={tableHeaders}
          renderCell={(item, key) => {
            if (key === "situation") {
              return (
                <StatusTypography status={item.situation}>
                  {item.situation === "Pendente" && "Pendente"}
                  {item.situation === "Próxima do vencimento" &&
                    "Próxima do vencimento"}
                  {item.situation === "Em atraso" && "Em atraso"}
                  {item.situation === "Paga" && "Paga"}
                </StatusTypography>
              );
            }
            if (key === "value") {
              return `R$ ${Number(item.value).toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}`;
            }
            if (key === "due_date") {
              return new Date(item.due_date).toLocaleDateString("pt-BR");
            }
            return item[key];
          }}
          actions={(item) => (
            <>
              <IconButton onClick={() => handleEditOpen(item)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(item.id)}>
                <DeleteIcon sx={{ color: theme.palette.error.main }} />
              </IconButton>
            </>
          )}
          loading={loading}
        />
      )}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
        mt={4}
        mb={4}
      >
        <ActionButton
          variant="outlined"
          color={page > 1 ? "success" : "inherit"}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Anterior
        </ActionButton>
        <Typography fontWeight={700}>{page}</Typography>
        <ActionButton
          variant="outlined"
          color={page < totalPages ? "success" : "inherit"}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          Próxima
        </ActionButton>
      </Stack>
      <Snackbar
        open={openSuccess}
        autoHideDuration={4000}
        onClose={handleCloseSuccess}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSuccess}
          severity="success"
          sx={{ width: "100%" }}
        >
          {success}
        </Alert>
      </Snackbar>
      <Snackbar
        open={openError}
        autoHideDuration={4000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Expenses;
