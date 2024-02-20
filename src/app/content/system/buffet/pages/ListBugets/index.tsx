"use client"

import BoxDash from "@src/app/components/system/BoxDash";
import { useTheme } from "@src/app/theme/ThemeProvider"
import Box from "@src/app/theme/components/Box/Box"
import Text from "@src/app/theme/components/Text/Text";
import { dataTable } from "@src/app/components/system/Mockup";

import FilterTableTime from "@src/app/components/system/FilterTableTime";
import Pagination from "@src/app/components/system/Pagination";
import Icon from "@src/app/theme/components/Icon/Icon";

import { useContext, useEffect, useState } from "react";
import { UserContext } from "@src/app/context/UserContext";
import BuffetService from "@src/app/api/BuffetService";
import { FilterArrows } from "../../../admin/screens/pages/common/FilterArrows";
import { useFilterFunctions } from "../../../admin/screens/pages/common/useFilterFunctions";
import useResponsive from "@src/app/theme/helpers/useResponsive";

//Material UI
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


const ListBudgets = () =>{

  const theme = useTheme();
  const [viewElements, setViewElements] = useState(0)
  const [currentPage, setCurrentPage] = useState(1);
  const elementsPerPage = 5; 

  
  const [orcamentos, setOrcamentos] = useState([]);
  const [orcamentosFixos, setOrcamentosFixos] = useState([]);
  const [totalOrcamentos, setTotalOrcamentos] = useState([]);

  const {

    dataUser
  } = useContext(UserContext);


  const {
    orderByGrowing,
    orderByDescending,
    orderByDateGrowing,
    orderByDateDescending,
    orderByStringGrowing,
    orderByStringDescending
    } = useFilterFunctions({hook: orcamentos, setHook: setOrcamentos})




  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  function formatarData(data) {
    const dataObj = new Date(data);
    
    const dia = String(dataObj.getDate()).padStart(2, '0');
    const mes = String(dataObj.getMonth() + 1).padStart(2, '0'); 
    const ano = dataObj.getFullYear();
  
    return `${dia}/${mes}/${ano}`;
  }

  



   

    function DownloadLink(index){
      const fileURL = `https://buscabuffet.com.br${orcamentos[index]?.['arquivo'].path}`;
      const newTab = window.open(fileURL, '_blank');
    }

  useEffect(()=>{
    if(dataUser?.['entidade']?.id){
      BuffetService.showBudgetsByIdEntity(dataUser?.['entidade']?.id)
      .then((response)=>{
        setOrcamentosFixos(response)
        setOrcamentos(response);
      }).catch(err=>{
        console.log(err)
      })
    }
  }, [dataUser?.['entidade']?.id])

  const isMobile = useResponsive()
  
  return(
    <Box styleSheet={{height: '90vh'}} tag="div">
       {isMobile&&  <FilterTableTime payments={orcamentos} setViewPayments={setOrcamentos} fixedPayments={orcamentosFixos}/>}
      <Box 
      
        styleSheet={{
        width: '100%',
        height: 'auto',
        marginTop: '2rem',
        padding: '2rem',
        borderRadius: '8px',
        display: 'flex',
        backgroundColor: theme.colors.neutral.x000,
        boxShadow: `0px 12px 23px 0px ${theme.colors.neutral.x100}`,
        flexDirection: 'column',
        gap: '.4rem',
      }}>
        
        <Box styleSheet={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: '2rem'}}>
          <Box>
            <Text variant='body3' styleSheet={{padding: '.5rem 0'}} color={theme.colors.neutral.x999}>Orçamentos Recentes</Text>
            <Text variant='caption' color={theme.colors.neutral.x800}>Consulte os orçamentos recentes</Text>
          </Box>
          
          {!isMobile&&  <FilterTableTime payments={orcamentos} setViewPayments={setOrcamentos} fixedPayments={orcamentosFixos}/>}
        </Box>

        <TableContainer>
          <Table>
          <TableHead >
            
            <TableRow sx={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between'}}>
              <TableCell sx={{textAlign: 'center', border: 'none' }}>
                <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <Text styleSheet={{ color: 'black'}}>ID orçamento</Text><FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/>
                </Box>
               
              </TableCell>
              <TableCell sx={{textAlign: 'center', border: 'none' }}>
               <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
               <Text styleSheet={{ color: 'black'}}>Buffet</Text><FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="update_at"/>
                </Box>
               
              </TableCell>
             <TableCell sx={{textAlign: 'center', border: 'none' }}>
               <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
               <Text styleSheet={{ color: 'black'}}>Valor</Text><FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="entidade.nome"/>
                </Box>
             
              </TableCell>
             <TableCell sx={{textAlign: 'center', border: 'none' }}>
               <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
               <Text styleSheet={{ color: 'black'}}>Disponibilidade data</Text><FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="qtd_pessoas"/>
                </Box>
              
              </TableCell>
             <TableCell sx={{textAlign: 'center', border: 'none' }}>
               <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <Text styleSheet={{ color: 'black'}}>Observações</Text><FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="periodo"/>
                </Box>
              
              </TableCell>
              {/*<TableCell>Tipo do Evento<FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="tipo"/></TableCell>*/}
              <TableCell sx={{textAlign: 'center', border: 'none' }}>
               <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <Text styleSheet={{ color: 'black'}}>Arquivo</Text><FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/>
                </Box>
              
              </TableCell>
             
            </TableRow>
     
            
          </TableHead>

          <TableBody>
            {orcamentos?.slice((currentPage - 1) * elementsPerPage, currentPage * elementsPerPage)
          ?.map((item, index)=>(
            <TableRow sx={{display: 'flex', gridTemplateColumns: 'repeat(6, 1fr)', justifyContent: 'space-between', padding: '1rem 0'}}>
                <TableCell sx={{border: 'none', }} align="left">{item?.['id']}</TableCell>
                <TableCell sx={{border: 'none', }} align="left">{item?.['evento']?.['nome']}</TableCell>
                <TableCell sx={{border: 'none', }} align="left">{(item?.['valor']).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</TableCell>
                <TableCell sx={{border: 'none', }} align="left">{item?.['data_disponibilidade']}</TableCell>
                <TableCell sx={{border: 'none', }} align="left">{item?.['observacoes']}</TableCell>
                <TableCell sx={{display: 'flex', justifyContent: 'center', alignItems: 'left', border: 'none'}}>
                  <Box onClick={(e)=>DownloadLink(index)}>
                    <Icon name="file" id='downloadLink' />
                  </Box>
                </TableCell>
                
              </TableRow>
          
            ))}
          </TableBody>
          </Table>
          </TableContainer>
      </Box>
      <Pagination
        currentPage={currentPage}
        elementsPerPage={elementsPerPage}
        qtdElements={orcamentos.length}
        onPageChange={handlePageChange}
      />
    </Box>
  )
}

export default ListBudgets;
