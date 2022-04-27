import Button, { ResetButton } from "../button";
import Headline from "../page-title";
import React, { FunctionComponent, HTMLProps, ReactNode } from "react";
import { ReactComponent as CheckSVG } from "./assets/check.svg";
import style from "./SaveResetHeader.module.scss";
import classNames from "classnames";
import { AssetInOrganization } from "../../types/asset";

interface SaveResetHeaderProps extends HTMLProps<HTMLDivElement> {
	headline: ReactNode;
	disableSave?: boolean;
	isSavedMessageActive?: boolean;
	disableReset?: boolean;
	headlineID?: string;
	closeModal?:()=>void

}

const SaveResetHeader: FunctionComponent<SaveResetHeaderProps> = ({
	headline,
	disableSave,
	disableReset,
	isSavedMessageActive,
	headlineID,
	className,
	title,
	closeModal,
	...other
}) => {
	return (
		<header className={classNames(style.header, className)}>
			<Headline style={{ margin: 0 }} id={headlineID} pageTitle={title}>
				{headline}
			</Headline>
			<div className={style.buttons}>
				<ResetButton
					disabled={disableReset}
					onClick={({ currentTarget }) => closeModal && closeModal()}
				>
					Cancel
				</ResetButton>

				<Button
					type="submit"
					className={style.save}
					disabled={disableSave}
					variant={isSavedMessageActive ? 'valid' : undefined}
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
