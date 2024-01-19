import { useRouter } from 'next/router';
import Box from '@src/app/theme/components/Box/Box';
import Text from '@src/app/theme/components/Text/Text';
import { useTheme } from '@src/app/theme/ThemeProvider';
import { useContext, useEffect } from 'react';
import ActivePageContext from '@src/app/context/ActivePageContext';
import Notifications from '../Notifications';
import Settings from '../Settings';
import Perfil from '../Perfil';
import { UserContext } from '@src/app/context/UserContext';
import BiUser from 'react-icons/bi'
import useResponsive from '@src/app/theme/helpers/useResponsive';

const SubHeader = () => {

  const theme = useTheme();
  const router = useRouter();
  const isMobile = useResponsive();
  const { activePage, widthSideMenu, setWidthSizeMenu } = useContext(ActivePageContext);

 
  const {
    dataUser,
    idEvent
  } = useContext(UserContext);

  const nome = dataUser['entidade']?.nome

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  
  return (
    <Box styleSheet={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: isMobile?  '70px' : '120px',
      backgroundColor: theme.colors.neutral.x000,
      padding: !isMobile?'2rem 3rem': '.5rem 2rem',
      zIndex: '20',
      boxShadow: `50px 4px 35px 0px ${theme.colors.neutral.x200}`,
      
    }}>
      <Box>
        <Text variant='heading3semiBold' color={theme.colors.neutral.x999} styleSheet={{fontSize: isMobile? '1.5rem': '2rem'}}>{capitalizeFirstLetter(activePage)}</Text>
        <Box>
          {activePage === 'Dashboard' && router.pathname === '/dashboard/buffet' && idEvent === null &&
            <Text variant='caption' color={theme.colors.neutral.x800}>Bem vindo, {nome}!</Text>
          }
           {idEvent &&
            <Text variant='caption' color={theme.colors.neutral.x800}>Responda a solicitação do cliente</Text>
          }
          {activePage === 'Dashboard' && router.pathname === '/dashboard/admin' &&
            <Text variant='caption' color={theme.colors.neutral.x800}>Bem vindo, {nome}!</Text>
          }
          {activePage === 'Dashboard' && router.pathname === '/dashboard/cliente' &&
            <Text variant='caption' color={theme.colors.neutral.x800}>Bem vindo, {nome}!</Text>
          }
          {activePage === 'Orçamentos' && router.pathname === '/dashboard/buffet' && isMobile &&
            <Text variant='caption' color={theme.colors.neutral.x800}>Consulte os orçamentos</Text>
          }

{activePage === 'Orçamentos' && router.pathname === '/dashboard/buffet' && !isMobile &&
            <Text variant='caption' color={theme.colors.neutral.x800}>Consulte os orçamentos</Text>
          }
          {activePage === 'Perfil' && router.pathname === '/dashboard/buffet' &&
            <Text variant='caption' color={theme.colors.neutral.x800}>Gerencie suas informações</Text>
          }
          {activePage === 'Assinatura' && router.pathname === '/dashboard/buffet' && !isMobile &&
            <Text variant='caption' color={theme.colors.neutral.x800}>Cliente, {nome}!</Text>
          }

{activePage === 'Assinatura' && router.pathname === '/dashboard/buffet' && isMobile &&
            <Text variant='caption' color={theme.colors.neutral.x800}>Gerencie sua assinatura</Text>
          }
          {activePage === 'Eventos' && router.pathname === '/dashboard/cliente' &&
            <Text variant='caption' color={theme.colors.neutral.x800}>Cliente, {nome}!</Text>
          }
          {activePage === 'Perfil' && router.pathname === '/dashboard/cliente' &&
            <Text variant='caption' color={theme.colors.neutral.x800}>Cliente, {nome}!</Text>
          }
          {activePage === 'Assinaturas' &&
             <Text variant='caption' color={theme.colors.neutral.x800}>Consulte as assinaturas</Text>
          }
          {activePage === 'Avaliações' && !isMobile &&
             <Text variant='caption' color={theme.colors.neutral.x800}>Consulte todos os buffets que estão na avaliação gratuita</Text>
          }

          {activePage === 'Avaliações' && router.pathname === '/dashboard/admin' && isMobile &&
             <Text variant='caption' color={theme.colors.neutral.x800}>Buffets em avaliação gratuita</Text>
          }

{activePage === 'Cupom' && router.pathname === '/dashboard/admin' && isMobile &&
             <Text variant='caption' color={theme.colors.neutral.x800}>Edite e consulte seus cupons</Text>
          }
          {activePage === 'Imagens'  && !isMobile &&
             <Text variant='caption' color={theme.colors.neutral.x800}>Adicione as melhores imagens do seu espaço</Text>
          }
          {activePage === 'Imagens' && router.pathname === '/dashboard/buffet' && isMobile &&
             <Text variant='caption' color={theme.colors.neutral.x800}>Gerencie suas imagens</Text>
          }
          {activePage === 'Cadastro' &&
             <Text variant='caption' color={theme.colors.neutral.x800}>Adicione informações pertinentes para seus clientes</Text>
          }
          {activePage === 'Planos' &&
             <Text variant='caption' color={theme.colors.neutral.x800}>Edite  e consulte os planos disponíveis </Text>
          }

        </Box>
      </Box>

      <Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '3rem', alignItems: 'center'}}>


        {
          dataUser['usuario']?.id_perfil != 1 && !isMobile && (
            <Notifications/>
          )
        }


        {
          dataUser['usuario']?.id_perfil != 1 && !isMobile && (
            <Settings/>
          )
        }

        
        {
          dataUser['usuario']?.id_perfil != 1 && !isMobile && (
            <Perfil/>
          )
        }

{
          dataUser['usuario']?.id_perfil == 1 && !isMobile && (
            <Notifications/>
          )
        }


        {
          dataUser['usuario']?.id_perfil == 1 && !isMobile && (
            <Settings/>
          )
        }

        
        {
          dataUser['usuario']?.id_perfil == 1 && !isMobile && (
            <Perfil/>
          )
        }





        
        
      </Box>
    </Box>
  );
};

export default SubHeader;
