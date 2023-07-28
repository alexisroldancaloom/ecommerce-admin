'use client';

import { Modal } from '../ui/modal';
import { useStoreModal } from '@/hooks/use-store-modal';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const formSchema = z.object({
  name: z.string().min(1),
});

export const StoreModal = () => {
  const storeModal = useStoreModal();
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post('/api/stores', values);
      toast.success('Tienda creada con éxito');
      window.location.assign(`/${response.data.id}`);
    } catch (error) {
      toast.error('Algo salió mal :(');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Crear Tienda"
      description="Agregar una nueva tienda para manejar productos y categorías "
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className="space-y-4 py-2 pb-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Mi tienda"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
              <Button
                disabled={loading}
                variant="outline"
                onClick={storeModal.onClose}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                Continuar
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </Modal>
  );
};
