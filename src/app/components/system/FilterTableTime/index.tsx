"use client"

import { useRouter } from 'next/router';
import Box from '@src/app/theme/components/Box/Box';
import Text from '@src/app/theme/components/Text/Text';
import { useTheme } from '@src/app/theme/ThemeProvider';
import { Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';
import ActivePageContext from '@src/app/context/ActivePageContext';
import useResponsive from '@src/app/theme/helpers/useResponsive';


const FilterTableTime = ({setViewPayments, payments, fixedPayments} : {setViewPayments?: Dispatch<SetStateAction<any>>, payments?: any, fixedPayments}) => {

  const theme = useTheme();
  const isMobile = useResponsive();



  const { activePage, widthSideMenu, setWidthSizeMenu } = useContext(ActivePageContext);

  const [activeFilter, setActiveFilter] = useState('todos')



  const changeFilter = (filter: string) => {
  
    setActiveFilter(filter);
    
    // Aplique o filtro à cópia original da lista de pagamentos
    switch (filter) {
      case 'todos':
        setViewPayments(payments);
        break;
      case 'mensal':
        getMonthPayments();
        break;
      case 'semanal':
        getWeekPayments();
        break;
      case 'hoje':
        getDayPayments();
        break;
      default:
        setViewPayments(payments);
        break;
    }
  };

  function getAllPayments() {
    setViewPayments(fixedPayments);
  }

  function getMonthPayments() {
    let paymentsMontly = fixedPayments.filter((element) => new Date(element.updated_at).getMonth() === new Date().getMonth());
   
    setViewPayments(paymentsMontly);
  }

  function getWeekPayments() {
    setViewPayments(fixedPayments.filter((element) => {
      const currentDate = new Date();
      const startWeek = new Date(currentDate);
      startWeek.setDate(new Date().getDate() - new Date().getDay());
      const endWeek = new Date(startWeek);
      endWeek.setDate(new Date(startWeek).getDate() + 7);
      return new Date(element.updated_at) >= startWeek && new Date(element.updated_at) < endWeek;
    }));
  }
  function getDayPayments() {
    setViewPayments(fixedPayments.filter((element) => new Date(element.updated_at).getDay() === new Date().getDay()));
  }

  return (
    <Box styleSheet={{
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      justifyContent: 'space-between',
      textAlign: 'center',
      padding: '.3rem',
      alignContent: 'center',
      backgroundColor: theme.colors.neutral.x050,
      width: !isMobile? '300px': '100%',
      height: '48px',
      marginLeft:  !isMobile? 'min(50px, -3vw)': '0',
      marginTop: isMobile? '2rem': '0',
      borderRadius: '6px',
      boxShadow: '1px 1px 2px 2px #ccc'
    }}>

      <Box onClick={(e)=>{changeFilter('todos'); getAllPayments()}} 
        styleSheet={{
          backgroundColor: activeFilter === 'todos'? theme.colors.neutral.x000: '',
          padding: '.5rem',
          borderRadius: '6px',
          cursor: 'pointer',

        }}>
        <Text color={theme.colors.neutral.x999}>
          Todos
        </Text>
      </Box>

      <Box onClick={(e)=>{changeFilter('mensal'); getMonthPayments()}} 
        styleSheet={{
          backgroundColor: activeFilter === 'mensal'? theme.colors.neutral.x000: '',
          padding: '.5rem',
          borderRadius: '6px',
          cursor: 'pointer',

        }}>
        <Text color={theme.colors.neutral.x999}>
          Mensal
        </Text>
      </Box>

      <Box onClick={(e)=>{changeFilter('semanal'); getWeekPayments()}}
        styleSheet={{
          backgroundColor: activeFilter === 'semanal'? theme.colors.neutral.x000: '',
          padding: '.5rem',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>  
        <Text color={theme.colors.neutral.x999}>
          Semanal
        </Text>
      </Box>

      <Box onClick={(e)=>{changeFilter('hoje'); getDayPayments()}} 
        styleSheet={{
          backgroundColor: activeFilter === 'hoje'? theme.colors.neutral.x000: '',
          padding: '.5rem',
          borderRadius: '6px',
          cursor: 'pointer'
        }}>
        <Text color={theme.colors.neutral.x999}>
          Hoje
        </Text>
      </Box>
      

    </Box>
  );
};

export default FilterTableTime;
