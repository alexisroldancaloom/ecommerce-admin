'use client';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { MaterialColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface MaterialsClientProps {
  data: MaterialColumn[];
}

export const MaterialsClient: React.FC<MaterialsClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Materiales (${data.length})`}
          description="Administra los materiales de tu tienda"
        />
        <Button onClick={() => router.push(`/${params.storeid}/materials/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Nuevo
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="label" />
      <Heading title="API" description="API llamadas para los materiales" />
      <Separator />
      <ApiList entityName="materials" entityIdName="materialId" />
    </>
  );
};
