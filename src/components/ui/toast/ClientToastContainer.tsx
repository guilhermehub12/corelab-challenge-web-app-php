'use client';

import { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import styles from './Toast.module.scss';

export const ClientToastContainer = ({ children }: { children: ReactNode }) => {
  return createPortal(
    <div className={styles.container}>{children}</div>,
    document.body
  );
};