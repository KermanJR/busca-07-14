'use client'

import { dataTable } from "@src/app/components/system/Mockup";

import { useTheme } from "@src/app/theme/ThemeProvider"
import Box from "@src/app/theme/components/Box/Box"
import Text from "@src/app/theme/components/Text/Text";
import Pagination from "@src/app/components/system/Pagination";
import { useEffect, useState } from "react";
import BuffetService from "@src/app/api/BuffetService";
import { FilterArrows } from "../common/FilterArrows";
import { useFilterFunctions } from "../common/useFilterFunctions";
import PagBankService from "@src/app/api/PagBankService";
import useResponsive from "@src/app/theme/helpers/useResponsive";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const Signatures = () =>{

  const theme = useTheme();

  const [signatures, setSignatures] = useState<any>([])
  const [viewElements, setViewElements] = useState(0)
  const [currentPage, setCurrentPage] = useState(1);
  const elementsPerPage = 5; // Define o número de elementos por página
  const [assinaturasPagBank, setAssinaturasPagBank] = useState([]);
  const [viewPayments, setViewPayments] = useState<any>([])
  const {
    orderByGrowing,
    orderByDescending,
    orderByDateGrowing,
    orderByDateDescending,
    orderByStringGrowing,
    orderByStringDescending
    } = useFilterFunctions({hook: signatures, setHook: setSignatures})

    useEffect(() => {
      if (typeof window != 'undefined') {
        Promise.all([BuffetService.showBuffets(), BuffetService.showSignatures(), BuffetService.totalProposal(), BuffetService.totalUsers()]).then((result) => {
        setViewPayments(result[1])
      })
      }
    }, [])

    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    function calcularDataExpiracao(dataString) {
      // Verifica se a dataString é fornecida
      if (!dataString) {
        return 'Data inválida';
      }
    
      // Converte a string para um objeto Date
      const dataOriginal = new Date(dataString);
    
      // Verifica se a conversão foi bem-sucedida
      if (isNaN(dataOriginal.getTime())) {
        return 'Data inválida';
      }
    
      // Adiciona 90 dias à data original
      const dataExpiracao = new Date(dataOriginal);
      dataExpiracao.setDate(dataOriginal.getDate() + 90);
    
      // Formata a nova data para o formato DD/MM/AAAA
      const dia = String(dataExpiracao.getDate()).padStart(2, '0');
      const mes = String(dataExpiracao.getMonth() + 1).padStart(2, '0');
      const ano = dataExpiracao.getFullYear();
    
      return `${dia}/${mes}/${ano}`;
    }

    const extrairValorAposHifen = (nome) => {
      const partes = nome.split('-');
      
      if (partes.length >= 2) {
        const valorAposHifen = partes[1].trim();
        return valorAposHifen;
      }
    }
  
    const formatarValor = (valor) => {
      const valorString = valor.toString();
      const reais = valorString.slice(0, -2) || '0';
      const centavos = valorString.slice(-2);
      const valorFormatado = `R$ ${reais},${centavos}`;
      return valorFormatado;
    };
      
          const [searchValue, setSearchValue] = useState("");
  const [filteredBuffets, setFilteredBuffets] = useState([]);


   

    const isMobile = useResponsive()
  
  
    

    useEffect(() => {
      const filtered = signatures?.filter(buffet =>
        buffet?.entidade?.nome.toLowerCase().includes(searchValue.toLowerCase())
      );
     
      setFilteredBuffets(filtered);
    }, [searchValue]);
  
    useEffect(() => {
      BuffetService.showSignatures().then((result) => setSignatures(result))
    }, [])

   
  
  
  
  return(
    <Box styleSheet={{display: 'flex', height: 'auto'}}>
      <Box 
        styleSheet={{
        width: '100%',
        marginTop: !isMobile? '1rem': '0rem',
        padding: !isMobile? '2rem': '1rem',
        borderRadius: '8px',
        display: 'flex',
        backgroundColor: theme.colors.neutral.x000,
        boxShadow: `0px 12px 23px 0px ${theme.colors.neutral.x100}`,
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '.4rem',
      }}>

      <TableContainer sx={{width: '100%'}}>
        <Table >
          <TableHead sx={{width: '100%'}}>
            <TableRow style={{width: '100%', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', justifyContent: 'space-between'}}>
              <TableCell sx={{border: 'none', dislay: 'flex', flexDirection: 'row'}}>
                <Box  styleSheet={{border: 'none', dislay: 'flex', flexDirection: 'row'}}>
                <Text>ID</Text>  
                  <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/>
                </Box>
              </TableCell>
              <TableCell sx={{border: 'none', dislay: 'flex', flexDirection: 'row'}}>
                <Box  styleSheet={{border: 'none', dislay: 'flex', flexDirection: 'row'}}>
                  <Text>Data Início</Text> 
                  <FilterArrows functionupArrow={orderByDateGrowing} functionDownArrow={orderByDateDescending} property="updated_at"/>
                </Box>
              </TableCell>
              <TableCell sx={{border: 'none', dislay: 'flex', flexDirection: 'row'}}>
              <Box  styleSheet={{border: 'none', dislay: 'flex', flexDirection: 'row'}}>
              <Text>Data Fim</Text> 
                <FilterArrows functionupArrow={orderByDateGrowing} functionDownArrow={orderByDateDescending} property="updated_at"/>
                </Box>
           
                
              </TableCell>
              <TableCell sx={{border: 'none', dislay: 'flex', flexDirection: 'row'}}>
              <Box  styleSheet={{border: 'none', dislay: 'flex', flexDirection: 'row'}}>
              <Text>Nome</Text> 
                <FilterArrows functionupArrow={orderByStringGrowing} functionDownArrow={orderByStringDescending} property="entidade.nome"/>
                </Box>
              
              </TableCell>
              <TableCell sx={{border: 'none', dislay: 'flex', flexDirection: 'row'}}>
              <Box  styleSheet={{border: 'none', dislay: 'flex', flexDirection: 'row'}}>
              <Text>Valor</Text> 
                <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="valor"/>
                </Box>
               
              </TableCell>
              <TableCell sx={{border: 'none', dislay: 'flex', flexDirection: 'row'}}>
              <Box  styleSheet={{border: 'none', dislay: 'flex', flexDirection: 'row'}}>
              <Text>Desconto</Text> 
                <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="desconto"/>
                </Box>
               
              </TableCell>
              <TableCell sx={{border: 'none', dislay: 'flex', flexDirection: 'row'}}>
              <Box  styleSheet={{border: 'none', dislay: 'flex', flexDirection: 'row'}}>
              <Text>Status</Text> 
                <FilterArrows functionupArrow={orderByStringGrowing} functionDownArrow={orderByStringDescending} property="status"/>
                </Box>
                
              </TableCell >
            </TableRow>
            
          </TableHead>

       
            {signatures?.slice((currentPage - 1) * elementsPerPage, currentPage * elementsPerPage)
          ?.map((item, index)=>(

            isMobile ? <TableBody>
            <TableRow sx={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '1rem 0'}}>
  
            <TableCell sx={{border: 'none', padding: '1rem'}} align="left"><Text styleSheet={{fontWeight: '500'}}>{index}</Text></TableCell>
           <TableCell sx={{border: 'none',}}  align="left"><Text styleSheet={{fontWeight: '500'}}>{new Date(item?.tipo?.trial?.start_at).toLocaleDateString()}</Text></TableCell>
           <TableCell sx={{border: 'none',}} ><Text styleSheet={{fontWeight: '500'}}>{new Date(item?.tipo?.trial?.end_at).toLocaleDateString()}</Text></TableCell>
           <TableCell sx={{border: 'none',}} ><Text styleSheet={{fontWeight: '500'}}>{item?.entidade?.nome}</Text></TableCell>
           <TableCell sx={{border: 'none',}} ><Text styleSheet={{fontWeight: '500'}}>{item?.plano?.valor_mensal?.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</Text></TableCell>
           <TableCell sx={{border: 'none'}} ><Text styleSheet={{fontWeight: '500'}}>{0}</Text></TableCell>

              {item?.status === 'TRIAL' && (
                <TableCell 
                sx={{
                  padding: '.7rem',
                  borderRadius: '10px',
                  backgroundColor: theme.colors.positive.x050,
                  height: '25px'
                }}    
              >
                <Text styleSheet={{
                    color: theme.colors.positive.x300,
                    textAlign: 'center',
                    marginTop: '-.5rem'
                  }}
                >
                  Ativo/Gratuito
                </Text>
              
              </TableCell>
              )}

              {item.status === 'OVERDUE'  && (
                <TableCell 
                sx={{
                  padding: '.7rem',
                  borderRadius: '10px',
                  backgroundColor: theme.colors.secondary.x1100,
                  color: theme.colors.secondary.x700,
                  height: '25px'
                }}    
              >
                <Text styleSheet={{
                     color: theme.colors.secondary.x700,
                    textAlign: 'center',
                    marginTop: '-.5rem'
                  }}
                >
                  Pendente
                </Text>
              
              </TableCell>
              )}

              {item.status === 'CANCELED'  && (
                <TableCell 
                sx={{
                  padding: '.7rem',
                  borderRadius: '10px',
                  backgroundColor: theme.colors.negative.x400,
                  height: '25px',
                  
                }}    
              >
                <Text styleSheet={{
                    color: theme.colors.neutral.x000,
                    textAlign: 'center',
                    marginTop: '-.5rem'
                  }}
                >
                  Cancelado
                </Text>
              
              </TableCell>
              )}



              {(item.status === "Avaliação" || item.status == null) && (
                <TableCell 
                sx={{
                  padding: '.7rem',
                  borderRadius: '10px',
                  backgroundColor: theme.colors.negative.x050,
                  height: '25px'
                }}
              >
                <Text styleSheet={{
                    color: theme.colors.negative.x300,
                    textAlign: 'center',
                    marginTop: '-.5rem'
                  }}
                >
                  {item?.['status'] ?? 'NULL'}
                </Text>
              
              </TableCell>
              )}
              </TableRow>
            </TableBody> : 
         <TableBody>
         <TableRow sx={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '1rem 0'}}>
           <TableCell sx={{border: 'none', padding: '1rem'}} align="left"><Text styleSheet={{fontWeight: '500'}}>{index}</Text></TableCell>
           <TableCell sx={{border: 'none',}}  align="left"><Text styleSheet={{fontWeight: '500'}}>{new Date(item?.tipo?.trial?.start_at).toLocaleDateString()}</Text></TableCell>
           <TableCell sx={{border: 'none',}} ><Text styleSheet={{fontWeight: '500'}}>{new Date(item?.tipo?.trial?.end_at).toLocaleDateString()}</Text></TableCell>
           <TableCell sx={{border: 'none',}} ><Text styleSheet={{fontWeight: '500'}}>{item?.entidade?.nome}</Text></TableCell>
           <TableCell sx={{border: 'none',}} ><Text styleSheet={{fontWeight: '500'}}>{item?.plano?.valor_mensal?.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</Text></TableCell>
           <TableCell sx={{border: 'none'}} ><Text styleSheet={{fontWeight: '500'}}>{0}</Text></TableCell>
         
         {item?.status === 'TRIAL' && (
           <TableCell 
           sx={{
             padding: '.7rem',
             borderRadius: '10px',
             backgroundColor: theme.colors.positive.x050,
             height: '25px'
           }}    
         >
           <Text styleSheet={{
               color: theme.colors.positive.x300,
               textAlign: 'center',
               marginTop: '-.5rem'
             }}
           >
             Ativo/Gratuito
           </Text>
         
         </TableCell>
         )}

         {item.status === 'OVERDUE'  && (
           <TableCell 
           sx={{
             padding: '.7rem',
             borderRadius: '10px',
             backgroundColor: theme.colors.secondary.x1100,
             color: theme.colors.secondary.x700,
             height: '25px'
           }}    
         >
           <Text styleSheet={{
               color: theme.colors.secondary.x700,
               textAlign: 'center',
               marginTop: '-.5rem'
             }}
           >
             Pendente
           </Text>
         
         </TableCell>
         )}

         {item.status === 'CANCELED'  && (
           <TableCell
           sx={{
             padding: '.7rem',
             borderRadius: '10px',
             backgroundColor: theme.colors.negative.x400,
             height: '25px'
           }}    
         >
           <Text styleSheet={{
               color: theme.colors.neutral.x000,
               textAlign: 'center',
               marginTop: '-.5rem'
             }}
           >
             Cancelado
           </Text>
         
         </TableCell>
         )}



         {(item.status === "Avaliação" || item.status == null) && (
           <TableCell 
           sx={{
             padding: '.7rem',
             borderRadius: '10px',
             backgroundColor: theme.colors.negative.x050,
             height: '25px'
           }}
         >
           <Text styleSheet={{
               color: theme.colors.negative.x300,
               textAlign: 'center',
               marginTop: '-.5rem'
             }}
           >
             {item?.['status'] ?? 'NULL'}
           </Text>
         
         </TableCell>
         )}
       </TableRow>
     </TableBody>
              
            ))}
     
          </Table>
          </TableContainer>
      </Box>
      <Pagination currentPage={currentPage} qtdElements={signatures?.length} elementsPerPage={elementsPerPage} onPageChange={handlePageChange}/>
    </Box>
  )
}

export default Signatures;
