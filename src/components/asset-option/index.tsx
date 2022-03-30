import { Dispatch, HTMLProps, SetStateAction } from "react";
import useChangeSet from "../../hooks/useChangeSet";
import Checkbox from "../app-checkbox";

interface OptionProps extends HTMLProps<HTMLOptionElement> {
	isSetByDefault?: boolean;
	setSelected: Dispatch<SetStateAction<Set<string | number>>>;

}

export default function AssetOption({
	selected,
	className,
	children,
	isSetByDefault,
	value,
	setSelected
}: OptionProps) {
	const [addToSelected, removeFromSelected] = useChangeSet(
		value as string | number,
		setSelected
	);

	return (
		<Checkbox
			className={className}
			checked={selected}
			labelCheckbox={isSetByDefault ? "Is set as default" : undefined}
			disabled={isSetByDefault}
			highlightOnChecked
			onChange={({ currentTarget }) => currentTarget.checked ? addToSelected() : removeFromSelected()}
			name={'asset' + value}
		>
			{children}
		</Checkbox >
	);
}
