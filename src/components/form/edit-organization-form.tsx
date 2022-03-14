import Button from "../button";
import React, {
	FormEvent,
	FunctionComponent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { Organization } from "types/organization/types";
import Input, { InputURL } from "../app-input";
import style from "./styles/edit-organization.module.scss";
import { useUpdateOrganizationMutation } from "../../api/organization";
import useDuplicatedOrgValues from "../../hooks/useDuplicatedOrgValues";
import normalizeName from "../../services/normalize-name";
import addHTTPtoURL from "../../services/addHTTPtoURL";
import SaveResetHeader from "../save-reset-header/SaveResetHeader";
import DocIcon from "./assets/doc.svg";

interface EditOrganizationFormProps {
    organization: Organization;
    isHaveAccessToOrgList?: boolean;
    toggleAssetModal: () => void;
}

const EditOrganizationForm: FunctionComponent<EditOrganizationFormProps> = ({
	organization,
	toggleAssetModal,
}) => {
	const [
		update,
		{
			isSuccess: isUpdated,
			isLoading: isUpdating,
			isError: isUpdateError,
			error: updateError,
		},
	] = useUpdateOrganizationMutation();

	const [name, setName] = useState<string>("");
	const [customerCrmId, setCustomerID] = useState<string>("");
	const [customerCrmLink, setCustomerLink] = useState<string>("");
	const [comments, setComment] = useState<string | undefined>("");

	const [isSavedMessageActive, setSavedMessageActive] = useState(false);

	const [isChanged, setIsChanged] = useState(false);

	const formRef = useRef<HTMLFormElement>(null);

	const [
		duplicateOrgError,
		duplicateIdError,
		checkNameDuplicate,
		checkIdDuplicate,
	] = useDuplicatedOrgValues(
		formRef,
		name,
		customerCrmId,
		setName,
		setCustomerID
	);

	const setInitialOrg = useCallback(() => {
		setName(organization.name);
		setCustomerID(organization.customerCrmId);
		setCustomerLink(organization.customerCrmLink);
		setComment(organization.comments);
	}, [organization]);


	function submitHandler(evt: FormEvent<HTMLFormElement>) {
		evt.preventDefault();
		let duplicate = false;

		const normalizedName = normalizeName(name);

		if (normalizedName !== organization.name) {
			duplicate = checkNameDuplicate();
		}

		if (customerCrmId !== organization.customerCrmId) {
			duplicate = checkIdDuplicate() || duplicate;
		}

		if (duplicate) {
			return;
		}

		update({
			...organization,
			name: normalizedName,
			customerCrmId,
			customerCrmLink: addHTTPtoURL(customerCrmLink),
			comments,
		});
	}

	const resetHandler = (evt: FormEvent<HTMLFormElement>) => {
		evt.preventDefault();
		setInitialOrg();
	};

	useEffect(() => {
		if (isUpdateError) {
			alert((updateError as any).data?.errors);
		}
	}, [isUpdateError]);

	useEffect(() => {
		if (isUpdated) {
			setSavedMessageActive(true);
		}
	}, [isUpdated]);

	useEffect(() => {
		if (isSavedMessageActive) {
			setTimeout(() => setSavedMessageActive(false), 2000);
			setIsChanged(false);
			setCustomerLink(addHTTPtoURL(customerCrmLink));
		}
	}, [isSavedMessageActive]);

	useEffect(setInitialOrg, [organization]);

	useEffect(() => {
		if (organization) {
			const isQuickChanged =
                organization.name !== name ||
                organization.customerCrmId !== customerCrmId ||
                organization.customerCrmLink !== customerCrmLink ||
                organization.comments !== comments;
			setIsChanged(isQuickChanged);
		}
	}, [name, customerCrmId, customerCrmLink, comments, organization]);

	return (
		<form
			className={style.root}
			onSubmit={submitHandler}
			onReset={resetHandler}
			ref={formRef}
		>
			<SaveResetHeader
				headline="Edit Organization"
				disableReset={isUpdating}
				disableSave={
					!isChanged ||
                    isUpdating ||
                    Boolean(duplicateOrgError) ||
                    Boolean(duplicateIdError)
				}
				isSavedMessageActive={isSavedMessageActive}
			/>
			<div className={style.inputs}>
				<Input
					externalSetter={setName}
					value={name}
					label="Org. Name"
					maxLength={64}
					required
					className={style.input}
					error={duplicateOrgError}
					disabled={isUpdating}
					variant="squared"
				/>
				<Input
					externalSetter={setCustomerID}
					value={customerCrmId}
					label="CRM Customer ID"
					maxLength={32}
					className={style.input}
					error={duplicateIdError}
					disabled={isUpdating}
					variant="squared"
				/>

				<InputURL
					externalSetter={setCustomerLink}
					value={customerCrmLink}
					label="CRM Customer ID Link"
					maxLength={72}
					className={style.input}
					disabled={isUpdating}
					variant="squared"
				/>

				<Input
					externalSetter={setComment}
					value={comments}
					placeholder="Comments"
					label="Comments"
					maxLength={200}
					showLimit
					className={style.input}
					disabled={isUpdating}
					variant="squared"
				/>
			</div>
			<p className={style.assets}>
				<Button
					type="button"
					className={style.save}
					disabled={false}
					onClick={toggleAssetModal}
				>
					<DocIcon width={21} height={21} fill="currentColor" aria-hidden />
                    Manage Assets
				</Button>
                Manage assets for the organization
			</p>
		</form>
	);
};

export default EditOrganizationForm;
