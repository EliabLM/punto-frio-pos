'use client';

import { UnitMeasure } from '@/app/generated/prisma';
import { createUnitMeasure, updateUnitMeasure } from '@/actions/unit-measures';
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

const unitMeasureSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  abbreviation: z.string().min(1, 'La abreviación es requerida'),
});

type UnitMeasureFormValues = z.infer<typeof unitMeasureSchema>;

interface UnitMeasureFormProps {
  unitMeasure: UnitMeasure | null;
}

export function UnitMeasureForm({ unitMeasure }: UnitMeasureFormProps) {
  const router = useRouter();
  const form = useForm<UnitMeasureFormValues>({
    resolver: zodResolver(unitMeasureSchema),
    defaultValues: {
      name: unitMeasure?.name ?? '',
      abbreviation: unitMeasure?.abbreviation ?? '',
    },
  });

  async function onSubmit(data: UnitMeasureFormValues) {
    try {
      if (unitMeasure) {
        await updateUnitMeasure(unitMeasure.id, data);
        toast.success('Unidad de medida actualizada correctamente');
      } else {
        await createUnitMeasure(data);
        toast.success('Unidad de medida creada correctamente');
      }
      router.push('/parametrizacion/unidades');
      router.refresh();
    } catch (error) {
      console.error('Error al guardar la unidad de medida', error);
      toast.error('Error al guardar la unidad de medida');
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
                <Input placeholder='Nombre de la unidad' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='abbreviation'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Abreviación</FormLabel>
              <FormControl>
                <Input placeholder='Abreviación de la unidad' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end space-x-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.push('/parametrizacion/unidades')}
          >
            Cancelar
          </Button>
          <Button type='submit'>{unitMeasure ? 'Actualizar' : 'Crear'}</Button>
        </div>
      </form>
    </Form>
  );
}
