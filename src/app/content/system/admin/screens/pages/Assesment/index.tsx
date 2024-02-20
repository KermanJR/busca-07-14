import BoxDash from "@src/app/components/system/BoxDash";
import TableCell from "@src/app/components/system/Table/TableCell";
import TableHead from "@src/app/components/system/Table/TableHead";
import TableRow from "@src/app/components/system/Table/TableRow";
import TableBody from "@src/app/components/system/Table/TableBody";
import { useTheme } from "@src/app/theme/ThemeProvider"
import Box from "@src/app/theme/components/Box/Box"
import Icon from "@src/app/theme/components/Icon/Icon";
import Text from "@src/app/theme/components/Text/Text";
import { useEffect, useState } from "react";
import Pagination from "@src/app/components/system/Pagination";
import BuffetService from "@src/app/api/BuffetService";
import ModalHighlight from "./Modals/ModalHighlight";
import { useFilterFunctions } from "../common/useFilterFunctions";
import { FilterArrows } from "../common/FilterArrows";
import useResponsive from "@src/app/theme/helpers/useResponsive";
import { FaStar } from "react-icons/fa";
import Input from "@src/app/theme/components/Input/Input";
const Assesment = () =>{

  const theme = useTheme();

  const [buffets, setBuffets] = useState<any>([])
  const [index, setIndex] = useState(null)
  const [nameBufet, setNameBuffet] = useState('')
  const [isModalOpenHighlight, setIsModalOpenHighlight] = useState(false)
  const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
  const [viewElements, setViewElements] = useState(0)
  const [currentPage, setCurrentPage] = useState(1);
  const elementsPerPage = 5; // Define o número de elementos por página
  
  const [hoveredEvent, setHoveredEvent] = useState(null);
  const [statusDestaque, setStatusDestaque] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [filteredBuffets, setFilteredBuffets] = useState([]);
  const {
    orderByGrowing,
    orderByDescending,
    orderByDateGrowing,
    orderByDateDescending,
    orderByStringGrowing,
    orderByStringDescending
    } = useFilterFunctions({hook: buffets, setHook: setBuffets})

    useEffect(() => {
      BuffetService.showAssessment().then((result) => {
        const filteredBuffets = result.filter((element) => Number(new Date(element.data_fim)) > Number(new Date()) || element.data_fim == null);
        const sortedBuffets = filteredBuffets.sort((a, b) => b.entidade.destacado - a.entidade.destacado);
        setBuffets(sortedBuffets)
      });
    }, []);
    

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);

  };

  

 
  const EventActionPopup = ({status_destaque}) => (
    
    <Box styleSheet={{ 
      width: '200px',
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
      alignItems: 'center',
      right: !isMobile? '-1rem': '-2rem',
      top: '-2rem',
      backgroundColor: theme.colors.neutral.x000,
      boxShadow: `0px 4px 4px 0px ${theme.colors.neutral.x050}`,
    }}>

      <Box  onClick={(e) => setIsModalOpenHighlight(!isModalOpenHighlight)} styleSheet={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', cursor: 'pointer'}}>
        <Icon name="star" />
        <Text>
          {
            status_destaque == 1? <Text>Remover Destaque</Text>: <Text>Destacar</Text>
          }
        </Text>
        </Box>
        
      

    </Box>
  );


  const isMobile = useResponsive()

  useEffect(() => {
    // Filtra os buffets com base no valor de pesquisa
    const filtered = buffets.filter(buffet =>
      buffet.slug.toLowerCase().includes(searchValue.toLowerCase())
    );
   
    setFilteredBuffets(filtered);
  }, [buffets, searchValue]);

  const handleSearchChange = event => {
    setSearchValue(event);
  };

  const isSearchEmpty = searchValue.trim() === "";


  return(
    <Box styleSheet={{height: '100vh'}}>

      {isModalOpenHighlight &&(
        <ModalHighlight setBuffets={setBuffets} isModalOpenHighLight={isModalOpenHighlight} setIsModalOpenHighlight={setIsModalOpenHighlight} index={index} nameBuffet={nameBufet} />
        )
      }

      <Box styleSheet={{
        width: '100%',
        height: '100px',
        boxShadow: '1px 1px 2px 1px #ccc',
        backgroundColor: 'white',
        borderRadius: '8px',
        display:'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        
        <Input
        type="text"
        placeholder="Pesquisar buffets"
        value={searchValue}
        onChange={handleSearchChange}
        styleSheet={{width: '95%', padding: '1rem', borderRadius: '8px', border: '1px solid #ccc'}}
      />
        
      </Box>

     

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

<Box tag="table" styleSheet={{overflowX: isMobile? 'scroll': 'none', width: '100%'}}>
<TableHead styleSheet={{width: isMobile? 'max-content': "100%"}}>
  {isMobile? <TableRow styleSheet={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap'}}>
              <TableCell><p>ID</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/></TableCell>
              <TableCell><p>Nome</p> <FilterArrows functionupArrow={orderByStringGrowing} functionDownArrow={orderByStringDescending} property="slug"/></TableCell>
              <TableCell><p>Data Final</p> <FilterArrows functionupArrow={orderByDateGrowing} functionDownArrow={orderByDateDescending} property="data_fim"/></TableCell>
              <TableCell><p>Destaque</p> <FilterArrows functionupArrow={orderByDateGrowing} functionDownArrow={orderByDateDescending} property="data_fim"/></TableCell>
              <TableCell><p>Ações</p> </TableCell>
            </TableRow>: 
            <TableRow>
            <TableCell><p>ID</p> <FilterArrows functionupArrow={orderByGrowing} functionDownArrow={orderByDescending} property="id"/></TableCell>
            <TableCell><p>Nome</p> <FilterArrows functionupArrow={orderByStringGrowing} functionDownArrow={orderByStringDescending} property="slug"/></TableCell>
            <TableCell><p>Data Final</p> <FilterArrows functionupArrow={orderByDateGrowing} functionDownArrow={orderByDateDescending} property="data_fim"/></TableCell>
            <TableCell><p>Destaque</p> <FilterArrows functionupArrow={orderByDateGrowing} functionDownArrow={orderByDateDescending} property="data_fim"/></TableCell>
            <TableCell><p>Ações</p> </TableCell>
          </TableRow>}
            
          </TableHead>

          <TableBody styleSheet={{width: isMobile? '100%': "100%"}}>
            {!isSearchEmpty?  filteredBuffets?.slice((currentPage - 1) * elementsPerPage, currentPage * elementsPerPage)
          ?.map((item, index)=>(
            isMobile ? 
            <TableRow styleSheet={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: '2rem'}}>
            <TableCell styleSheet={{width: '20%', textAlign: 'center', }}>{item?.['id']}</TableCell>
            <TableCell styleSheet={{width: '50%', textAlign: 'center', }}>{item?.['entidade']['nome']}</TableCell>
            <TableCell styleSheet={{width: '50%', textAlign: 'center', }}>{new Date(item?.['data_fim'] ?? new Date()).toLocaleDateString()}</TableCell>
            <TableCell styleSheet={{width: '50%', textAlign: 'center', }}>
            <TableCell styleSheet={{width: '50%', textAlign: 'center', }}>
            {item?.entidade?.destacado == 1?  
              <Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '5px'}}><FaStar color="yellow" style={{fill: '#EA760A'}}/>Sim</Box>: <FaStar  style={{fill: 'black'}}/>
            }
            </TableCell>
            </TableCell>
            <BoxDash
              key={index}
              styleSheet={{
                display: "flex",
                flexDirection: "column",
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
                width: "20%",
                height: '40px',
                position: 'relative',
              }}
              onMouseEnter={() => {setHoveredEvent(index), setIndex(item.id_entidade), setNameBuffet(item.slug)}}
              onMouseLeave={() => setHoveredEvent(null)}
            >
              <Text variant="heading5semiBold">...</Text>
              {hoveredEvent === index && (
                <EventActionPopup status_destaque={item?.entidade?.destacado}/>
              )}
            </BoxDash>

            {item?.entidade?.destacado}
           
          </TableRow>:
           <TableRow key={index} >
           <TableCell>{item?.['id']}</TableCell>
           <TableCell styleSheet={{width: '50%', textAlign: 'center', }}>{item?.['entidade']['nome']}</TableCell>
           <TableCell>{new Date(item?.['data_fim'] ?? new Date()).toLocaleDateString()}</TableCell>
           <TableCell styleSheet={{width: '50%', textAlign: 'center', }}>
            {item?.entidade?.destacado == 1?  
              <Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '5px'}}><FaStar color="yellow" style={{fill: '#EA760A'}}/>Sim</Box>: 
              <Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '5px'}}><FaStar  style={{fill: 'black'}}/>Não</Box>
            }
            </TableCell>
           <BoxDash
             key={index}
             styleSheet={{
               display: "flex",
               flexDirection: "column",
               justifyContent: 'flex-end',
               alignItems: 'flex-start',
               width: "100%",
               height: '40px',
               position: 'relative',
             }}
             onMouseEnter={() => {setHoveredEvent(index), setIndex(item.id_entidade), setNameBuffet(item.slug)}}
             onMouseLeave={() => setHoveredEvent(null)}
           >
             <Text variant="heading5semiBold">...</Text>
             {hoveredEvent === index && (
                 <EventActionPopup status_destaque={item?.entidade?.destacado}/>
             )}
           </BoxDash>
         </TableRow>
            )):
            buffets?.slice((currentPage - 1) * elementsPerPage, currentPage * elementsPerPage)
          ?.map((item, index)=>(
            isMobile ? 
            <TableRow styleSheet={{display: 'flex', flexDirection: 'row', flexWrap: 'nowrap', gap: '2rem'}}>
            <TableCell styleSheet={{width: '20%', textAlign: 'center', }}>{item?.['id']}</TableCell>
            <TableCell styleSheet={{width: '50%', textAlign: 'center', }}>{item?.['entidade']['nome']}</TableCell>
            <TableCell styleSheet={{width: '50%', textAlign: 'center', }}>{new Date(item?.['data_fim'] ?? new Date()).toLocaleDateString()}</TableCell>
            <TableCell styleSheet={{width: '50%', textAlign: 'center', }}>
            <TableCell styleSheet={{width: '50%', textAlign: 'center', }}>
            {item?.entidade?.destacado == 1?  
              <Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '5px'}}><FaStar color="yellow" style={{fill: '#EA760A'}}/>Sim</Box>: <FaStar  style={{fill: 'black'}}/>
            }
            </TableCell>
            </TableCell>
            <BoxDash
              key={index}
              styleSheet={{
                display: "flex",
                flexDirection: "column",
                justifyContent: 'flex-end',
                alignItems: 'flex-start',
                width: "20%",
                height: '40px',
                position: 'relative',
              }}
              onMouseEnter={() => {setHoveredEvent(index), setIndex(item.id_entidade), setNameBuffet(item.slug)}}
              onMouseLeave={() => setHoveredEvent(null)}
            >
              <Text variant="heading5semiBold">...</Text>
              {hoveredEvent === index && (
                <EventActionPopup status_destaque={item?.entidade?.destacado}/>
              )}
            </BoxDash>

            
           
          </TableRow>:
           <TableRow key={index} >
           <TableCell>{item?.['id']}</TableCell>
           <TableCell styleSheet={{width: '50%', textAlign: 'center', }}>{item?.['entidade']['nome']}</TableCell>
           <TableCell>{new Date(item?.['data_fim'] ?? new Date()).toLocaleDateString()}</TableCell>
           <TableCell styleSheet={{width: '50%', textAlign: 'center', }}>
            {item?.entidade?.destacado == 1?  
              <Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '5px'}}><FaStar color="yellow" style={{fill: '#EA760A'}}/>Sim</Box>: 
              <Box styleSheet={{display: 'flex', flexDirection: 'row', gap: '5px'}}><FaStar  style={{fill: 'black'}}/>Não</Box>
            }
            </TableCell>
           <BoxDash
             key={index}
             styleSheet={{
               display: "flex",
               flexDirection: "column",
               justifyContent: 'flex-end',
               alignItems: 'flex-start',
               width: "100%",
               height: '40px',
               position: 'relative',
             }}
             onMouseEnter={() => {setHoveredEvent(index), setIndex(item.id_entidade), setNameBuffet(item.slug)}}
             onMouseLeave={() => setHoveredEvent(null)}
           >
             <Text variant="heading5semiBold">...</Text>
             {hoveredEvent === index && (
                 <EventActionPopup status_destaque={item?.entidade?.destacado}/>
             )}
           </BoxDash>
         </TableRow>
            ))}
          </TableBody>
        </Box>
      </Box>
      <Pagination currentPage={currentPage} elementsPerPage={elementsPerPage} qtdElements={buffets.length}  onPageChange={handlePageChange}/>
    </Box>
  )
}

export default Assesment;
