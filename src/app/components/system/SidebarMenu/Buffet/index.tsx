import { useContext, useEffect, useState } from 'react';
import Box from '@src/app/theme/components/Box/Box';
import LinkSystem from '../../LinkSystem';
import { useRouter } from 'next/router';
import ActivePageContext from '@src/app/context/ActivePageContext';
import Icon from '@src/app/theme/components/Icon/Icon';
import theme from '@src/app/theme/theme';
import Text from '@src/app/theme/components/Text/Text';
import BuffetService from '@src/app/api/BuffetService';
import { UserContext } from '@src/app/context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import useResponsive from '@src/app/theme/helpers/useResponsive';
import ImageIcon from '../../../../../../public/assets/icons/image-icon.png'
import Image from '@src/app/theme/components/Image/Image';
const SidebarMenuIsOpenBuffet = () => {
  const [openedSubmenu, setOpenedSubmenu] = useState('');
  const [status, setStatus] = useState('');

  const [href, setHref] = useState('');
  const router = useRouter();
  const { setActivePage, isOpen, activePage } = useContext(ActivePageContext);
  const {
    setIdEvent,
    dataBuffet
  } = useContext(UserContext);


  const isMobile = useResponsive()
  


  const menuItems = [
    { label: 'Dashboard', icon: 'dashboard'},
    { label: 'Orçamentos', icon: 'events'},
    { 
      label: 'Perfil', 
      icon: 'perfil', 
      submenu: [
        { label: 'Imagens', action: () => setActivePage('Imagens') }
      ]
    },
    { 
      label: 'Assinatura', 
      icon: 'settings2', 
    },
    { label: 'Voltar ao site', icon: 'site', action: () => router.push('https://buscabuffet.com.br') }
];




  const toggleSubmenu = (label) => {
    if (openedSubmenu === label) {
      setOpenedSubmenu('');
    } else {
      setOpenedSubmenu(label);
    }
  };


  const menuItemStyle = (itemLabel) => ({
    padding: '1rem 1.5rem',
    borderLeft: activePage === itemLabel ? `6px solid ${theme.colors.primary.x500}` : '',
    backgroundColor: activePage === itemLabel ? theme.colors.primary.x1900 : theme.colors.neutral.x000
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
      <Box styleSheet={{marginTop: !isMobile? '-1rem': '-4.099rem', filter: dataBuffet && dataBuffet['status'] == 'P'? 'blur(2px)': 'none', pointerEvents: dataBuffet && dataBuffet['status'] == 'P'? 'none': ''}} >
        {menuItems.map((item) => (
          <>
            <Box key={item.label} tag='li' styleSheet={menuItemStyle(item.label)} disabled={dataBuffet && dataBuffet['status'] == 'P'? true : false}>
              <LinkSystem
  
                key={item?.label}
              
                href=""
                onClick={() => {
                  if(item.submenu){
                    toggleSubmenu(item.label);
                    setActivePage(item.label);
                    setIdEvent(null)
                  }else if(item.action){
                    item.action();
                    setIdEvent(null)
                  }else{
                    setActivePage(item.label);
                    setIdEvent(null)
                  }
                }}
                styleSheet={linkStyle(item.label)}
              >
                 <Icon name={item.icon} fill={theme.colors.neutral.x500} styleSheet={{width: '30px', height: '30px'}}/>
                <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '15rem'}}>
                  {isOpen && item.label == 'Perfil' &&
                  <>
                   
                  {isOpen && !openedSubmenu  &&(
                    <>
                    {!isMobile? <Text color={theme.colors.neutral.x900} styleSheet={{marginTop: '.2rem'}}>{item.label}</Text>: ''}
                      
                      <div>
                        <FontAwesomeIcon icon={faAngleRight} rotate={isOpen ? 180 : 0} />
                      </div>
                    </>
                  )}
                 
                 
                  {isOpen && openedSubmenu && (
                    <>
                    {!isMobile?  <Text color={theme.colors.neutral.x900} styleSheet={{marginTop: '.2rem'}}>{item.label}</Text>
                      :
                      <></>
                      }
                      
                      <div>
                        <FontAwesomeIcon icon={faAngleDown} rotate={isOpen ? 180 : 0} />
                      </div>
                    </>
                  )}
                  </>
                  }

      {isOpen && item.label != 'Perfil' && (
          <>
           {!isMobile? 
              <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '10rem'}}>
                <Text color={theme.colors.neutral.x900} styleSheet={{marginTop: '.2rem'}}>{item.label}</Text>
              </Box>
              : 
              <></>
            }
          </>
      )}
                    
                </Box>
              </LinkSystem>
            </Box>
            {isOpen && openedSubmenu === item.label && item.submenu && (
              <Box tag='ul'>
                {item.submenu.map(subItem => (
                  <Box key={subItem.label} tag='li' styleSheet={{padding: '.5rem', marginLeft: '3.5rem'}}>
                    <LinkSystem
                      key={item?.label}
                      href=""
                      onClick={() => subItem.action()}
                      styleSheet={{width: '100px', marginLeft: isMobile? '-2.3rem': '0'}}
                    >
                      {!isMobile? subItem.label: <Image src={ImageIcon.src} alt='' styleSheet={{width:'25px', height: '25px'}}/>}
                    </LinkSystem>
                  </Box>
                ))}
              </Box>
            )}
            
          </>
        ))}
      </Box>
    :
      <Box styleSheet={{marginTop: '5.5rem'}}>
        {menuItems.map((item) => (
          <Box key={item.label} tag='li' styleSheet={menuItemStyleClosed(item.label)}>
            <LinkSystem
              href=""
              key={item?.label}
              onClick={() => {
                if(item.submenu){
                  toggleSubmenu(item.label);
                  setActivePage(item.label);  
                  setIdEvent(null)// Defina o activePage aqui
                }else if(item.action){
                  item.action();
                  setIdEvent(null)
                }else{
                  setActivePage(item.label);
                  setIdEvent(null)
                }
              }}
              styleSheet={linkStyle(item.label)}
            >
              <Icon name={item.icon} fill={theme.colors.neutral.x500} />
            </LinkSystem>
            {isOpen && openedSubmenu === item.label && item.submenu && (
              <Box tag='ul'>
                {item.submenu.map(subItem => (
                  <Box key={subItem.label} tag='li' styleSheet={{ paddingLeft: '1.5rem' }}>
                    <LinkSystem
                      key={item?.label}
                      href=""
                      onClick={() => subItem.action()}
                    >
                      {subItem.label}
                    </LinkSystem>
                  </Box>
                ))}
              </Box>
            )}
        </Box>
      ))}
    </Box>
  } 
  </>
  )
};

export default SidebarMenuIsOpenBuffet;
