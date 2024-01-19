import { useTheme } from "@src/app/theme/ThemeProvider";
import Box from "@src/app/theme/components/Box/Box";
import Banner from "./Components/Banner/Banner";
import { useContext, useEffect, useState } from "react";
import Text from "@src/app/theme/components/Text/Text";
import Icon from "@src/app/theme/components/Icon/Icon";
import useResponsive from "@src/app/theme/helpers/useResponsive";
import { Gallery} from "@src/app/components/site/Patterns/Gallery/Gallery";
import { ModalContext } from "@src/app/context/ModalContext";
import ModalLogin from "../HomeScreen/Components/Modals/LoginModal";
import useSize from "@src/app/theme/helpers/useSize";
import ModalBudget from "../HomeScreen/Components/Modals/BudgetModal";
import { UserContext } from "@src/app/context/UserContext";
import BuffetService from "@src/app/api/BuffetService";
import IconUserTemplate from '../../../../../../public/assets/icons/icons_template/users.jpg';
import IconMapTemplate from '../../../../../../public/assets/icons/icons_template/map_pin.jpg';
import IconAtendimentoTemplate from '../../../../../../public/assets/icons/icons_template/atendimento.jpg';
import IconPhoneTemplate from '../../../../../../public/assets/icons/icons_template/phone.jpg';
import IconZoomTemplate from '../../../../../../public/assets/icons/icons_template/zoom.jpg';
import Iconfacebook from '../../../../../../public/assets/icons/rename.png';
import IconInstagram from '../../../../../../public/assets/icons/instagram.png';
import IconSocialTemplate from '../../../../../../public/assets/icons/icons_template/social.jpg';
import IconSiteTemplate from '../../../../../../public/assets/icons/icons_template/site.jpg';
import IconCheckTemplate from '../../../../../../public/assets/icons/icons_template/check.jpg';
import IconWhatsapp from '../../../../../../public/assets/icons/icons_template/WhatsApp.png';
import Image from "@src/app/theme/components/Image/Image";
import MapModal from "../SearchPage/Components/ModalMaps";
import GeolocalizationMapsService from "@src/app/api/GeolocalizationMapsService";
import { Relacionados } from "./Components/Relacionados";






