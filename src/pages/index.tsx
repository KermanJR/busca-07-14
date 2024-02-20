import HomeScreen from "@src/app/content/site/screens/HomeScreen";
import Footer from "@src/app/components/site/Patterns/Footer/Footer";
import Header from "@src/app/components/site/Patterns/Header/Header";
import { useRouter } from "next/router";
import { useEffect } from "react";
export default function App(){
  const router = useRouter();

  

  useEffect(() => {
    // Configura o histórico de navegação quando o usuário acessa esta página
    localStorage.setItem("prevPath", router.pathname);
  }, [router.pathname]);
  return(
    <>
    <Header/>
      <HomeScreen/>
      <Footer/>
    </>
  )
}
