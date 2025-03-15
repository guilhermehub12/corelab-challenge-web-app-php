'use client';

import { useState } from 'react';
import { TaskColor } from '@/types/api';
import { useUI } from '@/context/UIContext';
import styles from './ColorFilterSelector.module.scss';

interface ColorFilterSelectorProps {
  colors: TaskColor[];
  selectedColorId: number | null;
  onChange: (colorId: number | null) => void;
}

export const ColorFilterSelector = ({
  colors,
  selectedColorId,
  onChange
}: ColorFilterSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { state: uiState } = useUI();
  
  const handleToggle = () => {
    setIsOpen(prev => !prev);
  };
  
  const handleColorSelect = (colorId: number) => {
    onChange(selectedColorId === colorId ? null : colorId);
    setIsOpen(false);
  };
  
  const handleClearFilter = () => {
    onChange(null);
    setIsOpen(false);
  };
  
  // Obter a cor selecionada
  const selectedColor = selectedColorId !== null
    ? colors.find(color => color.id === selectedColorId)
    : null;
  
  return (
    <div className={styles.container}>
      <button 
        className={styles.filterButton}
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {selectedColor ? (
          <>
            <span 
              className={styles.colorIndicator} 
              style={{ backgroundColor: selectedColor.hex_code }}
            />
            <span>Filtrado por {selectedColor.name}</span>
            <span className={styles.clearButton} onClick={(e) => {
              e.stopPropagation();
              handleClearFilter();
            }}>
              ✕
            </span>
          </>
        ) : (
          <>
            <FilterIcon />
            <span>Filtrar por cor</span>
          </>
        )}
      </button>
      
      {isOpen && (
        <div className={`${styles.dropdown} ${uiState.theme === 'dark' ? styles.dark : ''}`}>
          <div className={styles.dropdownHeader}>
            <span>Selecione uma cor</span>
            <button 
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Fechar seletor de cores"
            >
              ✕
            </button>
          </div>
          
          <div className={styles.colorGrid}>
            {colors.map(color => (
              <button
                key={color.id}
                className={`${styles.colorOption} ${selectedColorId === color.id ? styles.selected : ''}`}
                style={{ backgroundColor: color.hex_code }}
                onClick={() => handleColorSelect(color.id)}
                aria-label={`Filtrar por cor ${color.name}`}
                aria-selected={selectedColorId === color.id}
              />
            ))}
          </div>
          
          {selectedColorId !== null && (
            <button 
              className={styles.clearFilterButton}
              onClick={handleClearFilter}
            >
              Limpar filtro
            </button>
          )}
        </div>
      )}
    </div>
  );
};

const FilterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);