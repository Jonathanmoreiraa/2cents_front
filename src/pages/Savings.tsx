import React, { useEffect, useState } from 'react';
import { Box, Typography, Stack, useMediaQuery, IconButton, Snackbar, Alert } from '@mui/material';
import WalletIcon from '@mui/icons-material/Wallet';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ActionButton from '../components/ActionButton';
import DataTable, { DataTableHeader } from '../components/DataTable/DataTable';
import { Saving } from '../types';
//import { GenericCardListHeader } from '../components/DataTable/GenericCardList';
import theme from '../theme';
import api from '../services/api';
import SavingCreateModal from '../components/Modal/SavingCreateModal';
import SimulationModal from '../components/Modal/SimulationModal';
import GenericCardList, { GenericCardListHeader } from '../components/DataTable/GenericCardList';

const headers: DataTableHeader<Saving>[] = [
  { label: 'Prioridade', key: 'priority' },
  { label: 'Descrição', key: 'description' },
  { label: 'Valor Acumulado', key: 'accumulated' },
  { label: 'Meta', key: 'goal', align: 'inherit' },
];

const cardHeaders: GenericCardListHeader<Saving>[] = [
  { label: 'Prioridade', key: 'priority' },
  { label: 'Descrição', key: 'description' },
  { label: 'Valor Acumulado', key: 'accumulated' },
  { label: 'Meta', key: 'goal' },
];

const Savings: React.FC = () => {
  const ITEMS_PER_PAGE = 10;
  const [page, setPage] = useState(1);
  const [savings, setSavings] = useState<Saving[]>([]);
  const [modalAddOpen, setModalAddOpen] = useState(false);
  const [modalSimulationOpen, setModalSimulationOpen] = useState(false);
  const [, setSavingData] = useState<Saving | null>(null);
  const [, setEditModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');
  const [error, setError] = useState('');
  const [openError, setOpenError] = useState(false);
  const handleCloseError = () => setOpenError(false);
  const totalPages = Math.max(1, Math.ceil(savings.length / ITEMS_PER_PAGE));
  const paginated = savings.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleOpenAddModal = () => setModalAddOpen(true);
  const handleOpenSimulationModal = () => setModalSimulationOpen(true);
  const handleCloseAddModal = () => setModalAddOpen(false);
  const handleCloseSimulationModal = () => setModalSimulationOpen(false);

  const handleOpenEditModal = (data: Saving) => {
    setSavingData(data);
    setEditModalOpen(true);
  };

  const handleCreateSaving = async (data: object) => {
    try {
      await api.post('/api/saving/add', data);
      handleGetSavings();
      handleCloseAddModal();
    } catch (err) {
      handleError(err);
    }
  };

  const handleGetSavings = async () => {
    try {
      const res = await api.get('/api/savings')
      setSavings(res.data);
    } catch (err) {
      handleError(err);
    }

    setLoading(false);
  }

  const handleError = (error: unknown) => {
    const errorMessage = error && typeof error === 'object' ? (error as { response: { data: { message: string } } }).response.data.message : 'Erro ao efetuar a ação, tente novamente.';
    setError(errorMessage);
    setOpenError(true);
  }

  const handleDelete = async (id: number) => {
    try {
      if (!window.confirm('Tem certeza que deseja deletar esta caixinha?')) return;
      await api.delete(`/api/saving/${id}`);
      handleGetSavings();
    } catch (err) {
      handleError(err);
    }
  };

  useEffect(() => {
    setLoading(true);
    handleGetSavings();
  }, []);

  return (
    <Box sx={{
      p: 3,
      width: '100%',
      minHeight: '100%',
      background: '#fff',
      overflow: 'auto',
      scrollbarWidth: 'thin',
      scrollbarColor: '#358156 #e6f2ec',
      '@media (max-width: 900px)': {
        p: 2,
        pb: 4
      }
    }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Stack direction="row" spacing={2}>
          <ActionButton variant='outlined' color="success" onClick={handleOpenSimulationModal} endIcon={<WalletIcon />}>Simulação</ActionButton>
        </Stack>
        <Stack direction="row" spacing={2}>
          <ActionButton variant='outlined' color="success" onClick={handleOpenAddModal}>Cadastrar</ActionButton>
        </Stack>
      </Stack>
      <SavingCreateModal
        open={modalAddOpen}
        onClose={handleCloseAddModal}
        onSubmit={handleCreateSaving}
      />
      <SimulationModal
        open={modalSimulationOpen}
        onClose={handleCloseSimulationModal}
      />
      {isMobile ? (
        <GenericCardList
          items={paginated}
          headers={cardHeaders}
          renderItem={(item, key) => {
            if (key === 'status') {
              return (
                <StatusTypography status={item.status}>
                  {item.status === 'Received' && 'Recebida'}
                  {item.status === 'Pending' && 'Pendente'}
                  {item.status === 'Overdue' && 'Em atraso'}
                </StatusTypography>
              );
            }
            if (key === 'value') {
              return `R$ ${item.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
            }
            if (key === 'dueDate') {
              return new Date(item.dueDate).toLocaleDateString('pt-BR');
            }
            return item[key];
          }}
          actions={(item) => (
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <IconButton size="small" color="primary" onClick={() => handleOpenEditModal(item)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}>
                <DeleteIcon fontSize="small" sx={{ color: theme.palette.error.main }} />
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
            if (key === "goal") {
              return `R$ ${item.goal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
            } else if (key === "accumulated") {
              return `R$ ${item.accumulated.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
            }
            return item[key];
          }}
          actions={(item) => (
            <>
              <IconButton onClick={() => handleOpenEditModal(item)}><EditIcon /></IconButton>
              <IconButton onClick={() => handleDelete(item.id)}><DeleteIcon sx={{ color: theme.palette.error.main }} /></IconButton>
            </>
          )}
          emptyMessage="Nenhum resultado encontrado."
          loading={loading}
        />
      )}
      <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" mt={4} mb={4}>
        <ActionButton
          variant="outlined"
          color={page > 1 ? "success" : "inherit"}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Anterior
        </ActionButton>
        <Typography fontWeight={700}>{page}</Typography>
        <ActionButton
          variant="outlined"
          color={page < totalPages ? "success" : "inherit"}
          onClick={() => setPage(p => Math.min(1000, p + 1))}
          disabled={page === totalPages}
        >
          Próxima
        </ActionButton>
      </Stack>
      {/* TODO: adicionar snackbars de sucesso e erro */}
      <Snackbar open={openError} autoHideDuration={4000} onClose={handleCloseError} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Savings; 