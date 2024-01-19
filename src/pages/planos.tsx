import Footer from "@src/app/components/site/Patterns/Footer/Footer";
import Header from "@src/app/components/site/Patterns/Header/Header";
import Plans from "@src/app/content/site/screens/Plans";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { UserContext } from "@src/app/context/UserContext";
import ProtectedRoute from "./ProtectedRoutes";
import ProtectedRoutePlan from "./ProtectedRoutePlan";

export default function Planos() {

  const router = useRouter()


  return (
    <>
    {}
    <ProtectedRoutePlan>
      <Header/>
        <Plans />
      <Footer />
    </ProtectedRoutePlan>
      
    </>
  );
}
