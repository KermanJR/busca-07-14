import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@src/app/context/UserContext';

export default function ProtectedRoute({ children, allowedRoles }) {

  const router = useRouter();



  useEffect(() => {
    const userToken = window.localStorage.getItem('USER_TOKEN'); 
    const userRole = window.localStorage.getItem('USER_ROLE');
    const userId = window.localStorage.getItem('USER_ID');
 
    if (!userToken || !userId || !allowedRoles.includes(userRole)) {
      router.push('/');
    }
  }, []);

  if (router.isFallback) {
    return <div>Carregando...</div>;
  }



  return children;
}
