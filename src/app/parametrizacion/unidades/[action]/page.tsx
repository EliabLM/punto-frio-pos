import { getUnitMeasures } from '@/actions/unit-measures';
import { UnitMeasureForm } from './form';
import { UnitMeasure } from '@/app/generated/prisma';

interface UnitMeasureFormPageProps {
  params: {
    action: string;
  };
}

export default async function UnitMeasureFormPage({
  params,
}: UnitMeasureFormPageProps) {
  const isEditing = params.action !== 'nuevo';
  const unitMeasures = await getUnitMeasures();
  const unitMeasure = isEditing
    ? unitMeasures.find((u: UnitMeasure) => u.id === params.action)
    : null;

  return (
    <div className='container mx-auto px-4 lg:px-6'>
      <h2 className='text-2xl font-bold mb-6'>
        {isEditing ? 'Editar Unidad de Medida' : 'Nueva Unidad de Medida'}
      </h2>
      <div className='max-w-2xl'>
        <UnitMeasureForm unitMeasure={unitMeasure ?? null} />
      </div>
    </div>
  );
}
