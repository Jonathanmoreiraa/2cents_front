import React from "react";
import { DateFieldProps } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale/pt-BR";
import { DateFieldWrapper } from "./common-components.styles";

const DateFieldInput: React.FC<DateFieldProps<boolean>> = (props) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
      <DateFieldWrapper format="dd/MM/yyyy" fullWidth {...props} />
    </LocalizationProvider>
  );
};

export default DateFieldInput;
