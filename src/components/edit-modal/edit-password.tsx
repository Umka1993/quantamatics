import React, { FormEvent, useEffect, useRef, useState } from "react";

import Button, { ResetButton } from "../button";
import Password from "../app-input/password";

import "./styles/edit-account.scss";
import { adaptRoles } from "../../services/baseService";
import KeyIcon from "./assets/key.svg";
import ComaList from "../coma-list";
import { useChangePasswordMutation } from "../../api/account";
import Loader from "../loader";
import { useGetAllUserAssetsQuery } from "../../api/asset";
import { AssetServerResponse } from "../../types/asset";
import { UserRole } from "../../data/enum";
import useUser from "../../hooks/useUser";
import { useLazyGetUserQuery } from "../../api/user";

interface IEditProfile {
	onClose: () => void;
}

export const EditPassword: React.FunctionComponent<IEditProfile> = ({
	onClose,
}) => {
	const { id, userRoles } = useUser();
	const [fetchUser, { data: user, isLoading: isLoadUser }] = useLazyGetUserQuery();

	useEffect(() => {
		fetchUser(id);
	}, [id])

	const [showEditForm, setShowEditForm] = useState(false);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [wrongCurrent, setWrongCurrent] = useState<string | undefined>(
		undefined
	);
	const [compare, setCompare] = useState<string | undefined>(undefined);

	const formRef = useRef<HTMLFormElement>(null);

	const { data: userAsset } = useGetAllUserAssetsQuery();

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
		isSuccess && onClose();
	}, [isSuccess]);

	return (isLoading || isLoadUser || user === undefined ? (
		<Loader />
	) : (
		<>
			<dl className="edit-account__list">
				<div className="edit-account__row">
					<dt className="edit-account__name">First Name</dt>
					<dd className="edit-account__value">{user.firstName}</dd>
				</div>
				<div className="edit-account__row">
					<dt className="edit-account__name">Last Name</dt>
					<dd className="edit-account__value">{user.lastName}</dd>
				</div>
				<div className="edit-account__row">
					<dt className="edit-account__name">Organization</dt>
					<dd className="edit-account__value">{user.companyName}</dd>
				</div>
				<div className="edit-account__row">
					<dt className="edit-account__name">Organization Role</dt>

					<dd className="edit-account__value">
						<ComaList list={adaptRoles(userRoles)} />
					</dd>
				</div>
				<div className="edit-account__row">
					<dt className="edit-account__name">Assigned Assets</dt>

					{userAsset && Boolean(userAsset.length) && (
						<dd className="edit-account__value">
							<ComaList
								list={userAsset.map(
									({ name }: AssetServerResponse) => name
								)}
							/>
						</dd>
					)}
				</div>
				<div className="edit-account__row">
					<dt className="edit-account__name">Email</dt>
					<dd className="edit-account__value">{user.email}</dd>
				</div>
				<div className="edit-account__row">
					<dt className="edit-account__name">Expiration Date</dt>
					<dd className="edit-account__value">
						{user.subscriptionEndDate.split(" ")[0]}
					</dd>
				</div>
				{!showEditForm && !user.userRoles.includes(UserRole.Demo) && (
					<div className="edit-account__row edit-account__row--inactive">
						<dt className="edit-account__name">Current Password</dt>
						<dd className="edit-account__value">
							<button
								type="button"
								className="edit-account__button"
								onClick={() => setShowEditForm(true)}
							>
								change
								<KeyIcon aria-hidden="true" fill="currentColor" />
							</button>
						</dd>
					</div>
				)}
			</dl>
			{showEditForm && (
				<form
					id="edit-pass-form"
					action=""
					className="edit-account__form edit-account__form--pass"
					onSubmit={handlerSubmit}
					onReset={onClose}
					ref={formRef}
				>
					<button
						type="button"
						className="edit-account__button edit-account__button--cancel"
						onClick={() => setShowEditForm(false)}
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
					/>

					<Password
						autoComplete="new-password"
						value={newPassword}
						externalSetter={setNewPassword}
						placeholder="New Password"
						error={compare}
						hideError
					/>
					<Password
						autoComplete="new-password"
						value={confirmPassword}
						externalSetter={setConfirmPassword}
						placeholder="Confirm New Password"
						error={compare}
					/>
				</form>
			)}

			<footer className="edit-account__footer">
				<ResetButton onClick={onClose}>Cancel</ResetButton>
				<Button
					type="submit"
					disabled={
						!Boolean(currentPassword && newPassword && confirmPassword)
					}
					form="edit-pass-form"
				>
					Save
				</Button>
			</footer>
		</>
	)
	);
};
