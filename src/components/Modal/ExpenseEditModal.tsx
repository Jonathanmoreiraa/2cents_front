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
import CloseIcon from '@mui/icons-material/Close';
import StyledTextField from '../StyledTextField';
import DateFieldInput from '../DateFieldInput';
import ActionButton from '../ActionButton';
import api from '../../services/api';
import theme from '../../theme';
import CancelIcon from '@mui/icons-material/Cancel';

interface ExpenseEditModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    value: number;
    description: string;
    due_date: string | null;
    paid: number;
    category_id: number;
  }) => void;
  onError: (error: unknown) => void;
  initialValues: {
    value: number;
    description: string;
    due_date: string;
    paid: number;
    category_id: number;
    category?: string;
  };
}

const ExpenseEditModal: React.FC<ExpenseEditModalProps> = ({ open, onClose, onSubmit, onError, initialValues }) => {
    const [value, setValue] = useState(initialValues.value.toString());
    const [description, setDescription] = useState(initialValues.description);
    const [dueDate, setDueDate] = useState<Date | null>(new Date(initialValues.due_date));
    const [paid, setPaid] = useState(initialValues.paid === 1);
    const [categoryId, setCategoryId] = useState(initialValues.category_id);
    const [categoryName, setCategoryName] = useState(initialValues.category || '');
    const [categories, setCategories] = useState<{ name: string, id: number }[]>([]);
  
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
        
        const selectedCategory = categories.find(cat => cat.name.toLowerCase() === value.toLowerCase());
        if (selectedCategory) {
            setCategoryId(selectedCategory.id);
        } else {
            await handleCategoryAdd(value);
        }
    };

    const handleCategoryAdd = async (name: string) => {
        try {
            const res = await api.post('/api/category/add', { name });
            await getCategories();
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
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const dueDateString = dueDate?.toISOString() || null;
        const paidValue = paid ? 1 : 0;
        onSubmit({ 
            value: Number(value), 
            description, 
            due_date: dueDateString, 
            paid: paidValue, 
            category_id: categoryId
        });
    };

    useEffect(() => {
        setValue(initialValues?.value?.toString() || '');
        setDescription(initialValues?.description || '');
        setDueDate(initialValues?.due_date ? new Date(initialValues.due_date) : null);
        setPaid(initialValues?.paid === 1 ? true : false);
        setCategoryId(initialValues?.category_id || 0);
        setCategoryName(initialValues?.category || '');
    }, [initialValues]);

    useEffect(() => {
        getCategories();
    }, []);

    return (
        <Dialog open={open} onClose={onClose} fullWidth PaperProps={{ sx: { borderRadius: 4, p: 0, scrollbarWidth: 'thin', scrollbarColor: theme.palette.primary.main + ' #e6f2ec' } }}>
            <DialogTitle sx={{ fontWeight: 600, fontSize: 28, pb: 0, pt: 3, px: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                Editar despesa
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
                        disabled={categoryName === "Caixinha"}
                        autoHighlight
                        getOptionLabel={(option) => option.name}
                        value={
                            categories.find(cat => cat.id === categoryId) ? 
                            categories.find(cat => cat.id === categoryId) : 
                            categoryName === "Caixinha" ? { name: categoryName, id: 0 } : 
                            null
                        }
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
                    <DialogActions sx={{ justifyContent: 'center', pb: 2, px: 0 , mt: 2}}>
                        <ActionButton type="submit" variant="contained" color="success" sx={{ px: 6, borderRadius: 999, fontWeight: 600, fontSize: 18 }}>
                            Salvar
                        </ActionButton>
                    </DialogActions>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default ExpenseEditModal; 