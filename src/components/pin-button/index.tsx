
import React, { ButtonHTMLAttributes, FunctionComponent } from 'react';
import PinIcon from './assets/pin.svg';
import './style/pin-button.scss';
import classNames from 'classnames'

interface PinButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    checked?: boolean
}

const PinButton: FunctionComponent<PinButtonProps> = ({ checked, className, ...other }) => {
    return (<button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label="Show password"
        className={classNames('pin-button', className)}
        {...other}
    >
        <PinIcon
            fill={checked ? '#017AEE' : '#BCC4D8'}
            width={16}
            height={16}
        />
    </button>);
}

export default PinButton;