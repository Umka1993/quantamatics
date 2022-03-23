import React, { Dispatch, FunctionComponent, SetStateAction } from "react";
import { UserRole } from "../../data/enum";
import style from "./role-selector.module.scss";
import RoleOption from "./RoleOption";
import RoleMultiSelect from "./RoleMultiselect";
import classNames from "classnames";
import { Option } from "../../types/option";
interface RoleSelectorProps {
	isSuperAdmin: boolean;
	defaultRoles: Set<UserRole>;
	externalSetter: Dispatch<SetStateAction<Set<UserRole>>>;
	variant?: "squared";
	className?: string;
}

const RoleSelector: FunctionComponent<RoleSelectorProps> = ({
	defaultRoles,
	externalSetter,
	isSuperAdmin,
	variant,
	className,
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
			variant={variant}
			className={className}
		/>
	) : (
		<div className={classNames(style.checkboxes, className)}>
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
