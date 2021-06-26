import { useEffect, useState } from 'react';
import { useJWT, useTempToken } from '.';
import { getUserDetails } from '../api';
import { useAuth } from '../providers/authProvider';

export default function useAuthentication() {
  const [jwt] = useJWT();
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(true);
  const { presetUser } = useAuth();
  const tempToken = useTempToken();

  useEffect(() => {
    (async () => {
        setTimeout(()=>{
            const response = getUserDetails(jwt);
            if (response && response.success) {
              setLoading(false);
              delete response.user.password
              presetUser(response.user);
              setToken(jwt);
            } else {
              setLoading(false);
              window.localStorage.removeItem('_jwt');
              setToken(tempToken);
            }
        }, 2000);
    })();
  }, []);

  return [token, loading];
}