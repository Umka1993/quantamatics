import Button, { ResetButton } from "../button";
import Headline from "../page-title";
import React, { FunctionComponent, HTMLProps, ReactNode } from "react";
import CheckSVG from "./assets/check.svg";
import style from "./SaveResetHeader.module.scss";
import classNames from "classnames";

interface SaveResetHeaderProps extends HTMLProps<HTMLDivElement> {
	headline: ReactNode;
	disableSave?: boolean;
	isSavedMessageActive?: boolean;
	disableReset?: boolean;
	headlineID?: string;
}

const SaveResetHeader: FunctionComponent<SaveResetHeaderProps> = ({
	headline,
	disableSave,
	disableReset,
	isSavedMessageActive,
	headlineID,
	className,
	title,
	...other
}) => {
	return (
		<header className={classNames(style.header, className)} {...other}>
			<Headline style={{ margin: 0 }} id={headlineID} pageTitle={title}>
				{headline}
			</Headline>
			<div className={style.buttons}>
				<ResetButton
					disabled={disableReset}
					onClick={({ currentTarget }) => currentTarget.blur()}
				>
					Cancel
				</ResetButton>

				<Button
					type="submit"
					className={style.save}
					disabled={disableSave}
					variant={isSavedMessageActive ? "valid" : undefined}
				>
					{isSavedMessageActive ? (
						<>
							<CheckSVG
								aria-hidden="true"
								width={17}
								height={17}
								fill="currentColor"
							/>
							Saved
						</>
					) : (
						"Save"
					)}
				</Button>
			</div>
		</header>
	);
};

export default SaveResetHeader;
