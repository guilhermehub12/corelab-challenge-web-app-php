import { useState, useCallback } from 'react';

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
  const [data, setData] = useState<any>(null);

  const open = useCallback((modalData?: any) => {
    setIsOpen(true);
    setData(modalData);
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