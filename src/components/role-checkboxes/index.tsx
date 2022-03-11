import { UserRole } from '../../data/enum';
import React, { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from 'react';
import Checkbox from '../app-checkbox/checkbox';
import './styles/role-checkboxes.scss'
import { Option } from '../../types/option';
import useChangeSet from 'hooks/useChangeSet';
interface RoleCheckboxesProps {
    defaultRoles: UserRole[] | [];
    externalSetter: Dispatch<SetStateAction<UserRole[]>>;
    className?: string;
    options: Option<UserRole>[]
}

const RoleCheckboxes: FunctionComponent<RoleCheckboxesProps> = ({ defaultRoles = [], externalSetter, className, options }) => {
    const [orgAdmin, setOrgAdmin] = useState<boolean>(defaultRoles.includes(UserRole.OrgAdmin));

    useEffect(() => {
        const newValues = new Set(defaultRoles);

        orgAdmin ? newValues.add(UserRole.OrgAdmin) : newValues.delete(UserRole.OrgAdmin);
        externalSetter(Array.from(newValues).sort())
    }, [orgAdmin])


    return (
        <div className={['role-checkboxes', className].join(' ')}>
            <h4 className='role-checkboxes__legend'>Organization Role</h4>

            {options.map(option => {
                const [] = useChangeSet(option.value, )
                return <Checkbox
                    name={option.value}
                    key={option.value}
                    checked={orgAdmin}
                    externalSetter={setOrgAdmin}
                    align='right'
                >
                    {option.label}
                </Checkbox>
            }
            )}


        </div>
    );
}

export default RoleCheckboxes;