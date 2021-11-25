import { UserRole } from '../../data/enum';
import React, { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from 'react';
import Checkbox from '../app-checkbox/checkbox';
import './styles/role-checkboxes.scss'

interface RoleCheckboxesProps {
    defaultRoles: UserRole[] | [];
    externalSetter: Dispatch<SetStateAction<UserRole[]>>;
    className?: string;
}

const RoleCheckboxes: FunctionComponent<RoleCheckboxesProps> = ({ defaultRoles = [], externalSetter, className }) => {
    const [orgAdmin, setOrgAdmin] = useState<boolean>(defaultRoles.includes(UserRole.OrgAdmin));

    useEffect(() => {
        const newValues = new Set(defaultRoles);

        orgAdmin ? newValues.add(UserRole.OrgAdmin) : newValues.delete(UserRole.OrgAdmin);
        externalSetter(Array.from(newValues).sort())
    }, [orgAdmin])

    return (
        <fieldset className={['role-checkboxes', className].join(' ')}>
            <legend className='role-checkboxes__legend'>Organization Role</legend>

            <Checkbox
                name="org-admin"
                checked={orgAdmin}
                externalSetter={setOrgAdmin}
            >
                Organization Admin
            </Checkbox>
        </fieldset>
    );
}

export default RoleCheckboxes;