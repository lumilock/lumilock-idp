import { useState } from 'react';

// Basics states to manage a request
export default function useRequestStates(initData = undefined, initErrors = '', initSuccess = '', initLoading = false) {
  const [data, setData] = useState(initData);
  const [errors, setErrors] = useState(initErrors);
  const [success, setSuccess] = useState(initSuccess);
  const [loading, setLoading] = useState(initLoading);

  // Array part
  const result = [
    data,
    errors,
    success,
    loading,
    setData,
    setErrors,
    setSuccess,
    setLoading,
  ];

  // object part
  result.data = data;
  result.errors = errors;
  result.success = success;
  result.loading = loading;
  result.setData = setData;
  result.setErrors = setErrors;
  result.setSuccess = setSuccess;
  result.setLoading = setLoading;

  return result;
}
