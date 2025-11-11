import React, { useEffect, useState } from 'react';
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
  TextField,
  Autocomplete,
} from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import StyledTextField from '../StyledTextField';
import DateFieldInput from '../DateFieldInput';
import ActionButton from '../ActionButton';
import api from '../../services/api';
import theme from '../../theme';

interface ExpenseCreateModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    value: number;
    description: string;
    due_date: string | null;
    paid: number;
    category_id: number;
    multiple_payments: boolean;
    num_installments?: number;
    payment_day?: number;
  }) => void;
  onError: (error: unknown) => void;
}

const ExpenseCreateModal: React.FC<ExpenseCreateModalProps> = ({ open, onClose, onSubmit, onError }) => {
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [paid, setPaid] = useState(false);
  const [category, setCategory] = useState('');
  const [categoryId, setCategoryId] = useState(0);
  const [categories, setCategories] = useState<{ name: string, id: number }[]>([]);
  const [multiplePayments, setMultiplePayments] = useState(false);
  const [installments, setInstallments] = useState<number | undefined>();
  const [paymentDay, setPaymentDay] = useState<number | undefined>();

  const getCategories = async () => {
    try {
      const res = await api.get('/api/categories');
      setCategories(res.data.map((cat: { name: string, id: number }) => ({ name: cat.name, id: cat.id })));
    } catch {
      //onError(err);
    }
  };

  const handleCategoryChange = async (event: React.SyntheticEvent | undefined, value: string | undefined) => {
    if (!value) {
      return;
    }
    
    if (!categories.some(cat => cat.name.toLowerCase() === value.toLowerCase())) {
      await handleCategoryAdd(value); 
    }

    setCategory(value);
  };

  const handleCategoryAdd = async (name: string) => {
    try {
      const res = await api.post('/api/category/add', { name });
      await getCategories();
      setCategory(name);
      setCategoryId(res.data.id);
    } catch (err) {
      onError(err);
    }
  };

  const handleCategoryDelete = async (id: number) => {
    try {
      await api.delete(`/api/category/${id}`);
      setCategories(prevCategories => prevCategories.filter(cat => cat.id !== id));
    } catch (err) {
      onError(err);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dueDateString = dueDate?.toISOString() || null;
    const paidValue = paid ? 1 : 0;
    onSubmit({ 
      value: Number(value), 
      description, 
      due_date: dueDateString, 
      paid: paidValue, 
      category_id: categoryId, 
      multiple_payments: multiplePayments,
      num_installments: installments, 
      payment_day: paymentDay });
  };

  useEffect(() => {
    setValue('');
    setDescription('');
    setDueDate(null);
    setPaid(false);
    setCategory('');
    setMultiplePayments(false);
    setInstallments(undefined);
    setPaymentDay(undefined);
  }, [open]);

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <Dialog open={open} onClose={onClose} fullWidth PaperProps={{ sx: { borderRadius: 4, p: 0, scrollbarWidth: 'thin', scrollbarColor: theme.palette.primary.main + ' #e6f2ec' } }}>
      <DialogTitle sx={{ fontWeight: 600, fontSize: 28, pb: 0, pt: 3, px: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        Cadastro de despesa
        <IconButton onClick={onClose} sx={{ ml: 2 }} aria-label="Fechar modal">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <Divider sx={{ my: 1 }} />
      <DialogContent sx={{ pt: 0, px: 4 }}>
        <Box component="form" onSubmit={handleSubmit}>
            <Box display="flex" alignItems={'center'} sx={{ flexDirection: { xs: 'column', md: 'row' },  gap: { sm: 0, md: 2 } }}>
                <StyledTextField
                  label="Valor (R$)"
                  value={value}
                  type="number"
                  onChange={e => setValue(e.target.value)}
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
              onChange={e => setDescription(e.target.value)}
              fullWidth
              required
              margin="normal"
            />
            <Autocomplete
              disablePortal
              options={categories}
              fullWidth
              autoHighlight
              getOptionLabel={(option) => option.name}
              getOptionDisabled={(option) =>
                option.name === "Caixinha"
              }
              slotProps={{
                  listbox: {
                    sx: {
                      scrollbarWidth: 'none',
                    }
                  },
                  paper: {
                    sx: {
                      maxHeight: 200,
                    }
                  }
              }}
              sx={{
                mt: 2
              }}
              renderInput={(params) => (
                  <TextField
                      {...params}
                      slotProps={{
                        htmlInput: {
                          ...params.inputProps,
                          autoComplete: 'off',
                        },
                      }}
                      label="Categoria"
                      required
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();
                          event.stopPropagation();
                          handleCategoryChange(undefined, params.inputProps.value as string | undefined);
                        }
                      }}
                      value={category}
                  />
              )}
              renderOption={(props, option) => {
                const { key, ...rest } = props;
                return (
                  <li 
                    key={key}
                    onMouseDown={() => {handleCategoryChange(undefined, option.name) ; setCategoryId(option.id)}}
                    style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                    }} 
                    {...rest}
                  >
                    {option.name}
                    <IconButton
                      edge="end"
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        handleCategoryDelete(option.id);
                      }}
                    >
                      <CancelIcon style={{ color: '#d4d4d4' }} />
                    </IconButton>
                  </li>
                );
              }}
            />
            <Box display="flex" alignItems="center" mt={2} mb={3}>
              <Typography mr={2}>Pagamento já realizado?</Typography>
              <Switch color="success" checked={paid} onChange={e => setPaid(e.target.checked)} />
            </Box>
            <Box display="flex" alignItems="center" mt={2}>
              <Typography mr={2}>Pagamento em mais de uma vez?</Typography>
              <Switch color="success" checked={multiplePayments} onChange={e => setMultiplePayments(e.target.checked)} />
            </Box>
            {multiplePayments && (
              <Box display="flex" alignItems={'center'} sx={{ flexDirection: { xs: 'column', md: 'row' },  gap: { sm: 0, md: 2 } }}>
                <StyledTextField
                  label="Nº de parcelas"
                  value={installments || ''}
                  type="number"
                  onChange={e => setInstallments(Number(e.target.value))}
                  margin="normal"
                  sx={{ width: { xs: "100%", md: "75%" } }}
                />
                <StyledTextField
                  label="Dia mensal de pagamento"
                  value={paymentDay || ''}
                  type="number"
                  onChange={e => setPaymentDay(Number(e.target.value))}
                  margin="normal"
                  sx={{ width: { xs: "100%", md: "75%" } }}
                />
              </Box>
            )}
            <DialogActions sx={{ justifyContent: 'center', pb: 2, px: 0 , mt: 2}}>
              <ActionButton type="submit" variant="contained" color="success" sx={{ px: 6, borderRadius: 999, fontWeight: 600, fontSize: 18 }}>
                Cadastrar
              </ActionButton>
            </DialogActions>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ExpenseCreateModal; 