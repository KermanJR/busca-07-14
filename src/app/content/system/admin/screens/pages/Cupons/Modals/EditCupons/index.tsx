'use client'

import BuffetService from "@src/app/api/BuffetService";
import InputDash from "@src/app/components/system/InputDash";
import ModalDashboard from "@src/app/components/system/Modal";
import SelectHours from "@src/app/components/system/SelectHours";
import Box from "@src/app/theme/components/Box/Box";
import Button from "@src/app/theme/components/Button/Button";
import Text from "@src/app/theme/components/Text/Text";
import useResponsive from "@src/app/theme/helpers/useResponsive";
import theme from "@src/app/theme/theme";
import { useState } from "react";

const ModalDashboardEditCupons = ({isModalOpenEditCupom, setIsModalOpenEditCupom, cupons, setCupons, index, id}) =>{

  const [code, setCode] = useState(cupons[index].codigo ?? '')
  const [price, setPrice] = useState(cupons[index].valor ?? '')
  const [percentage, setPercentage] = useState(cupons[index].porcentagem ?? '')
  const [description, setDescription] = useState(cupons[index].descricao ?? '')
  const [initialDate, setInitialDate] = useState((cupons[index].data_inicio).split('T')[0]?? null)
  const [endDate, setEndDate] = useState((cupons[index].data_fim).split('T')[0]?? null)
  const [auxHoursWeekBuffetsEnd, setAuxHoursWeekBuffetEnd] = useState('');
  const [auxHoursWeekBuffetsEnd2, setAuxHoursWeekBuffetEnd2] = useState('');

  function saveEdit() {
    const editCupom = {
      codigo: code,
      valor: price,
      porcentagem: percentage,
      descricao: description,
      data_inicio: `${initialDate} 00:00:00`, 
      data_fim: `${endDate} 00:00:00`,
      dias: 90,
      id
    }
    cupons[index] = editCupom
    BuffetService.editCupom(editCupom, id)
    setCupons(cupons)
  }

  const optionsYerOrNo = [
    {value: 1,
    label: 'Sim'
  },
  {value: 2,
    label: 'Não'
  }
  ]

  const optionsFatura = [
    {value: 1,
    label: 1
  },
  {value: 2,
    label: 2
  },
  {value: 3,
    label: 3
  },
  {value: 4,
    label: 4
  },
  {value: 5,
    label: 5
  },
  {value: 6,
    label: 6
  },
  {value: 7,
    label: 7
  },
  {value: 8,
    label: 8
  },
  {value: 9,
    label: 9
  },
  {value: 10,
    label: 10
  },
  {value: 11,
    label: 11
  },
  {value: 12,
    label: 12
  }
  ]




  const isMobile = useResponsive()

  return(
      <ModalDashboard 
        isOpen={isModalOpenEditCupom}
        setIsModalOpen={setIsModalOpenEditCupom}
        styleSheet={{
          width: !isMobile? '790px': '95%',
          height: !isMobile? '500px': 'auto',
          textAlign: 'left'
        }}
      >
        <Text styleSheet={{padding: '.5rem 0', textAlign: 'left', marginTop: isMobile? '-1rem': '0'}} variant="heading4Bold">Editar Cupom</Text>
        <Box styleSheet={{display: !isMobile? 'grid': 'flex', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'repeat(2, 1fr)', justifyContent: 'center', alignItems: 'center', gap: '1rem'}}>
        
        <Box styleSheet={{width: isMobile? '100%': ''}}>
            <Text>Código</Text>
            <InputDash value={code} onChange={setCode} styleSheet={{backgroundColor: theme.colors.neutral.x100}} placeholder="Digite o código" maxLength={12}/>
          </Box>
          <Box styleSheet={{width: isMobile? '100%': ''}}>
            <Text>Valor do cupom</Text>
            <InputDash value={price} onChange={setPrice} styleSheet={{backgroundColor: theme.colors.neutral.x100}} placeholder="Digite o valor"/>
          </Box>
          <Box styleSheet={{width: isMobile? '100%': ''}}>
            <Text>Porcentagem de Desconto</Text>
            <InputDash value={percentage} onChange={setPercentage} styleSheet={{backgroundColor: theme.colors.neutral.x100}} placeholder="Digite o valor (%)" type="number" min={0} max={100}/>
          </Box>
          <Box styleSheet={{width: '100%', gridColumn: '1/4'}}>
            <Text>Descrição</Text>
            <InputDash value={description} onChange={setDescription} styleSheet={{backgroundColor: theme.colors.neutral.x100, width: '100%', gridColumns: '0/3'}} placeholder="Digite a descrição"/>
          </Box>
        </Box>
        <Box styleSheet={{display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: '1rem', justifyContent: 'center', alignItems: 'center', gap: '1rem'}}>
          <Box>
            <Text>Validade início</Text>
            <input type="date" value={initialDate}  onChange={(e)=>setInitialDate(e.target.value)}  style={{
              backgroundColor: theme.colors.neutral.x100,
              border: 'none',
              borderRadius: '6px',
              padding: '1rem',

            }}
          />
          
          </Box>
          <Box>
            <Text>Validade Fim</Text>
            <input type="date" value={endDate}  onChange={(e)=>setEndDate(e.target.value)}  style={{
              backgroundColor: theme.colors.neutral.x100,
              border: 'none',
              borderRadius: '6px',
              padding: '1rem',

            }}
          />
            
          </Box>

          <Box>
            <Text>Recorrência</Text>
            <SelectHours 
              options={optionsYerOrNo} 
              selectedHoursBuffet={auxHoursWeekBuffetsEnd}
              setAuxHoursBuffet={setAuxHoursWeekBuffetEnd}
            />
          </Box>
          
          {auxHoursWeekBuffetsEnd == 'Sim'&& 
          <Box>
          <Text>Nº Faturas</Text>
          <SelectHours 
            options={optionsFatura} 
            selectedHoursBuffet={auxHoursWeekBuffetsEnd2}
            setAuxHoursBuffet={setAuxHoursWeekBuffetEnd2}
          />
        </Box>
          }
          
        </Box>

        <Box styleSheet={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'left', gap: '1rem', marginTop: !isMobile? '1rem': '0'}}>
          <Button styleSheet={{marginTop: '1rem', alignSelf: 'center', width: '132px'}} fullWidth colorVariant="primary" onClick={() => setIsModalOpenEditCupom(false)}>Não</Button>
          <Button styleSheet={{marginTop: '1rem', alignSelf: 'center', width: '132px'}} fullWidth colorVariant="secondary" onClick={() => {saveEdit(), setIsModalOpenEditCupom(false)}}>Sim</Button>
        </Box>
      </ModalDashboard>
  )
}

export default ModalDashboardEditCupons;
