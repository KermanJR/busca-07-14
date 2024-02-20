"use client"

import { ModalContext } from "@src/app/context/ModalContext";
import { useTheme } from "@src/app/theme/ThemeProvider";
import Box from "@src/app/theme/components/Box/Box";
import axios from "axios";
import Image from "@src/app/theme/components/Image/Image";
import Input from "@src/app/theme/components/Input/Input";
import Link from "@src/app/theme/components/Link/Link";
import Text from "@src/app/theme/components/Text/Text";
import { useRouter } from "next/router";
import { use, useContext, useEffect, useState } from "react";
import IconPassword from '../../../../../../public/assets/icons/password_svg.jpg'
import IconUser from '../../../../../../public/assets/icons/user_svg.jpg'
import IconEmail from '../../../../../../public/assets/icons/email_svg.jpg'
import IconCnpj from '../../../../../../public/assets/icons/cil_building.jpg'
import { UserContext } from "@src/app/context/UserContext";
import BuffetService from "@src/app/api/BuffetService";
import { BsCheck } from "react-icons/bs";
import useSize from "@src/app/theme/helpers/useSize";
import ModalBudget from "../HomeScreen/Components/Modals/BudgetModal";
import ModalLogin from "../HomeScreen/Components/Modals/LoginModal";
import FundoLogin from '../../../../../../public/assets/images/fundo-login2.jpg';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ModalRecoveryPassword from "../HomeScreen/Components/Modals/RecoveryPassword";
import { CiMail } from "react-icons/ci";
import { CiUser } from "react-icons/ci";
import { IoLockClosedOutline } from "react-icons/io5";
import { BsBuilding } from "react-icons/bs";
export default function RecoveryPassword() {
 
  const [response, setResponse] = useState<any>(null);
  const [errors, setErrors] = useState<[]>([]);
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null);
  const [valorPlanoBasico, setValorPlanoBasico] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
    setDataUser,
    setDataBuffet,
    setDadosCheckout
  } = useContext(UserContext);

  
  
  const theme = useTheme();
  const size = useSize()
  const router = useRouter();

  const [errorEmail, setErrorEmail] = useState('');
  const [errorDocumentDuplicate, setErrorDocumentDuplicate] = useState('');

  const [novaSenha, setNovaSenha] = useState('');
  const [repeteSenha, setRepeteSenha] = useState('');


  
  const {
    isModalOpen,
    closeModal,
    isNovoModalOpen,
    closeNovoModal,
    closeBudgetModal,
    isModalOpenBudget,
    isModalRecoveryPassword,
    closeRecoveryPassword,
    openRecoveryPassword,
    setModalOpen
  } = useContext(ModalContext)

  const { query } = useRouter();

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let buffetData: any = {
      email: query?.email,
      token: novaSenha,
      password: novaSenha,
    };

    if(query?.token && query?.email){
      if(novaSenha == repeteSenha){
        BuffetService.resetPassword(buffetData)
        .then(res=>{
          if(res?.message == 'Link expirado'){
            setError('Link expirado, por favor, faça a recuperação de senha novamente.')
          }else{
            setSuccess('Senha alterada com sucesso!')
            setTimeout(()=>{
              router.push('/')
            }, 1000)
          }
        }).catch(err=>{
          setError('Link expirado, por favor, faça a recuperação de senha novamente.')
        })
      }else if(novaSenha != repeteSenha){
        setError('Erro na confirmação da senha.')
      }
    }else{
      setError('Link expirado, por favor, faça a recuperação de senha novamente.')
    }

  };

 




  const removeMask = (formattedCNPJ) => {
    // Remove todos os caracteres não numéricos
    return formattedCNPJ.replace(/\D/g, '');
  };

  const {
    setSelectedBuffet
  } = useContext(UserContext);

  useEffect(()=>{
    setSelectedBuffet([])
  }, [])

  useEffect(()=>{
    typeof window != 'undefined'? window.localStorage.setItem('USER_ROLE', '2'): ''
    BuffetService.showPlans()
    .then(res=>{
      setValorPlanoBasico(res[0].valor_mensal)
    
    })
  }, [])

  useEffect(() => {
    const clearMessages = () => {
      setTimeout(() => {
        setErrors(null);
        setError('')
        setSuccess('')
        setErrorDocumentDuplicate('')
        setErrorEmail('')
      }, 3000);
    };

    if (errors || success || error || errorDocumentDuplicate || errorEmail) {
      clearMessages();
    }
  }, [errors, success, error, errorDocumentDuplicate, errorEmail]);

  return (
    <Box styleSheet={{ 
    backgroundColor:theme.colors.neutral.x050, 
    display: 'flex', 
     flexWrap: 'wrap', 
     flexDirection: 'row', 
     justifyContent: 'center',
      gap: (size < 910) && '30px', paddingTop: !(size < 910) ? '90px' : '60px', height: size <= 800 ? 'auto' : '80vh'}}>
       {/* Novo modal que será aberto */}
       {isNovoModalOpen &&(
            <ModalLogin isOpen={isNovoModalOpen} onClose={closeNovoModal} />
          )}

          {isModalOpenBudget &&(
            <ModalBudget isOpen={isModalOpenBudget} onClose={closeBudgetModal} />
          )}  
          {isModalRecoveryPassword &&(
            <ModalRecoveryPassword isOpen={isModalRecoveryPassword} onClose={closeRecoveryPassword} />
          )} 
      <Box styleSheet={{
        display: 'flex',
        width: size <= 800 ? '100%' : '50%',
        flexDirection: 'column',
        gap: (!(size < 1230) ? '15%' : !(size < 910) ? '5%' : '20px'),
        marginLeft: (!(size < 1230) ? '0' : '0px'),
        padding: (!(size < 1230) ? '7rem' : !(size < 410) ? '50px 30px' : '30px 0px'),
        backgroundImage: `URL(${FundoLogin.src})`,
        backgroundSize: 'cover 100% 100%',
        
      }}>
        <Text tag={!(size < 1230) ? "h3" : 'h5'} variant={!(size < 1230) ? "heading3semiBold" : "heading5semiBold"} color="#fff" styleSheet={{textAlign: 'center'}}>EXPERIMENTE GRÁTIS POR 90 DIAS</Text>
        <ul>
          <li style={{display: 'flex', width: 'auto', alignItems: 'center'}}>
            <BsCheck style={{display: 'inline-block', width: !(size < 350) ? '50px' : '30px', fill: theme.colors.secondary.x500}}/>
            <p style={{width: 'auto', fontWeight: !(size < 1230) ? 'bold' : '500', color: '#fff', fontSize: (size < 350) && '0.6rem'}}>Sua empresa em evidência.</p>
          </li>
          <li style={{display: 'flex', alignItems: 'center'}}>
            <BsCheck style={{display: 'inline-block', width: !(size < 350) ? '50px' : '30px', fill: theme.colors.secondary.x500}}/>
            <p style={{width: 'auto', fontWeight: !(size < 1230) ? 'bold' : '500', color: '#fff', fontSize: (size < 350) && '0.6rem'}}>Receba solicitações de orçamento.</p>
          </li>
          <li style={{display: 'flex', alignItems: 'center'}}>
            <BsCheck style={{display: 'inline-block', width: !(size < 350) ? '50px' : '30px', fill: theme.colors.secondary.x500}}/>
            <p style={{width: 'auto', fontWeight: !(size < 1230) ? 'bold' : '500', color: '#fff', fontSize: (size < 350) && '0.6rem'}}>Plataforma intuitiva para gestão dos clientes.</p>
          </li>
          <li style={{display: 'flex', alignItems: 'center'}}>
            <BsCheck style={{display: 'inline-block', width: !(size < 350) ? '50px' : '30px', fill: theme.colors.secondary.x500}}/>
            <p style={{width: 'auto', fontWeight: !(size < 1230) ? 'bold' : '500', color: '#fff', fontSize: (size < 350) && '0.6rem'}}>Perfil exclusivo para sua empresa.</p>
          </li>
          <li style={{display: 'flex', alignItems: 'center'}}>
            <BsCheck style={{display: 'inline-block', width: !(size < 350) ? '50px' : '30px', fill: theme.colors.secondary.x500}}/>
            <p style={{width: 'auto', fontWeight: !(size < 1230) ? 'bold' : '500', color: '#fff', fontSize: (size < 350) && '0.6rem'}}>Cancele quando quiser, sem multa.</p>
          </li>
        </ul>
      </Box>

      <Box
        styleSheet={{
          marginTop: size <= 800 ? '0' : '2.5rem',
          marginBottom: size <= 800 ? '-5rem' : '0',
          padding: size <= 800 ? '3rem .8rem' : '1rem',
          height: size <= 800 ? '110vh' : '75vh', 
          width: size <= 800 ? '100%' : '50%',
          backgroundColor: theme.colors.neutral.x050,
        
        }}
      >
        <Box tag="form" styleSheet={{display: 'flex', flexDirection: 'column', gap: '0.7rem', width: '100%',
         padding:  size <= 1366 && '0rem 3rem' || size >= 1366 && '4rem 20%' }} onSubmit={handleSubmit}>
          <Box styleSheet={{textAlign: 'center', display: 'flex', flexDirection: 'column', alignSelf: 'center', padding: '0', width: '100%'}}>
            <Text variant="heading3semiBold">Criar nova senha</Text>
          </Box>

          <Box>
            <span style={{display: 'inline-block', width: '50%', height: '3px', margin: '10px auto', backgroundColor: '#EA760A88'}}></span>
          </Box>

          <Box styleSheet={{display: 'flex', flexDirection: 'row',  alignContent: 'center', justifyContent: 'center', padding: '0 2rem'}}>
            <Box styleSheet={{borderRadius: '1px', backgroundColor: theme.colors.neutral.x000, padding: '.585rem'}}>
            <CiMail fill={theme.colors.secondary.x500} size={22}/>
            </Box>
            <Input 
              type="text" 
              required={true}
              placeholder="Insira seu e-mail"
              onChange={(e)=>setEmail(e)}
              value={String(query?.email)}
              disabled={true}
              styleSheet={{
                width: '100%',
                borderRadius: '1px',
                backgroundColor: theme.colors.neutral.x000,
                padding: size <= 1366 ?  '1.25999rem':'.5rem .8rem',
                height: size <= 1366 ?  '25px':'auto',
                border: 'none'
              }}
            />
          </Box>
          
          <Box styleSheet={{display: 'flex', flexDirection: 'row',  alignContent: 'center', justifyContent: 'center', padding: '0 2rem'}}>
          <Box styleSheet={{borderRadius: '1px', backgroundColor: theme.colors.neutral.x000, padding: '.6rem'}}>
            <IoLockClosedOutline  color={theme.colors.secondary.x500} fill={theme.colors.secondary.x500} size={22}/>
            </Box>
            <Input 
              type="password" 
              required={true}
              placeholder="Nova senha"
              onChange={(e)=>setNovaSenha(e)}
              value={novaSenha}
              styleSheet={{
                width: '100%',
                borderRadius: '1px',
                backgroundColor: theme.colors.neutral.x000,
                padding: size <= 1366 ?  '1.25999rem':'.5rem .8rem',
                border: 'none',
                height: size <= 1366 ?  '25px':'auto',
                filter: 'dropShadow(0px 8px 40px rgba(0, 0, 0, 0.05))'
              }}
            />
          </Box>

          <Box styleSheet={{display: 'flex', flexDirection: 'row',  alignContent: 'center', justifyContent: 'center', padding: '0 2rem'}}>
            <Box styleSheet={{borderRadius: '1px', backgroundColor: theme.colors.neutral.x000, padding: '.6rem'}}>
            <IoLockClosedOutline  color={theme.colors.secondary.x500} fill={theme.colors.secondary.x500} size={22}/>
            </Box>
            <Input 
              type="password" 
              required={true}
              placeholder="Confirme a senha"
              onChange={(e)=>setRepeteSenha(e)}
              value={repeteSenha}
              styleSheet={{
                width: '100%',
                borderRadius: '1px',
                backgroundColor: theme.colors.neutral.x000,
                padding: size <= 1366 ?  '1.25999rem':'.5rem .8rem',
                height: size <= 1366 ?  '25px':'auto',
                border: 'none'
              }}
            />
          </Box>
        


          <Button
          type="submit"
          variant="contained"
          
          disabled={isLoading}
          style={{
            backgroundColor: theme.colors.secondary.x500,
            borderRadius: '20px'
          }}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isLoading ? <Text color={theme.colors.neutral.x000}>Enviando...</Text> : <Text  color={theme.colors.neutral.x000}>Enviar</Text>}
        </Button>

          
          <Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
            <Text styleSheet={{textAlign: 'left', color: theme.colors.neutral.x999}} variant="body1">Você tem uma conta?</Text>
            <Box styleSheet={{cursor: 'pointer'}}>
              <Text styleSheet={{color: theme.colors.secondary.x500}} onClick={(e)=>router.push('/login')}>Entrar</Text>
            </Box>
          </Box>
          <Box  onClick={openRecoveryPassword} styleSheet={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
            <Text styleSheet={{textAlign: 'left', color: theme.colors.neutral.x999}} variant="body1">Esqueceu sua senha?</Text>
              <Box  styleSheet={{cursor: 'pointer'}}>
                <Text styleSheet={{color: theme.colors.secondary.x500}}>Redefinir senha</Text>
              </Box>
          </Box>
          


        {error &&   <Text color="red" styleSheet={{fontWeight: '400', fontSize: '.875rem'}}>{error}</Text>}
    
        {success && (
             <Text color="green">{success}</Text>
         )}
        </Box>
        
      </Box>
     
    </Box>
  )
}
