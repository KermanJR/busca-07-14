import { UserContext } from "@src/app/context/UserContext";
import Box from "@src/app/theme/components/Box/Box";
import Text from "@src/app/theme/components/Text/Text";
import theme from "@src/app/theme/theme";
import React, { useContext, useEffect, useRef, useState } from "react";
import Select from "react-select";



const SelectCategoriesRegion = ({options, selectedCategories, setAuxCategoryBuffets, setSelectedCategories}) => {
  
  const [selectedOptions, setSelectedOptions] = useState(selectedCategories);
  const selectedOptionsRef = useRef(selectedOptions);

  /*const handleChange = (selectedOption) => {
    const label = selectedOption[selectedOption?.length-1]?.label;
    setSelectedOptions(selectedOption)
    if (label && !selectedCategories.includes(label)) {
      console.log('ok')
      setSelectedCategories((prevCategories) => [...prevCategories, label]);
    }
  };*/

  const handleChange = (selectedOption) => {
    const labels = selectedOption.map(option => option.label);
    setSelectedOptions(selectedOption);
  
    labels.forEach(label => {
      if (label && !selectedCategories.includes(label)) {
        setSelectedCategories(prevCategories => [...prevCategories, label]);
      }
    });
  };
  

  const handleDelete = (removedValue) => {

    const updatedOptions = selectedOptions.filter(option => option !== removedValue);
    setSelectedOptions(updatedOptions);
    setSelectedCategories(updatedOptions.map(option => option)); // Atualize também o estado selectedCategories
  };
  
  

  const mappedOptions = options?.map((option) => ({
    value: option?.value,
    label: option?.label,
  }));


 
 

  useEffect(() => {
    selectedOptionsRef.current = selectedOptions;
    setAuxCategoryBuffets(selectedOptionsRef.current);
  }, [selectedOptions]);


  return (
    <Box tag="form">
      <Select
        options={mappedOptions}
        value={selectedOptions}
        onChange={handleChange}
        
        components={{
          MultiValueRemove: ({ innerProps, data }) => (
            <div {...innerProps} onClick={() => handleDelete(data)} style={{width: '20px'}}>
              &#215;
            </div>
          ),
        }}
      
        isMulti
        placeholder="Selecione o tipo de evento"
        required={true}
        styles={{
          control: (provided, state) => ({
            ...provided,
            border: state.isFocused ? `1px solid ${theme.colors.neutral.x100}` : provided.border,
            outline: state.isFocused ? `none` : provided.outline,
            padding: '.2rem',
            boxShadow: state.isFocused ? 'none' : provided.boxShadow,
            background: theme.colors.neutral.x050
          }),
        }}
      />
  
      
    </Box>
  );
};

export default SelectCategoriesRegion;
