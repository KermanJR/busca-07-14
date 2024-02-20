import Box from "@src/app/theme/components/Box/Box";
import Image from "@src/app/theme/components/Image/Image";
import Text from "@src/app/theme/components/Text/Text";
import useResponsive from "@src/app/theme/helpers/useResponsive";
import { useRouter } from "next/router";
import Logo from '../../public/assets/logo_buffet.svg'
import theme from "@src/app/theme/theme";

export default function Custom405() {
  const router = useRouter()
  const isMobile = useResponsive();
    return (
      !isMobile? 
      <Box styleSheet={{ height: '100vh', display: 'flex', flexDirection: 'row', width: '100%'}}>
        <Box styleSheet={{width: !isMobile? '50%': '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', margin: '0 auto', height: '400px'}}>
       
       <Box styleSheet={{display: 'flex', flexDirection: 'column', textAlign:' center', justifyContent: 'center', marginTop: '-4rem'}}>
          <Box styleSheet={{textAlign: 'center'}}>
            <Image src={Logo.src} alt="" styleSheet={{width: '200px', height: '200px', alignSelf: 'center'}}/>
          </Box>
          <Box>
            <Text tag="h1" styleSheet={{fontSize: '4rem'}}>Erro 404</Text>
          </Box>
          <Box>
            <Text tag="h1"  styleSheet={{marginTop: '4rem', fontSize: '4rem', wordWrap: 'break-word'}}>Página não encontrada</Text>
          </Box>
          <Box styleSheet={{textAlign: 'left', marginTop: '4rem'}}>
            <Text variant="body1" tag="a" onClick={(e)=>router.push('/')} styleSheet={{cursor: 'pointer'}} color={theme.colors.secondary.x500}>Retornar ao site {`>`} </Text>
          </Box>
       </Box>
          
       
        </Box>
      </Box>:
      <div style={{ height: '200vh', display: 'flex', flexDirection: 'row', width: '800px', padding: '1rem'}}>
      <Box styleSheet={{width: !isMobile? '50%': '100%', display: 'flex', flexDirection: 'row', justifyContent: 'center', alignSelf: 'center', margin: '0 auto', height: '400px'}}>
     
     <Box styleSheet={{display: 'flex', flexDirection: 'column', textAlign:' center', justifyContent: 'center', marginTop: '-4rem'}}>
        <Box styleSheet={{textAlign: 'center'}}>
          <Image src={Logo.src} alt="" styleSheet={{width: '200px', height: '200px', alignSelf: 'center'}}/>
        </Box>
        <Box>
          <Text tag="h1" styleSheet={{fontSize: '4rem'}}>Erro 404</Text>
        </Box>
        <Box>
          <Text tag="h1"  styleSheet={{marginTop: '4rem', fontSize: '4rem', wordWrap: 'break-word'}}>Página não encontrada</Text>
        </Box>
        <Box styleSheet={{textAlign: 'left', marginTop: '4rem'}}>
          <Text  tag="a" onClick={(e)=>router.push('/')} styleSheet={{cursor: 'pointer', fontSize: '2rem'}} color={theme.colors.secondary.x500}>Retornar ao site {`>`} </Text>
        </Box>
     </Box>
        
     
      </Box>
    </div>

    )
  }
