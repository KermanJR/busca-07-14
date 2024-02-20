
import { dataTable } from "@src/app/components/system/Mockup";
import TableCell from "@src/app/components/system/Table/TableCell";
import TableHead from "@src/app/components/system/Table/TableHead";
import TableRow from "@src/app/components/system/Table/TableRow";
import TableBody from "@src/app/components/system/Table/TableBody";
import { useTheme } from "@src/app/theme/ThemeProvider"
import Box from "@src/app/theme/components/Box/Box"
import Text from "@src/app/theme/components/Text/Text";
import Button from "@src/app/theme/components/Button/Button";
import { useContext, useEffect, useState } from "react";
import ModalDashboardCreateCupons from "./Modals/CreateCupons";
import ModalDashboardEditCupons from "./Modals/EditCupons";
import BuffetService from "@src/app/api/BuffetService";
import { FilterArrows } from "../common/FilterArrows";
import { useFilterFunctions } from "../common/useFilterFunctions";
import { UserContext } from "@src/app/context/UserContext";
import Icon from "@src/app/theme/components/Icon/Icon";
import BoxDash from "@src/app/components/system/BoxDash";
import { MdDelete } from "react-icons/md";
import { FaRegEdit } from "react-icons/fa";
import useResponsive from "@src/app/theme/helpers/useResponsive";
import PagBankService from "@src/app/api/PagBankService";

