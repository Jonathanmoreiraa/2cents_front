import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import { CardRow, EmptyStateBox, CardGeneric } from './Data.styles';

export interface GenericCardListHeader<T> {
  label: string;
  key: keyof T;
}

interface GenericCardListProps<T> {
  items: T[];
  headers: GenericCardListHeader<T>[];
  renderItem?: (item: T, key: keyof T) => React.ReactNode;
  actions?: (item: T) => React.ReactNode;
  emptyMessage?: string;
}

function GenericCardList<T extends { id?: number | string }>({
  items,
  headers,
  renderItem,
  actions,
  emptyMessage = 'Nenhum resultado encontrado.',
}: GenericCardListProps<T>) {
  if (!items.length) {
    return (
      <EmptyStateBox>
        <Typography variant="h6" color="text.secondary">{emptyMessage}</Typography>
      </EmptyStateBox>
    );
  }
  return (
    <Box width="100%">
      {items.map((item) => (
        <CardGeneric key={item.id ?? Math.random()}>
          <Stack spacing={1}>
            {headers.map((header) => (
              <CardRow key={String(header.key)}>
                <Box component="span" fontWeight={600}>{header.label}:</Box>
                <Box component="span" paddingLeft={1} textAlign={'right'}>
                  {renderItem ? renderItem(item, header.key) : (item[header.key] as React.ReactNode)}
                </Box>
              </CardRow>
            ))}
            {actions && (
              <Box display="flex" justifyContent="flex-end" mt={1}>
                {actions(item)}
              </Box>
            )}
          </Stack>
        </CardGeneric>
      ))}
    </Box>
  );
}

export default GenericCardList; 