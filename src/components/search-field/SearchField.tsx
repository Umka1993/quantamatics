import { HTMLProps } from "react";

import { ReactComponent as SearchIcon } from "./search.svg";
import style from './SearchField.module.scss'

type SearchFieldProps = HTMLProps<HTMLLabelElement> & Pick<HTMLProps<HTMLInputElement>, 'defaultValue'>

export default function SearchField({ defaultValue, ...other }: SearchFieldProps) {
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
			defaultValue={defaultValue}
		/>
	</label>
	);
}

