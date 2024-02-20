"use client"

import BoxDash from "@src/app/components/system/BoxDash";
import { useTheme } from "@src/app/theme/ThemeProvider"
import Box from "@src/app/theme/components/Box/Box"
import Text from "@src/app/theme/components/Text/Text";

import FilterTableTime from "@src/app/components/system/FilterTableTime";
import FileImage from '../../../../../../../public/assets/icons/file_doc.png'
import DolarYellowImage from '../../../../../../../public/assets/icons/dolar_yellow_svg.png'
import ActivityImage from '../../../../../../../public/assets/icons/activity_svg.png'
import Image from "@src/app/theme/components/Image/Image";
import Pagination from "@src/app/components/system/Pagination";
import { useContext, useEffect, useState } from "react";
import BuffetService from "@src/app/api/BuffetService";
import Link from "next/link";
import { UserContext } from "@src/app/context/UserContext";
import ActivePageContext from "@src/app/context/ActivePageContext";
import { useFilterFunctions } from "../../../admin/screens/pages/common/useFilterFunctions";
import { FilterArrows } from "../../../admin/screens/pages/common/FilterArrows";
import PagBankService from "@src/app/api/PagBankService";
import moment from "moment";
import useResponsive from "@src/app/theme/helpers/useResponsive";
import { it } from "node:test";
import { MdDelete } from "react-icons/md";

//Material UI
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Notification from "./Notifications";

