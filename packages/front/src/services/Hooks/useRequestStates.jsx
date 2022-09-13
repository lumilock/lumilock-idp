import { useState } from 'react';

// Basics states to manage a request
export default function useRequestStates() {
  const [errors, setErrors] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // Array part
  const result = [
    errors,
    success,
    loading,
    setErrors,
    setSuccess,
    setLoading,
  ];

  // object part
  result.errors = errors;
  result.success = success;
  result.loading = loading;
  result.setErrors = setErrors;
  result.setSuccess = setSuccess;
  result.setLoading = setLoading;

  return result;
}
