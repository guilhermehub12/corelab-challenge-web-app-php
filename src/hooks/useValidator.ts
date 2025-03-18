import { useMemo } from 'react';

interface ValidationRule<T> {
  test: (value: T, formValues?: Record<string, unknown>) => boolean;
  message: string;
}

interface ValidationConfig<T> {
  required?: boolean | string;
  min?: { value: number; message: string };
  max?: { value: number; message: string };
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  validate?: ValidationRule<T>[] | ((value: T, formValues?: Record<string, unknown>) => string | undefined);
}

export function useValidator() {
  const createValidator = useMemo(() => {
    return <T extends Record<string, unknown>>(schema: Record<keyof T, ValidationConfig<T[keyof T]>>) => {
      return (values: T): Partial<Record<keyof T, string>> => {
        const errors: Partial<Record<keyof T, string>> = {};
        
        // Validar cada campo
        Object.keys(schema).forEach((key) => {
          const fieldKey = key as keyof T;
          const value = values[fieldKey];
          const fieldSchema = schema[fieldKey];
          
          // Required
          if (fieldSchema.required) {
            const isEmptyValue = value === undefined || value === null || value === '';
            
            if (isEmptyValue) {
              errors[fieldKey] = typeof fieldSchema.required === 'string'
                ? fieldSchema.required
                : 'Este campo é obrigatório';
              return; // Não continuar validando este campo
            }
          }
          
          // Se o valor é undefined ou null e não é obrigatório, pulamos a validação
          if (value === undefined || value === null) {
            return;
          }
          
          // Min (para números)
          if (fieldSchema.min && typeof value === 'number') {
            if (value < fieldSchema.min.value) {
              errors[fieldKey] = fieldSchema.min.message;
              return;
            }
          }
          
          // Max (para números)
          if (fieldSchema.max && typeof value === 'number') {
            if (value > fieldSchema.max.value) {
              errors[fieldKey] = fieldSchema.max.message;
              return;
            }
          }
          
          // MinLength (para strings e arrays)
          if (fieldSchema.minLength && (typeof value === 'string' || Array.isArray(value))) {
            if (value.length < fieldSchema.minLength.value) {
              errors[fieldKey] = fieldSchema.minLength.message;
              return;
            }
          }
          
          // MaxLength (para strings e arrays)
          if (fieldSchema.maxLength && (typeof value === 'string' || Array.isArray(value))) {
            if (value.length > fieldSchema.maxLength.value) {
              errors[fieldKey] = fieldSchema.maxLength.message;
              return;
            }
          }
          
          // Pattern (para strings)
          if (fieldSchema.pattern && typeof value === 'string') {
            if (!fieldSchema.pattern.value.test(value)) {
              errors[fieldKey] = fieldSchema.pattern.message;
              return;
            }
          }
          
          // Validate (função personalizada ou array de regras)
          if (fieldSchema.validate) {
            if (typeof fieldSchema.validate === 'function') {
              const error = fieldSchema.validate(value, values);
              if (error) {
                errors[fieldKey] = error;
                return;
              }
            } else if (Array.isArray(fieldSchema.validate)) {
              for (const rule of fieldSchema.validate) {
                if (!rule.test(value, values)) {
                  errors[fieldKey] = rule.message;
                  return;
                }
              }
            }
          }
        });
        
        return errors;
      };
    };
  }, []);
  
  return { createValidator };
}