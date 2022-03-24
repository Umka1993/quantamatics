import React, {
	useState,
	useEffect,
	useRef,
	ChangeEventHandler,
	FormEventHandler,
	CSSProperties,
	cloneElement,
} from "react";
import "./styles/input.scss";
import classNames from "classnames";
import getValidationMessage from "./utils/emailValidation";
import { RegExpValidation } from "../../data/enum";
import { IInput } from "./input";

interface IEmail extends IInput {
	hideError?: boolean;
}

export default function Email({
	className,
	label,
	placeholder,
	required,
	value,
	onChange,
	onInvalid,
	externalSetter,
	hideError = false,
	error,
	icon,
	name,
	onFocus,
	variant,
	showLimit,
	maxLength,
	...other
}: IEmail) {
	const inputRef = useRef<HTMLInputElement>(null);
	const labelRef = useRef<HTMLSpanElement>(null);
	const [errorMessage, setErrorMessage] = useState<string | undefined>(error);
	const [rightOffset, setRightOffset] = useState<number>(20);

	const changeHandler: ChangeEventHandler<HTMLInputElement> = (evt) => {
		const { value } = evt.target;
		externalSetter && externalSetter(value);
		onChange && onChange(evt);
	};

	useEffect(() => {
		reCalcLabelWidth();
		if (inputRef.current) {
			const message = getValidationMessage(inputRef.current.validity, error);
			inputRef.current.setCustomValidity(message);
			const { validationMessage } = inputRef.current;

			!validationMessage.length && setErrorMessage(undefined);
		}
	}, [inputRef.current?.validity, error, value]);

	const invalidHandler: FormEventHandler<HTMLInputElement> = (evt) => {
		evt.preventDefault();
		setErrorMessage(evt.currentTarget.validationMessage);
		onInvalid && onInvalid(evt);
	};

	const reCalcLabelWidth = () => {
		if (labelRef.current) {
			const { offsetWidth } = labelRef.current;
			setRightOffset(icon ? offsetWidth + 25 : offsetWidth + 5);
		}
	};

	return (
		<div
			className={classNames("app-input", className, {
				"app-input--validate": errorMessage,
				"app-input--squared": variant === "squared",
			})}
		>
			<label
				className="app-input__wrapper"
				style={
					label
						? ({
							"--label-width": `${rightOffset}px`,
						} as CSSProperties)
						: undefined
				}
			>
				<input
					type="email"
					inputMode="email"
					autoComplete="email"
					className="app-input__field"
					onChange={changeHandler}
					onFocus={(evt) => {
						reCalcLabelWidth();
						onFocus && onFocus(evt);
					}}
					aria-invalid={!!errorMessage}
					aria-label={errorMessage && hideError ? errorMessage : undefined}
					name={name}
					aria-describedby={name && errorMessage ? name + "_error" : undefined}
					placeholder={label ? " " : placeholder}
					required={required}
					aria-required={required}
					value={value || ""}
					maxLength={maxLength}
					{...other}
					ref={inputRef}
					onInvalid={invalidHandler}
					pattern={RegExpValidation.Email as string}
				/>

				{icon && cloneElement(icon, { className: "app-input__icon" })}

				{label && (
					<span
						className={classNames("app-input__label", {
							"app-input__label--icon": icon,
						})}
					>
						<span ref={labelRef}>
							{label}
							{showLimit &&
								maxLength &&
								` (${(value as string)?.length} / ${maxLength})`}
						</span>
					</span>
				)}
			</label>

			{errorMessage && !hideError && (
				<p
					id={name && errorMessage ? name + "_error" : undefined}
					className="app-input__error"
				>
					{errorMessage}
				</p>
			)}
		</div>
	);
}
