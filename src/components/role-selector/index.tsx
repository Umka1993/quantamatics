import React, {
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import { UserRole, UserRoleLabel } from "../../data/enum";
import { Option } from "types/option";
import RolesMultiselect from "../app-input/roles-multiselect";
import style from "./role-selector.module.scss";
import RoleOption from "./RoleOption";
import RoleMultiSelect from "./RoleMultiselect";
interface RoleSelectorProps {
    isSuperAdmin: boolean;
    defaultRoles: UserRole[];
    externalSetter: Dispatch<SetStateAction<UserRole[]>>;
}

const RoleSelector: FunctionComponent<RoleSelectorProps> = ({
    defaultRoles,
    externalSetter,
    isSuperAdmin,
}) => {
    const [selected, setSelected] = useState<Set<UserRole>>(
        new Set(defaultRoles)
    );

    useEffect(() => {
        externalSetter(Array.from(selected));
    }, [selected]);

    const options: Option<UserRole>[] = isSuperAdmin
        ? [
            { label: "Org. Owner", value: UserRole.OrgOwner },
            { label: "Org. Admin", value: UserRole.OrgAdmin },
        ]
        : [{ label: "Organization Admin", value: UserRole.OrgAdmin }];

    return isSuperAdmin ? (
        <RoleMultiSelect
            selected={selected}
            setter={setSelected}
            options={options}
            label="Organization Role"
        />
    ) : (
        <div className={style.checkboxes}>
            <h4 className={style.clegend}>Organization Role</h4>
            {options.map((option) => (
                <RoleOption
                    key={option.value}
                    selected={selected.has(option.value)}
                    setter={setSelected}
                    align="right"
                    {...option}
                />
            ))}
        </div>
    );
};

export default RoleSelector;
