'use client';

import { PaymentMethod, PaymentType } from '@/app/generated/prisma';
import {
  createPaymentMethod,
  updatePaymentMethod,
} from '@/actions/payment-methods';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const paymentMethodSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
  type: z.nativeEnum(PaymentType),
});

type PaymentMethodFormValues = z.infer<typeof paymentMethodSchema>;

interface PaymentMethodFormProps {
  paymentMethod: PaymentMethod | null;
}

export function PaymentMethodForm({ paymentMethod }: PaymentMethodFormProps) {
  const router = useRouter();
  const form = useForm<PaymentMethodFormValues>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      name: paymentMethod?.name ?? '',
      type: paymentMethod?.type ?? PaymentType.CASH,
    },
  });

  async function onSubmit(data: PaymentMethodFormValues) {
    try {
      if (paymentMethod) {
        await updatePaymentMethod(paymentMethod.id, data);
        toast.success('Método de pago actualizado correctamente');
      } else {
        await createPaymentMethod(data);
        toast.success('Método de pago creado correctamente');
      }
      router.push('/parametrizacion/metodos-pago');
      router.refresh();
    } catch (error) {
      toast.error('Error al guardar el método de pago');
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
                <Input placeholder='Nombre del método de pago' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Seleccione un tipo' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values(PaymentType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0) + type.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex justify-end space-x-4'>
          <Button
            type='button'
            variant='outline'
            onClick={() => router.push('/parametrizacion/metodos-pago')}
          >
            Cancelar
          </Button>
          <Button type='submit'>
            {paymentMethod ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
