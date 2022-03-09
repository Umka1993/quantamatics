import React, { FunctionComponent, HTMLProps, Dispatch, SetStateAction } from "react";

import SearchIcon from "./assets/search.svg";
import style from './SearchField.module.scss'

interface SearchFieldProps extends HTMLProps<HTMLLabelElement> {
    search: string;
    setSearch: Dispatch<SetStateAction<string>>
}

const SearchField: FunctionComponent<SearchFieldProps> = ({ search, setSearch, ...other }) => {
    return (<label className={style.search} {...other}>
        <SearchIcon
            width={16}
            height={16}
            role="img"
            aria-label="Search organizations"
            fill='currentColor'
        />
        <input
            type="search"
            name="search"
            className={style.input}
            placeholder="Search organizations"
            value={search}
            onInput={({ currentTarget: { value } }) => setSearch(value)}
        />
    </label>
    );
}

export default SearchField;