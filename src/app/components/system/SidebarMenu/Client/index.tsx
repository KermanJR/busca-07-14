import { useContext, useEffect, useState } from 'react';
import Box from '@src/app/theme/components/Box/Box';
import LinkSystem from '../../LinkSystem';
import { useRouter } from 'next/router';
import ActivePageContext from '@src/app/context/ActivePageContext';
import Icon from '@src/app/theme/components/Icon/Icon';
import theme from '@src/app/theme/theme';
import Text from '@src/app/theme/components/Text/Text';
import BuffetService from '@src/app/api/BuffetService';
import useResponsive from '@src/app/theme/helpers/useResponsive';


const SidebarMenuIsOpenBuffet = () => {
  const [openedSubmenu, setOpenedSubmenu] = useState('');

  const isMobile = useResponsive();

  const [href, setHref] = useState('');
  const router = useRouter();
  const { setActivePage, isOpen, activePage } = useContext(ActivePageContext);
  
  const menuItems = [
    { label: 'Dashboard', icon: 'dashboard', action: () => setActivePage('Dashboard') },
    { label: 'Eventos', icon: 'events', action: () => setActivePage('Eventos') },
    { label: 'Perfil', icon: 'perfil', action: () => setActivePage('Perfil') },

    { label: 'Voltar ao site', icon: 'site', action: () => router.push('https://buscabuffet.com.br') },
    //{ label: 'Logout', icon: 'Logout', action: () => BuffetService.logout() }
];



  const menuItemStyle = (itemLabel) => ({
    padding: '1rem 1.5rem',
    borderLeft: activePage === itemLabel ? `6px solid ${theme.colors.primary.x500}` : '',
    backgroundColor: activePage === itemLabel ? theme.colors.primary.x1900 : theme.colors.neutral.x000,
    
    height: isMobile? '60px': 'auto'
  });

  const menuItemStyleClosed = (itemLabel) => ({
    marginTop: '2rem',
    paddingLeft: '1rem',
    backgroundColor: activePage === itemLabel ? theme.colors.primary.x1900 : theme.colors.neutral.x000
  });

  const linkStyle = (itemLabel) => ({
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'left',
    alignItems: 'center',
    gap: '.5rem',
    color: activePage === itemLabel ? theme.colors.primary.x500 : theme.colors.neutral.x700
  });

  
  useEffect(() => {
    setHref(window.document.location.pathname);
  }, []);

  return (
    <>
    {isOpen ? 
      <Box styleSheet={{marginTop: !isMobile? '-1rem': '-4.12rem'}}>
        {menuItems.map((item) => (
          <>
            <Box key={item.label} tag='li' styleSheet={menuItemStyle(item.label)}>
              <LinkSystem
                key={item?.label}
                href=""
                onClick={() => {item.action()}}
                styleSheet={linkStyle(item.label)}
              >
              <Icon name={item.icon} fill={theme.colors.neutral.x500} styleSheet={{width: '30px', height: '30px'}}/>
                {!isMobile? <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10rem'}}>
                  {isOpen && item.label != 'Voltar ao site' ? 
                    <Text color={theme.colors.neutral.x900}>{item.label}</Text>
                    :
                    <>
                      <Text color={theme.colors.neutral.x900}>{item.label}</Text>
                      <Icon name='arrowChevronRight'/>
                    </>
                  }
                </Box>: <></>}
                
                
              </LinkSystem>
            </Box>
          </>
        ))}
      </Box>
    :
      <Box styleSheet={{marginTop: '5.5rem'}}>
        {menuItems.map((item) => (
          <Box key={item.label} tag='li' styleSheet={menuItemStyleClosed(item.label)}>
            <LinkSystem
            key={item?.label}
              href=""
              onClick={() => {setActivePage(item.label)}}
              styleSheet={linkStyle(item.label)}
            >
              <Icon name={item.icon} fill={theme.colors.neutral.x500} styleSheet={{width: '30px', height: '30px'}}/>
              
            </LinkSystem>
        </Box>
      ))}
    </Box>
  } 
  </>
  )
};

export default SidebarMenuIsOpenBuffet;
