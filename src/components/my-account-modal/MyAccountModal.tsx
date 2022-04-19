import React, { FormEvent, useEffect, useRef, useState } from "react";

import Button, { ResetButton } from "../button";
import Password from "../app-input/password";

import { useChangePasswordMutation } from "../../api/account";
import Loader from "../loader";
import useUser from "../../hooks/useUser";
import { useLazyGetUserQuery } from "../../api/user";
import Dialog from "../dialog";
import { SideBarModalMode } from "../../types/sidebar-modal";
import style from "./my-account-modal.module.scss";
import MyAccountInfo from "./my-account-info";
import useBoolean from "../../hooks/useBoolean";
import { ReactComponent as KeyIcon } from "./key.svg";
import Headline from "../page-title";
import SaveResetHeader from "../save-reset-header/SaveResetHeader";
import { ReactComponent as CheckSVG } from "../save-reset-header/assets/check.svg";

interface IEditProfile {
	onRequestClose: () => void;
	open?: boolean;
}

export default function MyAccountModal({ onRequestClose, open }: IEditProfile) {
	const { id } = useUser();
	const [fetchUser, { data: user, isLoading: isLoadUser }] =
		useLazyGetUserQuery();

	useEffect(() => {
		fetchUser(id);
	}, [id]);

	const {
		value: showEditForm,
		setTrue: openPassword,
		setFalse: closePassword,
	} = useBoolean(false);

	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [wrongCurrent, setWrongCurrent] = useState<string | undefined>(
		undefined
	);
	const [compare, setCompare] = useState<string | undefined>(undefined);
	const [isSuccessUpdating, setSuccessUpdating] = useState(false)
	const [anyError, setAnyError] = useState(false)


	const formRef = useRef<HTMLFormElement>(null);

	const [
		updatePassword,
		{ isSuccess, isError, isLoading: isPasswordUpdating },
	] = useChangePasswordMutation();

	useEffect(() => {
		wrongCurrent && setWrongCurrent(undefined);
	}, [currentPassword]);

	useEffect(() => {
		if (!!newPassword.length && !!confirmPassword.length) {
			setCompare(
				newPassword !== confirmPassword
					? "The passwords do not match"
					: undefined
			);
		}
	}, [newPassword, confirmPassword]);

	const handlerSubmit = (evt: FormEvent<HTMLFormElement>) => {
		evt.preventDefault();
		const isValid = evt.currentTarget.reportValidity();

		if (isValid) {
			updatePassword({
				currentPassword,
				newPassword,
			}).unwrap();
		}
	};

	useEffect(() => {
		if (isError) {
			setWrongCurrent("Current password is incorrect");
		}
	}, [isError]);

	useEffect(() => {
		wrongCurrent && formRef.current && formRef.current.reportValidity();
	}, [wrongCurrent, formRef.current]);

	useEffect(() => {

		if(isSuccess){
			setSuccessUpdating(true)
			setTimeout(()=>setSuccessUpdating(false),1000)
			setTimeout(()=>isSuccess && resetHandler(),1000)
		}
	}, [isSuccess]);


	function resetHandler() {
		setCurrentPassword("");
		setNewPassword("");
		setConfirmPassword("");
		closePassword();
		onRequestClose();
	}



	return (
		<Dialog
			open={open}
			onRequestClose={resetHandler}
			closeOnOutsideClick
			id={SideBarModalMode.Account}
			wrapperClass={style.root}
			role="dialog"
			variant="right-side"
			hasCloseButton={false}
		>
			<div className={style.headlineWrap}>
				<Headline className={style.title} id={SideBarModalMode.Account}>
					My Account
				</Headline>
				<div className={style.buttons}>
					<ResetButton onClick={resetHandler}>Cancel</ResetButton>

					<Button
						type="submit"
						disabled={
							!Boolean(currentPassword && newPassword && confirmPassword )|| isPasswordUpdating ||
								Boolean(wrongCurrent) ||
								Boolean(compare) ||
								anyError
						}
						form="edit-pass-form"
						variant={isSuccessUpdating  ? "valid" : undefined}
					>
						{isSuccessUpdating ? (
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
			</div>

			{user !== undefined && (
				<>
					<MyAccountInfo
						user={user}
						className={style.info}
						isPasswordClosed={!showEditForm}
						openPassword={openPassword}
					>
						<button
							type="button"
							className={style.button}
							onClick={openPassword}
						>
							change
							<KeyIcon aria-hidden fill="currentColor" width={16} height={16} />
						</button>
					</MyAccountInfo>
				</>
			)}

			{showEditForm && (
				<form
					id="edit-pass-form"
					action=""
					className={style.form}
					onSubmit={handlerSubmit}
					ref={formRef}
				>
					<button
						type="button"
						className={[style.button, style.cancel].join(" ")}
						onClick={closePassword}
					>
						cancel
					</button>
					<Password
						placeholder="Current Password"
						value={currentPassword}
						externalSetter={setCurrentPassword}
						name="password"
						autoComplete="current-password"
						error={wrongCurrent}
						variant="squared"
					/>

					<Password
						autoComplete="new-password"
						value={newPassword}
						externalSetter={setNewPassword}
						placeholder="New Password"
						error={compare}
						hideError
						variant="squared"
					/>
					<Password
						autoComplete="new-password"
						value={confirmPassword}
						externalSetter={setConfirmPassword}
						placeholder="Confirm New Password"
						error={compare}
						variant="squared"
						setAnyError={setAnyError}

					/>
				</form>
			)}

			{(isLoadUser || user === undefined) && <Loader style={{ zIndex: 3 }} />}
		</Dialog>
	);
}