const Cupons = () =>{

  const theme = useTheme();
  const [isModalOpenEditCupom, setIsModalOpenEditCupom] = useState(false);
  const [isModalOpenNewCupom, setIsModalOpenNewCupom] = useState(false);
  const [cupons, setCupons] = useState<any>([]);
  const [index, setIndex] = useState(0)
  const [id, setId] = useState(0)  
  const [isModalOpenHighlight, setIsModalOpenHighlight] = useState(false)
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const {
    orderByGrowing,
    orderByDescending,
    orderByDateGrowing,
    orderByDateDescending
  } = useFilterFunctions({hook: cupons, setHook: setCupons})

  const {
    setDataCupons,
  } = useContext(UserContext)

 
function DeleteCupom(id_cupom){
  PagBankService.inactiveCupom(id_cupom)
  .then(res=>{
    console.log(res)
    BuffetService.showCupoms()
    .then(res=>{
      setCupons(res)
      setDataCupons(res)
    })
  })
}


  const EventActionPopup = ({item, index}) => (
    
    <Box styleSheet={{ 
      width: '100px',
      height: '40px',
      margin: '0 auto',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'row',
      gap: '8px' ,
      borderRadius: '4px',
      padding: '4px',
      position: 'absolute',
      justifyContent: 'center',
      right: !isMobile? '-5rem': '-2.5rem',
      top: '-2rem',
      backgroundColor: theme.colors.neutral.x000,
      boxShadow: `0px 4px 4px 0px ${theme.colors.neutral.x050}`,
      zIndex: '100'
    }}>
      
        <FaRegEdit  size={20} color={theme.colors.secondary.x500}  onClick={(e)=>{setIndex(index), setId(item?.['id']), setIsModalOpenEditCupom(!isModalOpenEditCupom)}} style={{cursor: 'pointer', textAlign: 'center'}}/>
        <MdDelete  onClick={(e) => DeleteCupom(item['id'])} size={20} color="red" style={{cursor: 'pointer'}}/>
    </Box>
  );

  const isMobile = useResponsive()

  useEffect(()=>{
    PagBankService.listCuponsPagBank()
    .then(res=>{
    
      setCupons(res?.coupons)
      setDataCupons(res?.coupons)
    })
  },[]);

  return(
    <Box styleSheet={{height: 'auto'}}>


      <Box 
        styleSheet={{
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

      {isModalOpenEditCupom &&(
        <ModalDashboardEditCupons isModalOpenEditCupom={isModalOpenEditCupom} setIsModalOpenEditCupom={setIsModalOpenEditCupom} cupons={cupons} setCupons={setCupons} index={index} id={id}/>
        )
      }

      {isModalOpenNewCupom &&(
        <ModalDashboardCreateCupons isModalOpenCreateCupom={isModalOpenNewCupom} setIsModalOpenCreateCupom={setIsModalOpenNewCupom} cupons={cupons} setCupons={setCupons}/>
      )}

      <Box tag="table" styleSheet={{overflowX: isMobile? 'scroll': 'none', width: '100%'}}>
        <TableHead styleSheet={{width: isMobile? 'max-content': "100%"}}>
          {isMobile? 
            <TableRow styleSheet={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <TableCell><p>Código</p></TableCell>
              <TableCell><p>Desconto (%)</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="porcentagem"/></TableCell>
              <TableCell><p>Descrição</p></TableCell>
              <TableCell><p>Recorrente</p></TableCell>
              <TableCell><p>N° Faturas</p></TableCell>
              <TableCell><p>Data Expiração</p> <FilterArrows functionupArrow={orderByDateGrowing} functionDownArrow={orderByDateDescending} property="data_fim"/></TableCell>
              <TableCell><p>Ações</p></TableCell>
            </TableRow>
            :
              <TableRow styleSheet={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
              <TableCell><p>Código</p></TableCell>
              <TableCell><p>Desconto (%)</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="porcentagem"/></TableCell>
              <TableCell><p>Descrição</p></TableCell>
              <TableCell><p>Recorrente</p></TableCell>
              <TableCell><p>N° Faturas</p></TableCell>
              <TableCell><p>Data Expiração</p> <FilterArrows functionupArrow={orderByDateGrowing} functionDownArrow={orderByDateDescending} property="data_fim"/></TableCell>
              <TableCell><p>Ações</p></TableCell>
          </TableRow>}    
        </TableHead>

        <TableBody styleSheet={{width: isMobile? 'max-content': "100%"}}>
            {cupons?.map((item, index)=>(
              isMobile? 
              <TableRow styleSheet={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', justifyContent: 'space-between'}}>
                <TableCell styleSheet={{width: '%'}}>{item?.['name']}</TableCell>
                <TableCell styleSheet={{width: '20%'}}>{`${item?.discount?.value} %`}</TableCell>
                <TableCell styleSheet={{width: '13%'}}>{item?.['description']}</TableCell>
                <TableCell styleSheet={{width: '13%'}}>{item?.duration?.type == 'REPEATING'? 'SIM': 'NÃO'}</TableCell>
                <TableCell styleSheet={{width: '13%'}}>{item?.duration?.occurrences}</TableCell>
                <TableCell  styleSheet={{width: '10%'}}>{item?.['exp_at'].substring(0, 10).split('-').reverse().join('/')}</TableCell>

                <TableCell
              
                >
                 
                 <MdDelete  onClick={(e) => DeleteCupom(item['id'])} size={20} color="red" style={{cursor: 'pointer'}}/>
                  
                </TableCell>
               
              </TableRow>:
              <TableRow key={index} styleSheet={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            
              <TableCell styleSheet={{width: '10%'}}>{item?.['name']}</TableCell>
                <TableCell styleSheet={{width: '10%'}}>{`${item?.discount?.value} %`}</TableCell>
                <TableCell styleSheet={{width: '10%'}}>{item?.['description']}</TableCell>
                <TableCell styleSheet={{width: '10%'}}>{item?.duration?.occurrences}</TableCell>
                <TableCell styleSheet={{width: '10%'}}>{item?.duration?.type == 'REPEATING'? 'SIM': 'NÃO'}</TableCell>
                <TableCell  styleSheet={{width: '15%'}}>{item?.['exp_at'].substring(0, 10).split('-').reverse().join('/')}</TableCell>
                <TableCell
              
              >
               
               <MdDelete  onClick={(e) => DeleteCupom(item['id'])} size={20} color="red" style={{cursor: 'pointer'}}/>
                
              </TableCell>
             
            </TableRow>
               
            ))}
          </TableBody>
        </Box>
          <Button styleSheet={{alignSelf: 'flex-start', width: '132px'}} fullWidth colorVariant="primary" onClick={() => setIsModalOpenNewCupom(true)}>Novo cupom</Button>
      </Box>
    </Box>
  )
}

export default Cupons;
