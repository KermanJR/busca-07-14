"use client"

import BoxDash from "@src/app/components/system/BoxDash";
import { useTheme } from "@src/app/theme/ThemeProvider"
import Box from "@src/app/theme/components/Box/Box"
import Text from "@src/app/theme/components/Text/Text";
import TableHead from "@src/app/components/system/Table/TableHead";
import TableRow from "@src/app/components/system/Table/TableRow";
import TableCell from "@src/app/components/system/Table/TableCell";
import TableBody from "@src/app/components/system/Table/TableBody";
import FilterTableTime from "@src/app/components/system/FilterTableTime";
import Icon from "@src/app/theme/components/Icon/Icon";
import Image from "@src/app/theme/components/Image/Image";
import CoffeImage from '../../../../../../../../public/assets/icons/coffee.png'
import Pagination from "@src/app/components/system/Pagination";
import { useContext, useEffect, useState } from "react";
import BuffetService from "@src/app/api/BuffetService";
import { UserContext } from "@src/app/context/UserContext";
import moment from "moment-timezone";
import { FilterArrows } from "@src/app/content/system/admin/screens/pages/common/FilterArrows";
import { useFilterFunctions } from "@src/app/content/system/admin/screens/pages/common/useFilterFunctions";
import useResponsive from "@src/app/theme/helpers/useResponsive";

