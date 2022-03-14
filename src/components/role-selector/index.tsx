import React, {
	Dispatch,
	FunctionComponent,
	SetStateAction,
	useEffect,
	useState,
} from "react";
import { UserRole } from "../../data/enum";
import { Option } from "types/option";
import style from "./role-selector.module.scss";
import RoleOption from "./RoleOption";
import RoleMultiSelect from "./RoleMultiselect";
interface RoleSelectorProps {
    isSuperAdmin: boolean;
    defaultRoles: Set<UserRole>;
    externalSetter: Dispatch<SetStateAction<Set<UserRole>>>;
}

const RoleSelector: FunctionComponent<RoleSelectorProps> = ({
	defaultRoles,
	externalSetter,
	isSuperAdmin,
}) => {
	const options: Option<UserRole>[] = isSuperAdmin
		? [
			{ label: "Org. Owner", value: UserRole.OrgOwner },
			{ label: "Org. Admin", value: UserRole.OrgAdmin },
		]
		: [{ label: "Organization Admin", value: UserRole.OrgAdmin }];

	return isSuperAdmin ? (
		<RoleMultiSelect
			selected={defaultRoles}
			setter={externalSetter}
			options={options}
			label="Organization Role"
		/>
	) : (
		<div className={style.checkboxes}>
			<h4 className={style.clegend}>Organization Role</h4>
			{options.map((option) => (
				<RoleOption
					key={option.value}
					selected={defaultRoles.has(option.value)}
					setter={externalSetter}
					align="right"
					{...option}
				/>
			))}
		</div>
	);
};

export default RoleSelector;
