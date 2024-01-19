import GlobalStyle from "@src/app/theme/GlobalStyle";
import ThemeProvider from "@src/app/theme/ThemeProvider";
import { AppProps } from "next/app";
import { useEffect, useState } from "react";
import ActivePageContext from "@src/app/context/ActivePageContext";
import { ModalProvider } from "@src/app/context/ModalContext";
import { UserProvider } from "@src/app/context/UserContext";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps){

  const [href, setHref] = useState('');
  const [activePage, setActivePage] = useState('Dashboard');
  const [widthSideMenu, setWidthSizeMenu] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const [passouPaginaAnterior, setPassouPaginaAnterior] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url) => {
      // Redirecionar para a página 404 se a rota não existir
      if (url.startsWith('/_error') && url.includes('statusCode=404')) {
        router.push('/404');
      }
    };

    // Adicionar o ouvinte de mudança de rota
    router.events.on('routeChangeComplete', handleRouteChange);

    // Remover o ouvinte ao desmontar o componente
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);
  

  useEffect(()=>{
    setHref(window.document.location.pathname);
  },[])

  return(
    <ActivePageContext.Provider value={{isOpen, setIsOpen, activePage, setActivePage, widthSideMenu, setWidthSizeMenu}}>
        <title>Busca Buffet</title>
        <UserProvider>
        <ThemeProvider>
          <ModalProvider>
            <GlobalStyle/>
            <Component {...pageProps}/>
          </ModalProvider>
        </ThemeProvider>
        </UserProvider>
        
    </ActivePageContext.Provider>
  )
}
