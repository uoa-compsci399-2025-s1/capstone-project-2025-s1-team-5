// src/components/Modal.tsx
import React, { ReactNode } from 'react';
import styles from './Modal.module.css';
export interface ModalProps {
  children: ReactNode;
  onClose: () => void;      // ← 一定要有这个
}

export default function Modal({ children, onClose }: ModalProps) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContent}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}