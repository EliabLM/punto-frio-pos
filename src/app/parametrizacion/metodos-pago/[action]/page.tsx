import { getPaymentMethods } from '@/actions/payment-methods';
import { PaymentMethodForm } from './form';
import { PaymentMethod } from '@/app/generated/prisma';

interface PaymentMethodFormPageProps {
  params: {
    action: string;
  };
}

export default async function PaymentMethodFormPage({
  params,
}: PaymentMethodFormPageProps) {
  const isEditing = params.action !== 'nuevo';
  const paymentMethods = await getPaymentMethods();
  const paymentMethod = isEditing
    ? paymentMethods.find((p: PaymentMethod) => p.id === params.action)
    : null;

  return (
    <div className='container mx-auto px-4 lg:px-6'>
      <h2 className='text-2xl font-bold mb-6'>
        {isEditing ? 'Editar Método de Pago' : 'Nuevo Método de Pago'}
      </h2>
      <div className='max-w-2xl'>
        <PaymentMethodForm paymentMethod={paymentMethod ?? null} />
      </div>
    </div>
  );
}
