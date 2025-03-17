import { useState, useCallback } from 'react';

interface ModalData {
  [key: string]: unknown;
}

interface UseModalOptions {
  initialOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export function useModal({
  initialOpen = false,
  onOpen,
  onClose,
}: UseModalOptions = {}) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [data, setData] = useState<ModalData | null>(null);

  const open = useCallback((modalData?: ModalData) => {
    setIsOpen(true);
    setData(modalData || null);
    onOpen?.();
  }, [onOpen]);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      onOpen?.();
    } else {
      onClose?.();
    }
  }, [isOpen, onOpen, onClose]);

  return {
    isOpen,
    data,
    open,
    close,
    toggle,
    setData,
  };
}