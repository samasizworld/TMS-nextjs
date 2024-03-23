
import React from 'react';
import Select from 'react-select';

const MultiSelectDropdown = ({ options, value, onChange, isMulti }: any) => {
    return isMulti ? (
        <Select
            options={options}
            isMulti
            value={value}
            onChange={onChange}
        />
    ) : (
        <Select
            options={options}
            value={value}
            onChange={onChange}
        />
    );

};

export default MultiSelectDropdown;
