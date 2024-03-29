import { useTheme } from "@src/app/theme/ThemeProvider";
import Box from "@src/app/theme/components/Box/Box";
import { useContext, useEffect, useState} from "react";
import Text from "@src/app/theme/components/Text/Text";
import Icon from "@src/app/theme/components/Icon/Icon";
import BackModal from '../../../../../../public/assets/images/fundo-login.jpg';
import Input from "@src/app/theme/components/Input/Input";
import { useRouter } from "next/router";
import { ModalContext } from "@src/app/context/ModalContext";
import ModalRegister from "../HomeScreen/Components/Modals/RegisterModal";
import ModalLogin from "../HomeScreen/Components/Modals/LoginModal";
import useSize from "@src/app/theme/helpers/useSize";
import ModalBudget from "../HomeScreen/Components/Modals/BudgetModal";
import Link from "@src/app/theme/components/Link/Link";
import { UserContext } from "@src/app/context/UserContext";
import useFormatarMoeda from "@src/app/theme/helpers/useFormatarMoeda";
import PagBankService from "@src/app/api/PagBankService";
import BuffetService from "@src/app/api/BuffetService";
import {encryptCardPagSeguro} from "@src/app/api/encryptPagSeguro.js";
import CircularProgress from '@mui/material/CircularProgress';
import LinkSystem from "@src/app/components/system/LinkSystem";
import { Button as BtnMaterial } from '@mui/material';
import Button from "@src/app/theme/components/Button/Button";
import IconVisa from '../../../../../../public/assets/icons/visa.png';
import IconMastercard from '../../../../../../public/assets/icons/mastercard.png';
import Confetti from 'react-confetti';
import useResponsive from "@src/app/theme/helpers/useResponsive";
import moment from "moment";
import { css } from '@emotion/react';
import { CircleLoader, RingLoader, RotateLoader, SyncLoader } from 'react-spinners';
import { FaCheckCircle, FaCheck } from 'react-icons/fa'
import { IoCloseCircleOutline } from 'react-icons/io5'
export default function Checkout(){


  const [userNameBuffet, setUserNameBuffet] = useState('');
  const [valuePlan, setValuePlan] = useState(null);
  const [namePlan, setNamePlan] = useState('');
  const [plansPagBank, setPlansPagBank] = useState([]);
  const [plansAdmin, setPlansAdmin] = useState([]);
  const [idPlano, setIdPlano] = useState(null);

  const [isLoading, setIsLoading] = useState(false);
  const [bandeira, setBandeira] = useState(null);


  //Dados do assinante
  const [nomeAssinante, setNomeAssinante] = useState<string>('');
  const [emailAssinante, setEmailAssinante] = useState<string>('');
  const [documentoAssinante, setDocumentoAssinante] = useState<string>('');
  const [telefoneAssinante, setTelefoneAssinante] = useState<string>('');
  const [dataNascimentoAssinante, setDataNascimentoAssinante] = useState<string>('');
  const [ruaAssinante, setRuaAssinante] = useState('');
  const [numeroAssinante, setNumeroAssinante] = useState('');
  const [complementoAssinante, setComplementoAssinante] = useState('');
  const [localidadeAssinante, setLocalidadeAssinante] = useState('');
  const [cidadeAssinante, setCidadeAssinante] = useState('');
  const [cepAssinante, setCepAssinante] = useState('');
  const [estadoAssinante, setEstadoAssinante] = useState('');
  const [dddAssinante, setDddAssinante] = useState('');



  //Dados do cartão de credito
  const [cypherCard, setCypherCard] = useState('');
  const [numberCard, setNumberCard] = useState('');
  const [cvvCard, setCvvCard] = useState('');
  const [expirationCard, setExpirationCard] = useState('');
  const [storeCard, setStoreCard] = useState('');
  const [nameCard, setNameCard] = useState('');

  //pedido
  const [idPedido, setIdPedido] = useState('');
  const [errorsPedido, setErrorsPedido] = useState([]);
  const [successPedido, setSuccessPedido] = useState(false);


  //Hooks
    const size = useSize();
    const theme = useTheme();
    const formatarMoeda = useFormatarMoeda();
    const router = useRouter();

    const [dataAssinatura, setDataAssinatura] = useState([]);
    const isMobile = useResponsive();
  


    const [loadingCupom, setLoadingCupom] = useState(false);
 

  //Context
    const {
      isNovoModalOpen,
      closeNovoModal,
      isModalOpenBudget,
      closeBudgetModal,
      setModalOpen
    } = useContext(ModalContext)

  
    const {
      setEmail,
      setNome,
      setPassword,
      setDocumento,
      nome,
      email,
      setIdPerfil,
      setRememberMeToken,
      documento,
      password,
      dataUser,
      selectedPlan,
      setDataUser,
      setDataBuffet,
      setSelectedBuffet,
      setDadosCheckout,
      dadosCheckout
    } = useContext(UserContext);

    useEffect(()=>{
      setSelectedBuffet([])
    }, [])

 


    const [response, setResponse] = useState<any>(null);
    const [errors, setErrors] = useState<[]>([]);
    const [errorDocument, setErrorDocument] = useState('');
    const [IDEntidade, setIDEntidade] = useState(null);
 


    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [cupons, setCupons] = useState([]);
    const [cupomValido, setCupomValido] = useState([]);
    const [codCupom, setCodCupom] = useState('');
    const [validateCupom, setValidateCupom] = useState(false);
    const [messageCupom, setMessageCupom] = useState('');
    const [messageErrorSignature, setMessageErrorSignature] = useState('');
    const [messageSucessSignature, setMessageSuccessSignature] = useState('');
    const [showNegationModal, setShowNegationModal] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [valorPlanoBasico, setValorPlanoBasico] = useState(null);
    const [mostrarConfetes, setMostrarConfetes] = useState(true);

    function ConfirmationModal() {
      return (
        <Box
          styleSheet={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Sobreposição escura,
          
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 999, // Garanta que esteja na parte superior
          }}
        >
          {/*mostrarConfetes && <Confetti />*/}
          <Box styleSheet={{
            backgroundColor: 'white',
            borderRadius: '8px',
            height: 'auto',
            width: !isMobile? '50%': '95%',
            padding: '1rem 0',
            background: `URL(${BackModal.src})`,
            backgroundPositionY: '-15rem'
          }}>

         <Button
          type="submit"
          variant="contained"
          onClick={(e)=>setShowConfirmationModal(!showConfirmationModal)}
          styleSheet={{
            backgroundColor: theme.colors.secondary.x500,
            borderRadius: '100%',
            height: '30px',
            width: '25px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: '0rem',
            position: 'relative',
            alignSelf: 'end',
            marginTop: '0rem',
            marginRight: '1rem',
           
          }}
        
        >
          X
        </Button>

        <Text  
          color={theme.colors.neutral.x000}
          styleSheet={{
            fontSize: '2rem',
            fontWeigth: '700',
            width: !isMobile? '80%': '50%',
            margin: '.5rem auto',
            display:' flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            textTransform: 'uppercase',
            lineHeight: isMobile? '45px': '0'
          }}>
            Assinatura Concluída!
            
         </Text>

         <Box 
          styleSheet={{
            backgroundColor: theme.colors.neutral.x000,
            borderRadius: '5px',
             padding: '1rem 2rem 1.5rem 2rem',
             width: '80%',
             margin: '1rem auto'
          }}>

          <Text color={theme.colors.neutral.x999} styleSheet={{padding: '.5rem 0' ,fontSize: '.975rem', fontWeigth: '500', width: '100%'}}>
              Informações do Plano
          </Text>
          <Box tag="ul">
            <Box tag="li"><Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '.5rem'}}><FaCheck color={theme.colors.secondary.x500}/>Nome: {dataAssinatura?.['plan']?.name}</Box></Box>
            <Box tag="li"><Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '.5rem'}}><FaCheck color={theme.colors.secondary.x500}/>Valor: {(dataAssinatura['amount']?.value/100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Box></Box> 
            {
              cupomValido && cupomValido?.['duration']?.['occurrences'] > 1 && <>
               <Box tag="li"><Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '.5rem'}}><FaCheck color={theme.colors.secondary.x500}/>Período gratuito: {new Date(dataAssinatura?.['trial']?.start_at).toLocaleDateString()} à {new Date(dataAssinatura?.['trial']?.end_at).toLocaleDateString()}</Box></Box>
              <Box tag="li"><Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '.5rem'}}><FaCheck color={theme.colors.secondary.x500}/>Cupom Aplicado: {cupomValido?.['name']}, válido para as suas próximas {cupomValido?.['duration']?.['occurrences']} faturas após o período de teste gratuito.</Box></Box>   
              </>
            }

            {
              cupomValido && cupomValido?.['duration']?.['occurrences'] == 1 && <>
               <Box tag="li">Período gratuito: {new Date(dataAssinatura?.['trial']?.start_at).toLocaleDateString()} à {new Date(dataAssinatura?.['trial']?.end_at).toLocaleDateString()}</Box>
              <Box tag="li">Cupom Aplicado: {cupomValido?.['name']}, válido para a sua primeira (1) fatura após o período de teste gratuito.</Box>   
              </>
            }

            {!cupomValido && <>
              <Box tag="li">Período gratuito: {new Date(dataAssinatura?.['trial']?.start_at).toLocaleDateString()} à {new Date(dataAssinatura?.['trial']?.end_at).toLocaleDateString()}</Box>
            </>
            
            }
             
           
          </Box>

        
          <Box tag="li">A cobrança da primera fatura será efetuada após o período de teste.</Box>

          
         </Box>
        
         <Text onClick={(e)=>goToDash(e)} color={theme.colors.secondary.x500} styleSheet={{cursor: 'pointer', textAlign: 'center',marginTop: '1rem', fontSize: '.875rem', fontWeigth: '700', width: '80%', margin: '0rem auto', display:' flex', flexDirection: 'row', height: 'auto',justifyContent: 'center', alignItems: 'center'}}>
              Ir para o dashboard <Text styleSheet={{cursor: 'pointer',fontSize: '1.4rem', marginLeft: '.7rem'}} color={theme.colors.secondary.x500} >{`>`}</Text>
          </Text>
         
         </Box>
        </Box>
        
      );
    }

    function goToDash(e){
      e.preventDefault()
      setTimeout(()=>{
        router.push('/dashboard/buffet')
      }, 1500)
     
    }




    const override = css`
      display: block;
      margin: 0 auto;
    `;

    
   
    
      const formatDocument = (value) => {
        // Remove caracteres não numéricos
        const cleanedValue = value.replace(/\D/g, '');
    
        // Verifica se é um CNPJ ou CPF
        if (cleanedValue.length === 11) {
          // É um CPF, aplica a máscara
          const formattedValue = cleanedValue.replace(
            /(\d{3})(\d{3})(\d{3})(\d{2})/,
            '$1.$2.$3-$4'
          );
          setDocumentoAssinante(formattedValue);
        } else if (cleanedValue.length === 14) {
          // É um CNPJ, aplica a máscara
          const formattedValue = cleanedValue.replace(
            /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
            '$1.$2.$3/$4-$5'
          );
          setDocumentoAssinante(formattedValue);
        } else {
          // Valor inválido, não aplica máscara
          setDocumentoAssinante(cleanedValue);
        }
      }

    

    async function createPaymentPagBank(){
      const partesData = expirationCard.split("/");
      const exp_month = partesData[0];
      const exp_year = partesData[1]; 

      let cypherCard = encryptCardPagSeguro({
        publicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp/dXanZK+XD3aImnF3nAkf5ijDedp9Lk2vnhxosd0BqQ/74PoXmeHU7XLt1Iu+o4OIBf1C12rVGULzl2zjUJDlI0QZp+wmLVEJkauboB7sG0BZzKbp0TlNmgX6VOtJ0/91e826wCkZ13FzOmLG+g1BAFhoLHHP3Cq4zO98yF/pw7k/n+P4QgOyEhUvk2LX4x1eqfo1u7GDPJ5wCJoNB9B4GLIPvAMrWDV/6EGern7EDf6q2ljUPHy2zXXOManf4s7NT2U9YahiCNMbiRVi4aJ8DwjuYKkYDvsVV2xn0eiNkXoqY02p1QtZ+ZyTPRWeJr0enHpEGeXRbdosXPhMk/twIDAQAB",
        number: numberCard,
        holder: nameCard,
        expYear:exp_year,
        expMonth: exp_month,
        securityCode: cvvCard,
      })
      const encrypted = cypherCard?.encryptedCard;
      const hasErrors = cypherCard?.hasErrors;
      const errors = cypherCard?.errors;
      setCypherCard(encrypted)
      return encrypted;
    }

    const formataDataExpiracao = (event) => {
      const inputText = event;
  
      // Remove caracteres não numéricos
      const numericValue = inputText.replace(/\D/g, '');
  
      // Adiciona uma barra após os primeiros dois caracteres
      const formattedValue = numericValue.replace(/(\d{2})(\d{0,4})/, '$1/$2');
  
      // Limita o comprimento total para 7 caracteres
      const truncatedValue = formattedValue.slice(0, 7);
  
      // Atualiza o estado
      setExpirationCard(truncatedValue);
    };



    function converterMoedaParaNumero(valor) {
      valor = valor?.replace('R$', ' ').replace(',', '.');
      const numero = parseFloat(valor);
      const valorEmCentavos = Math.round(numero * 100);
      return valorEmCentavos;
    }
    


    const removeMask = (formattedValue) => {
      // Remove todos os caracteres não numéricos
      return formattedValue.replace(/\D/g, '');
    };

    const cadastrarUsuario = async(resposta) => {
      
        const buffetData: any = {
          nome: dadosCheckout?.['nome'],
          email: dadosCheckout?.['email'],
          password: dadosCheckout?.['password'],
          documento: dadosCheckout?.['documento'],
          id_perfil: 2
        };
        
   
      try{
        BuffetService.createUser(buffetData)
        .then(res => {
      
          res?.messages?.errors ? setErrors( res?.messages?.errors): ''
          if(res.result.status){
            setResponse(res);
            setDataUser(res);
            setModalOpen(false)
            window.localStorage.setItem('ID_ENTITY', res?.result?.entidade?.id);
            window.localStorage.setItem('USER_NAME', res?.result?.entidade?.nome);
            window.localStorage.setItem('USER_TOKEN', res?.token?.token);
            window.localStorage.setItem('USER_ID', res?.result?.user?.id_entidade);
            window.localStorage.setItem('USER_ROLE', res?.result?.user?.id_perfil);
            setIDEntidade(res?.result?.entidade?.id)
            createSignatureBuffet(resposta || dataAssinatura, res?.result?.entidade?.id);
            setSuccess('Cadastro realizado com sucesso!');
       
          }else if(res?.messages?.errors){
            setErrors(res?.messages?.errors);
          }
         
        })
        .catch(err => {
          console.log(err)
        });
       
      }catch(err){
        console.log(err)
      }
        setIsLoading(false)
    };

    function getCurrentDayAndMonth() {
      const currentDate = new Date();
    
      const day = currentDate.getDate().toString().padStart(2, '0'); // Adiciona zero à esquerda se for necessário
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Os meses são baseados em zero, então adicionamos 1
    
      return {
        day: day
      };
    }





  

   async function handleSubmit(e){
      setIsLoading(true)
      e.preventDefault();
      if(cupomValido['id']){
        const data = {
          "plan": {
            "id": window?.localStorage?.getItem('ID_PLAN') == '1' && 'PLAN_C75A95FA-20DA-444C-A98E-E1FEF8EF3168' ||
            window?.localStorage?.getItem('ID_PLAN') == '2' && 'PLAN_7D16F3C4-4A61-4747-A35E-2196630CA895' ||
            window?.localStorage?.getItem('ID_PLAN') == '3' && 'PLAN_7EAED016-3CC9-45C9-8FAE-B145B55BA1C3' 
          },
          "customer": {
            "name": nomeAssinante + '-' + dadosCheckout?.['nome'],
            "email": emailAssinante,
            "tax_id": removeMask(documentoAssinante),
            "billing_info": [
              {
                "type": "CREDIT_CARD",
                "capture": true,
                "card": {
                  "encrypted": await createPaymentPagBank(),
                  "security_code": cvvCard,
                  "store": true
                }
              }
            ],
            "phones": [
                {
                "country": "55",
                "area": dddAssinante,
                "number": removeWhiteSpace(telefoneAssinante)
                }
            ],
          "birth_date": dataNascimentoAssinante,

          },
          
          "coupon":{
            "id": cupomValido?.['id']
          },
          "amount": {
            "currency": "BRL",
            "value": converterMoedaParaNumero(valuePlan)
          },
          "best_invoice_date": getCurrentDayAndMonth(),
          "interval": {
            "unit": "DAY",
          
          },
          "trial": {
            "enabled": true,
            "hold_setup_fee": false,
            "days": 90
          },
          "reference_id": "0005",
          "payment_method": [
            {
              "type": "CREDIT_CARD",
              "card": {
                "encrypted": await createPaymentPagBank(),
                "security_code": cvvCard,
                "store": true
              }
            }
          ]
        }
         
      PagBankService.createCustomerAndSubscription({data})
      .then(async res=>{
        if(res?.error_messages){
          setErrorsPedido(res?.error_messages)
        }
        else {
          if(res?.status === 'TRIAL'){
            setDataAssinatura(res)
            await cadastrarUsuario(res)
            setShowConfirmationModal(true)
            setSuccessPedido(true)
          }
        }
      })
      .catch(err=>{
        console.log(err)
      })
      setTimeout(()=>{
        setIsLoading(false)
      }, 3000)

      }else {
        const data = {
          "plan": {
            "id": window?.localStorage?.getItem('ID_PLAN') == '1' && 'PLAN_C75A95FA-20DA-444C-A98E-E1FEF8EF3168' ||
            window?.localStorage?.getItem('ID_PLAN') == '2' && 'PLAN_7D16F3C4-4A61-4747-A35E-2196630CA895' ||
            window?.localStorage?.getItem('ID_PLAN') == '3' && 'PLAN_7EAED016-3CC9-45C9-8FAE-B145B55BA1C3' 
          },
          "customer": {
            "name": nomeAssinante + '-' +  dadosCheckout?.['nome'],
            "email": emailAssinante,
            "tax_id": removeMask(documentoAssinante),
            "billing_info": [
              {
                "type": "CREDIT_CARD",
                "capture": true,
                "card": {
                  "encrypted": await createPaymentPagBank(),
                  "security_code": cvvCard,
                  "store": true
                }
              }
            ],
            "phones": [
                {
                "country": "55",
                "area": dddAssinante,
                "number": removeWhiteSpace(telefoneAssinante)
                }
            ],
          "birth_date": dataNascimentoAssinante,

          },
          "amount": {
            "currency": "BRL",
            "value": converterMoedaParaNumero(valuePlan)
          },
          "best_invoice_date": getCurrentDayAndMonth(),
          "interval": {
            "unit": "DAY",
          
          },
          "trial": {
            "enabled": true,
            "hold_setup_fee": false,
            "days": 90
          },
          "reference_id": "0005",
          "payment_method": [
            {
              "type": "CREDIT_CARD",
              "card": {
                "encrypted": await createPaymentPagBank(),
                "security_code": cvvCard,
                "store": true
              }
            }
          ]
        }
         
      PagBankService.createCustomerAndSubscription({data})
      .then(async res=>{
        if(res?.error_messages){
          setErrorsPedido(res?.error_messages)
        }
        else {
          if(res?.status === 'TRIAL'){
            setDataAssinatura(res)
            await cadastrarUsuario(res)
            setShowConfirmationModal(true)
            setSuccessPedido(true)
          }
        }
      })
      .catch(err=>{
        console.log(err)
      })
      setTimeout(()=>{
        setIsLoading(false)
      }, 3000)
      }
     
       
    }

    

    const formatPhoneNumber = (input) => {
      // Remove todos os caracteres não numéricos
      const cleaned = input.replace(/\D/g, '');
    
      // Garante que tenha no máximo 9 dígitos
      const truncated = cleaned.slice(0, 9);
    
      // Verifica se há pelo menos 1 dígito para formatar
      if (truncated.length > 0) {
        // Aplica a máscara para formatar o número de telefone
        const formatted = truncated.replace(/(\d{1})(\d{8})/, '$1 $2');
    
        // Define o estado ou faça o que quiser com o número formatado
        setTelefoneAssinante(formatted);
      } else {
        // Se não houver dígitos, define como vazio (ou outra lógica desejada)
        setTelefoneAssinante('');
      }
    };
    const removeWhiteSpace = (input) => {
      return input.replace(/\s/g, '');
    };


    const handleInputChange = (event) => {
      let inputValue = event;
    
      // Remove caracteres não numéricos
      inputValue = inputValue.replace(/\D/g, '');
    
      // Formata a string para mm/aaaa
      setExpirationCard(
        inputValue.length <= 2
          ? inputValue
          : `${inputValue.slice(0, 2)}/${inputValue.slice(2)}`
      );
  
    };

    const formatCreditCardCvv = (input) => {
      const cleaned = input.replace(/\D/g, '');
      const truncated = cleaned.slice(0, 3);
  
      setCvvCard(truncated);
    };

    const detectarBandeira = (numero) => {
      const cleaned = numero.replace(/\D/g, '');
  
      if (/^4/.test(cleaned)) {
        setBandeira('visa');
      } else if (/^5[1-5]/.test(cleaned)) {
        setBandeira('mastercard');
      } else if (/^3[47]/.test(cleaned)) {
        setBandeira('amex');
      } else if (/^6(?:011|5)/.test(cleaned)) {
        setBandeira('discover');
      } else {
        setBandeira(null);
      }
    };

    const formatCreditCardNumber = (input) => {
      // Remove todos os caracteres não numéricos
      const cleaned = input.replace(/\D/g, '');
    
      // Define os padrões de comprimento para Visa e Mastercard
      const visaPattern = /^4\d{12}(\d{3})?$/;
      const mastercardPattern = /^5[1-5]\d{14}$/;
    
      // Verifica se o número atende aos padrões
      if (visaPattern.test(cleaned)) {
        // Formata o número para Visa (por exemplo, adiciona espaços a cada 4 dígitos)
        const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
        return formatted;
      } else if (mastercardPattern.test(cleaned)) {
        // Formata o número para Mastercard (por exemplo, adiciona espaços a cada 4 dígitos)
        const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
        return formatted;
      } else {
        // Se não atender aos padrões, retorna o número original
        return cleaned;
      }
    };



    const handleChangeNumeroCartao = (e) => {
      setNumberCard(e);
      detectarBandeira(e);
    };

    function getCupons(){
      PagBankService.listCuponsPagBank()
      .then(res=>{
        //console.log(res?.coupons)
        setCupons(res?.coupons)
      }).catch(err=>{
        console.log(err)
      })
    }


    function applyCupom() {
      setLoadingCupom(true);
      if(codCupom){
        if (cupons?.length > 0) {
          let resultado = cupons?.find(cupom => cupom?.name === codCupom);
      
          if (resultado) {
            // Obter a data atual
            const dataAtual = moment();
      
            // Obter a data de expiração do cupom
            const dataExpiracaoCupom = moment(resultado.exp_at);
      
            // Verificar se a data atual está antes da data de expiração
            if (dataAtual.isBefore(dataExpiracaoCupom, 'day')) {
              setMessageCupom('Cupom Válido');
              setValidateCupom(true);
              setCupomValido(resultado);
            } else {
              setValidateCupom(false);
              setMessageCupom('Cupom Expirado');
            }
          } else {
            setMessageCupom('Cupom Inválido');
            setValidateCupom(false);
          }
        }
      
      }
      
      setTimeout(() => {
        setLoadingCupom(false);
      }, 1500);
    }
  
  

    useEffect(()=>{
      BuffetService.showPlans()
      .then(res=>{
        let id_plan =  window?.localStorage?.getItem('VALUE_PLAN');
        var valorNumericoString = id_plan.replace(/[^\d,]/g, '');
        var valorNumerico = parseFloat(valorNumericoString.replace(',', '.'));
        setValorPlanoBasico(valorNumerico);
      })
    }, [])


    useEffect(()=>{
      const user = window.localStorage.getItem('USER_NAME');
      const valuePlan = window.localStorage.getItem('VALUE_PLAN');
      const namePlan = window.localStorage.getItem('NAME_PLAN');
      const idPlan = window.localStorage.getItem('ID_PLAN');
      setValuePlan(valuePlan);
      setUserNameBuffet(user);
      setNamePlan(namePlan);
      setIdPlano(Number(idPlan));
      BuffetService.showPlans()
      .then((response)=>{
        setPlansAdmin(response)
      })
      .catch(err=>{
        console.log(err)
      })
    }, [])
    


    useEffect(()=>{
      BuffetService.getAddressByCEP(cepAssinante)
      .then((response)=>{
        setRuaAssinante(response?.logradouro);
        setLocalidadeAssinante(response?.bairro);
        setCidadeAssinante(response?.localidade);
        setEstadoAssinante(response?.uf);
        setCepAssinante(response?.cep)
      }).catch(err=>{
        console.log(err)
      })
    }, [cepAssinante.length === 8])


    useEffect(() => {
      const clearMessages = () => {
        setTimeout(() => {
          setErrorsPedido(null);
        }, 3000);
      };
  
      if (errorsPedido || successPedido) {
        clearMessages();
      }
    }, [errorsPedido, successPedido]);

    async function createSignatureBuffet(data2, id_entidade){
      const data = {
        "tipo": data2,
        "status": 'TRIAL',
        "valor": valorPlanoBasico,
        "desconto": 0,
        "id_plano": Number(localStorage?.getItem('ID_PLAN')),
        "id_entidade":  id_entidade
    }
      PagBankService.createSignatureInBuffet(data)
        .then(res=>{

          setMostrarConfetes(true);
          setTimeout(() => {
            setMostrarConfetes(false);
          }, 3000); 
        }).catch(err=>{
          console.log(err)
        })
    }
  
  
    let name = '';

    useEffect(()=>{
      BuffetService.showBuffetByIdEntity(dataUser['entidade']?.id)
      .then(res=>{
        setDataBuffet(res)
      }).catch(err=>{
        console.log(err)
      })
    }, [])



    if(typeof window !== 'undefined'){
      name = window?.localStorage?.getItem('USER_NAME');
    }

    useEffect(()=>{
      getCupons()
    }, [])

    useEffect(()=>{
      applyCupom()
    }, [codCupom])

  
  

   
   
 
    return(
        <Box tag="main"
            styleSheet={{
            alignItems: 'center',
            margin: '0 auto'
        }}>
        

       {/* Novo modal que será aberto */}
       {isNovoModalOpen &&(
            <ModalLogin isOpen={isNovoModalOpen} onClose={closeNovoModal} />
          )}

          {isModalOpenBudget &&(
            <ModalBudget isOpen={isModalOpenBudget} onClose={closeBudgetModal} />
          )}  
            {showConfirmationModal && <ConfirmationModal />}
            

          <Box styleSheet={{
              display:'flex',
              flexDirection: 'row',
              flexWrap:  size <= 820? 'wrap':'no-wrap',
              margin: '4rem auto',
              width: size <= 820? '100%':'80%',
              gap: '6rem',
              padding: size <= 820? '.5rem':'3rem',
            }}
            tag="form" 
                onSubmit={handleSubmit}
          >

            {/*Primeiro Bloco*/}
            <Box styleSheet={{
              width: size <= 820? '100%':'50%',
            }}>
              <Text variant="heading5semiBold" styleSheet={{textAlign: 'left', padding: '.5rem 0'}} color={theme.colors.primary.x500}>
                Confirme a sua assinatura
              </Text>
              <Text variant="body1" styleSheet={{textAlign: 'left', padding: '.5rem'}} color={theme.colors.neutral.x300}>
                {dadosCheckout?.['nome']}, você selecionou o <Text tag="label" color={theme.colors.primary.x500}>Plano {selectedPlan['nome']? selectedPlan['nome'] : namePlan} !</Text>
              </Text>

              <Box 
                styleSheet={{
                  marginTop: '.5rem',
                  boxShadow: `0px 8px 40px 0px ${theme.colors.neutral.x100}`,
                  borderRadius: '12px',
                  padding: '2rem'
                }}  
              >
                <Box>
                  <Text styleSheet={{paddingBottom: '1.5rem', fontSize: '1rem'}}>Detalhes do Assinante</Text>
                  <Box styleSheet={{
                    display: 'grid',
                    gridTemplateColumns: !isMobile? '1fr 1fr': '1fr',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}>
                    <Box>
                      <Text>Nome</Text>
                      <Input 
                        type="text"
                        disabled={successPedido}
                        required={true}
                        onChange={(e)=>setNomeAssinante(e)}
                        placeholder="Digite seu nome completo"
                        styleSheet={{
                          padding: '.8rem',
                          border: 'none',
                          backgroundColor: theme.colors.neutral.x050,
                          borderRadius: '6px',
                        
                        }}
                      />
                    </Box>
                    <Box>
                      <Text>E-mail</Text>
                      <Input 
                      type="email"
                      required={true}
                      onChange={(e)=>setEmailAssinante(e)}
                      placeholder="Digite seu E-mail"
                      disabled={successPedido}
                      styleSheet={{
                        padding: '.8rem',
                        border: 'none',
                        backgroundColor: theme.colors.neutral.x050,
                        borderRadius: '6px',
                        
                      }}
                    />
                    </Box>
                  </Box>
                </Box>

                <Box styleSheet={{marginTop: '1rem'}}>
                  <Box styleSheet={{
                     display: 'grid',
                     gridTemplateColumns: !isMobile? '1fr 1fr': '1fr',
                     flexWrap: 'wrap',
                     gap: '1rem'
                  }}>
                    <Box>
                      <Text>CPF/CNPJ</Text>
                      <Input 
                      type="text"
                      disabled={successPedido}
                      required={true}
                      value={documentoAssinante}
                      onChange={(e) => formatDocument(e)}
                      placeholder="Digite seu documento"
                      styleSheet={{
                       padding: '.8rem',
                        border: 'none',
                        backgroundColor: theme.colors.neutral.x050,
                        borderRadius: '6px',
                      }}
                    />
                    </Box>

                    <Box>
                      <Text>Data de Nascimento</Text>
                      
                    <input 
                      type="date"
                      required={true}
                      onChange={(e)=>setDataNascimentoAssinante(e.target.value)}
                      disabled={successPedido}
                      style={{
                       padding: '.8rem',
                        border: 'none',
                        backgroundColor: theme.colors.neutral.x050,
                        borderRadius: '6px',
                      }}
                    />
                    </Box>
                    
                  
                  </Box>
                </Box>

                <Box styleSheet={{marginTop: '1rem'}}>
                  <Box styleSheet={{
             
                    gridTemplateColumns: '10% 70%',
                    gap: '1rem',
                    display: !isMobile? 'grid': 'flex', flexDirection: isMobile? 'column': 'row', 
                  }}>
                    
                    <Box>
                      <Text>DDD</Text>
                      
                      <Input 
                        type="text"
                        required={true}
                        disabled={successPedido}
                        onChange={(e)=>setDddAssinante(e)}
                        placeholder="XX"
                        styleSheet={{
                         padding: '.8rem',
                        border: 'none',
                          backgroundColor: theme.colors.neutral.x050,
                          borderRadius: '6px',
                        }}
                      />
                    </Box>

                    
                    <Box>
                      <Text>Telefone</Text>
                      <Input 
                        type="phone"
                        disabled={successPedido}
                        required={true}
                        onChange={(e)=>formatPhoneNumber(e)}
                        value={telefoneAssinante}
                        placeholder="X XXXXXXXX"
                        styleSheet={{
                          width: !isMobile? '70%': '100%',
                         padding: '.8rem',
                        border: 'none',
                          backgroundColor: theme.colors.neutral.x050,
                          borderRadius: '6px',
                        }}
                      />
                    </Box>
                    </Box>
                </Box>
                
              

                

                <Box styleSheet={{paddingTop: '1rem', width: '97%'}}>
                  <Text styleSheet={{padding: '1rem 0',  fontSize: '1.2rem', marginTop:'1rem'}}>Detalhes do Pagamento</Text>
                  <Box styleSheet={{
                    display: 'grid',
                    gap: '0.67rem',
                    gridTemplateColumns: size <= 820? '1fr ':'50% 50%',
                    }}
                  >

                    
                    <Box>
                      <Text>Nome</Text>
                      <Input 
                      type="text"
                      required={true}
                      disabled={successPedido}
                      onChange={(e)=>setNameCard(e)}
                      placeholder="Digite o nome impresso no seu cartão"
                      styleSheet={{
                       padding: '.8rem',
                        border: 'none',
                        backgroundColor: theme.colors.neutral.x050,
                        borderRadius: '6px'
                      }}
                    />
                    </Box>

                    <Box>
                      <Text>N° do cartão</Text>
                      <Input 
                      type="text"
                      required={true}
                      disabled={successPedido}
                      onChange={(e)=>handleChangeNumeroCartao(e)}
                      placeholder="Digite o número do cartão"
                      styleSheet={{
                       padding: '.8rem',
                       paddingLeft: `${bandeira === '' && '' || bandeira === 'mastercard' && '3.5rem'|| bandeira === 'visa' && '3.5rem'}`,
                        border: 'none',
                        borderRadius: '6px',
                        background: `URL(${bandeira === 'mastercard' && IconMastercard.src || bandeira === 'visa' && IconVisa.src || bandeira === '' && ''})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: theme.colors.neutral.x050,
                        backgroundPosition: '5px'
                      }}
                    />
                   
                    </Box>

                    <Box>
                      <Text>Validade</Text>
                      <Input 
                      type="text"
                      onChange={(e)=>handleInputChange(e)}
                      maxLength="7"
                      required={true}
                      disabled={successPedido}
                      placeholder="MM/AAAA"
                      value={expirationCard}
                      styleSheet={{
                       padding: '.8rem',
                        border: 'none',
                        backgroundColor: theme.colors.neutral.x050,
                        borderRadius: '6px'
                      }}
                    />
                    </Box>

                    
                    <Box>
                      <Text>Código de segurança</Text>
                         
                    <Input 
                      type="text"
                      required={true}
                      disabled={successPedido}
                      placeholder="CVV"
                      onChange={(e)=>formatCreditCardCvv(e)}
                      value={cvvCard}
                      styleSheet={{
                       padding: '.8rem',
                        border: 'none',
                        backgroundColor: theme.colors.neutral.x050,
                        borderRadius: '6px'
                      }}
                    />
                    </Box>
                    
                    
               
              </Box>

                </Box>
              </Box>
            </Box>


            {/*Segundo Bloco*/}
            <Box styleSheet={{
              width: size <= 820? '100%':'40%',
             
            }}>
              <Box styleSheet={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: '1rem',
                width: size <= 820? '70%':'50%',
                margin: '2.2rem auto',
                padding: '1rem 0',
                
              }}>
              
             
              </Box>
              <Box
                styleSheet={{
                  marginTop: '.5rem',
                  backgroundColor: theme.colors.primary.x500,
                  borderRadius: '12px',
                  padding: '2rem',
                  
                }}>
                <Text variant="body2" styleSheet={{textAlign: 'left', padding: '.5rem 0'}} color={theme.colors.neutral.x000}>
                Valor da assinatura mensal
                </Text>
                <Text variant="heading2semiBold" styleSheet={{textAlign: 'left', padding: '.5rem 0'}} color={theme.colors.secondary.x700}>
                  { selectedPlan && selectedPlan?.['valor_mensal']? formatarMoeda(selectedPlan?.['valor_mensal']) : valuePlan}
                </Text>
              
                <Box styleSheet={{display: 'flex', flexDirection: 'row'}}>
                <Input 
                    type="text"
                    placeholder="CUPOM DE DESCONTO"
                    onChange={(e)=>setCodCupom(e)}
                    styleSheet={{
                     padding: '.8rem',
                        border: 'none',
                      backgroundColor: theme.colors.neutral.x050,
                      borderRadius: '6px',
                      width: '100%'
                    }}
                  />
                  {loadingCupom &&  codCupom &&  
                    <SyncLoader color="#072D82" loading={true} size={8} style={{display: 'block', margin: '0 auto', position: 'absolute', right: '17.5%', marginTop: '.5rem'}} />
                  }

                  {!loadingCupom && validateCupom && codCupom &&  
                    <FaCheckCircle style={{width: '15px', height: '15px', position: 'absolute', right: '17.5%', marginTop: '.8rem', color:' green'}} fill="green"/>
                  }

                  {!loadingCupom && !validateCupom && codCupom &&  
                    <IoCloseCircleOutline style={{width: '15px', height: '15px', position: 'absolute', right: '17.5%', marginTop: '.8rem', color: 'red'}} fill="red"/>
                  }
                  
                  
                </Box>

                <Box styleSheet={{height: '20px', marginTop: '1rem', borderBottom: !loadingCupom && codCupom? '1px solid #ccc': '', display: 'flex', flexDirection: 'row'}}>
                
           
                {
                    !loadingCupom && !validateCupom && messageCupom == 'Cupom já utilizado por esta conta' &&  codCupom && 
                    <Text color="white" variant="small">Cupom já utilizado por esta conta</Text>
                  }

                  {
                    !loadingCupom && !validateCupom && messageCupom == 'Cupom Expirado' && codCupom && 
                    <Text color="white" variant="small">Cupom Expirado</Text>
                  }

                  {
                    !loadingCupom && !validateCupom && messageCupom == 'Cupom Inválido' && codCupom && 
                    <Text color="white" variant="small">Cupom Inválido</Text>
                  }

                  {
                    !loadingCupom && validateCupom && messageCupom == 'Cupom Válido' && codCupom &&  
                    <Box styleSheet={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                      <Box><Text color="white" variant="small">Cupom Válido</Text></Box>
                     
                      <Box styleSheet={{alignSelf: 'right'}}><Text color="white" variant="small" styleSheet={{textAlign: 'right', alignSelf: 'right'}}>{cupomValido?.['discount']?.value}% OFF</Text></Box>
                    
                    </Box>
                    
                  }
                </Box>
                

                <Text variant="body1" styleSheet={{textAlign: 'left', paddingTop: '1rem',  }} color={theme.colors.neutral.x000}>
                  INFORMAÇÕES DO CARD
                </Text>
              
                  <Box tag="ul" styleSheet={{paddingBottom: '1rem',  }}>
                    {selectedPlan?.['tags']?.map(item=>{
                      return <Box tag="li">
                        <Text color={theme.colors.neutral.x000} styleSheet={{fontWeight: '400'}}>
                          - {item};
                        </Text>
                     </Box>
                    })}
                   
                  </Box>
              
                <Text styleSheet={{color: theme.colors.neutral.x050, fontWeight: '500', }}>A cobrança da primeira fatura será efetuada após o período de teste.</Text>
                <Box styleSheet={{
                  backgroundColor: theme.colors.primary.x600,
                  padding: '1rem',
                  borderRadius: '6px',
                  marginTop: '.5rem',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '.5rem',
                 
                }}>
                  
                  <Icon name="default_icon" fill={theme.colors.neutral.x000}/>
                  <Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '.4rem', flexWrap: 'wrap',   width:  '100%'}}>
                    <Text variant="body1" styleSheet={{textAlign: 'left', flexWrap: 'wrap',  width: '100%'}} color={theme.colors.neutral.x000}>
                      Ao contratar nossos serviços, você concorda com o 
                    </Text>
                    
                    <Link
                        href='/assets/Contrato_de_Intermediacao.pdf'
                        target="_blank"
                        styleSheet={{color: theme.colors.secondary.x800, textDecoration: `underline 1px ${theme.colors.secondary.x700}`}}
                    >
                      Contrato.
                    </Link>
                  </Box>
                </Box>
              </Box>
              <Box styleSheet={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                flexDirection: 'row',
                gap: '2rem'
              }}>
                <BtnMaterial 
                  fullWidth 
                  type="submit"
                  variant="contained"
                  disabled={successPedido}
                  style={{
                    padding: '1rem', 
                    marginTop: '1rem',
                    borderRadius: '10px',
                    backgroundColor: theme.colors.neutral.x050,
                    color: theme.colors.secondary.x500,
                    fontWeight: '600',
                    fontSize: isMobile? '.8rem': '.8rem'
                }}>
                  Cancelar
                </BtnMaterial>
    
                <BtnMaterial 
                  type="submit" 
                  startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                  disabled={successPedido}
                  style={{padding: '20px', marginTop: '1rem',background: theme.colors.secondary.x500, color: 'white', borderRadius: '8px'}}>
                  <Text color="white" styleSheet={{fontSize: isMobile? '.8rem': '.8rem'}}>Concluir assinatura</Text>
                </BtnMaterial>

                {successPedido && <Text onClick={(e)=>router.push('/dashboard/buffet')} color={theme.colors.secondary.x500} styleSheet={{cursor: 'pointer', marginTop: '1rem', fontSize: '.875rem', fontWeigth: '700', width: '80%', margin: '1rem auto', display:' flex', flexDirection: 'row', height: 'auto',justifyContent: 'left', alignItems: 'left'}}>
            Ir para o dashboard <Text styleSheet={{cursor: 'pointer',fontSize: '1.4rem', marginLeft: '.7rem'}} color={theme.colors.secondary.x500} >{`>`}</Text>
         </Text>}
                
              </Box>

            <Box styleSheet={{marginTop: '1.5rem', marginLeft: '1rem'}}>

            {errorsPedido &&
                            errorsPedido?.map((item, index)=>{
                              return(
                                <ul >
                                  <li > 
                                  <Text color="red">
                                    {item?.parameter_name === 'tax_id' &&
                                    item?.description === 'The tax id is too short. It must contain at least 11 digits.'
                                    &&
                                      'Número do documento inválido, verifique e tente novamente.'
                                    }
                                     {item?.parameter_name === 'tax_id' && item?.description === "The customer cannot be created, as there is already a customer registered with the informed tax_ID. Check that the data is correct and try again."
                                      &&
                                      'Documento já utilizado, tente novamente.'
                                    }
                                     {item?.parameter_name === 'tax_id' && item?.description === "The tax id is incorrect. It can not be in blank and it must contain only digits and be a valid tax id."
                                      &&
                                      'Número do documento inválido, verifique e tente novamente.'
                                    }
                                    {item?.parameter_name === 'phones[0].number' && 
                                    item?.description === 'The phone number is incorrect. It must not be in blank and it must contain only digits. Special characters are not accepted.' 
                                    || item?.description === 'The phone number is too long. It must contain 9 digits.' 
                                    &&
     
                                      'Número de telefone inválido'
                                    }
                                   
                                    {item?.parameter_name === 'email' &&
                                      'E-mail já utilizado, tente novamente.'
                                    }
                                   
                                    {item?.parameter_name === 'birth_date' &&
                                      'Data de nascimento inválida, tente novamente.'
                                    }

                                  {item?.parameter_name === 'card' &&
                                      'Dados do cartão inválidos, verifique e tente novamente.'
                                    }

                                    {item?.parameter_name === 'payment_method[0].card.security_code' &&
                                    item?.description === 
                                      'Card security code is invalid. The code must contain at least 3 digits.'
                                      &&
                                      'Dados do cartão inválidos, verifique e tente novamente.'
                                    }
                                    {item?.parameter_name === 'billing_info[0].card.holder'
                                    || item?.parameter_name === 'billing_info[0].card.exp_month'
                                    || item?.parameter_name === 'billing_info[0].card.exp_year'
                                    || item?.parameter_name === 'billing_info[0].card.number'
                                    &&
                                      'Dados do cartão inválidos, verifique e tente novamente.'
                                      }

                                    
                                  </Text>
                                  </li>
                                </ul>
                              )
                            }) 
}
                          
                          
            </Box>
            </Box>

          <Box>

        </Box>
      </Box>
    </Box>
    )

}
