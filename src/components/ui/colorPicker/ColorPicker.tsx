'use client';

import { useState } from 'react';
import { TaskColor } from '@/types/api';
import styles from './ColorPicker.module.scss';

interface ColorPickerProps {
  colors: TaskColor[];
  selectedColorId?: number;
  onChange: (colorId: number) => void;
}

export const ColorPicker = ({ colors, selectedColorId, onChange }: ColorPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleColorSelect = (colorId: number) => {
    onChange(colorId);
    setIsOpen(false);
  };

  const selectedColor = colors.find(color => color.id === selectedColorId);
  
  return (
    <div className={styles.colorPicker}>
      <button 
        className={styles.colorButton}
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          backgroundColor: selectedColor ? selectedColor.hex_code : '#FFFFFF',
          border: selectedColor ? 'none' : '1px solid #ccc'
        }}
        aria-label="Select color"
        type="button"
      />
      
      {isOpen && (
        <div className={styles.colorPalette}>
          {colors.map(color => (
            <button
              key={color.id}
              className={`${styles.colorOption} ${color.id === selectedColorId ? styles.active : ''}`}
              style={{ backgroundColor: color.hex_code }}
              onClick={() => handleColorSelect(color.id)}
              aria-label={`Color ${color.name}`}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  );
};