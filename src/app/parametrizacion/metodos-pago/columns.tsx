'use client';

import { ColumnDef } from '@tanstack/react-table';
import { PaymentMethod } from '@/app/generated/prisma';
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
import { deletePaymentMethod } from '@/actions/payment-methods';

export const columns: ColumnDef<PaymentMethod>[] = [
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    accessorKey: 'type',
    header: 'Tipo',
    cell: ({ row }) => {
      const type = row.getValue('type') as string;
      return type.charAt(0) + type.slice(1).toLowerCase();
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const paymentMethod = row.original;

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
              <Link
                href={`/parametrizacion/metodos-pago/${paymentMethod.id}/editar`}
              >
                <Pencil className='mr-2 h-4 w-4' />
                Editar
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className='text-red-600'
              onClick={async () => {
                if (confirm('¿Estás seguro de eliminar este método de pago?')) {
                  await deletePaymentMethod(paymentMethod.id);
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
