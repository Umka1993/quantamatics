import SaveResetHeader from "../save-reset-header/SaveResetHeader";
import {
	FunctionComponent,
	useEffect,
	useState,
	FormEvent,
	useRef,
	useCallback,
} from "react";
import { HTMLProps } from "react";
import Dialog from "../dialog";
import style from "./AssetModal.module.scss";
import { SortTableHeader } from "../sort-table-header/SortTableHeader";

import AssetRow from "./AssetRow";

import { SortDirection } from "../../data/enum";
import ISort from "../../types/sort-type";
import {
	useLazyGetOrganizationQuery,
	useUpdateOrganizationMutation,
} from "../../api/organization";
import { Organization } from "../../types/organization/types";
import useUser from "../../hooks/useUser";
import { AssetInOrganization } from "../../types/asset";

interface AssetModalProps extends Omit<HTMLProps<HTMLDivElement>, "selected"> {
	open: boolean;
	closeFunction: () => void;
	organization: Organization;
}

const AssetModal: FunctionComponent<AssetModalProps> = ({
	closeFunction,
	open,
	organization,
	...other
}) => {
	const user = useUser();
	const [noAssetError, setNoAssetError] = useState(false);

	const [hasChanges, setHasChanges] = useState(false);

	const [hasError, setError] = useState(false);

	const errorRef = useRef<HTMLParagraphElement>(null);

	const [selected, setSelected] = useState(organization.organizationAssets);

	const INITIAL_SORT = { name: "name", direction: SortDirection.Default };
	const [sort, setSort] = useState<ISort>(INITIAL_SORT);
	const [options, setOptions] = useState<AssetInOrganization[]>([]);

	const [update, { isLoading: isUpdating }] = useUpdateOrganizationMutation();
	const [getInfoOrg] = useLazyGetOrganizationQuery();

	const scrollRef = useRef<HTMLTableSectionElement>(null);

	function addBorderToTHeadOnScroll(this: HTMLTableSectionElement) {
		const thead = this.previousElementSibling;
		const activeClass = style["thead--active"];

		thead &&
			(this.scrollTop >= 5
				? thead.classList.add(activeClass)
				: thead.classList.remove(activeClass));
	}

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.addEventListener("scroll", addBorderToTHeadOnScroll);
			return () =>
				scrollRef.current?.removeEventListener(
					"scroll",
					addBorderToTHeadOnScroll
				);
		}
	}, [scrollRef.current]);

	const isUserOrganization = user?.organizationId === organization?.id;

	const setInitialOrg = useCallback(() => {
		if (organization) {
			setSelected(organization.organizationAssets);
		}
	}, [organization]);

	useEffect(() => {
		organization && setInitialOrg();
	}, [organization]);

	const assetsReset = useCallback(
		() => organization && setSelected(organization.organizationAssets),
		[organization]
	);

	function initOptions() {
		if (organization && user) {
			const prepareOptions = (allAssets: AssetInOrganization[]) => {
				const transformedOptions = [...allAssets].map((asset) => {
					const alreadySelectedAsset = organization.organizationAssets.find(
						({ assetId }) => assetId === asset.assetId
					);

					return alreadySelectedAsset === undefined
						? { ...asset, organizationId: organization.id }
						: alreadySelectedAsset;
				});
				sessionStorage.setItem(
					"asset-rows",
					JSON.stringify(transformedOptions)
				);

				setOptions(transformedOptions);
			};

			if (isUserOrganization) {
				setOptions(organization.organizationAssets);
			} else {
				getInfoOrg(user.organizationId as string)
					.unwrap()
					.then(({ organizationAssets: allAssets }) =>
						prepareOptions(allAssets)
					);
			}
		}
	}

	useEffect(initOptions, [organization, user]);

	function checkErrorsOrClose() {
		if (hasChanges && !hasError) {
			setError(true);
			return;
		}
		closeModal();
	}

	function closeModal() {
		hasError && setError(false);
		hasChanges && assetsReset();
		closeFunction();
	}

	function resetHandler(evt: FormEvent<HTMLFormElement>) {
		evt.preventDefault();
		closeModal();
	}

	useEffect(() => {
		if (hasError && errorRef.current) {
			errorRef.current.focus();
		}
	}, [hasError, errorRef.current]);

	useEffect(() => {
		if (selected.length) {
			setNoAssetError(false);
			setError(false);
		}
	}, [noAssetError, selected]);

	useEffect(() => {
		if (organization) {
			const isQuickChanged =
				organization.organizationAssets.length !== selected.length;

			if (isQuickChanged) {
				setHasChanges(true);
			} else {
				let isSharedChanged = false;
				selected.forEach((asset) => {
					const foundedInitialAsset = organization.organizationAssets.find(
						(initialAsset) => initialAsset.assetId === asset.assetId
					);

					if (
						foundedInitialAsset === undefined ||
						foundedInitialAsset.sharedByDefault !== asset.sharedByDefault
					) {
						isSharedChanged = true;
					}
				});
				setHasChanges(isSharedChanged);
			}
		}
	}, [selected, organization]);

	function submitHandler(evt: FormEvent<HTMLFormElement>) {
		evt.preventDefault();
		if (!selected.length) {
			setError(true);
			return setNoAssetError(true);
		}

		update({
			...organization,
			organizationAssets: [...selected].map((asset) => ({
				...asset,
				asset: null,
			})),
		})
			.unwrap()
			.then(closeFunction);
	}

	return (
		<Dialog
			id="asset-modal"
			variant="right-side"
			open={open}
			hasCloseButton={false}
			closeOnOutsideClick
			onRequestClose={checkErrorsOrClose}
			{...other}
		>
			<form
				className={style.root}
				onReset={resetHandler}
				onSubmit={submitHandler}
			>
				{open &&
					<SaveResetHeader
						headline="Assets"
						disableReset={isUpdating}
						disableSave={!hasChanges || noAssetError || isUpdating}
						isSavedMessageActive={isUpdating}
						headlineID="asset-modal-title"
						className={style.header}
					/>
				}
				{hasError && (
					<p className={style.error} role="alert" ref={errorRef} tabIndex={0}>
						{noAssetError
							? "Select asset permissions to assign to the organization."
							: "Changes have not been saved."}
					</p>
				)}

				<table className={style.table}>
					<thead className={style.thead}>
						<tr className={style.row}>
							<SortTableHeader
								name="name"
								text="Name"
								sort={sort}
								localRows={options}
								setSort={setSort}
								setLocalRows={setOptions}
								className={style.headline}
								localKey="asset-rows"
							/>
							<th className={[style.headline, style.action].join(" ")}>
								Assign
							</th>
							<th className={[style.headline, style.action].join(" ")}>
								Default
							</th>
						</tr>
					</thead>
					<tbody ref={scrollRef}>
						{Boolean(options.length) &&
							options.map((option) => (
								<AssetRow
									key={option.assetId}
									option={option}
									selected={selected}
									setSelected={setSelected}
									disabled={isUserOrganization}
								/>
							))}
					</tbody>
				</table>
			</form>
		</Dialog>
	);
};

export default AssetModal;
