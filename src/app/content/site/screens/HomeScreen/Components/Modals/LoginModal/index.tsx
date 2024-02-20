import { ModalContext } from "@src/app/context/ModalContext";
import { useTheme } from "@src/app/theme/ThemeProvider";
import Box from "@src/app/theme/components/Box/Box";
import Input from "@src/app/theme/components/Input/Input";
import Link from "@src/app/theme/components/Link/Link";
import Text from "@src/app/theme/components/Text/Text";
import { useContext, useEffect, useState } from "react";
import IconPassword from '../../../../../../../../../public/assets/icons/password_svg.jpg'
import IconEmail from '../../../../../../../../../public/assets/icons/email_svg.jpg'
import Image from "@src/app/theme/components/Image/Image";
import GoogleLoginButton from "../../GoogleLoginButton";
import BuffetService from "@src/app/api/BuffetService";
import { UserContext } from "@src/app/context/UserContext";
import { useRouter } from "next/router";
import { Button as BtnMaterial } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Button from "@src/app/theme/components/Button/Button";
import useResponsive from "@src/app/theme/helpers/useResponsive";
export default function ModalLogin({ isOpen, onClose }) {
  const theme = useTheme();
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);


  const {
    openBudgetModal,
    isNovoModalOpen,
    setIsNovoModalOpen,
    openRecoveryPassword
  } = useContext(ModalContext)

  const {
    setEmail,
    setPassword,
    setErrorLogin,
    setSuccessLogin,
    login, 
    errorLogin,
    successLogin,
    dataUser
  } = useContext(UserContext);

  const [error, setError] = useState(false);


  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    setIsLoading(true)
    e.preventDefault();
    let resp = await login();
      setError(false)
      setTimeout(()=>{
        setIsNovoModalOpen(!isNovoModalOpen)
      }, 1000 )
    setIsLoading(false)
  };

  useEffect(() => {
    const clearMessages = () => {
      setTimeout(() => {
        setErrorLogin(null);
        setSuccessLogin(null);
      }, 3000);
    };

    if (errorLogin || successLogin) {
      clearMessages();
    }
  }, [errorLogin, successLogin]);

  const isMobile = useResponsive()

  function redirectToLogin(e){
    e.preventDefault();
    setIsNovoModalOpen(!isNovoModalOpen)
    router.push('/login')
  }

  useEffect(() => {
    const clearMessages = () => {
      setTimeout(() => {
        setError(null);
      }, 3000);
    };

    if (error) {
      clearMessages();
    }
  }, [error]);

 


  return (
    <Box
      styleSheet={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: '120'
      }}
    >
      <Box
        styleSheet={{
          width: isMobile? "100%" : "570px",
          padding: '2rem',
          backgroundColor: theme.colors.neutral.x050,
          borderRadius: '1rem'
        }}
      >
      
      <Button
          onClick={onClose}
          fullWidth={false}
          styleSheet={{
            backgroundColor: theme.colors.secondary.x500,
            borderRadius: '100%',
            height: '30px',
            width: '25px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: '1rem',
            position: 'relative',
            alignSelf: 'end',
            marginTop: '-1rem',
            marginRight: '-1rem',
            boxShadow: '0.5px 1px 3px 1px #969BA0'
          }}
        >
          X
      </Button>
      
        <Box tag="form" styleSheet={{display: 'flex', flexDirection: 'column', gap: '1rem', paddingTop: '1rem'}} onSubmit={handleSubmit}>
          <Box styleSheet={{textAlign: 'center', display: 'flex', flexDirection: 'row', flexWrap: 'wrap',alignSelf: 'center', padding: isMobile? '0 0' :'0 2rem', gap: '.5rem', width:  '100%'}}>
            <Text variant="heading5" styleSheet={{textAlign: 'center', width: '100%'}}>Bem vindo de volta ao</Text>
            <Text  variant="heading4" styleSheet={{fontWeight: 'bold', marginTop: '-.19rem', textAlign: 'center', width: '100%'}}>Busca Buffet !</Text>
          </Box>


          <GoogleLoginButton/>


          <Box styleSheet={{display: 'flex', flexDirection: 'row',  alignContent: 'center', justifyContent: 'center', padding: '0 2rem'}}>
            <Box styleSheet={{borderRadius: '1px', backgroundColor: theme.colors.neutral.x000, padding: '.6rem'}}>
            <Image src={IconEmail.src} alt="" styleSheet={{width: '28px'}}/>
            </Box>
            <Input 
              type="email" 
              placeholder="Insira seu e-mail"
              onChange={(e)=>setEmail(e)}
              required={true}
              styleSheet={{
                width: '100%',
                borderRadius: '1px',
                backgroundColor: theme.colors.neutral.x000,
                padding: '.8rem',
                border: 'none',
              }}
            />
          </Box>
          <Box styleSheet={{display: 'flex', flexDirection: 'row',  alignItems: 'center', justifyContent: 'center', padding: '0 2rem'}}>
            <Box styleSheet={{borderRadius: '1px', backgroundColor: theme.colors.neutral.x000, padding: '.6rem'}}>
            <Image src={IconPassword.src} alt="" styleSheet={{width: '28px'}}/>
            </Box>
            <Input 
              type="password" 
              placeholder="Insira sua senha"
              onChange={(e)=>setPassword(e)}
              required={true}
              styleSheet={{
                width: '100%',
                borderRadius: '1px',
                backgroundColor: theme.colors.neutral.x000,
                padding: '.8rem',
                border: 'none',
                height: '47px'
              }}
            />
          </Box>
          {error ? <Text color='red'>Login inválido</Text>: ''}
          <BtnMaterial
          type="submit"
          variant="contained"
          
          disabled={isLoading}
          style={{
            backgroundColor: theme.colors.secondary.x500,
            borderRadius: '20px'
          }}
          startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
        >
          {isLoading ? <Text color={theme.colors.neutral.x000}>Entrando...</Text> : <Text  color={theme.colors.neutral.x000}>Entrar</Text>}
        </BtnMaterial>
          {errorLogin && (
            <Text color={theme.colors.negative.x700}>{errorLogin}</Text>
          )}
          {successLogin && (
            <Text color={theme.colors.positive.x700}>{successLogin}</Text>
          )}
          <Box styleSheet={{display: 'flex', flexDirection: 'row', justifyContent: 'left', gap: '10px'}}>
            <Text styleSheet={{textAlign: 'left', color: theme.colors.neutral.x999}} variant="body1">Não possui cadastro? </Text>
            <Text styleSheet={{fontWeight: 'bold', color: theme.colors.secondary.x500, cursor: 'pointer'}} onClick={openBudgetModal} > Cadastre-se</Text>
          </Box>
          <Box styleSheet={{display: 'flex', flexDirection: 'row', justifyContent: 'left', gap: '10px'}}>
            <Text styleSheet={{textAlign: 'left', color: theme.colors.neutral.x999}} variant="body1">É um Buffet?</Text>
            <Text styleSheet={{fontWeight: 'bold', color: theme.colors.secondary.x500, cursor: 'pointer'}} onClick={(e)=>redirectToLogin(e)} color="secondary"> Faça Login</Text>
          </Box>
          <Box   styleSheet={{display: 'flex', flexDirection: 'row', gap: '1rem'}}>
            <Text styleSheet={{textAlign: 'left', color: theme.colors.neutral.x999}} variant="body1">Esqueceu sua senha?</Text>
              <Box  styleSheet={{cursor: 'pointer'}}>
                <Text styleSheet={{fontWeight: 'bold', color: theme.colors.secondary.x500, cursor: 'pointer'}} color="secondary"  onClick={openRecoveryPassword}>Redefinir senha</Text>
              </Box>
          </Box>
        

        </Box>
      </Box>
    </Box>
  );
}
