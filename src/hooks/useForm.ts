import { useState, ChangeEvent, FormEvent } from 'react';

interface FormOptions<T> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  onSubmit: (values: T, helpers: FormHelpers<T>) => void | Promise<void>;
}

interface FormHelpers<T> {
  setValues: (values: T) => void;
  setFieldValue: <K extends keyof T>(field: K, value: T[K]) => void;
  setErrors: (errors: Partial<Record<keyof T, string>>) => void;
  setFieldError: (field: keyof T, error: string) => void;
  resetForm: () => void;
  setSubmitting: (isSubmitting: boolean) => void;
}

interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  onSubmit,
}: FormOptions<T>) {
  const [state, setState] = useState<FormState<T>>({
    values: initialValues,
    errors: {},
    touched: {},
    isSubmitting: false,
    isValid: true,
  });

  const setValues = (values: T) => {
    setState(prev => ({
      ...prev,
      values,
    }));
  };

  const setFieldValue = <K extends keyof T>(field: K, value: T[K]) => {
    setState(prev => ({
      ...prev,
      values: {
        ...prev.values,
        [field]: value,
      },
      touched: {
        ...prev.touched,
        [field]: true,
      },
    }));

    // Validar após alteração de campo
    if (validate) {
      const newErrors = validate({
        ...state.values,
        [field]: value,
      });
      
      setState(prev => ({
        ...prev,
        errors: newErrors,
        isValid: Object.keys(newErrors).length === 0,
      }));
    }
  };

  const setErrors = (errors: Partial<Record<keyof T, string>>) => {
    setState(prev => ({
      ...prev,
      errors,
      isValid: Object.keys(errors).length === 0,
    }));
  };

  const setFieldError = (field: keyof T, error: string) => {
    setState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: error,
      },
      isValid: false,
    }));
  };

  const setFieldTouched = (field: keyof T, isTouched: boolean = true) => {
    setState(prev => ({
      ...prev,
      touched: {
        ...prev.touched,
        [field]: isTouched,
      },
    }));
  };

  const resetForm = () => {
    setState({
      values: initialValues,
      errors: {},
      touched: {},
      isSubmitting: false,
      isValid: true,
    });
  };

  const setSubmitting = (isSubmitting: boolean) => {
    setState(prev => ({
      ...prev,
      isSubmitting,
    }));
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    let finalValue: any = value;
    
    // Converter valor para o tipo apropriado
    if (type === 'number') {
      finalValue = value === '' ? '' : Number(value);
    } else if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    }
    
    setFieldValue(name as keyof T, finalValue);
    setFieldTouched(name as keyof T);
  };

  const handleBlur = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name } = e.target;
    setFieldTouched(name as keyof T);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validar todos os campos
    if (validate) {
      const errors = validate(state.values);
      setErrors(errors);
      
      if (Object.keys(errors).length > 0) {
        return;
      }
    }
    
    setSubmitting(true);
    
    try {
      await onSubmit(state.values, {
        setValues,
        setFieldValue,
        setErrors,
        setFieldError,
        resetForm,
        setSubmitting,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return {
    // Estado
    values: state.values,
    errors: state.errors,
    touched: state.touched,
    isSubmitting: state.isSubmitting,
    isValid: state.isValid,
    
    // Handlers
    handleChange,
    handleBlur,
    handleSubmit,
    
    // Helpers
    setFieldValue,
    setValues,
    setErrors,
    setFieldError,
    setFieldTouched,
    resetForm,
    setSubmitting,
  };
}