import Box from "@src/app/theme/components/Box/Box";
import theme from "@src/app/theme/theme";
import React, { useState } from "react";
import arrowDown from "../../../../../../../../public/assets/icons/arrow_down.jpg"
import Text from "@src/app/theme/components/Text/Text";
export default function CategoryFilter({ categories1, selectedCategories, onCategoryChange }) {
  const [showSubModal, setShowSubModal] = useState(false);

  const toggleSubModal = () => {
    setShowSubModal(!showSubModal);
  };

  return (
    <div className="category-filter">
      <button style={{
        width: '278px',
        borderRadius: '50px',
        padding: '.9rem',
        border: 'none',
        textAlign: 'left',
        backgroundColor: theme.colors.neutral.x000, // Defina o fundo original para o select
        appearance: 'none', // Remover a aparência padrão do sistema
        backgroundImage: `URL(${arrowDown.src})`, // Substitua com o caminho da sua imagem da seta
        backgroundPosition: 'right 10px center', // Ajuste a posição da imagem da seta
        backgroundRepeat: 'no-repeat', // Não repita a imagem
        color: theme.colors.primary.x600,
        fontWeight: 500,
        fontSize: '.875rem'
        
      }} onClick={toggleSubModal}><Text styleSheet={{fontSize: '1rem', fontWeight: '500'}}>Todas as categorias</Text></button>
      {showSubModal && (
        <div className="sub-modal">
          <Text>Eventos Sociais</Text>
          <ul>
            {categories1.map((category) => (
              <li key={category.value}>
                <label>
                  <input
                    type="checkbox"
                    value={category.label}
                    checked={selectedCategories.includes(category.label)}
                    onChange={(e) => onCategoryChange(e.target.value)}
                  />
                  <Text styleSheet={{display: 'inline-block', fontSize: '.8rem', fontWeight: '500'}}>{category.label}</Text>
                </label>
              </li>
            ))}
          </ul>
         
        </div>
      )}
      <style jsx>{`
        .category-filter {
          position: relative;
          display: inline-block;
          
        }

        .sub-modal {
          position: absolute;
          top: 100%; // Coloca o submodal logo abaixo do botão
          left: 0;
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 5px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
          max-width: 300px;
          padding: 10px;
          z-index: 1;
          height: 250px;
          width: 280px;
          overflow-y: scroll;
          text-align: left;
          margin-top: .5rem;
        }

        .sub-modal h2 {
          font-size: 16px;
          margin-bottom: 10px;
        }

        .sub-modal ul {
          list-style: none;
          padding: 0;
        }

        .sub-modal li {
          margin: 5px 0;
        }
        /* Personalizar a barra de rolagem */
        .sub-modal::-webkit-scrollbar {
          width: 12px;
        }

        .sub-modal::-webkit-scrollbar-thumb {
          background-color: #ccc; /* Cor da barra de rolagem */
          border-radius: 6px; /* Arredondar as extremidades */
        }
      `}</style>
    </div>
  );
}
