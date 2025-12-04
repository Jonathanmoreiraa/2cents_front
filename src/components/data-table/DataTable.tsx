import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
  CircularProgress,
  Box,
} from "@mui/material";
import {
  StyledTableContainer,
  StyledTableHead,
  StyledTableRow,
} from "./data-table.styles";

export interface DataTableHeader<T> {
  label: string;
  key: keyof T;
  align?: "left" | "center" | "right" | "inherit";
}

interface DataTableProps<T> {
  items: T[];
  headers: DataTableHeader<T>[];
  renderCell?: (row: T, key: keyof T) => React.ReactNode;
  actions?: (row: T) => React.ReactNode;
  emptyMessage?: string;
  loading?: boolean;
}

function DataTable<T>({
  items,
  headers,
  renderCell,
  actions,
  emptyMessage = "Nenhum resultado encontrado.",
  loading = false,
}: DataTableProps<T>) {
  const colSpan = headers.length + (actions ? 1 : 0);
  return (
    <StyledTableContainer>
      <Table>
        <StyledTableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell
                key={String(header.key)}
                align={header.align || "left"}
              >
                {header.label}
              </TableCell>
            ))}
            {actions && <TableCell align="center">Ações</TableCell>}
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={colSpan} align="center">
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  minHeight={200}
                >
                  <CircularProgress />
                </Box>
              </TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={colSpan} align="center">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => (
              <StyledTableRow key={index}>
                {headers.map((header) => (
                  <TableCell
                    key={String(header.key)}
                    align={header.align || "left"}
                  >
                    {renderCell
                      ? renderCell(item, header.key)
                      : (item[header.key] as React.ReactNode)}
                  </TableCell>
                ))}
                {actions && (
                  <TableCell align="center">{actions(item)}</TableCell>
                )}
              </StyledTableRow>
            ))
          )}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}

export default DataTable;
