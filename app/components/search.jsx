import React, { useState } from 'react';
import { TextField } from '@mui/material';

const Search = ({ onSearch, className }) => {
    const [query, setQuery] = useState('');

    const handleSearch = (e) => {
        setQuery(e.target.value);
        onSearch(e.target.value);
    };

    return (
        <TextField
            label="Search Pantry"
            value={query}
            onChange={handleSearch}
            fullWidth
            className={className}
        />
    );
};

export default Search;
