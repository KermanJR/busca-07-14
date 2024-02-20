import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@src/app/context/UserContext';

export default function ProtectedRoutePlan({ children }) {
  const router = useRouter();
  const { passouPaginaAnterior, setPassouPaginaAnterior } = useContext(UserContext);


   useEffect(() => {
    const prevPath = localStorage.getItem("prevPath");
    setPassouPaginaAnterior(prevPath === "/anuncie-seu-buffet");
   
  }, []);
 
   useEffect(() => {
     // Verifica se o usuário tem um token e o papel do usuários
     const userToken = window.localStorage.getItem('USER_TOKEN');
     const userRole = Number(window.localStorage.getItem('USER_ROLE'));

 
     if ((userToken == null)) {
       // Se não tem token e não passou pela página anterior, redireciona para /anuncie-seu-buffet
       router.push("/");
     }else if(passouPaginaAnterior){
      router.push("/planos")
     }
   }, [passouPaginaAnterior]);


  if (router.isFallback) {
    return <div>Carregando...</div>;
  }



  return children;
}
