import useToggle from "../../hooks/useToggle";
import Input, { AppInputProps } from "./Input";
import styles from "./input.module.scss";

import { ReactComponent as EyeSVG } from "./icons/eye.svg";
import { ReactComponent as ClosedEyeSVG } from "./icons/closed-eye.svg";
import { RegExpValidation } from "./utils/patterns";

interface PasswordInputs extends Omit<AppInputProps, "type | autoComplete"> {
	autoComplete?: "new-password" | "current-password";
}

export default function InputPassword({
	autoComplete = "new-password",
	...otherProps
}: PasswordInputs) {
	const [isPasswordShown, togglePasswordShown] = useToggle(false);

	const isNewPassword = autoComplete === "new-password";

	return (
		<Input
			type={isPasswordShown ? "text" : "password"}
			autoComplete={autoComplete}
			pattern={isNewPassword ? RegExpValidation.Password : undefined}
			minLength={isNewPassword ? 8 : undefined}
			maxLength={isNewPassword ? 32 : undefined}
			withToggler
			{...otherProps}
		>
			<button
				type="button"
				onClick={togglePasswordShown}
				title="Show/hide password"
				className={styles.toggle}
			>
				{isPasswordShown ? (
					<EyeSVG role="img" aria-label="Hide password" fill="currentColor" />
				) : (
					<ClosedEyeSVG
						role="img"
						aria-label="Show password"
						aria-description="Warning: this will display your password on the screen."
						fill="currentColor"
					/>
				)}
			</button>
		</Input>
	);
}
