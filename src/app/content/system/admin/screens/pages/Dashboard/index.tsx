'use client'

import { FilterArrows } from "../common/FilterArrows";
import { useFilterFunctions } from "../common/useFilterFunctions";
import BoxDash from "@src/app/components/system/BoxDash";
import { useTheme } from "@src/app/theme/ThemeProvider"
import Box from "@src/app/theme/components/Box/Box"
import Text from "@src/app/theme/components/Text/Text";

import FilterTableTime from "@src/app/components/system/FilterTableTime";
import Image from "@src/app/theme/components/Image/Image";
import CoffeImage from '../../../../../../../../public/assets/icons/coffee.png'
import DolarImage from '../../../../../../../../public/assets/icons/dolar_svg.png'
import UserImage from '../../../../../../../../public/assets/icons/user_dash_svg.png'
import Pagination from "@src/app/components/system/Pagination";
import { useEffect, useState } from "react";
import BuffetService from "@src/app/api/BuffetService";
import PagBankService from "@src/app/api/PagBankService";
import useResponsive from "@src/app/theme/helpers/useResponsive";
import FilterTableTimeAdm from "@src/app/components/system/FilterTableTimeAdm";
import Input from "@src/app/theme/components/Input/Input";

//Material UI
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


const Homedash = () =>{

  const theme = useTheme();
  const [loading, setLoading] = useState(false)
  const [viewPayments, setViewPayments] = useState<any>([])
  const [viewElements, setViewElements] = useState(0)
  const [totalBuffets, setTotalBuffets] = useState(0)
  const [totalPayments, setTotalPayments] = useState(0)
  const [totalProposal, setTotalProposal] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [payments, setPayments] = useState<any>([])
  const [fixedPayments, setFixedPayments] = useState<any>([])
  const [currentPage, setCurrentPage] = useState(1);
  const elementsPerPage = 5; // Define o número de elementos por página
  
  const [assinaturasPagBank, setAssinaturasPagBank] = useState([]);
  const [fixedAssinaturasPagBank, setFixedAssinaturasPagBank] = useState([]);

  const {
    orderByGrowing,
    orderByDescending,
    orderByDateGrowing,
    orderByDateDescending,
    orderByStringGrowing,
    orderByStringDescending
  } = useFilterFunctions({hook: viewPayments, setHook: setViewPayments});

  const [totalPaymentsYear, setTotalPaymentsYear] = useState(0)
  const [totalPaymentsMonth, setTotalPaymentsMonth] = useState(0)
  const [totalPaymentsCancel, setTotalPaymentsCancel] = useState(0)

  useEffect(() => {
    if (typeof window != 'undefined') {
      Promise.all([BuffetService.showBuffets(), BuffetService.showSignatures(), BuffetService.totalProposal(), BuffetService.totalUsers()]).then((result) => {
      setTotalBuffets(result[0].length)
      setTotalPayments(Number((result[1].reduce((sum, element) => sum += element.valor, 0) / 1000).toFixed(2)))
      setFixedPayments(result[1])
      setPayments(result[1])
      setViewPayments(result[1])
      setTotalProposal(result[2].total)
      setTotalUsers(result[3].total)
      setLoading(true)

    
    
      let totalYearPayments = 0
      let totalmonthPayments = 0
      let totalCancelPayments = 0

      for (const element of result[1]) {
        switch(element.tipo) {
          case 'A':
            totalYearPayments++
          break;
          case 'M':
            totalmonthPayments++
          break;
          case 'C':
            totalCancelPayments++
        }
      }

      setTotalPaymentsYear(totalYearPayments)
      setTotalPaymentsMonth(totalmonthPayments)
      setTotalPaymentsCancel(totalCancelPayments)
    })
    }
  }, [loading])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  
 

  const extrairValorAposHifen = (nome) => {
    
    const partes = nome.split('-');
    
    if (partes.length >= 2) {
      const valorAposHifen = partes[1].trim();
      return valorAposHifen;
    }
  }

  const extrairValorAntesHifen = (nome) => {
    const partes = nome.split('-');
    
    if (partes.length >= 2) {
      const valorAntesHifen = partes[0].trim();
      return valorAntesHifen;
    }
}

const [signatures, setSignatures] = useState<any>([])
  const formatarValor = (valor) => {
    const valorString = valor;
    const reais = valorString.slice(0, -2) || '0';
    const centavos = valorString.slice(-2);
    const valorFormatado = `R$ ${reais},${centavos}`;
    return valorFormatado;
  };
    
  const [searchValue, setSearchValue] = useState("");
  const [filteredBuffets, setFilteredBuffets] = useState([]);




  const isMobile = useResponsive();

  const handleSearchChange = event => {
    setSearchValue(event);
  };

  const isSearchEmpty = searchValue.trim() === "";

  
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
    <Box styleSheet={{height: '140vh'}}>
      <Box styleSheet={{display: 'flex', flexDirection: !isMobile? 'row': 'column', justifyContent: 'space-between', gap: !isMobile? '0rem': '1rem', flexWrap: 'wrap'}}>
        <BoxDash styleSheet={{flexDirection: 'row', justifyContent: 'left', width:  !isMobile?'24%': '100%', gap: '1rem'}}>
          <Box styleSheet={{
            height: '84px',
            width: '84px',
            borderRadius: '100%',
            backgroundColor: theme.colors.primary.x1900,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Image src={CoffeImage.src} alt="Ícone de arquivo"/>
          </Box>
          <Box>
            <Text variant="display1" tag="p" color={theme.colors.neutral.x999}>{totalBuffets}</Text>
            <Text tag="p" color={theme.colors.neutral.x999}>Total de buffets</Text>
          </Box>
        </BoxDash>

        <BoxDash styleSheet={{flexDirection: 'row', justifyContent: 'left', gap: '1rem', width:  !isMobile?'24%': '100%'}}>
          <Box styleSheet={{
            height: '84px',
            width: '84px',
            borderRadius: '100%',
            backgroundColor: theme.colors.primary.x1900,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Image src={DolarImage.src} alt="Ícone de arquivo"/>
          </Box>
          <Box>
            <Text variant="display1" tag="p" color={theme.colors.neutral.x999}>{totalPayments}K</Text>
            <Text tag="p" color={theme.colors.neutral.x999}>Pagamentos</Text>
          </Box>
        </BoxDash>

        <BoxDash styleSheet={{flexDirection: 'row', justifyContent: 'left', gap: '1rem', width:  !isMobile?'24%': '100%'}}>
          <Box styleSheet={{
            height: '84px',
            width: '84px',
            borderRadius: '100%',
            backgroundColor: theme.colors.primary.x1900,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Image src={CoffeImage.src} alt="Ícone de arquivo"/>
          </Box>
          <Box>
            <Text variant="display1" tag="p" color={theme.colors.neutral.x999}>{totalProposal}</Text>
            <Text tag="p" color={theme.colors.neutral.x999} styleSheet={{flexWrap: 'wrap', width: '90%'}}>Orçamentos enviados</Text>
          </Box>
        </BoxDash>

        <BoxDash styleSheet={{flexDirection: 'row', justifyContent: 'left', gap: '1rem', width:  !isMobile?'24%': '100%'}}>
          <Box styleSheet={{
            height: '84px',
            width: '84px',
            borderRadius: '100%',
            backgroundColor: theme.colors.primary.x1900,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Image src={UserImage.src} alt="Ícone de arquivo"/>
          </Box>
          <Box>
            <Text variant="display1" tag="p" color={theme.colors.neutral.x999}>{totalUsers}</Text>
            <Text tag="p" color={theme.colors.neutral.x999} styleSheet={{flexWrap: 'wrap', width: '90%'}}>Total de usuários</Text>
          </Box>
        </BoxDash>

      </Box>
      
      {isMobile && <FilterTableTimeAdm setViewPayments={setViewPayments} payments={filteredBuffets} fixedPayments={signatures}/>}
      <Box 
        styleSheet={{
        width: '100%',
        height: 'auto',
        marginTop: !isMobile? '2rem': '1rem',
        padding: !isMobile? '2rem': '1rem',
        borderRadius: '8px',
        display: 'flex',
        backgroundColor: theme.colors.neutral.x000,
        boxShadow: `0px 12px 23px 0px ${theme.colors.neutral.x100}`,
        flexDirection: 'column',
        gap: '.4rem',
      }}>
        
        <Box styleSheet={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: '2rem'}}>
          <Box>
            <Text variant='body3' styleSheet={{padding: '.5rem 0'}} color={theme.colors.neutral.x999}>Pagamentos Recentes</Text>
            <Text variant='caption' color={theme.colors.neutral.x800}>Consulte os pagamentos recentes</Text>
            <Box styleSheet={{display: 'flex', flexDirection: !isMobile? 'row': 'column', justifyContent: 'end', alignItems:'end', gap: '2rem', marginTop: '2rem'}}>
                <Box styleSheet={{display: 'flex', flexDirection: !isMobile? 'row': 'column', justifyContent: 'left', gap: '2rem', marginTop: '0rem'}}>
                  <BoxDash styleSheet={{flexDirection: 'row', justifyContent: 'left', gap: '2rem', width: '209px', height: '113px', border: '1px solid #ccc'}}>
                    <Box>
                      <Text variant="heading2semiBold" tag="p" color={theme.colors.neutral.x999}>{totalPaymentsMonth}</Text>
                      <Text tag="p" color={theme.colors.neutral.x400}>Assinaturas Mensais</Text>
                    </Box>
                  </BoxDash>
                  <BoxDash styleSheet={{flexDirection: 'row', justifyContent: 'left', gap: '2rem', width: '209px', height: '113px', border: '1px solid #ccc'}}>
                    <Box>
                      <Text variant="heading2semiBold" tag="p" color={theme.colors.neutral.x999}>{totalPaymentsCancel}</Text>
                      <Text tag="p" color={theme.colors.neutral.x400}>Assinaturas Canceladas</Text>
                    </Box>
                  </BoxDash>
                </Box>
             
                
              </Box>
             
          </Box>
          {!isMobile && <FilterTableTimeAdm setViewPayments={setFilteredBuffets} payments={filteredBuffets? filteredBuffets: signatures} fixedPayments={signatures}/>}
        </Box>
        <BoxDash styleSheet={{width: '100%', height: 'auto', marginLeft: '-1rem'}}>
                <Input
                  type="text"
                  placeholder="Pesquisar Assinaturas"
                  value={searchValue}
                  onChange={handleSearchChange}
                  styleSheet={{width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ccc'}}
                />
        
                </BoxDash>

        <TableContainer>
          <Table>
            <TableHead sx={{width: '100%'}}>
            <TableRow style={{width: '100%', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', justifyContent: 'space-between'}}>
              <TableCell sx={{border: 'none', dislay: 'flex', flexDirection: 'row'}}>
              <Box  styleSheet={{border: 'none', dislay: 'flex', flexDirection: 'row'}}>
                <Text>ID</Text>  
                <FilterArrows functionupArrow={orderByDateGrowing} functionDownArrow={orderByDateDescending} property="id"/>
                </Box>
              
              </TableCell>
              <TableCell sx={{border: 'none', dislay: 'flex', flexDirection: 'row'}}>
              <Box  styleSheet={{border: 'none', dislay: 'flex', flexDirection: 'row'}}>
                  <Text>Data Início</Text> 
                  <FilterArrows functionupArrow={orderByDateGrowing} functionDownArrow={orderByDateDescending} property="id"/>
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

    
            {!isSearchEmpty? filteredBuffets?.slice((currentPage - 1) * elementsPerPage, currentPage * elementsPerPage)
          ?.map((item, index)=>(
            isMobile? 
            <TableBody>
              <TableRow sx={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '1rem'}}>
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
                    height: '20px'
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
                    color: theme.colors.secondary.x700
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
                   height: '20px'
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
                    height: '20px'
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
              </TableBody>:

              <TableBody sx={{width: '100%'}}>
               <TableRow sx={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '1rem', justifyContent: 'space-between'}}>
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
                  height: '20px'
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
                  height: '20px'
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
                  height: '20px'
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
                  height: '20px'
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
            )):
            signatures?.slice((currentPage - 1) * elementsPerPage, currentPage * elementsPerPage)
          ?.map((item, index)=>(
            isMobile? 
            <TableBody sx={{width: '100%'}}>
              <TableRow sx={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '1rem'}}>
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
                    height: '20px'
                  }}    
                >
                  <Text styleSheet={{
                      color: theme.colors.positive.x300,
                      textAlign: 'center',
                      marginTop: '-.5rem',
                     
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
                    color: theme.colors.secondary.x700
                  }}    
                >
                  <Text styleSheet={{
                       color: theme.colors.secondary.x700,
                      textAlign: 'Pagamento recusado',marginTop: '-.5rem',
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
                   
                  }}    
                >
                  <Text styleSheet={{
                      color: theme.colors.neutral.x000,
                      textAlign: 'center',
                      marginTop: '-.5rem',
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
                    backgroundColor: theme.colors.negative.x050
                  }}
                >
                  <Text styleSheet={{
                      color: theme.colors.negative.x300,
                      textAlign: 'center',
                      marginTop: '-.5rem',
                    }}
                  >
                    {item?.['status'] ?? 'NULL'}
                  </Text>
                
                </TableCell>
                )}
                </TableRow>
              </TableBody>:
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
                  
                    borderRadius: '10px',
                    backgroundColor: theme.colors.positive.x050,
                    height: '20px',
          
                  }}    
                >
                  <Text styleSheet={{
                      color: theme.colors.positive.x300,
                      marginTop: '-.5rem',
                      textAlign: 'center'
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
                    height: '20px',
                  }}    
                >
                  <Text styleSheet={{
                      color: theme.colors.secondary.x700,
          
                      marginTop: '-.5rem',
                      textAlign: 'center'
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
                    height: '20px',
                  }}    
                >
                  <Text styleSheet={{
                      color: theme.colors.neutral.x000,
                 
                      marginTop: '-.5rem',
                      textAlign: 'center'
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
                    height: '20px',
                  }}
                >
                  <Text styleSheet={{
                      color: theme.colors.negative.x300,
                      textAlign: 'center',
                      marginTop: '-.5rem',
                 
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

export default Homedash;
