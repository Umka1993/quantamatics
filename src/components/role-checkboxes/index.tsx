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
    const [research, setResearch] = useState<boolean>(defaultRoles.includes(UserRole.Research));
    const [coherence, setCoherence] = useState<boolean>(defaultRoles.includes(UserRole.Coherence));

    useEffect(() => {
        const newValues = [];

        orgAdmin && newValues.push(UserRole.OrgAdmin);
        research && newValues.push(UserRole.Research);
        coherence && newValues.push(UserRole.Coherence);

        externalSetter(newValues)
    }, [orgAdmin, research, coherence])

    return (
        <fieldset className={['role-checkboxes', className].join(' ')}>
            <legend className='role-checkboxes__legend'>Organization Role</legend>

            <Checkbox
                name="org-admin"
                checked={orgAdmin}
                externalSetter={setOrgAdmin}
            >
                Org. Admin
            </Checkbox>
            <Checkbox
                name={UserRole.Research}
                checked={research}
                externalSetter={setResearch}
            >
                {UserRole.Research}
            </Checkbox>
            <Checkbox
                name={UserRole.Coherence}
                checked={coherence}
                externalSetter={setCoherence}
            >
                {UserRole.Coherence}
            </Checkbox>
        </fieldset>
    );
}

export default RoleCheckboxes;