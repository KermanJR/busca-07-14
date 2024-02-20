'use client'

import { dataTable } from "@src/app/components/system/Mockup";
import TableCell from "@src/app/components/system/Table/TableCell";
import TableHead from "@src/app/components/system/Table/TableHead";
import TableRow from "@src/app/components/system/Table/TableRow";
import TableBody from "@src/app/components/system/Table/TableBody";
import { useTheme } from "@src/app/theme/ThemeProvider"
import Box from "@src/app/theme/components/Box/Box"
import Text from "@src/app/theme/components/Text/Text";
import Pagination from "@src/app/components/system/Pagination";
import { useEffect, useState } from "react";
import BuffetService from "@src/app/api/BuffetService";
import { FilterArrows } from "../common/FilterArrows";
import { useFilterFunctions } from "../common/useFilterFunctions";
import PagBankService from "@src/app/api/PagBankService";
import useResponsive from "@src/app/theme/helpers/useResponsive";
import BoxDash from "@src/app/components/system/BoxDash";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Input from "@src/app/theme/components/Input/Input";
import { BounceLoader } from "react-spinners";
import Notification from "./Notifications";

const Users = () =>{

  const theme = useTheme();

  const [signatures, setSignatures] = useState<any>([])
  const [viewElements, setViewElements] = useState(0)
  const [currentPage, setCurrentPage] = useState(1);
  const elementsPerPage = 5; // Define o número de elementos por página
  const [assinaturasPagBank, setAssinaturasPagBank] = useState([]);
  const [viewPayments, setViewPayments] = useState<any>([])
  const {
    orderByGrowing,
    orderByDescending,
    orderByDateGrowing,
    orderByDateDescending,
    orderByStringGrowing,
    orderByStringDescending
    } = useFilterFunctions({hook: signatures, setHook: setSignatures})

    useEffect(() => {
      if (typeof window != 'undefined') {
        Promise.all([BuffetService.showBuffets(), BuffetService.showSignatures(), BuffetService.totalProposal(), BuffetService.totalUsers()]).then((result) => {
        setViewPayments(result[1])
      })
      }
    }, [])

    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

    function calcularDataExpiracao(dataString) {
      // Verifica se a dataString é fornecida
      if (!dataString) {
        return 'Data inválida';
      }
    
      // Converte a string para um objeto Date
      const dataOriginal = new Date(dataString);
    
      // Verifica se a conversão foi bem-sucedida
      if (isNaN(dataOriginal.getTime())) {
        return 'Data inválida';
      }
    
      // Adiciona 90 dias à data original
      const dataExpiracao = new Date(dataOriginal);
      dataExpiracao.setDate(dataOriginal.getDate() + 90);
    
      // Formata a nova data para o formato DD/MM/AAAA
      const dia = String(dataExpiracao.getDate()).padStart(2, '0');
      const mes = String(dataExpiracao.getMonth() + 1).padStart(2, '0');
      const ano = dataExpiracao.getFullYear();
    
      return `${dia}/${mes}/${ano}`;
    }

   

    const [index, setIndex] = useState(0)

    const [booleanDelete, setBooleanDelete] = useState(false)

      
    function DeleteUser(id_cupom){
      BuffetService.deleteUser(id_cupom)
      .then(res=>{
        BuffetService.showUsers()
        .then(res=>{
          setBooleanDelete(true)
          setSignatures(res)
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
        
         
          <MdDelete  onClick={(e) => DeleteUser(item['id'])} size={20} color="red" style={{cursor: 'pointer'}}/>
      </Box>
    );
  
        
    const [searchValue, setSearchValue] = useState("");
    const [filteredBuffets, setFilteredBuffets] = useState([]);
    
    const isSearchEmpty = searchValue.trim() === "";
    const handleSearchChange = event => {
      setSearchValue(event);
    };
  
    useEffect(() => {
      const filtered = signatures?.filter(buffet =>
        buffet?.nome.toLowerCase().includes(searchValue.toLowerCase())
      );

      setFilteredBuffets(filtered);
    }, [searchValue]);
    


    const isMobile = useResponsive()

    
    /*useEffect(() => {
      const clearMessages = () => {
        setTimeout(() => {
          setBooleanDelete(false)
        }, 3000);
      };
  
      if (booleanDelete) {
        clearMessages();
      }
    }, [booleanDelete]);*/
  
    

  useEffect(() => {
    BuffetService.showUsers().then((result) => setSignatures(result))
  }, [])

 
  return(
    <Box styleSheet={{display: 'flex', height: 'auto'}}>
        {
        booleanDelete &&
      
        <Notification message={"Usuário excluído com sucesso!"} setOnDelete={setBooleanDelete} onDelete={booleanDelete}/>
        
      }
        
      <Box 
        styleSheet={{
        width: '100%',
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

    

<BoxDash styleSheet={{width: '100%', height: 'auto', marginLeft: '-1rem'}}>
                <Input
                  type="text"
                  placeholder="Pesquisar Usuários"
                  value={searchValue}
                  onChange={handleSearchChange}
                  styleSheet={{width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid #ccc'}}
                />
        
                </BoxDash>
<Box tag="table" styleSheet={{overflowX: isMobile? 'scroll': 'none', width: '100%'}}>
<TableHead styleSheet={{width: isMobile? 'max-content': "100%"}}>
  {
    isMobile ?
    <TableRow styleSheet={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap'}}>
              <TableCell><p>ID</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/></TableCell>
              <TableCell><p>Documento</p> <FilterArrows functionupArrow={orderByDateGrowing} functionDownArrow={orderByDateDescending} property="updated_at"/></TableCell>
              <TableCell><p>Nome</p> <FilterArrows functionupArrow={orderByDateGrowing} functionDownArrow={orderByDateDescending} property="updated_at"/></TableCell>
              <TableCell><p>E-mail</p> <FilterArrows functionupArrow={orderByStringGrowing} functionDownArrow={orderByStringDescending} property="entidade.nome"/></TableCell>
              <TableCell><p>Tipo Perfil</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="valor"/></TableCell>
              <TableCell><p>Ações</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="valor"/></TableCell>
             
            </TableRow>:
            <TableRow styleSheet={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap'}}>
            <TableCell><p>ID</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/></TableCell>
            <TableCell><p>Documento</p> <FilterArrows functionupArrow={orderByDateGrowing} functionDownArrow={orderByDateDescending} property="updated_at"/></TableCell>
            <TableCell><p>Nome</p> <FilterArrows functionupArrow={orderByDateGrowing} functionDownArrow={orderByDateDescending} property="updated_at"/></TableCell>
            <TableCell><p>E-mail</p> <FilterArrows functionupArrow={orderByStringGrowing} functionDownArrow={orderByStringDescending} property="entidade.nome"/></TableCell>
            <TableCell><p>Tipo Perfil</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="valor"/></TableCell>
            <TableCell><p>Ações</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="valor"/></TableCell>
          </TableRow>
  }
            
          </TableHead>

          <TableBody styleSheet={{width: isMobile? 'max-content': "100%"}}>
            {isSearchEmpty? signatures?.slice((currentPage - 1) * elementsPerPage, currentPage * elementsPerPage)
          ?.map((item, index)=>(

            isMobile ?
            <TableRow styleSheet={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap'}}>
              <TableCell  styleSheet={{width: '7%', textAlign: 'center', }}>{index}</TableCell>
              <TableCell styleSheet={{width: '15%', textAlign: 'center', }}>{item?.documento}</TableCell>
              <TableCell styleSheet={{width: '14%', textAlign: 'center', }}>{item?.nome}</TableCell>
              <TableCell styleSheet={{width: '20%', textAlign: 'center', }}>{item?.usuario?.email}</TableCell>
              <TableCell styleSheet={{width: '7%', textAlign: 'center', }}>
                {
                item?.usuario?.id_perfil == 2 && 'Buffet'
                }
                 {
                item?.usuario?.id_perfil == 3 && 'Admin'
                }
                 {
                item?.usuario?.id_perfil == 1 && 'Cliente'
                }
              </TableCell>
              <TableCell>
                  <MdDelete  onClick={(e) => DeleteUser(item['id'])} size={20} color="red" style={{cursor: 'pointer'}}/>
                </TableCell>
        
         </TableRow> : 
         <TableRow key={index} styleSheet={{display: 'flex', flexDirection: 'row'}}>
         <TableCell  styleSheet={{width: '7%', textAlign: 'center', }}>{index}</TableCell>
         <TableCell styleSheet={{width: '15%', textAlign: 'center', }}>{item?.documento}</TableCell>
         <TableCell styleSheet={{width: '12%', textAlign: 'center', }}>{item?.nome}</TableCell>
         <TableCell styleSheet={{width: '20%', textAlign: 'center', wordWrap: 'break-word'}}>{item?.usuario?.email}</TableCell>
         <TableCell styleSheet={{width: '20%', textAlign: 'center', }}>
         {
         item?.usuario?.id_perfil == 2 && 'Buffet'
         }
          {
         item?.usuario?.id_perfil == 3 && 'Cliente'
         }
          {
         item?.usuario?.id_perfil == 1 && 'Admin'
         }
       </TableCell>
          <TableCell>
          <MdDelete  onClick={(e) => DeleteUser(item['id'])} size={20} color="red" style={{cursor: 'pointer'}}/>
        </TableCell>
        
      </TableRow>
              
            )):
            filteredBuffets?.slice((currentPage - 1) * elementsPerPage, currentPage * elementsPerPage)
          ?.map((item, index)=>(

            isMobile ?
            <TableRow styleSheet={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap'}}>
              <TableCell  styleSheet={{width: '7%', textAlign: 'center', }}>{index}</TableCell>
              <TableCell styleSheet={{width: '15%', textAlign: 'center', }}>{item?.documento}</TableCell>
              <TableCell styleSheet={{width: '14%', textAlign: 'center', }}>{item?.nome}</TableCell>
              <TableCell styleSheet={{width: '20%', textAlign: 'center', }}>{item?.usuario?.email}</TableCell>
              <TableCell styleSheet={{width: '7%', textAlign: 'center', }}>
                {
                item?.usuario?.id_perfil == 2 && 'Buffet'
                }
                 {
                item?.usuario?.id_perfil == 3 && 'Admin'
                }
                 {
                item?.usuario?.id_perfil == 1 && 'Cliente'
                }
              </TableCell>
              <TableCell>
                  <MdDelete  onClick={(e) => DeleteUser(item['id'])} size={20} color="red" style={{cursor: 'pointer'}}/>
                </TableCell>
        
         </TableRow> : 
         <TableRow key={index} styleSheet={{display: 'flex', flexDirection: 'row'}}>
         <TableCell  styleSheet={{width: '7%', textAlign: 'center', }}>{index}</TableCell>
         <TableCell styleSheet={{width: '15%', textAlign: 'center', }}>{item?.documento}</TableCell>
         <TableCell styleSheet={{width: '14%', textAlign: 'center', }}>{item?.nome}</TableCell>
         <TableCell styleSheet={{width: '25%', textAlign: 'center', wordWrap: 'break-word'}}>{item?.usuario?.email}</TableCell>
         <TableCell styleSheet={{width: '10%', textAlign: 'center', }}>
         {
         item?.usuario?.id_perfil == 2 && 'Buffet'
         }
          {
         item?.usuario?.id_perfil == 3 && 'Cliente'
         }
          {
         item?.usuario?.id_perfil == 1 && 'Admin'
         }
       </TableCell>
       <TableCell>
              <MdDelete  onClick={(e) => DeleteUser(item['id'])} size={20} color="red" style={{cursor: 'pointer'}}/>   
        </TableCell>
        
      </TableRow>
              
            ))}
          </TableBody>
        </Box>
      </Box>
      <Pagination currentPage={currentPage} qtdElements={signatures?.length} elementsPerPage={elementsPerPage} onPageChange={handlePageChange}/>
    </Box>
  )
}

export default Users;
