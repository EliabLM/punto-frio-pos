'use client';

import { ColumnDef } from '@tanstack/react-table';
import { UnitMeasure } from '@/app/generated/prisma';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { deleteUnitMeasure } from '@/actions/unit-measures';

export const columns: ColumnDef<UnitMeasure>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    accessorKey: 'abbreviation',
    header: 'Abreviación',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const unitMeasure = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Abrir menú</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/parametrizacion/unidades/${unitMeasure.id}/editar`}>
                <Pencil className='mr-2 h-4 w-4' />
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className='text-red-600'
              onClick={async () => {
                if (
                  confirm('¿Estás seguro de eliminar esta unidad de medida?')
                ) {
                  await deleteUnitMeasure(unitMeasure.id);
                }
              }}
            >
              <Trash className='mr-2 h-4 w-4' />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
