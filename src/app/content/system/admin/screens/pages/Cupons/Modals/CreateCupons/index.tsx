'use client'

import BuffetService from "@src/app/api/BuffetService";
import InputDash from "@src/app/components/system/InputDash";
import ModalDashboard from "@src/app/components/system/Modal";
import Box from "@src/app/theme/components/Box/Box";
import Button from "@src/app/theme/components/Button/Button";
import Input from "@src/app/theme/components/Input/Input";
import Text from "@src/app/theme/components/Text/Text";
import theme from "@src/app/theme/theme";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import useResponsive from "@src/app/theme/helpers/useResponsive";
import SelectHours from "@src/app/components/system/SelectHours";
import PagBankService from "@src/app/api/PagBankService";

const ModalDashboardCreateCupons = ({isModalOpenCreateCupom, setIsModalOpenCreateCupom, cupons, setCupons}) =>{
  const [code, setCode] = useState('')
  const [price, setPrice] = useState('')
  const [percentage, setPercentage] = useState('')
  const [description, setDescription] = useState('')
  const [initialDate, setInitialDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [auxHoursWeekBuffetsEnd, setAuxHoursWeekBuffetEnd] = useState('');
  const [auxHoursWeekBuffetsEnd2, setAuxHoursWeekBuffetEnd2] = useState('');
  const [recorrencia, setRecorrencia] = useState('')
  const [nFaturas, setNFaturas] = useState('')

  
  function newCupom(e) {
    e.preventDefault();
    const id = (cupons.at(0)?.id ?? 0) + 1
    const newCupom = {
      codigo: code,
      valor: price,
      porcentagem: percentage,
      descricao: description,
      data_inicio: `${initialDate} 00:00:00`, 
      data_fim: `${endDate} 00:00:00`, 
      dias: 90,
      recorrencia: recorrencia,
      numero_faturas: nFaturas,
      id: id
    }
    //setCupons(cupons)
    BuffetService.addCupom(newCupom)
    cupons.push(Object.assign(newCupom, {id}))
    //getCupons();
    setIsModalOpenCreateCupom(false)
  }

  function newCupomPagBank(e){
    e.preventDefault()
    const data = {
      discount: {
        type: "PERCENT",
        value: percentage
      },
      status: "ACTIVE",
      duration: {
        type: recorrencia == 'Sim'? "REPEATING": 'ONCE',
        occurrences: nFaturas
      },
      name: code,
      description: description,
      exp_at: endDate
    }

    PagBankService.createCupomPagBank(data)
    .then(res=>{
      console.log(res)
    }).catch(err=>{
      console.log(err)
    })
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


  function getCupons(){
    PagBankService.listCuponsPagBank()
    .then(res=>{

      setCupons(res?.coupons)
    })
  }

  useEffect(()=>{
    getCupons()
  }, [])

const isMobile = useResponsive();

  return(
    <ModalDashboard 
    isOpen={isModalOpenCreateCupom}
    setIsModalOpen={setIsModalOpenCreateCupom}
    styleSheet={{
      width: !isMobile? '790px': '95%',
      height: !isMobile? '470px': 'auto',
      textAlign: 'left'
    }}
    >
      <Text styleSheet={{padding: !isMobile? '.5rem 0': '0', textAlign: 'left'}} variant="heading4Bold">Criar Cupom</Text>
      <Box tag="form" onSubmit={newCupomPagBank}>
        <Box styleSheet={{display: !isMobile? 'grid': 'flex', gridTemplateColumns: '1fr 1fr', justifyContent: 'center', alignItems: 'center', gap: '1rem'}}>
          <Box styleSheet={{width: isMobile? '100%': ''}}>
            <Text>Código</Text>
            <InputDash value={code} onChange={setCode} styleSheet={{backgroundColor: theme.colors.neutral.x100}} placeholder="Digite o código" maxLength={12} required={true}/>
          </Box>
          
          <Box styleSheet={{width: isMobile? '100%': ''}}>
              <Text>Porcentagem de Desconto</Text>
              <InputDash value={percentage} onChange={setPercentage} styleSheet={{backgroundColor: theme.colors.neutral.x100}} required={true} placeholder="Digite o valor (%)" type="number" min={0} max={100}/>
            </Box>
          
        </Box>
        <Box styleSheet={{width: '100%', marginTop: '1rem'}}>
            <Text>Descrição</Text>
            <InputDash value={description} onChange={setDescription} styleSheet={{backgroundColor: theme.colors.neutral.x100, width: '100%'}} required={true}  placeholder="Digite a descrição"/>
          </Box>
        <Box styleSheet={{display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: '1rem', justifyContent: 'center', alignItems: 'center', gap: '1rem'}}>
          
          <Box>
            <Text>Expiração</Text>
            <input type="date" value={endDate} onChange={(e)=>setEndDate(e.target.value)} required={true}  style={{
                backgroundColor: theme.colors.neutral.x100,
                border: 'none',
                borderRadius: '6px',
                padding: '1rem'

              }}
            />
          </Box>
          <Box>
            <Text>Recorrência</Text>
            <SelectHours 
              options={optionsYerOrNo} 
              selectedHoursBuffet={recorrencia}
              setAuxHoursBuffet={setRecorrencia}
            />
          </Box>
             
          {recorrencia == 'Sim'&& 
          <Box>
          <Text>Nº Faturas</Text>
          <SelectHours 
            options={optionsFatura} 
            selectedHoursBuffet={nFaturas}
            setAuxHoursBuffet={setNFaturas}
          />
        </Box>
          }
        </Box>

        <Box styleSheet={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'left', gap: '1rem',}}>
          <Button styleSheet={{marginTop: '1rem', alignSelf: 'center', width: '132px'}} fullWidth colorVariant="secondary" onClick={() => setIsModalOpenCreateCupom(false)}>Não</Button>
          <Button styleSheet={{marginTop: '1rem', alignSelf: 'center', width: '132px'}} fullWidth colorVariant="primary" type="submit">Sim</Button>
        </Box>
      </Box>
    </ModalDashboard>
  )
}

export default ModalDashboardCreateCupons;
