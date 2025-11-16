import { styled } from '@mui/material/styles';
import { Button, TextField, Box, Typography, DialogContent, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import theme from '../theme';

export const StyledActionButton = styled(Button)(() => ({
  borderRadius: 999,
  fontWeight: 600,
  fontSize: '15px',
  padding: '8px 24px',
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: 'none',
  },
  '&.MuiButton-outlinedSuccess': {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    '&:hover': {
      borderColor: theme.palette.success.light,
      backgroundColor: theme.palette.primary.main,
    },
  },
  '&.MuiButton-containedSuccess': {
    backgroundColor: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.success.dark,
    },
  },
  '&.MuiButton-outlinedSuccess:hover': {
    color: "white",
  },
}));

export const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    '& fieldset': {
      borderColor: theme.palette.grey[300],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.grey[400],
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.grey[600],
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
      backgroundColor: theme.palette.background.paper,
    },
  },
  
  '& .MuiInputLabel-outlined': {
    transform: 'translate(14px, 16px) scale(1)',
  },
}));

export const StyledTextLine = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 8,
    '& fieldset': {
      borderColor: theme.palette.grey[300],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.grey[400],
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.grey[600],
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
    '&.MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
      backgroundColor: theme.palette.background.paper,
    },
  },
  
  '& .MuiInputLabel-outlined': {
    transform: 'translate(14px, 16px) scale(1)',
  },
}));

export const CardContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 16,
  boxShadow: 'none',
  border: `1px solid ${theme.palette.grey[200]}`,
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '1.5rem',
  color: theme.palette.text.primary,
  marginBottom: theme.spacing(3),
}));

export const FormContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(3),
  maxWidth: 600,
  margin: '0 auto',
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: 16,
  boxShadow: 'none',
  border: `1px solid ${theme.palette.grey[200]}`,
}));

export const ErrorMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.error.main,
  fontSize: '0.875rem',
  marginTop: theme.spacing(1),
}));

export const SuccessMessage = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontSize: '0.875rem',
  marginTop: theme.spacing(1),
}));

export const LoadingContainer = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: 200,
  width: '100%',
}));

export const EmptyStateContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 200,
  width: '100%',
  color: theme.palette.grey[600],
  textAlign: 'center',
  padding: theme.spacing(3),
})); 

export const ModalContainerContent = styled(DialogContent)(({ theme }) => ({
  scrollbarWidth: 'thin',
  scrollbarColor: `${theme.palette.primary.main} #e6f2ec`,
})); 

export const DateFieldWrapper = styled(DatePicker)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    padding: "15px 0",
    borderRadius: 8,
    background: '#fff',
    '& fieldset': {
      borderColor: theme.palette.grey[300],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.grey[400],
    },
    '&.Mui-focused fieldset': {
      borderColor: `${theme.palette.primary.main} !important`,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.grey[600],
    '&.Mui-focused': {
      color: `${theme.palette.primary.main} !important`,
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '12px 14px',
  },
  '& .MuiSvgIcon-root': {
    color: theme.palette.grey[500],
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiSvgIcon-root': {
    color: `${theme.palette.primary.main} !important`,
  },
  '& .Mui-focused:not(.Mui-error) .MuiPickersOutlinedInput-notchedOutline': {
    borderColor: "#2e6846 !important",
  }
})); 

export const IconInfoOutlined = styled(InfoIcon)(() => ({
  marginLeft: 4,
  cursor: "pointer",
  '&:hover': {
    transform: 'scale(1.1)',
    transition: 'transform 0.3s'
  }
}))

export const StyledGrid = styled(Grid)(() => ({
  '& .MuiPaper-root': {
    borderRadius: 10,
  }
}))
