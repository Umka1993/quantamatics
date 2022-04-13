import React, { FunctionComponent, ReactNode } from "react";
import style from "./style/user-account-detail.module.scss";
import Headline from "../../page-title";
import { UserKey } from "../../../data/enum";
import Button from "../../button";
import { ReactComponent as DocIcon } from "../../organization-info/assets/doc.svg";
import { IUser } from "../../../types/edit-profile/types";

interface IUserAccountHeader {
	selectedUser: IUser;
	toggleEditUserPage: () => void;
		toggleAssetsModal: () => void;
		children: ReactNode
}

export const UserAccountHeader: FunctionComponent<IUserAccountHeader> = ({
	selectedUser,
	toggleEditUserPage,
	toggleAssetsModal,
	children
}) => {
	return (
		<div className={style.headlineWrap}>
			<div className={style.headlineWrap__title}>
				{children}
				<Headline
					className={style.title}
					pageTitle={`User ${selectedUser[UserKey.Name]}`}
				>
					<span className={style.name}>{`${selectedUser[UserKey.Name]}'s`}</span>{" "}
								Account
				</Headline>
			</div>


			<div className={style.headlineWrap__buttons}>
				<Button className={style.cta} onClick={toggleEditUserPage}>
					Edit
				</Button>
				<Button
					className={style.cta}
					onClick={toggleAssetsModal}
				>
					<DocIcon width={21} height={21} fill="currentColor" aria-hidden />
					Manage Assets
				</Button>
			</div>
		</div>
	);
};
