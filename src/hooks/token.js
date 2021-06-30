import { useState } from 'react';

export function useToken() {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      let item = '';
      if (process.browser) item = window.localStorage.getItem('_foine_temp_token');
      return item ? item : '';
    } catch (error) {
      return '';
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (process.browser) window.localStorage.setItem('_foine_temp_token', valueToStore);
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}


export function useAuthToken() {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      let item = '';
      if (process.browser) item = window.localStorage.getItem('_foine_auth_token');
      return item ? item : '';
    } catch (error) {
      return '';
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (process.browser) {
        window.localStorage.setItem('_foine_auth_token', valueToStore);
        window.localStorage.removeItem("_foine_temp_token");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}
