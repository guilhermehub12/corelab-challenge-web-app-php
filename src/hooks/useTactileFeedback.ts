'use client';

import { useCallback } from 'react';

// Tipo para vibrações
export type VibrationType = 'success' | 'error' | 'warning' | 'info' | 'click';

// Padrões de vibração (em ms)
const vibrationPatterns: Record<VibrationType, number[]> = {
  success: [100],
  error: [100, 50, 100],
  warning: [50, 30, 50],
  info: [50],
  click: [10]
};

export function useTactileFeedback() {
  // Verificar suporte a vibração
  const hasVibration = typeof navigator !== 'undefined' && 'vibrate' in navigator;
  
  // Função para vibrar com padrão específico
  const vibrate = useCallback((type: VibrationType = 'click') => {
    if (hasVibration) {
      try {
        navigator.vibrate(vibrationPatterns[type]);
      } catch (error) {
        console.error('Error executing vibration:', error);
      }
    }
  }, [hasVibration]);
  
  // Função para vibrar no clique (mais curta)
  const vibrateOnClick = useCallback(() => {
    vibrate('click');
  }, [vibrate]);
  
  // Função para parar vibração
  const stopVibration = useCallback(() => {
    if (hasVibration) {
      try {
        navigator.vibrate(0);
      } catch (error) {
        console.error('Error stopping vibration:', error);
      }
    }
  }, [hasVibration]);
  
  return {
    vibrate,
    vibrateOnClick,
    stopVibration,
    isSupported: hasVibration
  };
}