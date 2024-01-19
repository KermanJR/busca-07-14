import BoxDash from "@src/app/components/system/BoxDash";
import TableCell from "@src/app/components/system/Table/TableCell";
import TableHead from "@src/app/components/system/Table/TableHead";
import TableRow from "@src/app/components/system/Table/TableRow";
import TableBody from "@src/app/components/system/Table/TableBody";
import { useTheme } from "@src/app/theme/ThemeProvider"
import Box from "@src/app/theme/components/Box/Box"
import Icon from "@src/app/theme/components/Icon/Icon";
import Button from "@src/app/theme/components/Button/Button";
import Text from "@src/app/theme/components/Text/Text";
import { useEffect, useState } from "react";
import ModalDashboardEditPlans from "./Modals/EditPlan";
import BuffetService from "@src/app/api/BuffetService";
import ModalDashboardCreatePlans from "./Modals/CreatePlan";
import { useFilterFunctions } from "../common/useFilterFunctions";
import { FilterArrows } from "../common/FilterArrows";
import PagBankService from "@src/app/api/PagBankService";
import useResponsive from "@src/app/theme/helpers/useResponsive";

const Plans = () =>{

  const theme = useTheme();
  const [isModalOpenNewPlan, setIsModalOpenNewPlan] = useState(false)
  const [isModalOpenEditPlan, setIsModalOpenEditPlan] = useState(false);
  const [plans, setPlans] = useState<any>([])
  const [index, setIndex] = useState(0)
  const [id, setId] = useState(0)

  const {
    orderByGrowing,
    orderByDescending,
    orderByStringGrowing,
    orderByStringDescending
    } = useFilterFunctions({hook: plans, setHook: setPlans})

  useEffect(()=>{
    BuffetService.showPlans().then(res=>{
      setPlans(res)
    })
  },[])

  const isMobile = useResponsive()

  

  return(
    <Box styleSheet={{height: '100vh'}}>
      <Box 
        styleSheet={{
        width: '100%',
        height: 'auto',
        marginTop: !isMobile? '1rem': '0rem',
        padding: !isMobile? '2rem': '1rem',
        borderRadius: '8px',
        display: 'flex',
        backgroundColor: theme.colors.neutral.x000,
        boxShadow: `0px 12px 23px 0px ${theme.colors.neutral.x100}`,
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '.4rem',
       
      }}>

      {isModalOpenNewPlan && (
        <ModalDashboardCreatePlans isModalOpenCreatePlan={isModalOpenNewPlan} setIsModalOpenCreatePlan={setIsModalOpenNewPlan} plans={plans} setPlans={setPlans}/>
      )}

      {isModalOpenEditPlan &&(
          <ModalDashboardEditPlans 
            isModalOpenEditPlan={isModalOpenEditPlan}
            setIsModalOpenEditPlan={setIsModalOpenEditPlan}
            plans={plans}
            setPlans={setPlans}
            index={index} 
            id={id}
          />
        )
      }

      <Box tag="table" styleSheet={{overflowX: isMobile? 'scroll': 'none', width: '100%'}}>
        <TableHead styleSheet={{width: isMobile? 'max-content': "100%"}}>
          {isMobile? 
            <TableRow styleSheet={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <TableCell><p>Nome</p> <FilterArrows functionupArrow={orderByStringGrowing} functionDownArrow={orderByStringDescending} property="nome"/></TableCell>
              <TableCell><p>Valor Mensal</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="valor_mensal"/></TableCell>
              <TableCell><p>Valor Anual</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="valor_anual"/></TableCell>
              <TableCell><p>Funcionalidades</p></TableCell>
              <TableCell><p>Ações</p></TableCell>
            </TableRow>
            :
            <TableRow styleSheet={{display: 'flex', flexDirection: 'row'}}>
              <TableCell><p>Nome</p> <FilterArrows functionupArrow={orderByStringGrowing} functionDownArrow={orderByStringDescending} property="nome"/></TableCell>
              <TableCell><p>Valor Mensal</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="valor_mensal"/></TableCell>
              <TableCell><p>Valor Anual</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="valor_anual"/></TableCell>
              <TableCell><p>Funcionalidades</p></TableCell>
              <TableCell><p>Ações</p></TableCell>
            </TableRow>
          }  
        </TableHead>

        <TableBody styleSheet={{width: isMobile? '640px': "100%",}}>
            {plans.map((item, index)=>(
              isMobile? 
              <TableRow styleSheet={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: '5rem', justifyContent: 'space-around'}}>
                <TableCell styleSheet={{width: '6%',  textAlign: 'left'}}>{item?.['nome']}</TableCell>
                <TableCell styleSheet={{width: '5%', }}>{item?.['valor_mensal']}</TableCell>
                <TableCell styleSheet={{width: '5%', }}>{item?.['valor_anual']}</TableCell>
                <TableCell styleSheet={{width: '5%', }}><div style={{textAlign: 'left'}}>{item['tags']?.reduce((sum, element) => sum += `• ${element}\n`, '')}</div></TableCell>
                <Box onClick={(e)=> {setIndex(index), setId(item?.['id']), setIsModalOpenEditPlan(!isModalOpenEditPlan)}} styleSheet={{cursor: 'pointer'}}>
                  <Text variant="heading5semiBold">...</Text>
                </Box>
              </TableRow>
              :
              <TableRow key={index} styleSheet={{display: 'flex', flexDirection: 'row'}}>
              <TableCell>{item?.['nome']}</TableCell>
              <TableCell>{item?.['valor_mensal']}</TableCell>
              <TableCell>{item?.['valor_anual']}</TableCell>
              <TableCell styleSheet={{width: '15%'}}><div style={{textAlign: 'left'}}>{item['tags']?.reduce((sum, element) => sum += `• ${element}\n`, '')}</div></TableCell>
              <Box onClick={(e)=> {setIndex(index), setId(item?.['id']), setIsModalOpenEditPlan(!isModalOpenEditPlan)}} styleSheet={{cursor: 'pointer'}}>
                <Text variant="heading5semiBold">...</Text>
              </Box>
            </TableRow>
            ))}
          </TableBody>
        </Box>
        {/*<Button styleSheet={{alignSelf: 'flex-start', width: '132px'}} fullWidth colorVariant="primary" onClick={() => setIsModalOpenNewPlan(true)}>Novo Plano</Button>*/}
      </Box>
    </Box>
  )
}

export default Plans;
