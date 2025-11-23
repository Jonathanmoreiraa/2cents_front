import { styled } from '@mui/material/styles';
import { Button, TextField, Box, Typography, DialogContent, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import InfoIcon from '@mui/icons-material/InfoOutlined';
import theme from '../theme';

export const StyledActionButton = styled(Button)`
  border-radius: 25px;
  font-weight: 600;
  font-size: 15px;
  padding: 8px 24px;
  text-transform: none;
  box-shadow: none;

  &:hover {
    box-shadow: none;
  }

  &.MuiButton-outlinedSuccess {
    border-color: ${theme.palette.primary.main};
    color: ${theme.palette.primary.main};

    &:hover {
      border-color: ${theme.palette.primary.main};
      background-color: ${theme.palette.primary.main};
      color: white;
    }
  }

  &.MuiButton-containedSuccess {
    background-color: ${theme.palette.primary.main};

    &:hover {
      background-color: ${theme.palette.success.dark};
    }
  }
`;

export const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 8;

    fieldset {
      border-color: ${theme.palette.grey[300]};
    }

    &:hover fieldset {
      border-color: ${theme.palette.grey[400]};
    }

    .Mui-focused fieldset {
      border-color: ${theme.palette.primary.main};
    }
  }

  & .MuiInputLabel-root {
    color: ${theme.palette.grey[600]};

    &.Mui-focused {
      color: ${theme.palette.primary.main};
    }

    &.MuiInputLabel-shrink {
      transform: translate(14px, -9px) scale(0.75);
      background-color: ${theme.palette.background.paper};
    }
  }

  & .MuiInputLabel-outlined {
    transform: translate(14px, 16px) scale(1);
  }
`;

export const CardContainer = styled(Box)`
  background-color: ${theme.palette.background.paper};
  border-radius: 16px;
  box-shadow: none;
  border: 1px solid ${theme.palette.grey[200]};
  padding: ${theme.spacing(3)};
  margin-bottom: ${theme.spacing(2)};
`;

export const SectionTitle = styled(Typography)`
  font-weight: 600;
  font-size: 1.5rem;
  color: ${theme.palette.text.primary};
  margin-bottom: ${theme.spacing(3)};
`;

export const FormContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing(3)};
  max-width: 600;
  margin: 0 auto;
  padding: ${theme.spacing(3)};
  background-color: ${theme.palette.background.paper};
  border-radius: 16px;
  box-shadow: none;
  border: 1px solid ${theme.palette.grey[200]};
`;

export const ErrorMessage = styled(Typography)`
  color: ${theme.palette.error.main};
  font-size: 0.875rem;
  margin-top: ${theme.spacing(1)};
`;

export const SuccessMessage = styled(Typography)`
  color: ${theme.palette.primary.main};
  font-size: 0.875rem;
  margin-top: ${theme.spacing(1)};
`;

export const LoadingContainer = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200;
  width: 100%;
`;

export const EmptyStateContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200;
  width: 100%;
  color: ${theme.palette.grey[600]};
  text-align: center;
  padding: ${theme.spacing(3)};
`;

export const ModalContainerContent = styled(DialogContent)`
  scrollbar-width: thin;
  scrollbar-color: ${theme.palette.primary.main} #e6f2ec;
`;

export const DateFieldWrapper = styled(DatePicker)`
  & .MuiOutlinedInput-root {
    padding: 15px 0;
    border-radius: 8px;
    background: #fff;

    fieldset {
      border-color: ${theme.palette.grey[300]};
    }

    &:hover fieldset {
      border-color: ${theme.palette.grey[400]};
    }

    &.Mui-focused fieldset {
      border-color: ${theme.palette.primary.main} !important;
    }
  }

  & .MuiInputLabel-root {
    color: ${theme.palette.grey[600]};

    &.Mui-focused {
      color: ${theme.palette.primary.main} !important;
    }
  }

  & .MuiOutlinedInput-input {
    padding: 12px 14px;
  }

  & .MuiSvgIcon-root {
    color: ${theme.palette.grey[500]};
  }

  & .MuiOutlinedInput-root.Mui-focused .MuiSvgIcon-root {
    color: ${theme.palette.primary.main} !important;
  }

  & .Mui-focused:not(.Mui-error)
    .MuiPickersOutlinedInput-notchedOutline {
    border-color: #2e6846 !important;
  }
`;

export const IconInfoOutlined = styled(InfoIcon)`
  margin-left: 4;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
    transition: transform 0.3s;
  }
`;

export const StyledGrid = styled(Grid)`
  .MuiPaper-root {
    border-radius: 10px;
  }

  @media (max-width: 900px) {
    width: 100% !important;
  }
`;
