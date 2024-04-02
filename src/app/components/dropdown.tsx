
import React from 'react';
import Select from 'react-select';

const MultiSelectDropdown = ({ options, value, onChange, isMulti, disabled }: any) => {
    return isMulti ? (
        <Select
            options={options}
            isMulti
            value={value}
            onChange={onChange}
            isDisabled={disabled}
        />
    ) : (
        <Select
            options={options}
            value={value}
            onChange={onChange}
            isDisabled={disabled}
        />
    );

};

export default MultiSelectDropdown;
