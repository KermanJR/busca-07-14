'use client'

import { dataTable } from "@src/app/components/system/Mockup";
import TableCell from "@src/app/components/system/Table/TableCell";
import TableHead from "@src/app/components/system/Table/TableHead";
import TableRow from "@src/app/components/system/Table/TableRow";
import TableBody from "@src/app/components/system/Table/TableBody";
import { useTheme } from "@src/app/theme/ThemeProvider"
import Box from "@src/app/theme/components/Box/Box"
import Text from "@src/app/theme/components/Text/Text";
import Pagination from "@src/app/components/system/Pagination";
import { useEffect, useState } from "react";
import BuffetService from "@src/app/api/BuffetService";
import { FilterArrows } from "../common/FilterArrows";
import { useFilterFunctions } from "../common/useFilterFunctions";
import PagBankService from "@src/app/api/PagBankService";

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
      
        

    useEffect(()=>{
      PagBankService.getSignaturesPagBankById(viewPayments.map(item=>{
        item
      }))
      .then(res=>{
        setAssinaturasPagBank(res?.subscriptions);
      })
    }, [])

    console.log(assinaturasPagBank)

    
  
    

  useEffect(() => {
    BuffetService.showSignatures().then((result) => setSignatures(result))
  }, [])

  return(
    <Box styleSheet={{display: 'flex', height: 'auto'}}>
      <Box 
        styleSheet={{
        width: '100%',
        padding: '2rem',
        borderRadius: '8px',
        display: 'flex',
        backgroundColor: theme.colors.neutral.x000,
        boxShadow: `0px 12px 23px 0px ${theme.colors.neutral.x100}`,
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '.4rem',
      }}>

        <Box tag="table">
          <TableHead>
            <TableRow>
              <TableCell><p>ID</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/></TableCell>
              <TableCell><p>Data Início</p> <FilterArrows functionupArrow={orderByDateGrowing} functionDownArrow={orderByDateDescending} property="updated_at"/></TableCell>
              <TableCell><p>Data Fim</p> <FilterArrows functionupArrow={orderByDateGrowing} functionDownArrow={orderByDateDescending} property="updated_at"/></TableCell>
              <TableCell><p>Nome</p> <FilterArrows functionupArrow={orderByStringGrowing} functionDownArrow={orderByStringDescending} property="entidade.nome"/></TableCell>
              <TableCell><p>Valor</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="valor"/></TableCell>
              <TableCell><p>Desconto</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="desconto"/></TableCell>
              <TableCell><p>Status</p> <FilterArrows functionupArrow={orderByStringGrowing} functionDownArrow={orderByStringDescending} property="status"/></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {assinaturasPagBank?.slice((currentPage - 1) * elementsPerPage, currentPage * elementsPerPage)
          ?.map((item, index)=>(
              <TableRow key={index}>
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
          </TableBody>
        </Box>
      </Box>
      <Pagination currentPage={currentPage} qtdElements={assinaturasPagBank?.length} elementsPerPage={elementsPerPage} onPageChange={handlePageChange}/>
    </Box>
  )
}

export default Signatures;
