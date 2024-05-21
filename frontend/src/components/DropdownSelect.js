import React from 'react';
import Select from 'react-select';

const customStyles = {
    control: (base, state) => ({
      ...base,
      background: "white",
      borderColor: state.isFocused ? "blue" : "#edf4ff",
      boxShadow: state.isFocused ? "0 0 0 1px blue" : "none",
      "&:hover": {
        borderColor: "black",
        ".DropdownSelect__dropdown-indicator": {
          color: 'black'
        }
      },
      width: 250, 
      height: 38,
      minHeight: 38,
      borderRadius: "4px",
      display: 'flex',
      alignItems: 'center',
      padding: '0 8px',
    }),
    option: (provided, state) => ({
      ...provided,
      color: 'black',
      backgroundColor: state.isFocused ? state.data.color : "white",
      padding: 10,
      textAlign: 'left',
      borderRadius: '16px',
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: 'black',
      backgroundColor: state.data.color,
      display: 'inline-block',
      padding: '2px 5px',
      borderRadius: '16px',
      lineHeight: 'normal',
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '4px 6px',
      height: '100%',
      alignItems: 'center',
      display: 'inline-block'
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'gray',
    }),
    dropdownIndicator: (base, state) => ({
      ...base,
      color: state.isFocused ? 'black' : 'black', 
      transition: 'color 200ms',
      "&:hover": {
        color: 'black'
      }
    }),
};

const DropdownSelect = ({ onChange, value, options}) => {
  const handleChange = selectedOption => {
    onChange(selectedOption.value);
  };

  return (
    <Select
      styles={customStyles}
      options={options}
      onChange={handleChange}
      value={options.find(option => option.value === value)}
      isSearchable={false}
    />
  );
};

export default DropdownSelect;
