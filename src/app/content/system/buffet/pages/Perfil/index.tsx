
import { useTheme } from "@src/app/theme/ThemeProvider"
import Box from "@src/app/theme/components/Box/Box"
import InputDash from "@src/app/components/system/InputDash";
import Text from "@src/app/theme/components/Text/Text";

import { use, useContext, useEffect, useState } from "react";
import { UserContext } from "@src/app/context/UserContext";
import BuffetService from "@src/app/api/BuffetService";
import SelectWithClickToAddAttractives from "@src/app/components/system/SelectAttractives";
import SelectWithClickToAddServices from "@src/app/components/system/SelectServices";
import Icon from "@src/app/theme/components/Icon/Icon";
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import SelectWithClickToAddCategory from "@src/app/components/system/SelectCategories";
import SelectHours from "@src/app/components/system/SelectHours";
import useResponsive from "@src/app/theme/helpers/useResponsive";
import PagBankService from "@src/app/api/PagBankService";

const EditPerfil = () =>{

  //Hooks
  const theme = useTheme();

  //Datas
  const [capacityTotalBuffet, setCapacityTotalBuffet] = useState(null);
  const [areaTotal, setAreaTotal] = useState('');
  const [aboutBuffet, setAboutBuffet] = useState<string>('');
  const [phoneBuffet, setPhoneBuffet] = useState<string>('');
  const [whatsBuffet, setWhatsBuffet] = useState<string>('');
  const [urlYoutube, setUrlYoutube] = useState<string>('');
  const [urlInstagram, setUrlInstagram] = useState<string>('');
  const [urlFacebook, setUrlFacebook] = useState<string>('');
  const [urlSite, setUrlSite] = useState<string>('');

  const [attractionsBuffets, setAttractionsBuffets] = useState<[]>([]);
  const [securityBuffets, setSecurityBuffets] = useState<[]>([]);
  const [servicesBuffets, setServicesBuffets] = useState<[]>([]);
  const [categoriesBuffets, setCategoriesBuffets] = useState<[]>([]);

  const [categoriesBuffetsById, setCategoriesBuffetsById] = useState<[]>([]);
  const [hoursBuffetsById, setHoursBuffetsById] = useState('');

  const [youtube, setYoutube] = useState('')
  const [isLoading, setIsLoading] = useState(false);

  const [auxAttractiveBuffets, setAuxAttractivesBuffet] = useState([]);
  const [auxServicesBuffets, setAuxServicesBuffet] = useState([]);
  const [auxSecurityBuffets, setAuxSecurityBuffet] = useState([]);
  const [auxCategoriesBuffets, setAuxCategoriesBuffet] = useState([]);

  //Horários


  //Início Semana
  const [auxHoursWeekBuffetsInit, setAuxHoursWeekBuffetInit] = useState('');

  //Fim semana
  const [auxHoursWeekBuffetsEnd, setAuxHoursWeekBuffetEnd] = useState('');

  //Início Fim de Semana
  const [auxHoursBuffets, setAuxHoursBuffet] = useState('');

  //Fim Fim de semana
  const [auxHoursBuffetsEnd, setAuxHoursBuffetEnd] = useState('');




  const [hoursWeekInit, setHoursWeekInit] = useState<string>('');
  const [hoursWeekEnd, setHoursWeekEnd] = useState<string>('');

  const [hoursWeekendInit, setHoursWeekendInit] = useState<string>('');
  const [hoursWeekendEnd, setHoursWeekendEnd] = useState<string>('');

 


  const [detailsBuffet, setDetailsBuffet] = useState([]);
  const [idDetailsBuffet, setIdDetailsBuffet] = useState([]);
  const [idBuffetLocal, setIdBuffetLocal] = useState('');




  const [slug, setSlug] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false);
  const [addressBuffet, setAddressBuffet] = useState<[]>([])

  const [typeSignature, setTypeSignature] = useState('')


  //
  const [message, setMessage] = useState('');

  //Data Address BUFFET
  const [cep, setCep] = useState<string>('');
  const [rua, setRua] = useState('');
  const [bairro, setBairro] = useState<string>('');
  const [numero, setNumero] = useState<string>('');
  const [complemento, setComplemento] = useState<string>('');
  const [cidade, setCidade] = useState<string>(null);
  const [idCidade, setIdCidade] = useState<number>(null);
  const [idAddress, setIdAddress] = useState<number>(null);
  const [estado, setEstado] = useState<string>(null);
  const [idEstado, setIdEstado] = useState<number>(null);


  const [selectedCategoria, setSelectedCategoria] = useState(null);


  //Estados que estão no banco de dados
  const [states, setStates] = useState([]);


  //Variável de controle: EDIÇÃO || CRIAÇÃO do buffet
  const [modeBuffet, setModeBuffet] = useState('create');


  //Variável de controle: EDIÇÃO || CRIAÇÃO dos detalhes do buffet
  const [modeDetails, setModeDetails] = useState('create');


  //Variável de controle: EDIÇÃO || CRIAÇÃO do endereço do buffet
  const [modeAddress, setModeAddress] = useState('create');
  

  const [hoveredEvent, setHoveredEvent] = useState(false);


  //Contexts
  const {
    dataUser,
    setIdBuffet,
    idBuffet,
    dataBuffet, setDataBuffet
  } = useContext(UserContext);

  const optionsHoursInit = [];

  for (let i = 0; i < 24 * 2; i++) { // 24 horas * 2 (para cobrir os 30 minutos de intervalo)
    const hour = Math.floor(i / 2);
    const minutes = i % 2 === 0 ? '00' : '30';

    optionsHoursInit.push({
      value: i + 1,
      label: `${String(hour).padStart(2, '0')}:${minutes}`
    });
  }


  

  /**************************************** */

  let selectedAttractivesBuffet = detailsBuffet
  .map((userAttraction) => {
    const matchingAttraction = attractionsBuffets.find(
      (attraction) => attraction?.['id'] === userAttraction?.['id_atracao']
    );
    return matchingAttraction
      ? {
          value: matchingAttraction?.['id'],
          label: matchingAttraction?.['nome']
        }
      : null;
  })
  .filter((attraction) => attraction !== null);

  /**************************************** */

  let selectedSecurityBuffet = detailsBuffet
  .map((userAttraction) => {
    const matchingAttraction = securityBuffets.find(
      (attraction) => attraction?.['id'] === userAttraction?.['id_seguranca']
    );
    return matchingAttraction
      ? {
          value: matchingAttraction?.['id'],
          label: matchingAttraction?.['nome']
        }
      : null;
  })
  .filter((attraction) => attraction !== null);


  /**************************************** */

  let selectedServicesBuffet: any = detailsBuffet
  .map((userService) => {
    const matchingService = servicesBuffets.find(
      (service) => service?.['id'] === userService?.['id_servico']
    );
    return matchingService
      ? {
          value: matchingService?.['id'],
          label: matchingService?.['nome']
        }
      : null; 
  })
  .filter((service) => service !== null); 

  /**************************************** */
  let selectedCategoriesBuffet: any = categoriesBuffetsById
  .map((userService) => {
    const matchingService = categoriesBuffets.find(
      (categoria) => categoria?.['id'] === userService?.['id_categoria']
    );
    return matchingService
      ? {
          value: matchingService?.['id'],
          label: matchingService?.['nome']
        }
      : null; 
  })
  .filter((categoria) => categoria !== null); 

  /**************************************** */



  const [dataNowBuffet, setDataNowBuffet] = useState([])



  //CRIAR DETALHES DO BUFFET SERVIÇOS && ATRATIVOS
  async function CreateDetailsBuffet(id){
    await BuffetService.deleteAttractionsServicesBuffets(idBuffet)
      .then((response) => {
        //console.log(response)
      })
      .catch((error) => {
        console.log(error);
      });

    let servicesArray = auxServicesBuffets.map((service) => ({
      id_buffet:  id,
      id_servico: service?.value,
      id_atracao: null,
    }))

    let securityArray = auxSecurityBuffets.map((security) => ({
      id_buffet:  id,
      id_seguranca: security?.value,
      id_atracao: null,
    }))

    let attractivesArray = auxAttractiveBuffets.map((attractive) => ({
      id_buffet: id,
      id_servico: null,
      id_atracao: attractive?.value,
    }));
    let combinedArray = [...servicesArray, ...attractivesArray, ...securityArray];
    await BuffetService.postAttractionsServicesBuffets({
      id_buffet: idBuffetLocal,
      items: combinedArray,
    })
      .then((response) => {
        response.map((item)=>(
          setIdDetailsBuffet(item?.id)
        ))
        setAuxAttractivesBuffet([])
        setAuxServicesBuffet([])
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //CRIAR DETALHES DO BUFFET SERVIÇOS && ATRATIVOS
  async function CreateCategoryBuffet(id){
    await BuffetService.deleteCategoriesBuffets(idBuffet)
      .then((response) => {
        //console.log(response)
      })
      .catch((error) => {
        console.log(error);
      });


    let categoriesArray = auxCategoriesBuffets.map((attractive) => (
      BuffetService.postCategoriaBuffet({
        id_buffet: id,
        id_categoria: attractive?.value,
      }).then((response) => {
       
        setAuxCategoriesBuffet([])
      })
      .catch((error) => {
        console.log(error);
      })
    ));

  }





  //CRIAR ENDEREÇO DO BUFFET
  async function CreateAddressBuffet(){
    BuffetService.createAddressBuffets(dataUser?.['entidade']?.id, {
      id_cidade: idCidade,
      cep: cep,
      bairro: bairro,
      complemento: complemento,
      rua: rua,
      numero: numero,
      estado: estado,
      cidade: cidade,
      contato: " ",
      telefone: phoneBuffet,
      email: "",

      tipo: "C"
    }).then((response)=>{
      setModeAddress('edit')
    }).catch((error)=>{
      console.log(error)
    })
  }

  
  async function EditAddressBuffet(id){
    BuffetService.editAddressBuffets(id, {
      id_cidade: idCidade,
      cep: cep,
      bairro: bairro,
      complemento: complemento,
      rua: rua,
      numero: numero,
      cidade: cidade,
      estado: estado,
      contato: " ",
      telefone: phoneBuffet,
      email: "",
      tipo: "C"
    }).then((response)=>{
      setRua(response?.rua)
      setBairro(response?.bairro)
      setCidade(response?.cidade)
      setNumero(response?.numero)
      setEstado(response?.estado)
      setPhoneBuffet(response?.entidade_endereco?.telefone)
      setCep(response?.cep)
      setIdCidade(response?.id_cidade)
      setAddressBuffet(response?.entidade?.enderecos);
      setIdAddress(response?.id);
    }).catch((error)=>{
      console.log(error)
    })
  }
  



  //CRIAR BUFFET
  function CreateBuffet(e: any){
    e.preventDefault();
    setIsLoading(true);
    BuffetService.createBuffets({
      id_entidade: dataUser['entidade']?.id,
      slug: formatToSlug(dataUser['entidade']?.nome),
      capacidade_total: capacityTotalBuffet,
      area_total: areaTotal,
      sobre: aboutBuffet,
      horario_atendimento: auxHoursWeekBuffetsInit + ' - ' + auxHoursWeekBuffetsEnd,
      horario_atendimento_fds: auxHoursBuffets +  ' - ' + auxHoursBuffetsEnd,
      youtube: youtube,
      status: 'I',
      documento: dataUser['entidade']?.documento,
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
      if(response?.id){
        setIdBuffetLocal(response?.id)
        setIdBuffet(response?.id)
        setDataBuffet(response);
        await CreateDetailsBuffet(response?.id);
        await CreateAddressBuffet();
        await CreateCategoryBuffet(response?.id)
        setMessage('Dados salvos com sucesso.');
        setModeBuffet('edit')
      }
    }).catch((error)=>{
      setMessage('Erro ao salvar dados, tente novamente.');
      console.log(error)
    })
    setIsLoading(false);
  }

  const formatToSlug = (input) => {
    return input
      .toLowerCase() // Converte para minúsculas
      .replace(/\s+/g, '-') // Substitui espaços por hífens
      .replace(/[^\w-]+/g, '') // Remove caracteres especiais
      .replace(/--+/g, '-') // Substitui múltiplos hífens por um único hífen
      .trim(); // Remove espaços em branco no início e no final
  };





  //EDITAR BUFFET
  function EditBuffet(e: any){
    e.preventDefault();
    setIsLoading(true);
    BuffetService.editBuffets(idBuffet, {
      slug: formatToSlug(dataUser['entidade']?.nome),
      capacidade_total: capacityTotalBuffet,
      area_total: areaTotal,
      sobre: aboutBuffet,
      horario_atendimento: auxHoursWeekBuffetsInit+ ' - ' + auxHoursWeekBuffetsEnd,
      horario_atendimento_fds: auxHoursBuffets + ' - ' + auxHoursBuffetsEnd,
      youtube: youtube,
      status: 'A',
      documento: dataUser['entidade']?.documento,
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
      if(response?.id){
        setDataBuffet(response)
        setAreaTotal(response?.area_total);
        setAboutBuffet(response?.sobre);
        setCapacityTotalBuffet(response?.capacidade_total);
        setSlug(response?.slug);
        setHoursWeekInit((response?.horario_atendimento).split(' - ')[0]);
        setHoursWeekEnd((response?.horario_atendimento).split(' - ')[1]);
        setHoursWeekendInit((response?.horario_atendimento_fds).split(' - ')[0])
        setHoursWeekendEnd((response?.horario_atendimento_fds).split(' - ')[1])
        setIdBuffet(response?.id)
        setAddressBuffet(response?.entidade?.enderecos);
        setMessage('Dados salvos com sucesso.')
        setUrlInstagram(response?.entidade?.redesSociais[0]?.descricao)
        setUrlFacebook(response?.entidade?.redesSociais[1]?.descricao);
        setUrlSite(response?.entidade?.redesSociais[2]?.descricao);
        setWhatsBuffet(response?.entidade?.redesSociais[3]?.descricao)
        setPhoneBuffet(response?.entidade?.enderecos[0]?.['endereco']?.telefone)
        setUrlYoutube(response?.entidade?.redesSociais[5]?.descricao)
        await CreateDetailsBuffet(response?.id)
        await CreateCategoryBuffet(response?.id)
        await handleAddress()
      }
    }).catch((error)=>{
      setMessage('Erro ao salvar dados, tente novamente');
    
    })
    setIsLoading(false);
  }

  async function checkAddressExists(buffetId) {
    return BuffetService.getAddressByBuffetId(buffetId)
      .then(response => response)
      .catch(error => {
        console.error('Erro ao verificar endereço do buffet:', error);
        throw error;
      });
  }




  async function handleAddress() {
    try {
      const existingAddress = await checkAddressExists(dataBuffet?.['entidade']['enderecos'][0]?.id_endereco);
      console.log(existingAddress)
      if (existingAddress) {
        await EditAddressBuffet(existingAddress?.id);
        setModeAddress('edit');
      } else {
        await CreateAddressBuffet();
        setModeAddress('create');
      }
    } catch (error) {
      console.error('Erro ao lidar com endereço do buffet:', error);
    }
  }

  //RETORNA OS DADOS DO BUFFET PELO SEU ID
  async function GetBuffetById(){
    BuffetService.showBuffetByIdEntity(dataUser['entidade']?.id)
    .then(async (response) => {
      console.log(response)
      setDataBuffet(response)
      if(response){
        //await handleAddress()
        setModeBuffet('edit')
        setIdAddress(response?.entidade?.enderecos[0].id_endereco);
        setSlug(response?.['slug'])
        setAreaTotal(response?.['area_total']);
        setAboutBuffet(response?.sobre);
        setCapacityTotalBuffet(response?.['capacidade_total']);
        setSlug(response?.slug);
        setAuxHoursWeekBuffetInit((response?.horario_atendimento).split(' - ')[0]);
        setAuxHoursWeekBuffetEnd((response?.horario_atendimento).split(' - ')[1]);
        setAuxHoursBuffet((response?.horario_atendimento_fds).split(' - ')[0])
        setAuxHoursBuffetEnd((response?.horario_atendimento_fds).split(' - ')[1])
        setIdBuffetLocal(response?.id)
        setIdBuffet(response?.id)
        setRua(response?.entidade?.enderecos[0].endereco['rua'])
        setBairro(response?.entidade?.enderecos[0].endereco['bairro'])
        setCidade(response?.entidade?.enderecos[0].endereco['cidade'])
        setNumero(response?.entidade?.enderecos[0].endereco['numero'])
        setCep(response?.entidade?.enderecos[0].endereco.cep)
        setEstado(response?.entidade?.enderecos[0].endereco['estado'])
        setComplemento(response?.entidade?.enderecos[0].endereco?.complemento)
        setIdCidade(response?.entidade?.enderecos[0].endereco.cidade.id)
        setWhatsBuffet(response?.entidade?.redesSociais[3].descricao)
        setAddressBuffet(response?.entidade?.enderecos);
        setTypeSignature(response?.entidade?.assinaturas[0]?.plano?.nome);
        setSelectedCategoria(response?.categorias[0]?.categoria?.id)
        setYoutube(response?.youtube)
        setUrlInstagram(response?.entidade?.redesSociais[0]?.descricao);
        setUrlFacebook(response?.entidade?.redesSociais[1]?.descricao);
        setUrlSite(response?.entidade?.redesSociais[2]?.descricao);
        setPhoneBuffet(response?.entidade?.enderecos[0]['telefone'])
      }else{
        setModeBuffet('create')
      }
    })
    .catch((error) => {
      console.error('Erro ao buscar dados do Buffet:', error);
    });
  }



  


  //RETORNA AS ATRAÇÕES FIXAS CADASTRADAS NO BANCO DE DADOS
  function showAttractionsBuffets(){
    BuffetService.showAttractionBuffets()
    .then((response) => {
      const sortedAttractionsBuffets = response.sort((a, b) => a.nome.localeCompare(b.nome));
      setAttractionsBuffets(sortedAttractionsBuffets);
    })
    .catch((error) => {
      console.error('Erro ao buscar atrações para os Buffets:', error);
    });
  }

  //RETORNA OS SERVIÇOS FIXOS CADASTRADOS NO BANCO DE DADOS
  function showServicesBuffets(){
    BuffetService.showServicesBuffets()
    .then((response) => {
      const sortedServicesBuffets = response.sort((a, b) => a.nome.localeCompare(b.nome));
      setServicesBuffets(sortedServicesBuffets);
    })
    .catch((error) => {
      console.error('Erro ao buscar serviços para os Buffets:', error);
    });
  }


  //RETORNA OS SERVIÇOS FIXOS CADASTRADOS NO BANCO DE DADOS
  function showSecurityBuffets(){
    BuffetService.showSecurityBuffets()
    .then((response) => {
      const sortedSecuritiesBuffets = response.sort((a, b) => a.nome.localeCompare(b.nome));
      setSecurityBuffets(sortedSecuritiesBuffets);

    
    })
    .catch((error) => {
      console.error('Erro ao buscar items de segurança para os Buffets:', error);
    });
  }

  //RETORNA AS CATEGORIAS FIXAAS NO BANCO DE DADOS
  function showCategoriasBuffet(){
    BuffetService.getCategoriasBuffet()
    .then((response) => {
      const sortedCategoriasBuffets = response.sort((a, b) => a.nome.localeCompare(b.nome));
      setCategoriesBuffets(sortedCategoriasBuffets);
    })
    .catch((error) => {
      console.error('Erro ao buscar items de segurança para os Buffets:', error);
    });
  }

  
  //RETORNA OS DETALHES CADASTRADOS PARA O BUFFET PELO SEU ID
  function showDetailsBuffetById() {
    BuffetService.showDetailsBuffetById(idBuffet)
      .then((response) => {
        setDetailsBuffet(response);
        if(response.length === 0){
          setModeDetails('create')
        }else if(response.length > 0){
          setModeDetails('edit')
        }
      })
      .catch((error) => {
        console.error('Erro ao buscar detalhes do Buffet:', error);
      });
  }

  function showCategoriesBuffetById() {
    BuffetService.getCategoriesBuffetsById(idBuffet)
      .then((response) => {
        let vetor: any = [];
        for (const elemento of response) {
          for (const valor of Object.values(elemento)) {
            vetor.push(valor);
          }
        }
        setCategoriesBuffetsById(vetor);
    
      })
      .catch((error) => {
        console.error('Erro ao buscar categorias do Buffet:', error);
      });
  }



 
  


  useEffect(() => {
   
    showAttractionsBuffets();
    showServicesBuffets();
    showSecurityBuffets();
    showCategoriasBuffet();

  }, []);

  useEffect(()=>{
    GetBuffetById();
  }, [])

  useEffect(()=>{
    showDetailsBuffetById();
    showCategoriesBuffetById();
  }, [idBuffet != null])

  useEffect(() => {
    const clearMessages = () => {
      setTimeout(() => {
        setMessage(null);
      }, 3000);
    };

    if (message) {
      clearMessages();
    }
  }, [message]);

 

  useEffect(()=>{
    BuffetService.getAddressByCEP(cep)
    .then((response)=>{

      setRua(response?.logradouro);
      setBairro(response?.bairro);
      setCidade(response?.localidade);
      setEstado(response?.uf);
      setCep(response?.cep)
    }).catch(err=>{
      console.log(err)
    })
  }, [cep])

  
  

  const formatPhoneNumber = (input) => {
    // Remove todos os caracteres não numéricos
    const cleaned = input.replace(/\D/g, '');
  
    // Limita o número de caracteres a 13
    const truncated = cleaned.slice(0, 11);
  
    // Aplica a máscara para formatar o número de telefone
    if (truncated.length === 0) {
      setPhoneBuffet('');
    } else if (truncated.length <= 2) {
      setPhoneBuffet(`(${truncated}`);
    } else if (truncated.length <= 3) {
      setPhoneBuffet(`(${truncated.slice(0, 2)}) ${truncated.slice(2)}`);
    } else if (truncated.length <= 7) {
      setPhoneBuffet(`(${truncated.slice(0, 2)}) ${truncated.slice(2, 3)} ${truncated.slice(3)}`);
    } else {
      setPhoneBuffet(`(${truncated.slice(0, 2)}) ${truncated.slice(2, 3)} ${truncated.slice(3, 7)} ${truncated.slice(7)}`);
    }
  };

  const formatWhatsNumber = (input) => {
    // Remove todos os caracteres não numéricos
    const cleaned = input.replace(/\D/g, '');
  
    // Limita o número de caracteres a 13
    const truncated = cleaned.slice(0, 11);
  
    // Aplica a máscara para formatar o número de telefone
    if (truncated.length === 0) {
      setWhatsBuffet('');
    } else if (truncated.length <= 2) {
      setWhatsBuffet(`(${truncated}`);
    } else if (truncated.length <= 3) {
      setWhatsBuffet(`(${truncated.slice(0, 2)}) ${truncated.slice(2)}`);
    } else if (truncated.length <= 7) {
      setWhatsBuffet(`(${truncated.slice(0, 2)}) ${truncated.slice(2, 3)} ${truncated.slice(3)}`);
    } else {
      setWhatsBuffet(`(${truncated.slice(0, 2)}) ${truncated.slice(2, 3)} ${truncated.slice(3, 7)} ${truncated.slice(7)}`);
    }
  };

  console.log(modeBuffet)

  const isMobile = useResponsive();


  useEffect(() => {
    BuffetService.showSignaturesById(dataUser['entidade'].id)
    .then(res=>{
      let id = res[0]?.tipo
      getSignature(id?.id)
    }).catch(err=>{
      console.log(err)
    })

  }, []);

  function getSignature(id){
    PagBankService.getSignaturesPagBankById(id)
    .then(res=>{
      setTypeSignature(res?.plan?.name)
    }).catch(err=>{
      console.log(err)
    })
  }

  return(
    <Box 
      tag="form"
      onSubmit={modeBuffet === 'create'? CreateBuffet:EditBuffet}
      styleSheet={{
      width: '100%',
      height: 'auto',
      backgroundColor: theme.colors.neutral.x000,
      borderRadius: '8px',
      padding: !isMobile?'2rem': '1rem',
    }}>
       <Text variant="heading4Bold" color={theme.colors.neutral.x999}>Informações do Perfil</Text>
     <Box styleSheet={{display: !isMobile? 'grid': 'flex', flexDirection: isMobile? 'column': 'row', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', marginTop: '1rem'}}>
    
      <Box>
        <Text>Nome</Text>
        <InputDash  placeholder="Digite o nome do Buffet" type="text" defaultValue={dataUser['entidade']?.nome} disabled={true} styleSheet={{backgroundColor: theme.colors.neutral.x200}}/>
      </Box>
       <Box>
        <Text>CNPJ</Text>
        <InputDash placeholder="CNPJ" type="text" defaultValue={dataUser['entidade']?.documento} disabled={true} styleSheet={{backgroundColor: theme.colors.neutral.x200}}/>
       </Box>
       <Box>
       <Box styleSheet={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '5px'}}>
            <Text>Slug</Text>
            <Icon
              name="default_icon" 
              size="sm" 
              fill={theme.colors.secondary.x600}  
              onMouseEnter={(e)=>setHoveredEvent(!hoveredEvent)}
              onMouseLeave={(e) => setHoveredEvent(!hoveredEvent)}
            />
              
          </Box>
        <InputDash 
          placeholder="Digite a slug do Buffet"
          type="text"
          value={formatToSlug(dataUser['entidade']?.nome)} 
          disabled={true} 
          required={true}
          styleSheet={{backgroundColor: theme.colors.neutral.x200}}
        />
       </Box>
     </Box>

     <Box styleSheet={{display: !isMobile? 'grid': 'flex', flexDirection: isMobile? 'column': 'row',gridTemplateColumns: '1fr 3fr 1fr 2fr', gap: '2rem', padding: '2rem 0 0 0'}}>
        <Box>
          <Text>CEP</Text>
          <InputDash placeholder="Digite o CEP" type="text"  onChange={(e)=>setCep(e)} value={cep} />
        </Box>
        <Box>
        <Text>Rua</Text>
          <InputDash placeholder="Digite o nome da rua" type="text" value={rua} disabled={true} styleSheet={{paddingRight: '0'}}/>
        </Box>
        <Box>
          <Text>N°</Text>
          <InputDash placeholder="Digite o número" type="text" value={numero} onChange={(e)=>setNumero(e)} required={true} styleSheet={{paddingRight: '0'}}/>
        </Box>
        <Box>
          <Text>Complemento</Text>
          <InputDash placeholder="Digite um complemento" type="text" value={complemento} onChange={(e)=>setComplemento(e)} styleSheet={{paddingRight: '0'}}/>
        </Box>
     </Box>

     <Box styleSheet={{width: !isMobile? '40%': '100%',display: !isMobile? 'grid': 'flex', flexDirection: isMobile? 'column': 'row', gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', padding: '2rem 0 2rem 0'}}>
        <Box>
          <Text>Bairro</Text>
          <InputDash placeholder="Cidade" type="text" value={bairro} disabled={true}/>
        </Box>
        <Box>
          <Text>Cidade</Text>
          <InputDash placeholder="Cidade" type="text" value={cidade} disabled={true}/>
        </Box>
        <Box>
          <Text>Estado</Text>
          <InputDash placeholder="Estado" type="text" value={estado} disabled={true}/>
        </Box>
     </Box>

     <Text variant="heading4Bold" color={theme.colors.neutral.x999}>Informações Técnicas</Text>

     <Box styleSheet={{
      display: !isMobile? 'grid': 'flex', flexDirection: isMobile? 'column': 'row',

        gridTemplateColumns: 'repeat(4, 1fr)',

        gap: '2rem',
        paddingTop: '1rem'
      }}>
        <Box >
          <Text>Horário Atendimento Semanal (Abre)</Text>
          <SelectHours 
            options={optionsHoursInit} 
            selectedHoursBuffet={auxHoursWeekBuffetsInit}
            setAuxHoursBuffet={setAuxHoursWeekBuffetInit}
          />
          
        </Box>
        <Box >
          <Text>Horário Atendimento Semanal (Fecha)</Text>
          <SelectHours 
            options={optionsHoursInit} 
            selectedHoursBuffet={auxHoursWeekBuffetsEnd}
            setAuxHoursBuffet={setAuxHoursWeekBuffetEnd}
          />
        </Box>

        <Box >
          <Text>Horário Atendimento Fim Semana (Abre)</Text>
            <SelectHours 
            options={optionsHoursInit} 
            selectedHoursBuffet={auxHoursBuffets}
            setAuxHoursBuffet={setAuxHoursBuffet}
            />
        </Box>
        
        <Box >
          <Text>Horário Atendimento Fim Semana (Fecha)</Text>
            <SelectHours 
            options={optionsHoursInit} 
            selectedHoursBuffet={auxHoursBuffetsEnd}
            setAuxHoursBuffet={setAuxHoursBuffetEnd}
            />
        </Box>


      </Box>

     <Box styleSheet={{display: !isMobile? 'grid': 'flex', flexDirection: isMobile? 'column': 'row',gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', padding: '1rem 0 1rem 0', marginTop: '1rem'}}>
        <Box>
          <Text>Categoria do Buffet</Text>
          <Box>
            <SelectWithClickToAddCategory 
              options={categoriesBuffets} 
              selectedCategoriesBuffet={selectedCategoriesBuffet}
              setAuxCategoryBuffets = {setAuxCategoriesBuffet}
            />
          </Box>
        </Box>

        <Box>
          <Text>Capacidade Total</Text>
          <InputDash placeholder="Digite a capacidade Total" type="number" value={capacityTotalBuffet} onChange={setCapacityTotalBuffet} required={true}/>
        </Box>
        <Box>
          <Text>Àrea Total m²</Text>
          <InputDash placeholder="Digite Área total" type="text" value={areaTotal} onChange={setAreaTotal} required={true}/>
        </Box>
        <Box >
          <Text>Telefone</Text>
          <InputDash placeholder="Digite seu telefone" type="text" value={phoneBuffet}  onChange={(e) => formatPhoneNumber(e)} required={true}/>
        </Box>
    
     </Box>
     

     <Box styleSheet={{display: !isMobile? 'grid': 'flex', flexDirection: isMobile? 'column': 'row',gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', padding: '1rem 0 1rem 0'}}>
        {typeSignature === 'Plano Premium' || typeSignature === 'PLANO PREMIUM'? 
        <Box>
          <Text>URL Youtube</Text>
          <InputDash placeholder="Digite a URL do youtube" type="text"  value={youtube} onChange={(e)=>setYoutube(e)} />
        </Box>: ''
        }

        <Box>
          <Text>Instagram</Text>
          <InputDash placeholder="instagram.com/seuperfil" type="text" value={urlInstagram}  onChange={(e) => setUrlInstagram(e)} />
        </Box>

        <Box>
          <Text>Facebook</Text>
          <InputDash placeholder="facebook.com/seuperfil" type="text" value={urlFacebook}  onChange={(e) => setUrlFacebook(e)} />
        </Box>
        <Box>
          <Text>URL Site</Text>
          <InputDash placeholder="www.seusite.com.br" type="text" value={urlSite}  onChange={(e) => setUrlSite(e)} />
        </Box>
     </Box>

     <Box styleSheet={{width:!isMobile? '23.3%': '100%'}}>
          <Text>Whatsapp</Text>
          <InputDash placeholder="XX X XXXXXXXX" type="text" value={whatsBuffet}  onChange={(e) => formatWhatsNumber(e)} />
        </Box>

     <Box styleSheet={{display: !isMobile? 'grid': 'flex', flexDirection: isMobile? 'column': 'row',gridTemplateColumns: '1fr 1fr 1fr', gap: '2rem', padding: '1rem 0 1rem 0'}}>
     <Box>
        <Text variant="heading4Bold" color={theme.colors.neutral.x999} styleSheet={{padding: '1rem 0'}}>Principais comodidades</Text>
        <SelectWithClickToAddAttractives 
          options={attractionsBuffets} 
          selectedAttractivesBuffet={selectedAttractivesBuffet}
          setAuxAttractivesBuffets = {setAuxAttractivesBuffet}
        />
      </Box>
      <Box>
        <Text variant="heading4Bold" color={theme.colors.neutral.x999} styleSheet={{padding: '1rem 0'}}>Serviços oferecidos</Text>
        <SelectWithClickToAddServices
          options={servicesBuffets}
          selectedServicesBuffet={selectedServicesBuffet}
          setAuxServicesBuffets = {setAuxServicesBuffet}
        />
      </Box>
      <Box>
        <Text variant="heading4Bold" color={theme.colors.neutral.x999} styleSheet={{padding: '1rem 0'}}>Segurança</Text>
        <SelectWithClickToAddServices
          options={securityBuffets}
          selectedServicesBuffet={selectedSecurityBuffet}
          setAuxServicesBuffets = {setAuxSecurityBuffet}
        />
      </Box>

     </Box>

      <Box>
        <Text variant="heading4Bold" color={theme.colors.neutral.x999} styleSheet={{padding: '1rem 0'}}>Sobre</Text>
        <InputDash 
          tag="textarea" 
          placeholder="Escreva brevemente a história do buffet" 
          styleSheet={{height: '15rem'}} 
          defaultValue={aboutBuffet} 
          onChange={setAboutBuffet} 
          required={true}
        />
      </Box>
      <Box styleSheet={{
        display: 'flex',
        flexDirection: 'row',
        gap: '2rem',
        justifyContent: 'left',
        alignItems: 'center'
      }}>
        <Button
          type="submit"
          variant="contained"
          
          disabled={isLoading}
          style={{
            backgroundColor: theme.colors.secondary.x500,
            borderRadius: '20px',
            marginTop: '1rem',
            textDecoration: 'capitalize'
          }}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isLoading ? <Text color={theme.colors.neutral.x000}>Salvando...</Text> : <Text  color={theme.colors.neutral.x000}>Salvar</Text>}
        </Button>
        {
          message && <Text styleSheet={{
            color: message === 'Dados salvos com sucesso.'? theme.colors.positive.x700 : theme.colors.negative.x800, marginTop: '1rem'
          }}>{message === 'Dados salvos com sucesso.'? 'Dados salvos com sucesso.':  'Erro ao salvar dados, tente novamente.'}</Text>
        }
       
      </Box>
   
      
    </Box>
  )
}

export default EditPerfil;
