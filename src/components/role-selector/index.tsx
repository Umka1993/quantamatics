import React, {
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useEffect,
    useState,
} from "react";
import RoleCheckboxes from "../role-checkboxes";
import { UserRole, UserRoleLabel } from "../../data/enum";
import { Option } from "types/option";
import RolesMultiselect from "../app-input/roles-multiselect";

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
        externalSetter(Array.from(selected))
    }, [selected])

    const options: Option<UserRole>[] = isSuperAdmin
        ? [
            { label: UserRoleLabel[UserRole.OrgOwner], value: UserRole.OrgOwner },
            { label: UserRoleLabel[UserRole.OrgAdmin], value: UserRole.OrgAdmin },
        ]
        : [{ label: "Organization Admin", value: UserRole.OrgAdmin }];

    return (
        isSuperAdmin ? <RolesMultiselect
            selected={selected}
            setter={setSelected}
            options={options}

            label="Organization Role"
        />
            :
            <RoleCheckboxes
                selected={selected}
                setter={setSelected}
                options={options}
            />

    );
};

export default RoleSelector;
