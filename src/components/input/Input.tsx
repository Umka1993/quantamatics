import classNames from "classnames";

// @ts-expect-error Waiting update type package to React 18
import { useEffect, useId } from "react";

import {
	useState,
	Dispatch,
	FormEvent,
	InputHTMLAttributes,
	SetStateAction,
} from "react";

import styles from "./input.module.scss";
import useSetCustomError from "./utils/useSetCustomError";

export interface AppInputProps extends InputHTMLAttributes<HTMLInputElement> {
	label?: string;
	externalSetter?: Dispatch<SetStateAction<string>>;
	externalErrorID?: string;
	invalid?: boolean;
	customError?: string;
	withToggler?: boolean;
	resetErrorOnInput?: boolean;
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
	withToggler,
	children,
	resetErrorOnInput = true,
	...otherProps
}: AppInputProps) {
	const [error, setError] = useState("");

	const identifier = id || useId();
	const errorID = `error-${identifier}`;

	function resetErrorMessage() {
		error && setError("")
	}

	const inputRef = useSetCustomError(customError);

	useEffect(() => { !customError && resetErrorMessage() }, [customError])

	function inputHandler(evt: FormEvent<HTMLInputElement>) {
		externalSetter && externalSetter(evt.currentTarget.value);
		resetErrorOnInput && resetErrorMessage();
		onInput && onInput(evt);
	}

	function invalidHandler(evt: FormEvent<HTMLInputElement>) {
		evt.preventDefault();
		!externalErrorID && setError(evt.currentTarget.validationMessage);
		onInvalid && onInvalid(evt);
	}

	return (
		<p className={styles.root}>
			<input
				className={classNames(
					styles.input,
					{
						[styles.invalid]: invalid,
						[styles.withToggler]: withToggler,
						[styles.validate]: error.length,
					},
					className
				)}
				aria-label={label}
				onInput={inputHandler}
				onInvalid={invalidHandler}
				id={identifier}
				ref={inputRef}
				aria-describedby={externalErrorID ? externalErrorID : errorID}
				aria-invalid={invalid}
				{...otherProps}
			/>
			{error && (
				<span className={styles.error} aria-live="polite" id={errorID}>
					{error}
				</span>
			)}

			{children}
		</p>
	);
}
