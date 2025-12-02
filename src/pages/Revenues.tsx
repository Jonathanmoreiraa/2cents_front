import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DataTable, { DataTableHeader } from "../components/data-table/DataTable";
import ActionButton from "../components/common/ActionButton";
import { StatusTypography } from "../components/data-table/data-table.styles";
import api from "../services/api";
import GenericCardList, {
  GenericCardListHeader,
} from "../components/data-table/GenericCardList";
import RevenueFilterModal from "../components/modals/RevenueFilterModal";
import RevenueCreateModal from "../components/modals/RevenueCreateModal";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import RevenueEditModal from "../components/modals/RevenueEditModal";
import { ApiRevenue, Revenue } from "../types";
import theme from "../theme";
import { FilterValues } from "../components/modals/RevenueFilterModal";
import { getFirstAndLastDayOfMonth } from "../utils/get-first-last-days-month";

const headers: DataTableHeader<Revenue>[] = [
  { label: "Situação", key: "status" },
  { label: "Descrição", key: "description" },
  { label: "Recebimento", key: "dueDate" },
  { label: "Valor", key: "value", align: "right" },
];

const cardHeaders: GenericCardListHeader<Revenue>[] = [
  { label: "Situação", key: "status" },
  { label: "Descrição", key: "description" },
  { label: "Data", key: "dueDate" },
  { label: "Valor", key: "value" },
];

const Revenues: React.FC = () => {
  const ITEMS_PER_PAGE = 10;
  const [revenues, setRevenues] = useState<Revenue[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width:900px)");
  const [filterOpen, setFilterOpen] = useState(false);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [error, setError] = useState("");
  const [openError, setOpenError] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [revenueData, setRevenueData] = useState<Revenue | null>(null);
   const { firstDay, lastDay } = getFirstAndLastDayOfMonth();
  const defaultFilterValues = {
    description: "",
    date_start: firstDay,
    date_end: lastDay,
    min: 0,
    max: 0,
    status: {
      pending: false,
      overdue: false,
      received: false,
    },
  };
  const totalPages = Math.max(1, Math.ceil(revenues.length / ITEMS_PER_PAGE));
  const paginated = revenues.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handleOpenAddModal = () => setModalAddOpen(true);
  const handleCloseAddModal = () => setModalAddOpen(false);

  const handleCloseError = () => setOpenError(false);

  const handleCreateRevenue = async (data: object) => {
    try {
      await api.post("/api/revenue/add", data);
      handleGetRevenues();
      handleCloseAddModal();
    } catch (err) {
      handleError(err);
    }
  };

  const handleGetRevenues = async () => {
    try {
      const res = await api.get("/api/revenues");
      setRevenues(formatRevenues(res.data));
    } catch (err) {
      handleError(err);
    }

    setLoading(false);
  };

  const formatRevenues = (data: ApiRevenue[]) => {
    const today = new Date();
    const mapped: Revenue[] = data.map((item) => {
      const dueDate = new Date(item.due_date);
      let status: "Received" | "Pending" | "Overdue" = "Pending";
      if (item.received === 1) status = "Received";
      else if (item.received === 0 && today > dueDate) status = "Overdue";
      else status = "Pending";
      return {
        id: item.id,
        status,
        description: item.description,
        dueDate: item.due_date,
        value: Number(item.value),
      };
    });

    return mapped;
  };

  const handleOpenEditModal = (data: Revenue) => {
    setRevenueData(data);
    setEditModalOpen(true);
  };

  const handleEdit = async (data: object) => {
    try {
      await api.put(`/api/revenue/${revenueData?.id}`, data);
      handleGetRevenues();
      setEditModalOpen(false);
    } catch (err) {
      handleError(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      if (!window.confirm("Tem certeza que deseja deletar esta receita?"))
        return;
      await api.delete(`/api/revenue/${id}`);
      handleGetRevenues();
    } catch (err) {
      handleError(err);
    }
  };

  const handleFilter = async (values: object) => {
    try {
      const res = await api.post("/api/revenue/filter", values);
      setRevenues(formatRevenues(res.data));
      setLoading(false);
    } catch (err) {
      handleError(err);
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
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    handleFilter(defaultFilterValues);
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
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}>
        <Stack direction="row" spacing={2}>
          <ActionButton
            variant="outlined"
            color="success"
            endIcon={<FilterListIcon />}
            onClick={() => setFilterOpen(true)}>
            Filtrar
          </ActionButton>
        </Stack>
        <Stack direction="row" spacing={2}>
          <ActionButton
            onClick={handleOpenAddModal}
            variant="outlined"
            color="success">
            Cadastrar
          </ActionButton>
        </Stack>
      </Stack>
      <RevenueFilterModal
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        onFilter={handleFilter}
      />
      <RevenueCreateModal
        open={modalAddOpen}
        onClose={handleCloseAddModal}
        onSubmit={handleCreateRevenue}
      />
      <RevenueEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleEdit}
        initialValues={revenueData}
      />
      {isMobile ? (
        <GenericCardList
          items={paginated}
          headers={cardHeaders}
          renderItem={(item, key) => {
            if (key === "status") {
              return (
                <StatusTypography status={item.status}>
                  {item.status === "Received" && "Recebida"}
                  {item.status === "Pending" && "Pendente"}
                  {item.status === "Overdue" && "Em atraso"}
                </StatusTypography>
              );
            }
            if (key === "value") {
              return `R$ ${item.value.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}`;
            }
            if (key === "dueDate") {
              return new Date(item.dueDate).toLocaleDateString("pt-BR");
            }
            return item[key];
          }}
          actions={(item) => (
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <IconButton
                size="small"
                color="primary"
                onClick={() => handleOpenEditModal(item)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleDelete(item.id)}>
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
          headers={headers}
          renderCell={(item, key) => {
            if (key === "status") {
              return (
                <StatusTypography status={item.status}>
                  {item.status === "Received" && "Recebida"}
                  {item.status === "Pending" && "Pendente"}
                  {item.status === "Overdue" && "Em atraso"}
                </StatusTypography>
              );
            }
            if (key === "value") {
              return `R$ ${item.value.toLocaleString("pt-BR", {
                minimumFractionDigits: 2,
              })}`;
            }
            if (key === "dueDate") {
              return new Date(item.dueDate).toLocaleDateString("pt-BR");
            }
            return item[key];
          }}
          actions={(item) => (
            <>
              <IconButton onClick={() => handleOpenEditModal(item)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(item.id)}>
                <DeleteIcon sx={{ color: theme.palette.error.main }} />
              </IconButton>
            </>
          )}
          emptyMessage="Nenhum resultado encontrado."
          loading={loading}
        />
      )}
      <Stack
        direction="row"
        spacing={2}
        justifyContent="center"
        alignItems="center"
        mt={4}
        mb={4}>
        <ActionButton
          variant="outlined"
          color={page > 1 ? "success" : "inherit"}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}>
          Anterior
        </ActionButton>
        <Typography fontWeight={700}>{page}</Typography>
        <ActionButton
          variant="outlined"
          color={page < totalPages ? "success" : "inherit"}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}>
          Próxima
        </ActionButton>
      </Stack>
      {/* TODO: adicionar snackbar de sucesso */}
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
    </Box>
  );
};

export default Revenues;
