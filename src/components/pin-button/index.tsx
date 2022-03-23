
import { ButtonHTMLAttributes, FunctionComponent } from 'react';
import { ReactComponent as PinIcon } from './assets/pin.svg';
import './style/pin-button.scss';
import classNames from 'classnames'

interface PinButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	checked?: boolean
	size?: number
}

const PinButton: FunctionComponent<PinButtonProps> = ({ checked, className, size = 16, ...other }) => {
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
			width={size}
			height={size}
		/>
	</button>);
}

export default PinButton;
