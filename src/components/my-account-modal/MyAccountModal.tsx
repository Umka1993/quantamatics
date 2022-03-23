import React, { FormEvent, useEffect, useRef, useState } from "react";

import Button, { ResetButton } from "../button";
import Password from "../app-input/password";

import "./styles/edit-account.scss";

import { useChangePasswordMutation } from "../../api/account";
import Loader from "../loader";
import useUser from "../../hooks/useUser";
import { useLazyGetUserQuery } from "../../api/user";
import Dialog from "../dialog";
import { SideBarModalMode } from "../../types/sidebar-modal";
import style from "./my-account-modal.module.scss";
import MyAccountInfo from "./my-account-info";
import useBoolean from "../../hooks/useBoolean";
import KeyIcon from "./key.svg";

interface IEditProfile {
	onRequestClose: () => void;
	open?: boolean;
}

const MyAccountModal: React.FunctionComponent<IEditProfile> = ({
	onRequestClose,
	open,
}) => {
	const { id } = useUser();
	const [fetchUser, { data: user, isLoading: isLoadUser }] =
		useLazyGetUserQuery();


	useEffect(() => {
		fetchUser(id);
	}, [id]);

	const { value: showEditForm, setTrue: openPassword, setFalse: closePassword } = useBoolean(false)

	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [wrongCurrent, setWrongCurrent] = useState<string | undefined>(
		undefined
	);
	const [compare, setCompare] = useState<string | undefined>(undefined);

	const formRef = useRef<HTMLFormElement>(null);


	const [updatePassword, { isSuccess, isError, error, isLoading }] =
		useChangePasswordMutation();

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
		isSuccess && onRequestClose();
	}, [isSuccess]);

	return (
		<Dialog
			open={open}
			onRequestClose={onRequestClose}
			closeOnOutsideClick
			headline="My Account"
			id={SideBarModalMode.Account}
			wrapperClass={style.root}
			role="dialog"
			variant="right-side"
			hasCloseButton={false}
		>
			{user !== undefined && (
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
			)}

			{showEditForm && (
				<form
					id="edit-pass-form"
					action=""
					className={style.form}
					onSubmit={handlerSubmit}
					onReset={onRequestClose}
					ref={formRef}
				>
					<button
						type="button"
						className={[style.button, style.cancel].join(' ')}
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
						variant='squared'
					/>

					<Password
						autoComplete="new-password"
						value={newPassword}
						externalSetter={setNewPassword}
						placeholder="New Password"
						error={compare}
						hideError
						variant='squared'
					/>
					<Password
						autoComplete="new-password"
						value={confirmPassword}
						externalSetter={setConfirmPassword}
						placeholder="Confirm New Password"
						error={compare}
						variant='squared'
					/>
				</form>
			)}

			<footer className={style.footer}>
				<ResetButton onClick={onRequestClose}>Cancel</ResetButton>
				<Button
					type="submit"
					disabled={!Boolean(currentPassword && newPassword && confirmPassword)}
					form="edit-pass-form"
				>
					Save
				</Button>
			</footer>

			{isLoading || isLoadUser || (user === undefined && <Loader />)}
		</Dialog>
	);
};

export default MyAccountModal;
