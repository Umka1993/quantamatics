import { useEffect, useRef, useState } from "react";
import "./styles/create-organization.scss";
import { useNavigate, useParams } from "react-router-dom";
import Button, { ResetButton } from "../button";
import Input, { Email, Multiselect } from "../app-input/";
import Form from "./form";
import { AppRoute, Error, UserRole } from "../../data/enum";
import { useRegisterUserMutation } from "../../api/account";
import { useGetOrganizationQuery } from "../../api/organization";
import {
	useGetAllAssetsQuery,
	useLinkAssetToUserMutation,
} from "../../api/asset";
import useUser from "../../hooks/useUser";
import RoleSelector from "../role-selector";

export default function InviteUserForm() {
	const { id: organizationId } = useParams();

	const loggedUser = useUser();
	const isSuperAdmin = loggedUser?.userRoles.includes(UserRole.Admin);

	const { data: company } = useGetOrganizationQuery(
		organizationId as string
	);

	const { data: assets } = useGetAllAssetsQuery(organizationId as string);
	const [assetError, setAssetError] = useState(false);
	const [loading, setLoading] = useState(false);

	const [firstName, setFirstName] = useState<string>("");
	const [lastName, setLastName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [subscriptionEndDate, setSubscriptionEndDate] = useState<Date>(
		new Date()
	);
	const [assetPrepared, setAssetPrepared] = useState(false);

	const [assignedAssets, setAssignedAssets] = useState<Set<string | number>>(
		new Set()
	);

	useEffect(() => {
		if (assets) {
			const sharedAssets = assets.filter((asset) => asset.sharedByDefault);
			const sharedAssetsIDs = sharedAssets.map(({ assetId }) => assetId);
			setAssignedAssets(new Set(sharedAssetsIDs));
			setAssetPrepared(true);
		}
	}, [assets]);

	const [errors, setErrors] = useState<string | undefined>(undefined);

	const [userRoles, setRoles] = useState<Set<UserRole>>(new Set());

	const [
		register,
		{ isSuccess: isUserRegistered, isError, error, data: registeredUser },
	] = useRegisterUserMutation();
	const formRef = useRef<HTMLFormElement>(null);

	const [linkAsset] = useLinkAssetToUserMutation();

	useEffect(() => {
		setLoading(false);
		if (isError) {
			if ((error as any).data[0]?.code === "DuplicateUserName")
				setErrors(Error.DuplicateUser);
			else alert(JSON.stringify((error as any).data?.errors));
		}
	}, [isError]);

	const backLink = `/organizations/${company?.id}`;

	useEffect(() => {
		if (isUserRegistered) {
			//? Link new assets to user
			assignedAssets.forEach((assetId) => {
				linkAsset({
					assetId,
					userId: registeredUser.id,
				});
			});

			navigate(AppRoute.Success, {
				state: {
					headline: "An invitation email has been sent to the user",
					linkText: "Go Back",
					link: backLink,
				},
			});
		}
	}, [isUserRegistered]);

	useEffect(() => {
		assignedAssets.size && setAssetError(false);
	}, [assignedAssets]);

	const navigate = useNavigate();

	useEffect(() => {
		errors && setErrors(undefined);
	}, [email]);

	useEffect(() => {
		errors && formRef.current && formRef.current.reportValidity();
	}, [errors, formRef.current]);

	const addUserToOrg = () => {
		setLoading(true);
		setAssetError(false);
		if (assignedAssets.size) {
			register({
				firstName,
				lastName,
				email,
				organizationId: company?.id,
				companyName: company?.name,
				subscriptionEndDate,
				userRoles: Array.from(userRoles),
			});
		} else {
			setLoading(false);
			setAssetError(true);
		}
	};

	return (
		<Form
			className="create-organization"
			headline="Create a User Account"
			subtitle="Add a new user account to your organization"
			onSubmit={addUserToOrg}
			stopLoading={isError || assetError}
			forwardRef={formRef}
		>
			<div className="create-organization__fields">
				<Input
					externalSetter={setFirstName}
					required
					value={firstName}
					maxLength={100}
					label="First Name"
					variant="squared"
				/>
				<Input
					externalSetter={setLastName}
					required
					value={lastName}
					maxLength={100}
					label="Last Name"
					variant="squared"
				/>
				<Email
					externalSetter={setEmail}
					required
					value={email}
					maxLength={100}
					error={errors}
					label="Email Address"
					variant="squared"
				/>
				<DatePickerComponent
					minDate={new Date()}
					required
					label="Expiration Date"
					variant="squared"
				/>

				{assetPrepared && assets && (
					<Multiselect
						options={assets}
						selected={assignedAssets}
						setSelected={setAssignedAssets}
						label="Account Assets"
						errorMessage="Select asset permissions to assign to the user account."
						showError={assetError}
						type="user"
						variant="squared"
						inputList={[
							...assets.filter(({ assetId }) => assignedAssets.has(assetId)),
						]
							.map(({ name }) => name)
							.join(", ")}
					/>
				)}

				<RoleSelector
					isSuperAdmin={isSuperAdmin}
					defaultRoles={userRoles}
					externalSetter={setRoles}
					variant="squared"
				/>
			</div>
			<Button
				className="create-organization__submit"
				type="submit"
				disabled={
					!Boolean(
						firstName && lastName && email && subscriptionEndDate && !assetError
					)
				}
			>
				Create
			</Button>

			<ResetButton className="create-organization__cancel" href={backLink}>
				Cancel
			</ResetButton>
		</Form>
	);
}
