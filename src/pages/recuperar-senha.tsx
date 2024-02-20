import Footer from "@src/app/components/site/Patterns/Footer/Footer";
import Header from "@src/app/components/site/Patterns/Header/Header";
import NewBuffet from "@src/app/content/site/screens/NewBuffet";
import RecoveryPassword from "@src/app/content/site/screens/RecoveryPassword";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function AnuncieSeuBuffet(){
  const router = useRouter();

  

  useEffect(() => {
    // Configura o histórico de navegação quando o usuário acessa esta página
    localStorage.setItem("prevPath", router.pathname);
  }, [router.pathname]);
  return(
    <>
      <Header/>
        <RecoveryPassword/>
      <Footer/>
    </>
  )
}