const Homedash = () =>{  

  const {
    setIdEvent,
    dataUser,
    dataBuffet,
    setDataBuffet,
    idBuffet,
    setIdBuffet
  } = useContext(UserContext);
  
  const theme = useTheme();
  const [propostas, setPropostas] = useState([]);
  const [propostasFixas, setPropostasFixas] = useState([]);
  const [orcamentos, setOrcamentos] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const elementsPerPage = 5; // Define o número de elementos por página

  const [diasRestantes, setDiasRestantes] = useState(null);
  const [dataCadastro, setDataCadastro] = useState(null);
  const [dataFim, setDataFim] = useState(null);

  const [statusBuffet, setStatusBuffet] = useState('I');
  const [valorPlanoBasico, setValorPlanoBasico] = useState(null);
  const [dadosAssinatura, setDadosAssinatura] = useState(null);

  const [phoneBuffet, setPhoneBuffet] = useState<string>('');
  const [whatsBuffet, setWhatsBuffet] = useState<string>('');
  const [youtube, setYoutube] = useState<string>('');
  const [urlInstagram, setUrlInstagram] = useState<string>('');
  const [urlFacebook, setUrlFacebook] = useState<string>('');
  const [urlSite, setUrlSite] = useState<string>('');

  const [loading, setLoading] = useState(false);
  
  
  const {
    orderByGrowing,
    orderByDescending,
    } = useFilterFunctions({hook: orcamentos, setHook: setOrcamentos})

  const {
    activePage,
    setActivePage
  } = useContext(ActivePageContext)



  const handleBuffetClick = (id) => {
    setIdEvent(id);
    setActivePage('Responda o orçamento')
  };

   const handlePageChange = (pageNumber) => {
   
    setCurrentPage(pageNumber);

  };
  

  function converterData(dataOriginal) {
    const dataConvertida = moment(dataOriginal).format('DD/MM/YYYY');
    return dataConvertida;
  }

  const startIndex = (currentPage - 1) * elementsPerPage;
  const endIndex = startIndex + elementsPerPage;
  const currentPropostas = propostas.slice(startIndex, endIndex);


  useEffect(()=>{
    if(dataUser?.['entidade']?.id){
      BuffetService.showEventsByIdEntity(dataUser?.['entidade']?.id)
      .then((response)=>{
        setPropostasFixas(response)
        setPropostas(response);
      })
    }
  }, [dataUser?.['entidade']?.id])

 


  useEffect(()=>{
    if(dataUser?.['entidade']?.id){
      BuffetService.showBudgetsByIdEntity(dataUser?.['entidade']?.id)
      .then((response)=>{
        setOrcamentos(response);
      }).catch(err=>{
        console.log(err)
      })
    }
  }, [dataUser?.['entidade']?.id])

  useEffect(()=>{
    BuffetService.showBuffetByIdEntity(dataUser?.['entidade']?.id)
    .then(res=>{
      
      setDataCadastro(res?.data_cadastro);
      setDataFim(res?.data_fim)
      setIdBuffet(res?.id)
      setStatusBuffet(res?.status)
      setDataBuffet(res)
    }).catch(err=>{
      console.log(err)
    })
  }, [dataUser?.['entidade']?.id])



  //EDITAR BUFFET
  function EditBuffet(){
    BuffetService.editBuffets(idBuffet, {
      slug: dataBuffet?.['slug'],
      capacidade_total: dataBuffet?.['capacidade_total'],
      area_total: dataBuffet?.['area_total'],
      sobre: dataBuffet?.['sobre'],
      horario_atendimento: dataBuffet?.['horario_atendimento'],
      horario_atendimento_fds: dataBuffet?.['horario_atendimento_fds'],
      youtube: dataBuffet?.['youtube'],
      status: 'P',
      redes_sociais: [
        {
            "descricao": urlInstagram ? urlInstagram : '',
            "tipo": "instagram"
        },
        {
          "descricao": urlFacebook ? urlFacebook : '',
          "tipo": "facebook"
      },
      {
        "descricao": urlSite ? urlSite : '',
        "tipo": "site"
      },
      {
        "descricao": whatsBuffet ? whatsBuffet : '',
        "tipo": "whatsapp"
      },
      {
        "descricao": phoneBuffet ? phoneBuffet : '',
        "tipo": "telefone"
      },
      {
        "descricao": youtube ? youtube : '',
        "tipo": "youtube"
      }
      
      ]
    })
    .then(async (response)=>{
      console.log(response)
    }).catch((error)=>{
      console.log(error)
    })
  }


  async function editSignatureBuffet(){
    const data = {
      "tipo": `PLAN_3571D956-D88B-485C-89EC-18CA89CF0C1C`,
      "status": 'Pendente',
      "valor": valorPlanoBasico,
      "desconto": 1.22,
      "id_plano": 1,
      "id_entidade": dataBuffet['entidade']?.id
  }
    PagBankService.editSignatureInBuffet(data, dataBuffet['entidade']['assinaturas'][0]?.id)
      .then(res=>{
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
  }


  

  useEffect(()=>{
    BuffetService.showPlans()
    .then(res=>{
      setValorPlanoBasico(res[0].valor_mensal)
    })
  }, [])




  

  function contaDiasRestantes(){
    const dataAtual = moment().format();
    let dias = moment(dataFim).diff(dataAtual, "days");
    if(!Number.isNaN(dias) && dias != 0){
      setDiasRestantes(dias)
    }else if(dias == 0){
      setDiasRestantes(0)
      editSignatureBuffet();
      EditBuffet()
    }
    
  }

    setInterval(()=>{
      if(dataFim != null && dataFim != undefined){
        contaDiasRestantes()
      }
    }, 10000)

    useEffect(()=>{
      contaDiasRestantes()
    }, [dataFim != null && dataFim != undefined])
 
 

  useEffect(() => {
    BuffetService.showSignaturesById(dataUser['entidade']?.id)
    .then(res=>{
      let id = res[0]?.tipo
      getSignature(id?.id)
    }).catch(err=>{
      console.log(err)
    })

  }, []);

  function getSignature(id){
    setLoading(true)
    PagBankService.getSignaturesPagBankById(id)
    .then(res=>{
      setDadosAssinatura(res)
      
    }).catch(err=>{
      console.log(err)
    })
    setTimeout(()=>{
      setLoading(false)

    }, 2000)
   
  }

  const [booleanDelete, setBooleanDelete] = useState(false)

  function DeleteEvent(id_cupom){
    BuffetService.deleteEvento(id_cupom)
    .then(res=>{
      BuffetService.showUsers()
      .then(res=>{
        setBooleanDelete(true)
        BuffetService.showEventsByIdEntity(dataUser?.['entidade']?.id)
        .then((response)=>{
          setPropostasFixas(response)
          setPropostas(response);
        })
        
      })
    })
  }


 
 

  function conteudoAposHifen(texto){
    const partes = texto.observacoes.split('-');
    const conteudoAposHifen = partes[1] ? partes[1].trim() : '';
    return conteudoAposHifen;
  }

  const isMobile = useResponsive()

  function getAguardando(observacoes) {
    const aguardandoRegex = /\bAguardando\.\.\./;
    const observacoesTrimmed = observacoes?.trim() || ''; // Tratamento para evitar erros se observacoes for null ou undefined
  
    return aguardandoRegex.test(observacoesTrimmed) ? 'Aguardando...' : '';
  }

  function getVisualizado(observacoes) {
    const visualizadoRegex = /\bVisualizado\b/;
    const observacoesTrimmed = observacoes?.trim() || ''; // Tratamento para evitar erros se observacoes for null ou undefined
  
    return visualizadoRegex.test(observacoesTrimmed) ? 'Visualizado' : '';
  }
  
  


  return(
    <Box styleSheet={{height: 'auto'}}>
       {
        booleanDelete &&
      
        <Notification message={"Evento excluído com sucesso!"} setOnDelete={setBooleanDelete} onDelete={booleanDelete}/>
        
      }
        
      <Box styleSheet={{display: 'flex', flexDirection: !isMobile?'row': "column",  gap: '2rem'}}>
        <BoxDash styleSheet={{flexDirection: 'row', justifyContent: 'left', gap: '1.2rem', width: !isMobile? '25%': "100%"}}>
          <Box styleSheet={{
            height: '84px',
            width: '84px',
            borderRadius: '100%',
            backgroundColor: theme.colors.primary.x1900,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <Image src={ActivityImage.src} alt="Ícone de arquivo"/>
          </Box>
          <Box styleSheet={{width: '70%'}}>
            <Text variant="display1" tag="p" color={theme.colors.neutral.x999}>{orcamentos?.length}</Text>
            <Text tag="p" color={theme.colors.neutral.x999} styleSheet={{width: !isMobile? '100%': "80%"}}>Orçamentos enviados</Text>
          </Box>
        </BoxDash>
        <BoxDash styleSheet={{marginTop: isMobile? '-1rem': '0', flexDirection: 'row', justifyContent: 'left', gap: '1.2rem',  width: !isMobile? '25%': "100%"}}>
          <Box styleSheet={{
            height: '84px',
            width: '84px',
            borderRadius: '100%',
            backgroundColor: theme.colors.primary.x1900,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Image src={FileImage.src} alt="Ícone de arquivo"/>
          </Box>
          <Box styleSheet={{width: '70%'}}>
            <Text variant="display1" tag="p" color={theme.colors.neutral.x999}>{propostasFixas?.length}</Text>
            <Text tag="p" color={theme.colors.neutral.x999} styleSheet={{width: !isMobile? '100%': "80%"}}>Solicitações de orçamentos recebidos</Text>
          </Box>
        </BoxDash>
        <BoxDash styleSheet={{marginTop: isMobile? '-1rem': '0',flexDirection: 'row', justifyContent: 'left', gap: !isMobile? '2rem': '.5rem', width: !isMobile? '45%': "100%", backgroundColor: theme.colors.secondary.x700}}>
          <Box styleSheet={{
            height: '84px',
            width: '84px',
            borderRadius: '100%',
            backgroundColor: theme.colors.primary.x600,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Image src={DolarYellowImage.src} alt="Ícone de arquivo"/>
          </Box>

         
          {statusBuffet === 'A' && dataBuffet?.['galerias']?.length > 0 && dadosAssinatura?.status == 'TRIAL' &&(
            !loading ? 
              <Box styleSheet={{width: '90%'}}>
              <Text variant="heading3Bold" tag="p" color={theme.colors.neutral.x000}>Aviso</Text>
              <p  style={{width: '80%', fontFamily: `'Poppins', 'sans-serif'`, color: "white"}}>
                Restam <label style={{display: 'inline-block',fontWeight: 'bold', color: theme.colors.primary.x500}}> 
                {diasRestantes > 0 ? (
                  diasRestantes > 0 ? (
                  diasRestantes
                  ) : (
                  <p> Não perca a oportunidade de continuar desfrutando de todos os benefícios! 
                    Assine em <label style={{display: 'inline-block'}}><a href="https://buscabuffet.com.br/planos" style={{color: theme.colors.primary.x500, fontWeight: '600'}}>buscabuffet.com.br/planos</a></label>
                  </p>
                  )
                ) : (
                  0
                )}
                 </label> dias para continuar aproveitando sua avaliação gratuita.
                Não perca a oportunidade de continuar desfrutando de todos os benefícios! 
                Assine em <label style={{display: 'inline-block'}}><a href="https://buscabuffet.com.br/planos" style={{color: theme.colors.primary.x500, fontWeight: '600'}}>buscabuffet.com.br/planos</a></label>
              </p>
            </Box>: ''
            
            
          )}

        {statusBuffet === 'A' && dataBuffet?.['galerias']?.length > 0 && dadosAssinatura?.status == 'ACTIVE' &&(
            <Box styleSheet={{width: '90%'}}>
            <Text variant="heading3Bold" tag="p" color={theme.colors.neutral.x000}>Aviso</Text>
            <p  style={{width: '80%', fontFamily: `'Poppins', 'sans-serif'`, color: "white"}}>
             Nenhum aviso 
            </p>
          </Box>
          )}

          {statusBuffet === 'A' && dataBuffet?.['galerias']?.length == 0 &&(
            <Box styleSheet={{width: '70%'}}>
            <Text variant="heading3Bold" tag="p" color={theme.colors.neutral.x000}>Aviso</Text>
            <Text color={theme.colors.neutral.x000} styleSheet={{width: !isMobile? '100%': "80%"}}>Por favor, insira as imagens do seu Buffet para ativá-lo e 
              torna-lo visível ao público.
            </Text>
         
          </Box>
          )}

        {statusBuffet === 'I' && dadosAssinatura?.status == 'TRIAL'  &&(
          !loading ? 
            <Box styleSheet={{width: '70%'}}>
            <Text variant="heading3Bold" tag="p" color={theme.colors.neutral.x000}>Aviso</Text>
            <Text color={theme.colors.neutral.x000}>Por favor, preencha as informações e insira as imagens do seu Buffet para ativá-lo e 
              torna-lo visível ao público.
            </Text>
         
          </Box>
          :'Carregando...'
            
          )}

{statusBuffet === 'I' &&dadosAssinatura?.status == 'ACTIVE'  &&(
      !loading ? 
            <Box styleSheet={{width: '70%'}}>
            <Text variant="heading3Bold" tag="p" color={theme.colors.neutral.x000}>Aviso</Text>
            <Text color={theme.colors.neutral.x000}>Por favor, preencha as informações e insira as imagens do seu Buffet para ativá-lo e 
              torna-lo visível ao público.
            </Text>
         
          </Box>:'Carregando...'
          )}

          {statusBuffet === 'P' && (
            <Box styleSheet={{width: '70%'}}>
              <Text variant="heading3Bold" tag="p" color={theme.colors.neutral.x000}>Aviso</Text>
              <p style={{width: '90%', fontFamily: `'Poppins', 'sans-serif'`, color: "white"}}> 
                  Seus dias de avaliação acabaram, não perca a oportunidade de continuar desfrutando de todos os benefícios! 
                  Assine em <label style={{display: 'inline-block'}}><a href="http://localhost:3000/planos" style={{color: theme.colors.primary.x500, fontWeight: '600'}}>buscabuffet.com.br/planos</a></label>
              </p>
            </Box>
          )}

          {dadosAssinatura?.status == 'CANCELED' && statusBuffet === 'I' || dadosAssinatura?.status == 'CANCELED' && statusBuffet === 'A'&&(
            <Box styleSheet={{width: '82%'}}>
            <Text variant="heading3Bold" tag="h3" color={theme.colors.neutral.x000}>Aviso</Text>
            <p style={{width: '90%', fontFamily: `'Poppins', 'sans-serif'`, color: "white"}}> 
                Seu plano foi cancelado, você tem até o dia {new Date(dadosAssinatura?.trial?.end_at).toLocaleDateString()} 
                {' ' } para continuar usufruindo do Busca Buffet! Escolha uma nova assinatura em <a href="http://localhost:3000/planos" style={{color: theme.colors.primary.x500, fontWeight: '600'}}>buscabuffet.com.br/planos
                </a> ou reative-a na seção Assinaturas.
            </p>
            </Box>
          )}
          
        </BoxDash>
      </Box>
      {isMobile&&  <FilterTableTime payments={propostas} setViewPayments={setPropostas} fixedPayments={propostasFixas}/>}

      <Box 
        styleSheet={{
        width: '100%',
        height: 'auto',
        marginTop: '2rem',
        padding: !isMobile? '2rem': '1rem',
        borderRadius: '8px',
        display: 'flex',
        backgroundColor: theme.colors.neutral.x000,
        boxShadow: `0px 12px 23px 0px ${theme.colors.neutral.x100}`,
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '.4rem',
       
      }}>
        <Box styleSheet={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: '2rem'}}>
          <Box>
            <Text variant='body3' styleSheet={{padding: '.5rem 0'}} color={theme.colors.neutral.x999}>Propostas Recentes</Text>
            <Text variant='caption' color={theme.colors.neutral.x800}>Consulte as propostas recentes</Text>
          </Box>
          {!isMobile&&  <FilterTableTime payments={propostas} setViewPayments={setPropostas} fixedPayments={propostasFixas}/>}
        </Box>

        <TableContainer>
          <Table >
          <TableHead >
            <TableRow sx={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between'}}>
              <TableCell sx={{textAlign: 'center', border: 'none' }}>
                <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <Text styleSheet={{ color: 'black'}}>ID Proposta</Text><FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/>
                </Box>
               
              </TableCell>
              <TableCell sx={{textAlign: 'center', border: 'none' }}>
               <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
               <Text styleSheet={{ color: 'black'}}>Data</Text><FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="update_at"/>
                </Box>
               
              </TableCell>
             <TableCell sx={{textAlign: 'center', border: 'none' }}>
               <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
               <Text styleSheet={{ color: 'black'}}>Nome do Evento</Text><FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="entidade.nome"/>
                </Box>
             
              </TableCell>
             <TableCell sx={{textAlign: 'center', border: 'none' }}>
               <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
               <Text styleSheet={{ color: 'black'}}>Qtd. Pessoas</Text><FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="qtd_pessoas"/>
                </Box>
              
              </TableCell>
             <TableCell sx={{textAlign: 'center', border: 'none' }}>
               <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <Text styleSheet={{ color: 'black'}}>Período</Text><FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="periodo"/>
                </Box>
              
              </TableCell>
              {/*<TableCell>Tipo do Evento<FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="tipo"/></TableCell>*/}
              <TableCell sx={{textAlign: 'center', border: 'none' }}>
               <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <Text styleSheet={{ color: 'black'}}>Status</Text><FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/>
                </Box>
              
              </TableCell>
              <TableCell sx={{textAlign: 'center', border: 'none' }}>
               <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <Text styleSheet={{ color: 'black'}}>Ações</Text>
                <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/>
                </Box>
              
               
              </TableCell>
            </TableRow>
          </TableHead>
            
          

      
            
            {propostas?.slice((currentPage - 1) * elementsPerPage, currentPage * elementsPerPage)
          ?.map((item, index)=>(
        
              <TableBody sx={{ width: '100%', display: 'flex', flexDirection: 'row', gap: '3rem'}}>
              <Link href={`buffet/`} key={index} onClick={(e)=>handleBuffetClick(item?.id)} style={{ width: '100%'}}>
             
                <TableRow sx={{display: 'flex', gridTemplateColumns: 'repeat(7, 1fr)', justifyContent: 'space-between', padding: '1rem 0'}}>
                  <TableCell sx={{border: 'none', width: '14%'}} align="left"><Text styleSheet={{fontWeight: '500', color: 'black'}}>{item?.['id']}</Text></TableCell>
                  <TableCell sx={{border: 'none', width: '14%'}} align="left"><Text styleSheet={{fontWeight: '500', color: 'black'}}>{converterData(item?.['data_do_evento'])}</Text></TableCell>
                  <TableCell sx={{border: 'none', width: '14%'}} align="left"><Text styleSheet={{fontWeight: '500', color: 'black'}}>{item?.['nome']}</Text></TableCell>
                  <TableCell sx={{border: 'none', width: '14%'}} align="left"> <Text styleSheet={{fontWeight: '500', color: 'black'}}>{item?.['qtd_pessoas']}</Text></TableCell>

                  {item?.['periodo'] === 'Manhã' && 
                  <TableCell sx={{border: 'none', width: '14%'}}><Text styleSheet={{fontWeight: '500', color: 'black'}}>Manhã</Text></TableCell>
                  }
                  {item?.['periodo'] === 'Tarde' && 
                  <TableCell sx={{border: 'none', width: '14%'}}><Text styleSheet={{fontWeight: '500',  color: 'black'}}>Tarde</Text></TableCell>
                  }
                  {item?.['periodo'] === 'Noite' && 
                  <TableCell sx={{border: 'none', width: '14%'}}><Text styleSheet={{fontWeight: '500',  color: 'black'}}>Noite</Text></TableCell>
                  }

                
               

                
                  {
                    getAguardando(item?.observacoes) && (
                      <TableCell
                    sx={{
                      border: 'none', 
                      width: 'auto',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent:'center',
                      height: '15px',
                      borderRadius: '10px',
                      marginTop: '10px',
                      backgroundColor:  getAguardando(item?.observacoes)? 
                      theme.colors.negative.x050 : theme.colors.positive.x050
                    }}    
                  >
                    <Text styleSheet={{
                        color:  getAguardando(item?.observacoes)?
                        theme.colors.negative.x300 : theme.colors.positive.x400,
                        textAlign: 'center'
                      }}
                    >
                    {getAguardando(item?.observacoes)}
                    </Text>
                  </TableCell>
                    )
                  }

                  {
                    getVisualizado(item?.observacoes) && (
                      <TableCell
                    sx={{
                      border: 'none', 
                      width: 'auto',
                      padding: '.7rem',
                      marginTop: '10px',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent:'center',
                      height: '15px',
                  
                      borderRadius: '10px',
                      backgroundColor: theme.colors.positive.x050
                    }}    
                  >
                    <Text styleSheet={{
                        color: theme.colors.positive.x400,
                        textAlign: 'center'
                      }}
                    >
                    { getVisualizado(item?.observacoes)}
                    </Text>
                  </TableCell>
                  )
                }
              </TableRow>                
              </Link>
              <TableCell sx={{border: 'none'}}>
                  <MdDelete  onClick={(e) => DeleteEvent(item['id'])} size={20} color="red" style={{cursor: 'pointer', zIndex: 100000, marginTop: '1rem 0'}}/>
              </TableCell>
              </TableBody>
            ))}
          
          </Table>
          </TableContainer>
      </Box>
      <Pagination
        currentPage={currentPage}
        elementsPerPage={elementsPerPage}
        qtdElements={propostas.length}
        onPageChange={handlePageChange}
      />
    </Box>
  )
}

export default Homedash;
