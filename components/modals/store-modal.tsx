'use client';

import { Modal } from '../ui/modal';
import { useStoreModal } from '@/hooks/use-store-modal';

export const StoreModal = () => {
  const storeModal = useStoreModal();
  return (
    <Modal
      title="Crear Tienda"
      description="Agregar una nueva tienda para manejar productos y categorías "
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      Formulario
    </Modal>
  );
};
