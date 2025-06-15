'use client';

import { Category } from '@/app/generated/prisma';
import { createCategory, updateCategory } from '@/actions/categories';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  description: z.string().optional(),
});

type CategoryFormValues = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  category: Category | null;
}

export function CategoryForm({ category }: CategoryFormProps) {
  const router = useRouter();
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? '',
      description: category?.description ?? '',
    },
  });

  async function onSubmit(data: CategoryFormValues) {
    try {
      if (category) {
        await updateCategory(category.id, data);
        toast.success('Categoría actualizada correctamente');
      } else {
        await createCategory(data);
        toast.success('Categoría creada correctamente');
      }
      router.push('/parametrizacion/categorias');
      router.refresh();
    } catch (error) {
      toast.error('Error al guardar la categoría');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder='Nombre de la categoría' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Input placeholder='Descripción de la categoría' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end space-x-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.push('/parametrizacion/categorias')}
          >
            Cancelar
          </Button>
          <Button type='submit'>{category ? 'Actualizar' : 'Crear'}</Button>
        </div>
      </form>
    </Form>
  );
}
