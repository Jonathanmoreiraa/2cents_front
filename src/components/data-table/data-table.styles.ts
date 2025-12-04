import { styled } from "@mui/material/styles";
import {
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Paper,
} from "@mui/material";
import theme from "../../theme";

export const StyledTableContainer = styled(TableContainer)({
  borderRadius: 16,
  boxShadow: "none",
  border: "1px solid #E0E0E0",
  background: "#fff",
});

export const StyledTableHead = styled(TableHead)({
  background: "#F7F7F7",
  "& th": {
    fontWeight: 700,
    fontSize: 16,
    color: "#222",
    borderBottom: "none",
    padding: "18px 0",
    backgroundColor: "#f1f1f1",
    textAlign: "center",
  },
});

export const StyledTableRow = styled(TableRow)({
  "& td": {
    fontSize: 17,
    color: "#666",
    borderBottom: "1px solid #E0E0E0",
    paddingLeft: 8,
    textAlign: "center",
    maxWidth: "150px",
    lineBreak: "break-word",
    hyphens: "auto",
    wordBreak: "break-word",
    overflowWrap: "break-word",
  },
  "&:last-child td": {
    borderBottom: "none",
  },
});

export const StatusTypography = styled(Typography)<{ status: string }>(
  ({ status }) => ({
    fontWeight: 700,
    color:
      status === "Received" || status === "Paga"
        ? theme.palette.primary.main
        : status === "Próxima do vencimento"
          ? "#B0A748"
          : status === "Overdue" || status === "Em atraso"
            ? theme.palette.error.main
            : "#888",
  }),
);

export const PaginationWrapper = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 32,
});

export const PaginationCircle = styled(Box)({
  width: 40,
  height: 40,
  borderRadius: "50%",
  background: theme.palette.primary.main,
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700,
  fontSize: 22,
});

export const CardGeneric = styled(Paper)({
  marginBottom: 16,
  padding: 19,
  borderRadius: 16,
  boxShadow: "none",
  border: "1px solid #E0E0E0",
  display: "flex",
  flexDirection: "column",
  gap: 10,
});

export const CardRow = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 4,
});

export const EmptyStateBox = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: 200,
});
