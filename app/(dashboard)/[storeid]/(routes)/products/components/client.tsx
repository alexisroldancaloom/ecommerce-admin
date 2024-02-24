'use client';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { ProductColumn, columns } from './columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '@/components/ui/api-list';

interface ProductsClientProps {
  data: ProductColumn[];
}

export const ProductClient: React.FC<ProductsClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Productos (${data.length})`}
          description="Administra los productos de tu tienda"
        />
        <Button onClick={() => router.push(`/${params.storeid}/products/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Agregar Nuevo
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
      <Heading title="API" description="API llamadas para los productos" />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
};
