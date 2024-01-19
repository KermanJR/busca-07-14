import { createContext, useContext, useState, ReactNode } from 'react';
import { UserSetters, UserState, UserProviderProps, ExtendedUserContextType } from '../interfaces/userInterface';
import BuffetService from '../api/BuffetService';
import { useRouter } from 'next/router';
import ModalBudget from '../content/site/screens/HomeScreen/Components/Modals/BudgetModal';
import { ModalContext } from './ModalContext';

type UserContextType = UserState & UserSetters & ExtendedUserContextType;

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [nome, setNome] = useState<string>("");
    const [documento, setDocumento] = useState<string>("");
    const [aceitou_termo, setAceitouTermo] = useState<string>("");
    const [destacado, setDestacado] = useState<string>("");
    const [remember_me_token, setRememberMeToken] = useState<string>("");
    const [google_token, setGoogleToken] = useState<string>("");
    const [token_recovery, setTokenRecovery] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [dataUser, setDataUser] = useState<[]>([]);
    const [dataCupons, setDataCupons] = useState<[]>([]);
    const [dataBuffet, setDataBuffet] = useState<[]>([]);
    const [slugBuffet, setSlugBuffet] = useState('');
    const [selectedPlan, setSelectedPlan]= useState<[]>([]);
    const [selectedCity, setSelectedCity]= useState('');
    const [selectedState, setSelectedState]= useState(null);
    const [selectedCategory, setSelectedCategory]= useState<[]>([]);
    const [selectedAttractives, setSelectedAttractives]= useState<[]>([]);
    const [selectedServices, setSelectedServices]= useState<[]>([]);
    const [selectedServicesAndAttractives, setSelectedServicesAndAttractives]= useState<[]>([]);
    const [id_perfil, setIdPerfil] = useState<number>(1);
    const [idBuffet, setIdBuffet] = useState<number>(null);
    const [idEvent, setIdEvent] = useState<number>(null);
    const [buffetsRelacionados, setBuffetsRelacionados] = useState<[]>([])
    const [selectedBuffet, setSelectedBuffet] = useState<[]>([])
    const [dadosCheckout, setDadosCheckout] = useState<[]>([])
const [passouPaginaAnterior, setPassouPaginaAnterior] = useState(false);
const [estaLogado, setEstaLogado] = useState(false);
    const [errorLogin, setErrorLogin] = useState('');
    const [successLogin, setSuccessLogin] = useState('');

    const router = useRouter();

    const {
      setIsNovoModalOpen,
      isNovoModalOpen
    } = useContext(ModalContext)

    let pathname;

    if (typeof window !== 'undefined') {
      pathname = window.location.pathname;
    } else {
      pathname = '/';
    }



    const login = async () => {
      BuffetService.loginUser({
        email, password
      })
        .then(async res => {
          if(res.user){
            if(res?.user?.id_perfil === 1){
              console.log(res)
              window.localStorage.setItem('USER_TOKEN', res?.token?.token);
              window.localStorage.setItem('USER_ID', res?.user?.id_entidade);
              window.localStorage.setItem('USER_ROLE', res?.user?.id_perfil);
              setRememberMeToken(res?.token?.token)
              setDataUser(res)
              setIdPerfil(res?.user?.id_entidade)
              setSuccessLogin('Login Efetuado com sucesso.');
              router.push('/dashboard/admin');
              setIsNovoModalOpen(!isNovoModalOpen)
              
            }
            else if(res?.user?.id_perfil === 3){
              console.log(res)
              window.localStorage.setItem('USER_TOKEN', res?.token?.token);
              window.localStorage.setItem('USER_ID', res?.user?.id_entidade);
              window.localStorage.setItem('USER_ROLE', res?.user?.id_perfil);
              setRememberMeToken(res?.token?.token)
              setDataUser(res)
              setIdPerfil(res?.user?.id_entidade)
              setSuccessLogin('Login Efetuado com sucesso.');
              if(pathname === '/orcamento-por-regiao'){
                if (typeof window !== 'undefined') {
                  window.location.reload()
                } 
                setIsNovoModalOpen(!isNovoModalOpen)
                return false
              }else{
                router.push('/dashboard/cliente')
                setIsNovoModalOpen(!isNovoModalOpen)
                return false
              }
            }else if(res?.user?.id_perfil === 2){
              
              router.push('/login')
              
            }
          }
          return res
        })
        .catch(err => {
          setErrorLogin(err.message)
          return err
        });
      
    };
  
    /*const logout = () => {
      fakeAuthService.logout();
      setUser(null);
      localStorage.removeItem('user'); // Remova o usuário do localStorage
    };*/
  

    return (
        <UserContext.Provider value={{
          passouPaginaAnterior, setPassouPaginaAnterior,
          estaLogado,
          setEstaLogado,
            nome,
            documento,
            aceitou_termo,
            destacado,
            remember_me_token,
            dataBuffet,
            google_token,
            slugBuffet,
            token_recovery,
            email,
            password,
            dataUser,
            selectedCity,
            selectedState,
            id_perfil,
            idBuffet,
            selectedPlan,
            selectedCategory,
            dataCupons, 
            selectedAttractives,
            selectedServices,
            selectedServicesAndAttractives,
            idEvent,
            errorLogin,
            successLogin,
            buffetsRelacionados,
            selectedBuffet,
            dadosCheckout,
            setDadosCheckout,
            setSelectedBuffet,
            setBuffetsRelacionados,
            setErrorLogin,
            setSuccessLogin,
            login, 
            setNome,
            setSelectedCity,
            setSelectedState,
            setIdEvent,
            setSelectedServicesAndAttractives,
            setDataBuffet,
            setSelectedCategory,
            setSlugBuffet,
            setIdBuffet,
            setSelectedAttractives,
            setSelectedServices,
            setDataCupons,
            setSelectedPlan,
            setDataUser,
            setDocumento,
            setAceitouTermo,
            setDestacado,
            setRememberMeToken,
            setGoogleToken,
            setTokenRecovery,
            setEmail,
            setPassword,
            setIdPerfil
        }}>
            {children}
        </UserContext.Provider>
    );
};
