import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export function useJWT() {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      let item = '';
      if (process.browser) item = window.localStorage.getItem('_jwt');
      if(item) {
        window.localStorage.removeItem('foine_temp_token');
        return item;
      }
      return '';
    } catch (error) {
      return '';
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (process.browser) window.localStorage.setItem('_jwt', valueToStore);
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue];
}

export function useTempToken(){
  let item = '';
    try {
      let value = ""
      if (process.browser) value = window.localStorage.getItem('foine_temp_token');
      if (value) item = value
      else item = uuidv4();
      window.localStorage.setItem('foine_temp_token', item);
    } catch (error) {
      item = '';
    }

  return item;
}
