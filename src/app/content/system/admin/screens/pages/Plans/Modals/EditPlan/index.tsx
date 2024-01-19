'use client'

import BuffetService from "@src/app/api/BuffetService";
import PagBankService from "@src/app/api/PagBankService";
import InputDash from "@src/app/components/system/InputDash";
import ModalDashboard from "@src/app/components/system/Modal";
import Box from "@src/app/theme/components/Box/Box";
import Button from "@src/app/theme/components/Button/Button";
import Text from "@src/app/theme/components/Text/Text";
import useResponsive from "@src/app/theme/helpers/useResponsive";
import theme from "@src/app/theme/theme";
import { useEffect, useState } from "react";

const ModalDashboardEditPlans = ({isModalOpenEditPlan, setIsModalOpenEditPlan, plans, setPlans, index, id}) =>{

  const [name, setName] = useState(plans[index].nome ?? '')
  const [monthPrice, setMonthPrice] = useState(plans[index].valor_mensal ?? '')
  const [yearPrice, setYearPrice] = useState(plans[index].valor_anual ?? '')
  const [tags, setTags] = useState(plans[index].tags?.join(',') ?? '')
  const [plansPagBank, setPlansPagBank] = useState([]);

  function saveEdit() {
    const editPlan = {nome: name, valor_mensal: monthPrice, valor_anual: yearPrice, id, tags: tags.split(',')}
    plans[index] = editPlan
    BuffetService.editPlan(editPlan, id)
    editPagBank()
    setPlans(plans)
  }

  function editPagBank(){
    let idid ='';
    if(id == 1){
      idid = "PLAN_C75A95FA-20DA-444C-A98E-E1FEF8EF3168"
    }
    if(id == 2){
      idid = "PLAN_7D16F3C4-4A61-4747-A35E-2196630CA895"
    }
    if(id == 3){
      idid = "PLAN_7EAED016-3CC9-45C9-8FAE-B145B55BA1C3"
    }
    const data = {
        "status": "ACTIVE",
        "name": name,
        "amount": {
            "value": Math.round(monthPrice * 100),
            "currency": "BRL"
        },
        "description": tags
    
    }

   
    PagBankService.editPlanPagBank(idid, data)
    .then(res=>{
      console.log(res)
    })
  }

  useEffect(()=>{
    PagBankService.getPlansPagBank()
    .then(res=>{
      setPlansPagBank(res?.result)
    
    })
  }, [])

  //STANDARD "PLAN_7D16F3C4-4A61-4747-A35E-2196630CA895"
  //BASIC "PLAN_C75A95FA-20DA-444C-A98E-E1FEF8EF3168"
  //PREMIUM "PLAN_7EAED016-3CC9-45C9-8FAE-B145B55BA1C3"

  const isMobile = useResponsive();

  return(
      <ModalDashboard 
        isOpen={isModalOpenEditPlan}
        setIsModalOpen={setIsModalOpenEditPlan}
        styleSheet={{
          width: !isMobile? '790px': '95%',
          height: !isMobile? '470px': 'auto',
          textAlign: 'left'
        }}
      >
        <Text styleSheet={{padding: '.5rem 0', textAlign: 'left'}} variant="heading4Bold">Editar Plano</Text>
        <Box styleSheet={{display: !isMobile? 'grid': 'flex', gridTemplateColumns: '1fr 1fr 1fr', gridTemplateRows: 'repeat(2, 1fr)', justifyContent: 'center', alignItems: 'center', gap: '1rem'}}>
        
        <Box styleSheet={{width: isMobile? '100%': ''}}>
            <Text>Nome</Text>
            <InputDash value={name} onChange={setName} styleSheet={{backgroundColor: theme.colors.neutral.x100}} placeholder="Digite o nome"/>
          </Box>
          <Box styleSheet={{width: isMobile? '100%': ''}}>
            <Text>Valor mensal</Text>
            <InputDash value={monthPrice} onChange={setMonthPrice} styleSheet={{backgroundColor: theme.colors.neutral.x100}} placeholder="Digite o valor mensal"/>
          </Box>
          <Box styleSheet={{width: isMobile? '100%': ''}}>
            <Text>Valor anual</Text>
            <InputDash value={yearPrice} onChange={setYearPrice} styleSheet={{backgroundColor: theme.colors.neutral.x100}} placeholder="Digite o valor anual" type="number" min={0} max={100}/>
          </Box>
          <Box styleSheet={{gridColumn: !isMobile? '1/4': '100%', width: isMobile? '100%': ''}}>
            <Text>Funcionalidades</Text>
            <InputDash value={tags} onChange={setTags} styleSheet={{width: '100%', backgroundColor: theme.colors.neutral.x100}} placeholder="Funcionalidades (separadas por vírgula sem espaço, ex: piscina infantil,jardim)"/>
          </Box>
        </Box>


        <Box styleSheet={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'left', gap: '1rem', marginTop: '1rem'}}>
          <Button styleSheet={{marginTop: '1rem', alignSelf: 'center', width: '132px'}} fullWidth colorVariant="secondary" onClick={() => setIsModalOpenEditPlan(false)}>Não</Button>
          <Button styleSheet={{marginTop: '1rem', alignSelf: 'center', width: '132px'}} fullWidth colorVariant="primary" onClick={() => {saveEdit(), setIsModalOpenEditPlan(false)}}>Sim</Button>
        </Box>
      </ModalDashboard>
  )
}

export default ModalDashboardEditPlans;
