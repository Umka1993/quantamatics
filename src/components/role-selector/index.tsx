import RolesMultiselect from "../app-input/roles-multiselect";
import React, {
    Dispatch,
    FunctionComponent,
    SetStateAction,
    useState,
} from "react";
import RoleCheckboxes from "../role-checkboxes";
import { UserRole, UserRoleLabel } from "../../data/enum";
import { Option } from "types/option";

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

    const options: Option<UserRole>[] = isSuperAdmin
        ? [
            { label: UserRoleLabel[UserRole.OrgOwner], value: UserRole.OrgOwner },
            { label: UserRoleLabel[UserRole.OrgAdmin], value: UserRole.OrgAdmin },
        ]
        : [{ label: "Organization Admin", value: UserRole.OrgAdmin }];

    return (
        <RoleCheckboxes
            defaultRoles={defaultRoles}
            externalSetter={externalSetter}
            options={options}
        />
        // isSuperAdmin ? <RolesMultiselect
        //     options={[UserRole.OrgOwner, UserRole.OrgAdmin]}
        //     selected={Array.from(userRoles).sort()}
        //     setSelected={setRoles}
        //     label="Organization Role"
        //     errorMessage="Select asset permissions to assign to the user account."
        //     showError={assetError}
        //     type="user"
        //     inputList={Array.from(userRoles).sort().join(", ")}
        // /> :
        //
    );
};

export default RoleSelector;