export default function SinglePageBuffet(slug){
  const {
    idBuffet,
    setSelectedBuffet,
    buffetsRelacionados
  } = useContext(UserContext)
  
    const [attractions, setAttractions] = useState([])
    const [services, setServices] = useState([])
    const [securities, setSecurities] = useState([])
    const [details, setDetails] = useState([]);
    const [cep, setCep] = useState();
    const [coordinates, setCoordinates] = useState([]);
    

    const isMobile = useResponsive()
    const size = useSize()
    const theme = useTheme();

   
    
    const [buffets, setBuffets] = useState([])

    const {
      isModalOpen,
      closeModal,
      isNovoModalOpen,
      closeNovoModal,
      closeBudgetModal,
      isModalOpenBudget
    } = useContext(ModalContext)

   
  

  function formatarNumero(numero) {
    return numero?.toLocaleString('pt-BR');
  }

  function primeiraLetraMaiuscula(string: string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1).toLowerCase();
  }

 


    useEffect(() => {
      BuffetService.showBuffetById(idBuffet ? idBuffet : JSON.parse(localStorage.getItem('ID_BUFFET')))
        .then((response) => {
   
          setDetails(response)
          setSelectedBuffet(response)
          const attractionPromises = response?.detalhes
            .filter((item) => item.id_atracao !== null)
            .map((item) => BuffetService.getAttractionsBuffetsById(item?.id_atracao));
    
          const servicePromises = response?.detalhes
            .filter((item) => item.id_servico !== null)
            .map((item) => BuffetService.getServicesBuffetsById(item?.id_servico));

            const securityPromises = response?.detalhes
            .filter((item) => item.id_seguranca !== null)
            .map((item) => BuffetService.getSecuritiesBuffetsById(item?.id_seguranca));
    
          Promise.all(attractionPromises)
            .then((attractionResponses) => {
              const attractions = attractionResponses.map((response) => response?.nome);
              setAttractions(attractions);
            })
            .catch((attractionError) => {
              console.error('Erro ao buscar atrações:', attractionError);
            });

            Promise.all(securityPromises)
            .then((securityResponses) => {
              const securities = securityResponses.map((response) => response?.nome);
              setSecurities(securities);
            })
            .catch((attractionError) => {
              console.error('Erro ao buscar atrações:', attractionError);
            });
    
          Promise.all(servicePromises)
            .then((serviceResponses) => {
              const services = serviceResponses.map((response) => response?.nome);
              setServices(services);
            })
            .catch((serviceError) => {
              console.error('Erro ao buscar serviços:', serviceError);
            });
        })
        .catch((error) => {
          console.error('Erro ao buscar detalhes do buffet:', error);
        });
    }, []);



    useEffect(()=>{
      let accumulatedCoordinates = [];
      buffetsRelacionados?.map((item,index)=>{
        GeolocalizationMapsService.geocodeAddressByCep(item?.['entidade']?.['enderecos'][0]?.['endereco']?.['cep'])
        .then((response)=>{
          accumulatedCoordinates.push(response);
          setCoordinates(accumulatedCoordinates);
        })
      })
      
    }, [details])

 

    useEffect(()=>{
      BuffetService.showBuffets()
        .then(res=>{
          setBuffets(res)
        })
    }, [])
  
    
 
    const extractVideoId = (youtubeUrl) => {
      const match = youtubeUrl?.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
      return match ? match[1] : null;
    };

    const videoId = extractVideoId(details?.['youtube']);

  
    useEffect(()=>{
      setSelectedBuffet([])
    }, [])

    /*useEffect(()=>{
      BuffetService.showBuffetsBySlug((slug?.slug))
      .then(res=>{
        console.log(res)
      }).catch(err=>{
        console.log(err)
      })
    }, [])*/
    
    function extrairNomeDaPagina(url) {
      const match = url.match(/facebook\.com\/(.+)$/);
    
      if (match && match[1]) {
        return `facebook.com/${match[1]}`;
      }
    
      return null;
    }
    
    
  



    return(
        <Box >
          {details ? <Banner data={details}/> : <></>}
          
          {/* Novo modal que será aberto */}
          {isNovoModalOpen &&(
            <ModalLogin isOpen={isNovoModalOpen} onClose={closeNovoModal} />
          )}

          {isModalOpenBudget &&(
            <ModalBudget isOpen={isModalOpenBudget} onClose={closeBudgetModal} />
          )}  


          <Box styleSheet={{
            display: 'grid',
            gridTemplateColumns: `${!isMobile ? '2fr 1fr' : '1fr'}`,
            gap: '4rem',
         
            margin: !isMobile ? '5rem 4rem' : '1rem auto',
            padding: '0 1rem',
          }}>
           
             
                <Box tag="div" >
                  <Text tag="h3" variant="heading3semiBold" 
                    styleSheet={{
                      padding: '1rem 0',
                      borderBottom: `1px solid ${theme.colors.neutral.x100}`
                    }}>
                    Sobre o Buffet
                  </Text>

                  {/*Descrição do Buffet*/}
                  <Text tag="p" variant="body1"
                    styleSheet={{
                    padding: '3rem 0',
                 
                    width: '100%'
                  }}>'
                    {details?.['sobre']}
                  </Text>

                  {/*Principais comodidades*/}
                  <Box tag="div">
                    <Text tag="h3" variant="heading3semiBold" 
                      styleSheet={{
                        padding: '1rem 0',
                        borderBottom: `1px solid ${theme.colors.neutral.x100}`,
                        
                      }}>
                        Principais Comodidades
                    </Text>
                    <Box tag="div"                  
                      styleSheet={{                 
                        display: 'flex',                  
                        flexDirection: !(size<=450)? 'row': 'column',  
                        flexWrap: 'wrap',                
                        gap: '1rem',                  
                        marginTop: !(size<=450)? '3rem': '1rem',
                                     
                      }}                  
                    >                 
                      {attractions?.map((nome, index)=>{
                          return(
                              <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem', padding: '1rem 0', flexWrap: 'wrap'}}>
                               <Image src={IconCheckTemplate.src} alt="icone-comodidades" styleSheet={{width: '20px'}}/>
                                <Text styleSheet={{wordWrap: 'break-word'}} variant="btnRegular">{nome}</Text>
                              </Box>
                          )
                      })
                      }                 
                    </Box>                
                  </Box>

                  {/*Serviços*/}
                  <Box tag="div">
                    <Text tag="h3" variant="heading3semiBold" 
                      styleSheet={{
                        padding: '1rem 0',
                        borderBottom: `1px solid ${theme.colors.neutral.x100}`,
                        marginTop: '3rem'
                      }}>
                        Serviços oferecidos
                    </Text>
                    <Box tag="div" 
                      styleSheet={{
                        display: 'flex',                  
                        flexDirection: !(size<=450)? 'row': 'column',  
                        flexWrap: 'wrap',                
                        gap: '1rem',                  
                        marginTop: !(size<=450)? '3rem': '1rem',
                      }}
                    >
                      {services?.map((nome, index)=>{
                          return(
                              <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem', padding: '1rem 0'}}>
                                <Image src={IconCheckTemplate.src} alt="icone-servicos" styleSheet={{width: '20px'}}/>
                                <Text styleSheet={{wordWrap: 'break-word'}} variant="btnRegular">{nome}</Text>
                              </Box>
                          )
                      })
                      }
                    </Box>
                  </Box>

                  {/*Segurança*/}
                  <Box tag="div">
                    <Text tag="h3" variant="heading3semiBold" 
                      styleSheet={{
                        padding: '1rem 0',
                        borderBottom: `1px solid ${theme.colors.neutral.x100}`,
                        marginTop: '3rem'
                      }}>
                        Segurança
                    </Text>
                    <Box tag="div" 
                      styleSheet={{
                        display: 'flex',                  
                        flexDirection: !(size<=450)? 'row': 'column', 
                        flexWrap: 'wrap',                
                        gap: '1rem',                  
                        marginTop: !(size<=450)? '3rem': '1rem', 
                      }}
                    >
                      {securities?.map((nome, index)=>{
                          return(
                              <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem', padding: '1rem 0'}}>
                                <Image src={IconCheckTemplate.src} alt="icone-seguranca" styleSheet={{width: '20px'}}/>
                                <Text styleSheet={{wordWrap: 'break-word'}} variant="btnRegular">{nome}</Text>
                              </Box>
                          )
                      })
                      }
                    </Box>
                  </Box>

                  {/*Informações Técnicas*/}
                  <Box tag="div"  >
                    <Text tag="h3" variant="heading3semiBold" 
                      styleSheet={{
                        padding: '1rem 0',
                        borderBottom: `1px solid ${theme.colors.neutral.x100}`,
                        marginTop: '3rem',
                      
                      }}>
                        Informações Técnicas
                    </Text>

                    <Box tag="div" 
                        styleSheet={{
                          display: !isMobile?'grid': 'flex',
                          flexDirection: isMobile? 'column': 'row',
                          gridTemplateColumns: '1fr 2fr 2fr',
                          gap: '2rem',
                          marginTop: !(size<=450)? '3rem': '1rem',
                          flexWrap: 'wrap',
                          
                      }}
                    >
                      <Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'left', alignItems: 'center'}}>
                        <Box>
                          <Image alt="Ícone de zoom" src={IconZoomTemplate.src} styleSheet={{
                            width: !(size < 500) ? 'auto' : '25px',
                            heigth: !(size < 500) ? 'auto' : '25px',
                          }}/>
                        </Box>
                        <Box>
                          <Text variant={!(size < 500) ? 'heading5Bold' : 'heading6Bold'} >Área Total</Text>
                          <Text styleSheet={{color: theme.colors.neutral.x999}} variant="btnRegular">{details?.['area_total']} m²</Text>
                        </Box>
                      </Box>
                      <Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'left', alignItems: 'center'}}>
                        <Box>
                          <Image alt="Ícone de zoom" src={IconMapTemplate.src} styleSheet={{
                            width: !(size < 500) ? 'auto' : '25px',
                            heigth: !(size < 500) ? 'auto' : '25px',
                          }}/>
                        </Box>
                        <Box >

                          <Text variant={!(size < 500) ? 'heading5Bold' : 'heading6Bold'} >Endereço</Text>
                          <Text styleSheet={{color: theme.colors.neutral.x999, width: !isMobile? '85%': '92%'}} variant="btnRegular">
                              Rua {details?.['entidade']?.enderecos[0]?.endereco?.rua}, 
                              N°  {details?.['entidade']?.enderecos[0]?.endereco?.numero}
                          </Text>
                          <Text styleSheet={{color: theme.colors.neutral.x999}} variant="btnRegular">
                              {primeiraLetraMaiuscula(details?.['entidade']?.enderecos[0]?.endereco?.cidade.nome) + ', ' + 
                                ( details?.['entidade']?.enderecos[0]?.endereco?.cidade.estado.sigla).toUpperCase()
                              } 
                          </Text>
                        </Box>
                      </Box>

                      
                      <Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'left', alignItems: 'center'}}>
                        <Box>
                          <Image alt="Ícone de zoom" src={IconUserTemplate.src} styleSheet={{
                            width: !(size < 500) ? 'auto' : '25px',
                            heigth: !(size < 500) ? 'auto' : '25px',
                          }}/>
                        </Box>
                        <Box>
                          <Text variant={!(size < 500) ? 'heading5Bold' : 'heading6Bold'} >Capacidade Total</Text>
                          <Text styleSheet={{color: theme.colors.neutral.x999}} variant="btnRegular">{formatarNumero(details?.['capacidade_total'])} pessoas</Text>
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  

                  <Box tag="div">
                    <Box tag="div" 
                        styleSheet={{
                          display: !isMobile?'grid': 'flex',
                          flexDirection: isMobile? 'column': 'row',
                          gridTemplateColumns: '1fr 2fr 2fr',
                          gap: '2rem',
                          marginTop: !(size<=450)? '3rem': '1rem',
                          flexWrap: 'wrap',
                         
                      }}
                    >
                      <Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'left', alignItems: 'center'}}>
                        <Box>
                          <Image alt="Ícone de zoom" src={IconPhoneTemplate.src} styleSheet={{
                            width: !(size < 500) ? 'auto' : '25px',
                            heigth: !(size < 500) ? 'auto' : '25px',
                          }}/>
                        </Box>
                        <Box>
                          <Text variant={!(size < 500) ? 'heading5Bold' : 'heading6Bold'}  >Telefone</Text>
                          <Text styleSheet={{color: theme.colors.neutral.x999}} variant="btnRegular">{(details?.['entidade']?.redesSociais[4]?.descricao)}</Text>
                        </Box>
                      </Box>
                      

                      <Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'left', alignItems: 'center'}}>
                        <Box>
                          <Image alt="Ícone de zoom" src={IconAtendimentoTemplate.src} styleSheet={{
                            width: !(size < 500) ? 'auto' : '25px',
                            heigth: !(size < 500) ? 'auto' : '25px',
                          }}/>
                        </Box>
                        <Box >
                          <Text variant={!(size < 500) ? 'heading5Bold' : 'heading6Bold'}>Atendimento</Text>
                          <Text styleSheet={{color: theme.colors.neutral.x999, width: !(size < 500) ? '100%' : '100%'}} variant="btnRegular">
                              De segunda às sextas: {details?.['horario_atendimento']}
                          </Text>
                          <Text styleSheet={{color: theme.colors.neutral.x999}} variant="btnRegular"> 
                            Aos sábados: {details?.['horario_atendimento_fds']}
                          </Text>
                        </Box>
                      </Box>
                      {details?.['entidade']?.redesSociais[3]?.descricao != 'none' ? 
                      <Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'left', alignItems: 'center'}}>
                        <Box>
                          <Image alt="Ícone de zoom" src={IconWhatsapp.src} styleSheet={{
                            width: !(size < 500) ? 'auto' : '25px',
                            heigth: !(size < 500) ? 'auto' : '25px',
                          }}/>
                        </Box>
                        <Box>
                          <Text variant={!(size < 500) ? 'heading5Bold' : 'heading6Bold'}  >Whatsapp</Text>
                          <Text styleSheet={{color: theme.colors.neutral.x999}} variant="btnRegular">{(details?.['entidade']?.redesSociais[3]?.descricao)}</Text>
                        </Box>
                      </Box>: ''
                }

                    </Box>
                  </Box>


                  

                  <Box tag="div">
                    <Box tag="div" 
                        styleSheet={{
                          display: !isMobile?'grid': 'flex',
                          flexDirection: isMobile? 'column': 'row',
                          gridTemplateColumns: '1fr 2fr 2fr',
                          gap: '2rem',
                          marginTop: !(size<=450)? '3rem': '1rem',
                          flexWrap: 'wrap',
                       
                         paddingBottom: '4rem'
                      }}
                    >
                      {details?.['entidade']?.redesSociais[0]?.descricao != '' ? 
                      <Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'left', alignItems: 'center', width: '90%'}}>
                          <Image alt="Ícone de zoom" src={IconInstagram.src} styleSheet={{
                            width: !(size < 500) ? 'auto' : '25px',
                            heigth: !(size < 500) ? 'auto' : '25px',
                          }}/>
                        
                        <Box styleSheet={{ width: '70%'}}>
                          <Text variant={!(size < 500) ? 'heading5Bold' : 'heading6Bold'} >Instagram</Text>
                          <Text styleSheet={{color: theme.colors.neutral.x999, wordWrap: 'break-word',}} variant="btnRegular">{(details?.['entidade']?.redesSociais[0]?.descricao)}</Text>
                        </Box>
                      </Box>: ''
                      }

                    {details?.['entidade']?.redesSociais[1]?.descricao != 'none' ?  
                      <Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'left', alignItems: 'center', width: '90%'}}>
                        <Box>
                          <Image alt="Ícone de zoom" src={Iconfacebook.src} styleSheet={{
                            width: !(size < 500) ? 'auto' : '25px',
                            heigth: !(size < 500) ? 'auto' : '25px',
                          }}/>
                        </Box>
                        <Box styleSheet={{width: '70%'}}>
                          <Text variant={!(size < 500) ? 'heading5Bold' : 'heading6Bold'}  >Facebook</Text>
                          <Text styleSheet={{color: theme.colors.neutral.x999, wordWrap: 'break-word'}} variant="btnRegular">{(details?.['entidade']?.redesSociais[1]?.descricao)}</Text>
                        </Box>
                      </Box>: ''
                    }

                  {details?.['entidade']?.redesSociais[2]?.descricao != 'none' ? 
                      <Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '1rem', justifyContent: 'left', alignItems: 'center', border: '1px solid red', width: '90%'}}>
                        <Box>
                          <Image alt="Ícone de zoom" src={IconSiteTemplate.src} styleSheet={{
                            width: !(size < 500) ? 'auto' : '25px',
                            heigth: !(size < 500) ? 'auto' : '25px',
                          }}/>
                        </Box>
                        <Box styleSheet={{width: '70%', border: '1px solid red'}}>
                          <Text variant={!(size < 500) ? 'heading5Bold' : 'heading6Bold'}>Site</Text>
                          <Text styleSheet={{color: theme.colors.neutral.x999, wordWrap: 'break-word', border: '1px solid red'}} variant="btnRegular">
                          {(details?.['entidade']?.redesSociais[2]?.descricao)}
                          </Text>
                         
                        </Box>
                      </Box>: ''
                    }
                    </Box>
                        
                  </Box>
                  
                  
             
                  


                  {/*Galeria*/}
                  <Box tag="div">
                      <Text tag="h3" variant="heading3" 
                          styleSheet={{
                              padding: '1rem 0',
                              borderBottom: `1px solid ${theme.colors.neutral.x100}`,
                              marginTop: '1rem',
                              fontWeight: '600'
                          }}>
                          Galeria
                      </Text>
                      <Gallery dataBuffet={details} isMobile={isMobile}/>
                  </Box>

                  {/*CONHEÇA NOSSO ESPAÇO - PREMIUM*/}

                  
                  
              </Box>


              {/*Buffets Relacionados*/}
              <Box tag="div" styleSheet={{height: 'auto', backgroundColor: '#F5F2F2', borderRadius:'8px', padding: '2rem'}}>
                {/*<MapModal isOpen={isMapModalOpen} onRequestClose={closeMapModal} coordinates={coordinates}/>*/}
                <Text styleSheet={{
                  padding: '2rem',
                  fontSize: '2rem',
                  textAlign: 'center',
               
                }}>Destaques</Text>
                <Relacionados data={details}/>
              </Box>
            
          </Box>
          {/*<WhatsAppButton number={details?.['entidade']?.enderecos[0]?.telefone? removeMask(details?.['entidade']?.enderecos[0]?.telefone): ''}/>*/}
      </Box>
    )
}
