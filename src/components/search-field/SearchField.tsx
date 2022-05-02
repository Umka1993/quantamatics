import { HTMLProps } from "react";

import { ReactComponent as SearchIcon } from "./search.svg";
import style from "./SearchField.module.scss";

type SearchFieldProps = HTMLProps<HTMLLabelElement> &
	Pick<HTMLProps<HTMLInputElement>, "defaultValue" | "placeholder">;

export default function SearchField({
	defaultValue,
	placeholder,
	...other
}: SearchFieldProps) {
	return (
		<label className={style.search} {...other}>
			<SearchIcon
				width={16}
				height={16}
				role="img"
				aria-label={placeholder}
				fill="currentColor"
			/>
			<input
				type="search"
				name="search"
				className={style.input}
				placeholder={placeholder}
				defaultValue={defaultValue}
			/>
		</label>
	);
}
