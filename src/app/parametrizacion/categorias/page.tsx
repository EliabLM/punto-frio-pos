'use server';

import { getCategories } from '@/actions/categories';
import { DataTable } from '@/components/parametrizacion/data-table';
import { columns } from './columns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className='container mx-auto px-4 lg:px-6'>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-2xl font-bold'>Categorías</h2>
        <Button asChild>
          <Link href='/parametrizacion/categorias/nuevo'>Nueva Categoría</Link>
        </Button>
      </div>
      <DataTable columns={columns} data={categories} />
    </div>
  );
}
