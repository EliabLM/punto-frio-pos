'use server';

import { getPaymentMethods } from '@/actions/payment-methods';
import { DataTable } from '@/components/parametrizacion/data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function PaymentMethodsPage() {
  const paymentMethods = await getPaymentMethods();

  return (
    <div className='container mx-auto px-4 lg:px-6'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold'>Métodos de Pago</h2>
        <Button asChild>
          <Link href='/parametrizacion/metodos-pago/nuevo'>Nuevo Método</Link>
        </Button>
      </div>
      <DataTable columns={columns} data={paymentMethods} />
    </div>
  );
}
