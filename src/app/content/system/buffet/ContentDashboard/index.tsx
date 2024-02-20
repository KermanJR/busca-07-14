import Box from "@src/app/theme/components/Box/Box";
import SideMenu from "@src/app/components/system/SidebarMenu";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import ActivePageContext from "@src/app/context/ActivePageContext";
import SubHeader from "@src/app/components/system/Subheader";
import theme from "@src/app/theme/theme";
import Homedash from "../pages/Dashboard";
import EditPerfil from "../pages/Perfil";
import Budgets from "../pages/BudgetId";
import ImagesBuffet from "../pages/Images";
import Settings from "../pages/Settings"
import ListBudgets from "../pages/ListBugets";
import BuffetService from "@src/app/api/BuffetService";
import { UserContext } from "@src/app/context/UserContext";
import BudgetId from "../pages/BudgetId";
import useResponsive from "@src/app/theme/helpers/useResponsive";

export default function ContentDashboard(){

  const [loading, setLoading] = useState(false)
 
  const PAGES = {
    'Dashboard': Homedash,
    'Perfil': EditPerfil,
    'Orçamentos': ListBudgets,
    'Imagens': ImagesBuffet,
    'Orçamento': Budgets,
    'Assinatura': Settings
  };

  const {
    activePage,
    setActivePage,
    isOpen
  } = useContext(ActivePageContext)

  const isMobile = useResponsive()

  const {
    setDataUser,
    idEvent
  } = useContext(UserContext)

  
  useEffect(() => {
    setLoading(true)
    const storedUserId = localStorage.getItem('USER_ID');
    if (storedUserId) {
      const userId = parseInt(storedUserId);
      BuffetService.getUserData(userId)
        .then((response) => {
          setDataUser(response);
        })
        .catch((error) => {
          console.error('Erro ao buscar dados do usuário:', error);
        });
        setTimeout(()=>{
          setLoading(false)
        }, 1000)
       
    }

  }, []);

  
  // Pega o componente baseado na chave do objeto PAGES
  const ContentComponent = PAGES[activePage] || 'Dashboard';
 
  return(
   
    <Box styleSheet={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}>

        {/*Menu Lateral*/}
        <SideMenu/>

        {/* Main Content */}
        <Box styleSheet={{
          width: !isOpen ? '97.5%': '80%',
          position: 'fixed',
          right: '0',
          height: '100vh',
        }}>

          <SubHeader/>

          {/*loading &&<Box styleSheet={{width: '100%', height: '100vh', position: 'relative', border: '1px solid red ', backgroundColor: 'linear-gradient(to right, rgba(128, 128, 128, 0.5) 0%, rgba(255, 255, 255, 0) 100%)'}}>tsee</Box>*/}
          <Box styleSheet={{
            width: '100%',
            height: '80vh',
           
            backgroundColor: theme.colors.neutral.x050,
            padding: !isMobile? '3rem': '1rem',
            overflowY: 'scroll',
            overflowX: 'hidden',  
   
          }}>
            {/*Conteúdo principal - [Dashboard, Eventos, Perfil]*/}
            {/* Seu código para renderizar o conteúdo principal */}
          {idEvent != null? (
            <BudgetId idEvent={idEvent} />
          ) : (
            <ContentComponent />
          )}
          </Box>
        </Box>
      </Box>
  )
}
