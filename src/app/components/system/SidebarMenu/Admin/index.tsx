import { useContext, useEffect, useState } from 'react';
import Box from '@src/app/theme/components/Box/Box';
import LinkSystem from '../../LinkSystem';
import { useRouter } from 'next/router';
import ActivePageContext from '@src/app/context/ActivePageContext';
import Icon from '@src/app/theme/components/Icon/Icon';
import theme from '@src/app/theme/theme';
import MoneyImage from '../../../../../../public/assets/icons/money_symbol_svg.jpg'
import Text from '@src/app/theme/components/Text/Text';
import useResponsive from '@src/app/theme/helpers/useResponsive';

const SidebarMenuIsOpenAdmin = () => {
  const [openedSubmenu, setOpenedSubmenu] = useState('');

  const [href, setHref] = useState('');
  const isMobile = useResponsive();
  const router = useRouter();
  const { setActivePage, isOpen, activePage } = useContext(ActivePageContext);
  
  const menuItems = [
    { label: 'Dashboard', icon: 'dashboard', action: () => setActivePage('Dashboard') },
    { label: 'Assinaturas', icon: 'events', action: () => setActivePage('Assinaturas') },
    { label: 'Destaque', icon: 'default_icon', action: () => setActivePage('Destaque') },
    { label: 'Planos', icon: 'plans', action: () => setActivePage('Planos') },
    { label: 'Cupom', icon: 'cupom', action: () => setActivePage('Cupom') },
    { label: 'Usuários', icon: 'user', action: () => setActivePage('Usuários') },
    { label: 'Voltar ao site', icon: 'site', action: () => router.push('https://buscabuffet.com.br') }
];

  


  const menuItemStyle = (itemLabel) => ({
    
    padding: '1rem 1.5rem',
    borderLeft: activePage === itemLabel ? `6px solid ${theme.colors.primary.x500}` : '',
    backgroundColor: activePage === itemLabel ? theme.colors.primary.x1900 : theme.colors.neutral.x000
  });

  const menuItemStyleClosed = (itemLabel) => ({
    marginTop: '2rem',
    paddingLeft: !isMobile? '1rem': '1.5rem',
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
    {isOpen && !isMobile? 
    <Box styleSheet={{marginTop: '-1rem'}}>
    {menuItems.map((item) => (
      <Box key={item.label} tag='li' styleSheet={menuItemStyle(item.label)}>
        <LinkSystem
          href=""
          key={item?.label}
          onClick={() => item.action()}
          styleSheet={linkStyle(item.label)}
        >
          <Icon name={item.icon} fill={theme.colors.neutral.x500} />
          <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10rem'}}>
            {isOpen && item.label != 'Voltar ao site'? 
              <Text color={theme.colors.neutral.x900}>{item.label}</Text>
              :
              <>
                <Text color={theme.colors.neutral.x900}>{item.label}</Text>
                <Icon name='arrowChevronRight'/>
              </>
            }
          </Box>
        </LinkSystem>
      </Box>
    ))}
  </Box>
  :
  <Box styleSheet={{marginTop: '-4.15rem'}}>
    {menuItems.map((item) => (
      <Box key={item.label} tag='li' styleSheet={!isMobile? menuItemStyleClosed(item.label): {
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        borderLeft: activePage === item?.label ? `6px solid ${theme.colors.primary.x500}` : '',
        backgroundColor: activePage === item.label ? theme.colors.primary.x1900 : theme.colors.neutral.x000
      }}>
        <LinkSystem
        
          key={item?.label}
          href=""
          onClick={() => {item.action()}}
          styleSheet={!isMobile? linkStyle(item.label) : {
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            color: activePage === item.label ? theme.colors.primary.x500 : theme.colors.neutral.x700
          }}
        >
          
          <Icon name={item.icon} fill={theme.colors.neutral.x500} styleSheet={{width: '30px'}}/>
        </LinkSystem>
    </Box>
  ))}
</Box>
  }
    

  </>
  )
};

export default SidebarMenuIsOpenAdmin;
