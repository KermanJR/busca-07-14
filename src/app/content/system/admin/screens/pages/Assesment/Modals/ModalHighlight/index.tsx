'use client'

import BuffetService from "@src/app/api/BuffetService";
import ModalDashboard from "@src/app/components/system/Modal";
import ActivePageContext from "@src/app/context/ActivePageContext";
import Box from "@src/app/theme/components/Box/Box";
import Button from "@src/app/theme/components/Button/Button";
import Text from "@src/app/theme/components/Text/Text";
import { useState, useEffect, useContext } from "react";

const ModalHighlight = ({isModalOpenHighLight, setIsModalOpenHighlight, index, nameBuffet, setBuffets}) =>{

  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [isHighlight, setIsHighlight] = useState(null)

  useEffect(() => {
    setLoading(true)
    BuffetService.showOneUser(index).then((result) => {
      setUser(result)
      result.entidade.destacado == '1' ? setIsHighlight(true) : setIsHighlight(false)
      setLoading(false)
    })
  }, [])

  const { activePage, widthSideMenu, setWidthSizeMenu, setActivePage } = useContext(ActivePageContext);

 

  function updateHighlight() {
    switch (user?.entidade?.destacado) {
      case '0':
        user.entidade.destacado = '1';
        BuffetService.editUser(user.entidade.id, user.entidade).then(() => {
          // Atualize a lista de buffets após a edição do usuário
          BuffetService.showAssessment().then((result) => {
            setBuffets(result);
          });
        });
        break;
      case '1':
        user.entidade.destacado = '0';
        BuffetService.editUser(user.entidade.id, user.entidade).then(() => {
          // Atualize a lista de buffets após a edição do usuário
          BuffetService.showAssessment().then((result) => {
            setBuffets(result);
          });
        });
        break;
    }
  }
  return(
    <>
      {
        !loading && <ModalDashboard 
        isOpen={isModalOpenHighLight}
        setIsModalOpen={setIsModalOpenHighlight}
        styleSheet={{

        }}
      >
        <Text styleSheet={{padding: '.5rem 0'}} variant="body2">
          {isHighlight ? `Deseja remover o destaque do usuário ${user?.entidade.nome} responsável pelo ${nameBuffet}?` : `Deseja destacar o usuário ${user?.entidade.nome} responsável pelo ${nameBuffet}?`}
        </Text>
        <Text variant="body1">Usuários com destaque possuem maior visibilidade no site!</Text>
        <Box styleSheet={{display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '1rem'}}>
          <Button styleSheet={{marginTop: '1rem', alignSelf: 'center', width: '132px'}} fullWidth colorVariant="primary" onClick={() => setIsModalOpenHighlight(false)}>Não</Button>
          <Button styleSheet={{marginTop: '1rem', alignSelf: 'center', width: '132px'}} fullWidth colorVariant="secondary" onClick={() => {setIsModalOpenHighlight(false); updateHighlight()}}>Sim</Button>
        </Box>
      </ModalDashboard>
      }
    </>
  )
}

export default ModalHighlight;
