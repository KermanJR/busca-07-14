"use client"

import { useRouter } from 'next/router';
import Box from '@src/app/theme/components/Box/Box';
import Text from '@src/app/theme/components/Text/Text';
import { useTheme } from '@src/app/theme/ThemeProvider';
import { Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';
import ActivePageContext from '@src/app/context/ActivePageContext';
import useResponsive from '@src/app/theme/helpers/useResponsive';


const FilterTableTimeAdm = ({setViewPayments, payments, fixedPayments} : {setViewPayments?: Dispatch<SetStateAction<any>>, payments?: any, fixedPayments}) => {

  const theme = useTheme();
  const isMobile = useResponsive();

  console.log(payments)
  console.log(fixedPayments)


  const [activeFilter, setActiveFilter] = useState('todos')



  const changeFilter = (filter: string) => {
  
    setActiveFilter(filter);

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
    const currentDate = new Date();
    const currentYear = currentDate.getUTCFullYear();
    const currentMonth = currentDate.getUTCMonth();
  
    let paymentsMonthly = fixedPayments.filter((element) => {
      const paymentDate = new Date(element.updated_at);
  
      const isSameYear = paymentDate.getUTCFullYear() === currentYear;
      const isSameMonth = paymentDate.getUTCMonth() === currentMonth;
  
      return isSameYear && isSameMonth;
    });
  
    setViewPayments(paymentsMonthly);
  }
  

  function getWeekPayments() {
    const currentDate = new Date();
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 7);
  
    setViewPayments(
      fixedPayments.filter((element) => {
        const paymentDate = new Date(element.updated_at);
  
        const isSameYear = paymentDate.getUTCFullYear() === currentDate.getUTCFullYear();
        const isSameMonth = paymentDate.getUTCMonth() === currentDate.getUTCMonth();
        const isSameWeek = isSameYear && isSameMonth && areDatesInSameWeek(paymentDate, currentDate);
  
        return isSameWeek;
      })
    );
  }
  
 
  

  function getDayPayments() {
    const currentDate = new Date();
  
    setViewPayments(
      fixedPayments.filter((element) => {
        const paymentDate = new Date(element.updated_at);
  
        const isSameYear = paymentDate.getUTCFullYear() === currentDate.getUTCFullYear();
        const isSameMonth = paymentDate.getUTCMonth() === currentDate.getUTCMonth();
        const isSameWeek = isSameYear && isSameMonth && areDatesInSameWeek(paymentDate, currentDate);
        const isSameDay = isSameWeek && paymentDate.getUTCDate() === currentDate.getUTCDate();
  
        return isSameDay;
      })
    );
  }
  
  // Função auxiliar para verificar se duas datas estão na mesma semana
  function areDatesInSameWeek(date1, date2) {
    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((date1 - date2) / oneDay));
    return diffDays < 7;
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

export default FilterTableTimeAdm;
