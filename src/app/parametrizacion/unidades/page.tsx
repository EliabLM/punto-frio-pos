'use server';

import { getUnitMeasures } from '@/actions/unit-measures';
import { DataTable } from '@/components/parametrizacion/data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function UnitMeasuresPage() {
  const unitMeasures = await getUnitMeasures();

  return (
    <div className='container mx-auto px-4 lg:px-6'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold'>Unidades de Medida</h2>
        <Button asChild>
          <Link href='/parametrizacion/unidades/nuevo'>Nueva Unidad</Link>
        </Button>
      </div>
      <DataTable columns={columns} data={unitMeasures} />
    </div>
  );
}
