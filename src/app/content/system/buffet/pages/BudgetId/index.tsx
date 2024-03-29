
import { useTheme } from "@src/app/theme/ThemeProvider"
import Box from "@src/app/theme/components/Box/Box"
import Text from "@src/app/theme/components/Text/Text";
import { useEffect, useState } from "react";
import BuffetService from "@src/app/api/BuffetService";
import InputDash from "@src/app/components/system/InputDash";
import Button from "@src/app/theme/components/Button/Button";
import moment from "moment-timezone";
import Input from "@src/app/theme/components/Input/Input";
import useResponsive from "@src/app/theme/helpers/useResponsive";
import Select from "@src/app/theme/components/Select/Select";

const BudgetId = ({idEvent}) =>{

  const theme = useTheme();
  const [dataEvent, setDataEvent] = useState([]);
  const [selectedFileBudget, setSelectedFileBudget] = useState('');

  const [dispDataEvento, setDispDataEvento] = useState('');
  const [valorEvento, setValorEvento] = useState(null);
  const [idDocumento, setIdDocumento] = useState(null);
  const [obsEvento, setObsEvento] = useState('');
  const [loading, setLoading] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [disponibilidade, setDisponibilidade] = useState('Sim')

  const handleImageSelectOne = (event) => {
    let file = event.target.files[0];
    setSelectedFileBudget(file);
  };

  
function converterData(dataOriginal) {
  const dataFormatoISO = moment(dataOriginal).format('YYYY-MM-DD');
  const dataConvertida = moment(dataFormatoISO).format('DD/MM/YYYY');
  return dataConvertida;
}

const [formattedValue, setFormattedValue] = useState('');
  const [numericValue, setNumericValue] = useState(null);

  const handleInputChange = (event) => {
    const rawValue = event.replace(/[^\d]/g, ''); // Remove caracteres não numéricos
    const newNumericValue = parseFloat(rawValue) / 100; // Converte centavos para reais
    const newFormattedValue = formatCurrency(newNumericValue);

    setNumericValue(newNumericValue);
    setFormattedValue(newFormattedValue);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };


async function enviarDadosProposta(id: any){
  const data = {
    "nome": dataEvent[0]?.['nome'],
    "observacoes": obsEvento,
    "valor": numericValue,
    "status": String(dataEvent[0]?.['status']),
    "id_entidade": dataEvent[0]?.['entidade']?.id,
    "id_evento": dataEvent[0]?.id,
    "id_arquivo": id,
    "data_disponibilidade": disponibilidade
  }
  BuffetService.sendProposta(data)
}

async function enviarDocumentoProposta(){
  try{
    await BuffetService.postFileBuffet(selectedFileBudget)
    .then(res=>{
      if(res?.id != null || res?.id != '' || res?.id != undefined){

        setIdDocumento(res?.id);
        setSuccess('Orçamento enviado com sucesso.');
        enviarDadosProposta(res?.id);
      }else{
        setError('Falha ao enviar orçamento, tente novamente.')
      }
      
    }).catch(err=>{
      console.log(err)
    })
  }catch(err){
    setError('Falha ao enviar orçamento, tente novamente.')
  }

}

function enviarProposta(e){
  e.preventDefault();
  enviarDocumentoProposta();
}



useEffect(() => {
  const clearMessages = () => {
    setTimeout(() => {
      setError(null);
      setSuccess(null);
    }, 3000);
  };

  if (error || success) {
    clearMessages();
  }
}, [error, success]);



  useEffect(()=>{
    BuffetService.showEventsById(idEvent)
      .then((response)=>{
        setDataEvent(response);
      })
  }, [])

  const options = [
    {
      value: '1',
      label: 'Sim'
    },
    {
      value: '2',
      label: 'Não'
    },
  ]



  function selectDisponibilidade(e){
    if(e == 1){
      setDisponibilidade('Sim')
    }else  if(e == 2){
      setDisponibilidade('Não')
    }

  
  }

 




  const isMobile = useResponsive();

  return(
    <Box styleSheet={{height: '100vh'}}>
      <Box 
        onSubmit={enviarProposta}
        styleSheet={{
        width: '100%',
        height: 'auto',
        marginTop: !isMobile? '2rem': '.5rem',
        padding: !isMobile? '2rem': '1rem',
        borderRadius: '8px',
        display: 'flex',
        backgroundColor: theme.colors.neutral.x000,
        boxShadow: `0px 12px 23px 0px ${theme.colors.neutral.x100}`,
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '.4rem',
      }}
        tag="form"
      >

        <Box styleSheet={{display: !isMobile? 'grid': 'column', gridTemplateColumns: '4fr 1fr 1fr 1fr', gap: '1rem', flexWrap: 'wrap'}}>
          <Box>
            <Text>Nome do evento</Text>
            <InputDash 
              type="text" 
              placeholder="Nome do cliente"
              value={idEvent? dataEvent[0]?.nome : ''}
              disabled={true}
            />  
          </Box>  
          <Box>
            <Text>N° de convidados</Text>
            <InputDash 
              type="text" 
              placeholder="N° de convidades"
              value={idEvent? dataEvent[0]?.['qtd_pessoas'] : ''}
              disabled={true}
            />  
          </Box> 
          <Box>
            <Text>Data do evento</Text>
            <InputDash
             disabled={true}
              type="text"
              value={idEvent? converterData(dataEvent[0]?.['created_at']) : ''} 
            />  
          </Box> 
          <Box>
            <Text>Tipo do evento</Text>
         
               {Array.isArray(dataEvent[0]?.['tipo']) && dataEvent[0]?.['tipo']?.length > 1 ? 
                    dataEvent[0]?.['tipo']?.map((item1, index)=>{
                      return <textarea>{item1}</textarea>
                    })
                    : 
                    <InputDash  value={dataEvent[0]?.['tipo']}/>
                  }
            
 
          </Box>
        </Box>
        
        <Box styleSheet={{marginTop: '2rem'}}>
          <Text>Observações</Text>
          <InputDash 
            tag="textarea" 
            placeholder="Observações da proposta" 
            styleSheet={{height: '205px'}}  
            required={true}
            value={idEvent? dataEvent[0]?.['observacoes'] : ''}
            disabled={true}
          />
        </Box>

        <Text variant="heading4Bold" styleSheet={{marginTop: '2rem', padding: '0 0 1rem 0', flexWrap: 'wrap'}}>Seu Orçamento</Text>
        <Box styleSheet={{display: !isMobile? 'grid': 'column', gridTemplateColumns: '1fr 1fr 3fr', gap: '1rem'}}>
          <Box>
              <Text>Disponibilidade</Text>
              <Select onChange={selectDisponibilidade}  options={options} styleSheet={{
                width: '100%',
                border: 'none',
                backgroundColor: theme.colors.neutral.x050,
                borderRadius: '7px'
              }}/>
               
            </Box>  
            <Box>
              <Text>Valor do orçamento</Text>
              <InputDash 
                type="text" 
                value={formattedValue}
                onChange={(e)=>handleInputChange(e)}
                required={true}
              />  
            </Box> 
            <Box>
              <Text>Arquivo</Text>
              <input 
                type="file" 
                onChange={(e)=>handleImageSelectOne(e)}
                required={true}
              />  
            </Box> 
        </Box>

        <Box styleSheet={{marginTop: '2rem'}}>
          <InputDash 
            tag="textarea" 
            placeholder="Observações do orçamento" 
            styleSheet={{height: '205px'}}  
            required={true}
            onChange={(e)=>setObsEvento(e)}
          />
        </Box>
        <Box styleSheet={{display: 'flex', flexDirection: !isMobile? 'row': 'column', gap: '1rem', alignItems: !isMobile? 'center': 'left',}}>
        <Button colorVariant="secondary" styleSheet={{width: !isMobile?'200px': '100%', marginTop: '1rem'}} type="submit">Enviar orçamento</Button>
                {error && <Text styleSheet={{color: 'red'}}>{error}</Text>}
                {success && <Text styleSheet={{color: 'green'}}>{success}</Text>}
        </Box>
       
      </Box>
      
    </Box>
  )
}

export default BudgetId;
