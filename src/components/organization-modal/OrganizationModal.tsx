import Dialog from "../dialog";
import React, {
	FormEvent,
	FunctionComponent,
	HTMLProps,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import style from "./organization-modal.module.scss";
import { Organization } from "../../types/organization/types";
import SaveResetHeader from "../save-reset-header/SaveResetHeader";
import Input, { InputURL } from "../app-input/";
import { useUpdateOrganizationMutation } from "../../api/organization";
import useDuplicatedOrgValues from "../../hooks/useDuplicatedOrgValues";
import normalizeName from "../../services/normalize-name";
import addHTTPtoURL from "../../services/addHTTPtoURL";

interface OrganizationModalProps extends HTMLProps<HTMLDivElement> {
	open: boolean;
	closeFunction: () => void;
	organization: Organization;
}

const OrganizationModal: FunctionComponent<OrganizationModalProps> = ({
	open,
	closeFunction,
	organization,
}) => {
	const [
		update,
		{ isLoading: isUpdating, isError: isUpdateError, error: updateError },
	] = useUpdateOrganizationMutation();

	const [name, setName] = useState<string>(organization.name);
	const [customerCrmId, setCustomerID] = useState<string>(
		organization.customerCrmId
	);
	const [customerCrmLink, setCustomerLink] = useState<string>(
		organization.customerCrmLink
	);
	const [comments, setComment] = useState<string | undefined>(
		organization.comments
	);

	const [isChanged, setIsChanged] = useState(false);

	const [closeError, setCloseError] = useState("");

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
		}).then(closeFunction);
	}

	const resetHandler = (evt: FormEvent<HTMLFormElement>) => {
		evt.preventDefault();
		setInitialOrg();
		closeFunction();
	};

	useEffect(() => {
		if (isUpdateError) {
			alert((updateError as any).data?.errors);
		}
	}, [isUpdateError]);

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

	function checkErrorsOrClose() {
		if (closeError.length) {
			setCloseError("");
		} else {
			if (isChanged) {
				setCloseError(
					"Changes have not been saved."
				);
				return;
			}
		}

		setInitialOrg();
		closeFunction();
	}

	return (
		<Dialog
			open={open}
			onRequestClose={checkErrorsOrClose}
			closeOnOutsideClick
			id="org-modal"
			variant="right-side"
			hasCloseButton={false}
		>
			<form
				className={style.root}
				onReset={resetHandler}
				onSubmit={submitHandler}
				ref={formRef}
			>
				{open && (
					<SaveResetHeader
						title={`Edit ${organization.name}`}
						headline={
							<>
								Edit <span className={style.title}>{organization.name}</span>{" "}
							</>
						}
						disableReset={isUpdating}
						disableSave={
							!isChanged ||
							isUpdating ||
							Boolean(duplicateOrgError) ||
							Boolean(duplicateIdError)
						}
						isSavedMessageActive={isUpdating}
						headlineID="org-modal-title"
						className={style.header}
					/>
				)}

				{Boolean(closeError.length) && (
					<p className={style.error}>{closeError}</p>
				)}
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
			</form>
		</Dialog>
	);
};

export default OrganizationModal;