const Homedash = () =>{

  const theme = useTheme();
  const [viewElements, setViewElements] = useState(0)

  const isMobile = useResponsive();

  const [propostas, setPropostas] = useState([])

  const [currentPage, setCurrentPage] = useState(1);
  const elementsPerPage = 5; // Define o número de elementos por página

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const {
    dataUser
  } = useContext(UserContext);

  
  function converterData(dataOriginal) {
    const dataConvertida = moment(dataOriginal).format('DD/MM/YYYY');
    return dataConvertida;
  }

  const {
    orderByGrowing,
    orderByDescending,
    orderByDateGrowing,
    orderByDateDescending,
    orderByStringGrowing,
    orderByStringDescending
    } = useFilterFunctions({hook: propostas, setHook: setPropostas})

    function DownloadLink(index, dataEvento){
      const formatoEsperado = "YYYY-MM-DD HH:mm:ss";
      const dataFormatada = moment(dataEvento?.data_do_evento).format(formatoEsperado)


      const partes = dataEvento?.observacoes.split('-');
      const textoAntesDoHifen = partes[0].trim();
      const observacoesFormatadas = textoAntesDoHifen + " - Visualizado";

      const data = {
          "nome": dataEvento?.nome,
          "observacoes": observacoesFormatadas,
          "qtd_pessoas": dataEvento?.qtd_pessoas,
          "tipo": dataEvento?.tipo,
          "status": dataEvento?.status,
          "periodo": dataEvento?.periodo,
          "id_entidade": dataEvento?.id_entidade,
          "bairro": dataEvento?.bairro,
          "data_do_evento": dataFormatada,
          "id_cidade": dataEvento?.id_cidade
      
      }
      BuffetService.editEventBydId(dataEvento?.['id'], data)
        .then(res=>{
          console.log(res)
        }).catch(err=>{
          console.log(err)
        })
      const fileURL = `https://buscabuffet.com.br${propostas[index]?.['arquivo'].path}`;
      const newTab = window.open(fileURL, '_blank');
    }

  useEffect(()=>{
    BuffetService.showBudgetsByStatus(dataUser?.['entidade']?.id)
    .then(res=>{
      setPropostas(res);
    }).catch(err=>{
      console.log(err)
    })
  }, [dataUser != null || dataUser != undefined])

  //console.log(propostas)

  return(
    <Box styleSheet={{height: '100vh', width: 'auto'}} tag="div">
      <BoxDash styleSheet={{flexDirection: 'row', justifyContent: 'left', gap: !isMobile? '2rem' :'.5rem', width: !isMobile?"33%": "100%"}}>
        <Box styleSheet={{
          height: '84px',
          width: '84px',
          borderRadius: '100%',
          backgroundColor: theme.colors.primary.x1900,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
          }}>
            <Image src={CoffeImage.src} alt="Ícone de arquivo" styleSheet={{objectFit: 'contain'}}/>
        </Box>
        <Box>
          <Text variant="display1" color={theme.colors.neutral.x999}>{propostas?.length}</Text>
          <Text tag="p" color={theme.colors.neutral.x999}>Total de orçamentos</Text>
        </Box>
      </BoxDash>

      {isMobile&&  <FilterTableTime payments={propostas} setViewPayments={setPropostas}/>}

      <Box 
        styleSheet={{
        width: '100%',
        height: 'auto',
        marginTop: !isMobile ?'2rem': '.5rem',
        padding: !isMobile ?'2rem': '.5rem',
        borderRadius: '8px',
        display: 'flex',
        backgroundColor: theme.colors.neutral.x000,
        boxShadow: `0px 12px 23px 0px ${theme.colors.neutral.x100}`,
        flexDirection: 'column',
        gap: '.4rem',
     
      }}>
      
        <Box styleSheet={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: '2rem',  flexWrap: 'wrap'}}>
          <Box>
            <Text variant='body3' styleSheet={{padding: '.5rem 0'}} color={theme.colors.neutral.x999}>Orçamentos Recentes</Text>
            <Text variant='caption' color={theme.colors.neutral.x800}>Consulte os orçamentos recentes</Text>
          </Box>
          {!isMobile&&  <FilterTableTime payments={propostas} setViewPayments={setPropostas}/>}
          
        </Box>

        <Box tag="table" styleSheet={{overflowX: isMobile? 'scroll': 'none', width: '100%'}}>
          <TableHead styleSheet={{width: isMobile? 'max-content': "100%"}}>
            {isMobile?   <TableRow styleSheet={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap'}}>
              <TableCell>ID Proposta<FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/></TableCell>
              <TableCell>Nome do Buffet<FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/></TableCell>
              <TableCell>Data Disponibilidade<FilterArrows functionupArrow={orderByDateGrowing} functionDownArrow={orderByDateDescending} property="id"/></TableCell>
              <TableCell>Valor<FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/></TableCell>
              <TableCell>Observações<FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/></TableCell>
              <TableCell>Arquivo<FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/></TableCell>
            </TableRow>:   
            
            <TableRow >
              <TableCell>ID Proposta<FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/></TableCell>
              <TableCell>Nome do Buffet<FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/></TableCell>
              <TableCell>Data Disponibilidade<FilterArrows functionupArrow={orderByDateGrowing} functionDownArrow={orderByDateDescending} property="id"/></TableCell>
              <TableCell>Valor<FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/></TableCell>
              <TableCell>Observações<FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/></TableCell>
              <TableCell>Arquivo<FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/></TableCell>
            </TableRow>}
          
          </TableHead>

          <TableHead styleSheet={{width: isMobile? 'max-content': "100%"}}>
            {propostas?.slice((currentPage - 1) * elementsPerPage, currentPage * elementsPerPage)
          ?.map((item, index)=>(
              isMobile? 
              <TableRow styleSheet={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: '2rem'}}>
                <TableCell styleSheet={{width: '20%', textAlign: 'center', }}>{item?.['id']}</TableCell>
                <TableCell styleSheet={{width: '20%'}}>{item?.entidade?.['nome']}</TableCell>
                <TableCell styleSheet={{width: '20%'}}>{converterData(item?.['data_do_evento'])}</TableCell>
                <TableCell styleSheet={{width: '20%', marginLeft: '2.6rem'}}>{(item?.['valor']).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</TableCell>
                <TableCell styleSheet={{textAlign: 'left', color: 'black', width: '20%', marginLeft: '-2.4rem'}}>{item?.['observacoes']}</TableCell>
                <TableCell styleSheet={{display: 'flex', justifyContent: 'right', alignItems: 'left', width: '20%'}}>
                  <Box onClick={(e)=>DownloadLink(index, item?.['evento'])} styleSheet={{marginLeft: '1.5rem'}}>
                    <Icon name="file" id='downloadLink' />
                  </Box>
                </TableCell>
              </TableRow>:
              <TableRow >
              <TableCell>{item?.['id']}</TableCell>
              <TableCell>{item?.entidade?.['nome']}</TableCell>
              <TableCell>{converterData(item?.['data_do_evento'])}</TableCell>
              <TableCell>{(item?.['valor']).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</TableCell>
              <TableCell styleSheet={{textAlign: 'left', color: 'black', width: '15%'}}>{item?.['observacoes']}</TableCell>
              <TableCell styleSheet={{display: 'flex', justifyContent: 'center', alignItems: 'left'}}>
                <Box onClick={(e)=>DownloadLink(index, item?.['evento'])}>
                  <Icon name="file" id='downloadLink' />
                </Box>
              </TableCell>
            </TableRow>
            ))}
          </TableHead>
        </Box>
      </Box>
      <Pagination currentPage={currentPage} qtdElements={propostas?.length} elementsPerPage={elementsPerPage} onPageChange={handlePageChange}/>
    </Box>
  )
}

export default Homedash;
