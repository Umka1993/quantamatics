import { UserRole } from '../../data/enum';
import React, { Dispatch, FunctionComponent, SetStateAction, useEffect, useState } from 'react';
import Checkbox from '../app-checkbox/';
import './styles/role-checkboxes.scss'
import { Option } from '../../types/option';
import useChangeSet from '../../hooks/useChangeSet';
interface RoleCheckboxesProps {
    selected: Set<UserRole>;
    setter: Dispatch<SetStateAction<Set<UserRole>>>;
    className?: string;
    options: Option<UserRole>[]
}

const RoleCheckboxes: FunctionComponent<RoleCheckboxesProps> = ({ selected, setter, className, options }) =>
    <div className={['role-checkboxes', className].join(' ')}>
        <h4 className='role-checkboxes__legend'>Organization Role</h4>

        {options.map(option => {
            const [addToSet, removeFromSet] = useChangeSet(option.value, setter)
            const isSelected = selected.has(option.value);
            return <Checkbox
                name={option.value}
                key={option.value}
                checked={isSelected}
                onChange={isSelected ? removeFromSet : addToSet}
                align='right'
            >
                {option.label}
            </Checkbox>
        }
        )}
    </div>


export default RoleCheckboxes;