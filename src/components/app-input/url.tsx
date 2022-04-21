import React, {
	useState,
	useEffect,
	useRef,
	ChangeEventHandler,
	FormEventHandler,
	CSSProperties,
	FunctionComponent
} from "react";
import "./styles/input.scss";
import classNames from "classnames";
import { IInput } from "./input";


const Input: FunctionComponent<IInput> = ({
	className,
	label,
	placeholder,
	required,
	value,
	onChange,
	onInvalid,
	autoComplete,
	externalSetter,
	error,
	icon,
	maxLength,
	showLimit,
	variant,
	invalid,
	setAnyError,
	...other
}) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const labelRef = useRef<HTMLSpanElement>(null);
	const [errorMessage, setErrorMessage] = useState<string | undefined>(
		undefined
	);
	const [rightOffset, setRightOffset] = useState<number>(20);

	const changeHandler: ChangeEventHandler<HTMLInputElement> = (evt) => {
		externalSetter && externalSetter(evt.currentTarget.value)
		onChange && onChange(evt);
	};

	useEffect(() => {
		reCalcLabelWidth();
		if (inputRef.current) {
			const { validationMessage, validity, value, required } = inputRef.current;

			const isOnlySpaces = /^\s+$/.test(value);

			if (
				(required && (validity.valueMissing || isOnlySpaces)) ||
				(!validity.valueMissing && validity.patternMismatch)
			) {
				inputRef.current.setCustomValidity(
					`This is not valid ${label ? label : ""}`
				);
			} else {
				inputRef.current.setCustomValidity("");
			}
			error
				? inputRef.current.setCustomValidity(error)
				: setErrorMessage(undefined);

			if (!validationMessage.length) {
				setErrorMessage(undefined);
			}
		}
	}, [inputRef.current?.validity, error, value]);

	const invalidHandler: FormEventHandler<HTMLInputElement> = (evt) => {
		evt.preventDefault();

		setErrorMessage(inputRef.current?.validationMessage);
		onInvalid && onInvalid(evt);
	};

	useEffect(() => {
		if (errorMessage) {
			setAnyError && setAnyError(true);
		} else {
			setAnyError && setAnyError(false);
		}
	}, [errorMessage]);

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
				"app-input--squared": variant === "squared"
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
					className={classNames("app-input__field", {
						"app-input__field--error": invalid,
					})}
					onChange={changeHandler}
					aria-invalid={!!errorMessage}
					autoComplete={autoComplete}
					placeholder={label ? " " : placeholder}
					required={required}
					aria-required={required}
					value={value || ""}
					maxLength={maxLength}
					type="text"
					pattern='.{1,}\..{1,}'
					{...other}
					ref={inputRef}
					onInvalid={invalidHandler}
				/>
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

			{errorMessage && <p className="app-input__error">{errorMessage}</p>}
		</div>
	);
};

export default Input;
