'use server';

import { getCategories } from '@/actions/categories';
import { CategoryForm } from './form';
import { Category } from '@/app/generated/prisma';

interface CategoryFormPageProps {
  params: {
    action: string;
  };
}

export default async function CategoryFormPage({
  params,
}: CategoryFormPageProps) {
  const isEditing = params.action !== 'nuevo';
  const categories = await getCategories();
  const category = isEditing
    ? categories.find((c: Category) => c.id === params.action)
    : null;

  return (
    <div className='container mx-auto px-4 lg:px-6'>
      <h2 className='text-2xl font-bold mb-6'>
        {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
      </h2>
      <div className='max-w-2xl'>
        <CategoryForm category={category ?? null} />
      </div>
    </div>
  );
}
