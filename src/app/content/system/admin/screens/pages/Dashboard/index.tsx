'use client'

import { FilterArrows } from "../common/FilterArrows";
import { useFilterFunctions } from "../common/useFilterFunctions";
import BoxDash from "@src/app/components/system/BoxDash";
import { useTheme } from "@src/app/theme/ThemeProvider"
import Box from "@src/app/theme/components/Box/Box"
import Text from "@src/app/theme/components/Text/Text";
import TableHead from "@src/app/components/system/Table/TableHead";
import TableRow from "@src/app/components/system/Table/TableRow";
import TableCell from "@src/app/components/system/Table/TableCell";
import TableBody from "@src/app/components/system/Table/TableBody";
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
  const [currentPage, setCurrentPage] = useState(1);
  const elementsPerPage = 5; // Define o número de elementos por página
  
  const [assinaturasPagBank, setAssinaturasPagBank] = useState([]);

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

  const formatarValor = (valor) => {
    const valorString = valor.toString();
    const reais = valorString.slice(0, -2) || '0';
    const centavos = valorString.slice(-2);
    const valorFormatado = `R$ ${reais},${centavos}`;
    return valorFormatado;
  };
    
      
  

  useEffect(()=>{
    PagBankService.getSignaturesPagBankById(viewPayments.map(item=>{
      item
    }))
    .then(res=>{
      setAssinaturasPagBank(res?.subscriptions);
    })
  }, [])

  const isMobile = useResponsive();




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
      
      {isMobile && <FilterTableTime setViewPayments={setViewPayments} payments={payments}/>}
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
            <Box styleSheet={{display: 'flex', flexDirection: !isMobile? 'row': 'column', justifyContent: 'left', gap: '2rem', marginTop: '2rem'}}>
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
          {!isMobile && <FilterTableTime setViewPayments={setViewPayments} payments={payments}/>}
        </Box>

        <Box tag="table" styleSheet={{overflowX: isMobile? 'scroll': 'none', width: '100%'}}>
        <TableHead styleSheet={{width: isMobile? 'max-content': "100%"}}>
            {loading && isMobile ? <TableRow styleSheet={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap'}}>
              <TableCell><p>ID</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/></TableCell>
              <TableCell><p>Data Início</p> <FilterArrows functionupArrow={orderByDateGrowing} functionDownArrow={orderByDateDescending} property="updated_at"/></TableCell>
              <TableCell><p>Data Fim</p> <FilterArrows functionupArrow={orderByDateGrowing} functionDownArrow={orderByDateDescending} property="updated_at"/></TableCell>
              <TableCell><p>Nome</p> <FilterArrows functionupArrow={orderByStringGrowing} functionDownArrow={orderByStringDescending} property="entidade.nome"/></TableCell>
              <TableCell><p>Valor</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="valor"/></TableCell>
              <TableCell><p>Desconto</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="desconto"/></TableCell>
              <TableCell><p>Status</p> <FilterArrows functionupArrow={orderByStringGrowing} functionDownArrow={orderByStringDescending} property="status"/></TableCell>
            </TableRow>: 
            <TableRow>
            <TableCell><p>ID</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/></TableCell>
            <TableCell><p>Data Início</p> <FilterArrows functionupArrow={orderByDateGrowing} functionDownArrow={orderByDateDescending} property="updated_at"/></TableCell>
            <TableCell><p>Data Fim</p> <FilterArrows functionupArrow={orderByDateGrowing} functionDownArrow={orderByDateDescending} property="updated_at"/></TableCell>
            <TableCell><p>Nome</p> <FilterArrows functionupArrow={orderByStringGrowing} functionDownArrow={orderByStringDescending} property="entidade.nome"/></TableCell>
            <TableCell><p>Valor</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="valor"/></TableCell>
            <TableCell><p>Desconto</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="desconto"/></TableCell>
            <TableCell><p>Status</p> <FilterArrows functionupArrow={orderByStringGrowing} functionDownArrow={orderByStringDescending} property="status"/></TableCell>
          </TableRow>}
          </TableHead>

          <TableHead styleSheet={{width: isMobile? 'max-content': "100%"}}>
            {assinaturasPagBank?.slice((currentPage - 1) * elementsPerPage, currentPage * elementsPerPage)
          ?.map((item, index)=>(
            isMobile? 
            <TableRow styleSheet={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: '2rem'}}>
                <TableCell styleSheet={{width: '7%', textAlign: 'center', }}>{index}</TableCell>
                <TableCell styleSheet={{width: '15%', textAlign: 'center', }}>{new Date(item?.trial?.start_at).toLocaleDateString()}</TableCell>
                <TableCell styleSheet={{width: '14%', textAlign: 'center', }}>{new Date(item?.trial?.end_at).toLocaleDateString()}</TableCell>
                <TableCell styleSheet={{width: '13%', textAlign: 'center', }}>{item?.customer?.name != ''? extrairValorAposHifen(item?.customer?.name): "Não Preenchido"}</TableCell>
                <TableCell styleSheet={{width: '15%', textAlign: 'center', }}>{formatarValor(item?.amount?.value)}</TableCell>
                <TableCell styleSheet={{width: '7%', textAlign: 'center', }}>{0}</TableCell>

                {item?.status === 'TRIAL' && (
                  <Box tag="td"
                  styleSheet={{
                    padding: '.7rem',
                    borderRadius: '10px',
                    backgroundColor: theme.colors.positive.x050,
                    width: '20%'
                  }}    
                >
                  <Text styleSheet={{
                      color: theme.colors.positive.x300,
                      textAlign: 'center'
                    }}
                  >
                    Ativo/Gratuito
                  </Text>
                
                </Box>
                )}

                {item.status === 'OVERDUE'  && (
                  <Box tag="td"
                  styleSheet={{
                    padding: '.7rem',
                    borderRadius: '10px',
                    backgroundColor: theme.colors.secondary.x1100,
                    color: theme.colors.secondary.x700
                  }}    
                >
                  <Text styleSheet={{
                       color: theme.colors.secondary.x700,
                      textAlign: 'Pagamento recusado'
                    }}
                  >
                    Pendente
                  </Text>
                
                </Box>
                )}

                {item.status === 'CANCELED'  && (
                  <Box tag="td"
                  styleSheet={{
                    padding: '.7rem',
                    borderRadius: '10px',
                    backgroundColor: theme.colors.negative.x400,
                   
                  }}    
                >
                  <Text styleSheet={{
                      color: theme.colors.neutral.x000,
                      textAlign: 'center'
                    }}
                  >
                    Cancelado
                  </Text>
                
                </Box>
                )}



                {(item.status === "Avaliação" || item.status == null) && (
                  <Box tag="td"
                  styleSheet={{
                    padding: '.7rem',
                    borderRadius: '10px',
                    backgroundColor: theme.colors.negative.x050
                  }}
                >
                  <Text styleSheet={{
                      color: theme.colors.negative.x300,
                      textAlign: 'center'
                    }}
                  >
                    {item?.['status'] ?? 'NULL'}
                  </Text>
                
                </Box>
                )}
                
              </TableRow>:
              <TableRow key={index} styleSheet={{}}>
              <TableCell>{index}</TableCell>
              <TableCell >{new Date(item?.trial?.start_at).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(item?.trial?.end_at).toLocaleDateString()}</TableCell>
              <TableCell>{item?.customer?.name != ''? extrairValorAposHifen(item?.customer?.name): "Não Preenchido"}</TableCell>
              <TableCell>{formatarValor(item?.amount?.value)}</TableCell>
              <TableCell>{0}</TableCell>

              {item?.status === 'TRIAL' && (
                <Box tag="td"
                styleSheet={{
                  padding: '.7rem',
                  borderRadius: '10px',
                  backgroundColor: theme.colors.positive.x050,
                  width: '100%'
                }}    
              >
                <Text styleSheet={{
                    color: theme.colors.positive.x300,
                    textAlign: 'center'
                  }}
                >
                  Ativo/Gratuito
                </Text>
              
              </Box>
              )}

              {item.status === 'OVERDUE'  && (
                <Box tag="td"
                styleSheet={{
                  padding: '.7rem',
                  borderRadius: '10px',
                  backgroundColor: theme.colors.secondary.x1100,
                  color: theme.colors.secondary.x700
                }}    
              >
                <Text styleSheet={{
                     color: theme.colors.secondary.x700,
                    textAlign: 'Pagamento recusado'
                  }}
                >
                  Pendente
                </Text>
              
              </Box>
              )}

              {item.status === 'CANCELED'  && (
                <Box tag="td"
                styleSheet={{
                  padding: '.7rem',
                  borderRadius: '10px',
                  backgroundColor: theme.colors.negative.x400,
                 
                }}    
              >
                <Text styleSheet={{
                    color: theme.colors.neutral.x000,
                    textAlign: 'center'
                  }}
                >
                  Cancelado
                </Text>
              
              </Box>
              )}



              {(item.status === "Avaliação" || item.status == null) && (
                <Box tag="td"
                styleSheet={{
                  padding: '.7rem',
                  borderRadius: '10px',
                  backgroundColor: theme.colors.negative.x050
                }}
              >
                <Text styleSheet={{
                    color: theme.colors.negative.x300,
                    textAlign: 'center'
                  }}
                >
                  {item?.['status'] ?? 'NULL'}
                </Text>
              
              </Box>
              )}
              
            </TableRow>
            ))}
          </TableHead>
        </Box>
      </Box>
      <Pagination currentPage={currentPage} qtdElements={assinaturasPagBank?.length} elementsPerPage={elementsPerPage} onPageChange={handlePageChange}/>
    </Box>
  )
}

export default Homedash;
