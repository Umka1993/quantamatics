import Checkbox from "../app-checkbox";
import React, { Dispatch, FunctionComponent, HTMLProps, SetStateAction } from "react";
import { UserRole } from "../../data/enum";
import useChangeSet from "../../hooks/useChangeSet";

interface RoleOptionProps {
    selected?: boolean;
    value: UserRole;
    label: string;
    setter: Dispatch<SetStateAction<Set<UserRole>>>;
    className?: string;
    highlightOnChecked?: boolean;
    align?: "right" | "left";
    
}

const RoleOption: FunctionComponent<RoleOptionProps> = ({
	selected = false,
	setter,
	value,
	label,
	className,
	highlightOnChecked,
	align
}) => {
	const [addToSet, removeFromSet] = useChangeSet(value, setter);

	return (
		<Checkbox
			name={value}
			checked={selected}
			onChange={selected ? removeFromSet : addToSet}
			className={className}
			highlightOnChecked={highlightOnChecked}
			align={align}
		>
			{label}
		</Checkbox>
	);
};

export default RoleOption;
