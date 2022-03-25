import classNames from "classnames";
import { useEffect } from "react";
import { useState, useRef } from "react";
import {
	Dispatch,
	FormEvent,
	InputHTMLAttributes,
	SetStateAction,
} from "react";
import styles from "./input.module.scss";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	externalSetter?: Dispatch<SetStateAction<string>>;
	externalErrorID?: string;
	invalid?: boolean;
	customError?: string;
}

export default function Input({
	className,
	label,
	externalSetter,
	onInput,
	onInvalid,
	id,
	externalErrorID,
	invalid,
	customError,
	...otherProps
}: Props) {
	const errorID = id ? `error-${id}` : undefined;
	const inputRef = useRef<HTMLInputElement>(null);

	const [error, setError] = useState("");

	function inputHandler(evt: FormEvent<HTMLInputElement>) {
		externalSetter && externalSetter(evt.currentTarget.value);
		onInput && onInput(evt);
	}

	function invalidHandler(evt: FormEvent<HTMLInputElement>) {
		evt.preventDefault();
		!externalErrorID && setError(evt.currentTarget.validationMessage);
		onInvalid && onInvalid(evt);
	}

	useEffect(() => {
		inputRef.current &&
			(customError
				? inputRef.current.setCustomValidity(customError)
				: inputRef.current.setCustomValidity(""));
	}, [customError, inputRef.current]);

	return (
		<>
			<input
				className={classNames(
					styles.input,
					invalid && styles.invalid,
					className
				)}
				aria-label={label}
				onInput={inputHandler}
				onInvalid={invalidHandler}
				id={id}
				ref={inputRef}
				aria-describedby={externalErrorID ? externalErrorID : errorID}
				{...otherProps}
			/>
			{error && (
				<p className={styles.error} aria-live="polite" id={errorID}></p>
			)}
		</>
	);
}
