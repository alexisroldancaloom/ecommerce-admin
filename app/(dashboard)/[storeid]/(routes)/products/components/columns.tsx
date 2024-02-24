'use client';

import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from './cell-action';

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  category: string;
  size: string;
  material: string;
  createdAt: string;
  isFeatured: boolean;
  isArchived: boolean;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    accessorKey: 'isArchived',
    header: 'Archivado',
  },
  {
    accessorKey: 'isFeatured',
    header: 'Destacado',
  },
  {
    accessorKey: 'price',
    header: 'Precio',
  },
  {
    accessorKey: 'category',
    header: 'Categoría',
  },
  {
    accessorKey: 'size',
    header: 'Tamaño',
  },
  {
    accessorKey: 'material',
    header: 'Material',
  },
  {
    accessorKey: 'createdAt',
    header: 'Fecha',
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
