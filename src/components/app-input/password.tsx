import React, {
	useState,
	useEffect,
	useRef,
	InputHTMLAttributes,
	ChangeEventHandler,
	FormEventHandler,
	FunctionComponent
} from "react";
import "./styles/input.scss";
import classNames from "classnames";
import EyeSVG from "./assets/eye.svg";
import ClosedEyeSVG from "./assets/closed-eye.svg";
import getValidationMessage from "./utils/passwordValidation";
import { RegExpValidation } from "../../data/enum";
interface IPassword extends InputHTMLAttributes<HTMLInputElement> {
	error?: string;
	label?: string;
	autoComplete?: "current-password" | "new-password";
	externalSetter?: (value: string) => void;
	hideError?: boolean
	variant?: "squared";
}

const Password: FunctionComponent<IPassword> = ({
	className,
	label,
	placeholder,
	required,
	name,
	value,
	onChange,
	onInvalid,
	autoComplete,
	externalSetter,
	hideError,
	error,
	variant,
	...other
}) => {
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const [errorMessage, setErrorMessage] = useState<string | undefined>(
		undefined
	);

	const isNewPassword = autoComplete === "new-password";

	// check if any label is provided
	let labelText = label ? label : placeholder;
	labelText = labelText ? labelText : "Password input";

	// Show/hide pass
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.type = showPassword ? "text" : "password";
		}
	}, [showPassword]);

	const changeHandler: ChangeEventHandler<HTMLInputElement> = (evt) => {
		const { value } = evt.currentTarget;
		externalSetter && externalSetter(value);
		onChange && onChange(evt);
	};

	useEffect(() => {
		if (inputRef.current) {
			if (error) {
				inputRef.current.setCustomValidity(error);
			} else {
				inputRef.current.setCustomValidity('');
				if (isNewPassword) {
					const message = getValidationMessage(inputRef.current.validity);
					inputRef.current.setCustomValidity(message);
				}
			}
			errorMessage && setErrorMessage(undefined);
		}
	}, [value, inputRef.current?.validity, error])

	const invalidHandler: FormEventHandler<HTMLInputElement> = (evt) => {
		evt.preventDefault();
		setErrorMessage(evt.currentTarget.validationMessage);
		onInvalid && onInvalid(evt);
	};

	return (
		<div
			className={classNames("app-input", className, {
				"app-input--validate": errorMessage,
				"app-input--squared": variant === "squared",
			})}
		>
			<div className="app-input__wrapper">
				<input
					className="app-input__field"
					type="password"
					onChange={changeHandler}
					aria-invalid={!!errorMessage}
					aria-label={showPassword ? "Password is open" : labelText}
					name={name}
					aria-describedby={name && errorMessage ? name + "_error" : undefined}
					autoComplete={autoComplete}
					placeholder={placeholder}
					required={required}
					aria-required={required}
					pattern={isNewPassword ? RegExpValidation.Password as string : undefined}
					minLength={isNewPassword ? 8 : undefined}
					maxLength={isNewPassword ? 32 : undefined}
					value={value || ''}
					{...other}
					ref={inputRef}
					onInvalid={invalidHandler}

				/>

				<button
					type="button"
					role="switch"
					aria-checked={showPassword}
					aria-label="Show password"
					onClick={() => setShowPassword(!showPassword)}
					title="Show/hide password"
					className="app-input__toggle"
				>
					{showPassword ? (
						<EyeSVG aria-hidden="true" />
					) : (
						<ClosedEyeSVG aria-hidden="true" />
					)}
				</button>
			</div>

			{errorMessage && !hideError && (
				<p id={name ? name + "_error" : undefined} className="app-input__error">
					{errorMessage}
				</p>
			)}
		</div>
	);
};

export default Password;
