import { useTheme } from "@src/app/theme/ThemeProvider";
import Box from "@src/app/theme/components/Box/Box";
import Button from "@src/app/theme/components/Button/Button";
import Text from "@src/app/theme/components/Text/Text";

import ImageBanner from '../../../../../../../../public/assets/images/banner_singlePage_buffet.webp'
import { useContext } from "react";
import { UserContext } from "@src/app/context/UserContext";
import { useRouter } from "next/router";
import useResponsive from "@src/app/theme/helpers/useResponsive";
import useSize from "@src/app/theme/helpers/useSize";

export default function Banner({data}){

 


    const imagens = data?.galerias;
    const router = useRouter();

    const isMobile = useResponsive()
    const theme = useTheme();
    const size = useSize();


    const {
        idBuffet,
        setIdBuffet,
        selectedBuffet,
        setSelectedBuffet,
    } = useContext(UserContext);

    const handleSubmit = (e, idEntidade)=>{
        e.preventDefault();
        setIdBuffet(idEntidade)
        setSelectedBuffet(data)
        router.push('/orcamento-por-regiao')

    }
 

    const imagemCapa = imagens?.find(imagem => imagem?.arquivo?.tipo === 'capa');

    return(
        <Box tag="div"
            styleSheet={{
                width: '100%',
                height: '430px',
                background: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(https://buscabuffet.com.br/api/uploads/${data?.galerias?.length > 0 && imagemCapa?.arquivo?.nome})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: `${isMobile ? (!(size < 350) ? '2rem' : '3rem'): '6rem'}`,
              marginTop: `${isMobile ? (!(size < 350) ? '4rem' : '3rem'): '5rem'}`,
             
            
          
            }}    
        >     {/* Pseudo-elemento para escurecer o fundo */}
  
            <Box tag="div" 
                styleSheet={{
                    width: '100%',
                    margin: '0 auto',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirectioc: 'column',
                  
                }}
            >
                <Text variant="heading3semiBold"
                    styleSheet={{color: `${theme.colors.neutral.x000}`, fontSize: '2.5rem'}}
                >
                    {data?.entidade?.nome}
                </Text>

                <Text tag="p" variant="body2"
                    styleSheet={{color: `${theme.colors.neutral.x000}`, fontSize: '1.2rem', paddingTop: '1rem'}}
                >
                    Cadastre-se e solicite seu orçamento
                </Text>

                <Button onClick={(e)=>handleSubmit(e, data?.id_entidade)} variant="contained" colorVariant="secondary" size="lg" styleSheet={{margin: '2rem auto'}}>Solicitar orçamento</Button>
            </Box>
        </Box>
    )
}
