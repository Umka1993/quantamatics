import SaveResetHeader from "../../save-reset-header/SaveResetHeader";
import {
	FormEvent,
	FunctionComponent,
	HTMLProps,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import Dialog from "../../dialog";
import style from "./style/AssetModalWithoutPin.module.scss";
import { SortTableHeader } from "../../sort-table-header/SortTableHeader";

import { SortDirection, UserKey } from "../../../data/enum";
import ISort from "../../../types/sort-type";
import {
	useLazyGetOrganizationQuery,
	useUpdateOrganizationMutation,
} from "../../../api/organization";
import { Organization } from "../../../types/organization/types";
import useUser from "../../../hooks/useUser";
import { AssetInOrganization } from "../../../types/asset";
import AssetRowWithoutPin from "./AssetRowWithoutPin";
import { IUser } from "../../../types/user";
import {
	useGetAllAssetsQuery,
	useGetUserAssetsQuery,
	useLinkAssetToUserMutation,
	useUnlinkAssetToUserMutation,
} from "../../../api/asset";
import { useParams } from "react-router";
import Loader from "../../loader";

export interface AssetModalProps
	extends Omit<HTMLProps<HTMLDivElement>, "selected"> {
	open: boolean;
	toggleAssetsModal: () => void;
	organization: Organization;
	user: IUser;
}

const AssetModalWithoutPin: FunctionComponent<AssetModalProps> = ({
	toggleAssetsModal,
	open,
	organization,
	user,
	...other
}) => {

	const { id: orgId } = useParams();
	const [noAssetError, setNoAssetError] = useState(false);

	const [hasChanges, setHasChanges] = useState(false);

	const [hasError, setError] = useState(false);

	const errorRef = useRef<HTMLParagraphElement>(null);
	const { data: serverSelectedAssets, isSuccess: isAssetsLoaded } =
		useGetUserAssetsQuery(user.id);

	const [selected, setSelected] = useState<AssetInOrganization[]>(
		organization.organizationAssets
	);

	const [assignedAssets, setAssignedAssets] = useState<Set<string | number>>(
		new Set()
	);

	const INITIAL_SORT = { name: "name", direction: SortDirection.Default };
	const [sort, setSort] = useState<ISort>(INITIAL_SORT);
	const [options, setOptions] = useState<AssetInOrganization[]>([]);
	const [linkAsset, { isLoading: isAssetLinking }] =
		useLinkAssetToUserMutation();
	const [unlinkAsset, { isLoading: isAssetUnLinking  }] =
		useUnlinkAssetToUserMutation();
	const { data: assets } = useGetAllAssetsQuery(orgId as string);

	const [update, { isLoading: isUpdating }] = useUpdateOrganizationMutation();
	const [getInfoOrg] = useLazyGetOrganizationQuery();
	const [isAssetChanged, setAssetChanged] = useState(false);

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
		if (serverSelectedAssets && assets) {
			const selectedAssets: Set<string | number> = new Set(
				serverSelectedAssets.map(({ id }) => id)
			);
			setAssignedAssets(selectedAssets);
		}
	}, [serverSelectedAssets, assets]);

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


	function updateAssets() {
		// ? Link new assets to user

		assignedAssets.forEach((assetId) => {
			const alreadySelectedAsset = serverSelectedAssets?.find(
				(element) => element.id === assetId
			);

			if (alreadySelectedAsset === undefined) {
				linkAsset({
					assetId,
					userId: user.id,
				});
			}
		});

		// ? Unlink old assets from user
		serverSelectedAssets?.forEach((alreadySelectedAsset) => {
			!assignedAssets.has(alreadySelectedAsset.id) &&
				unlinkAsset({
					assetId: alreadySelectedAsset.id,
					userId: user.id,
				});
		});
	}

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
		// hasChanges && assetsReset();
		setAssetChanged(false)
		setAssignedAssets(
			new Set(serverSelectedAssets && serverSelectedAssets.map(({ id }) => id))
		);
		toggleAssetsModal();
	}

	function resetHandler(evt: FormEvent<HTMLFormElement>) {
		evt.preventDefault();
		closeModal();
	}

	useEffect( ()=>{
		if(isAssetUnLinking || isAssetLinking){
			setTimeout( ()=>toggleAssetsModal(),500)
		}
	},[isAssetUnLinking || isAssetLinking])

	useEffect(() => {
		if (hasError && errorRef.current) {
			errorRef.current.focus();
		}
	}, [hasError, errorRef.current]);

	useEffect(() => {
		if (selected && selected.length) {
			setNoAssetError(false);
			setError(false);
		}
	}, [noAssetError, selected]);

	useEffect(() => {
		if (assets) {
			const changedAssets: any[] = [];
			const arrAssignedAssets = Array.from(assignedAssets);
			assets.forEach((asset) => {
				for (let i = 0; i <= arrAssignedAssets.length; i++) {
					if (asset.assetId == arrAssignedAssets[i]) {
						changedAssets.push(asset);
					}
				}
			});
			setSelected(changedAssets);
		}
	}, [assignedAssets]);

	function checkIfAssetChanged() {
		let changed = false;

		serverSelectedAssets?.forEach((asset) => {
			if (!assignedAssets.has(asset.id)) {
				changed = true;
			}
		});

		!changed &&
			assignedAssets.forEach((assetId) => {
				const hasAsset = serverSelectedAssets?.findIndex((serverAsset) => {
					serverAsset.id === assetId;
				});

				if (hasAsset === -1) {
					return true;
				}
			});

		return changed;
	}

	useEffect(() => {
		if (serverSelectedAssets) {
			const isSameAmount = assignedAssets.size === serverSelectedAssets.length;
			setAssetChanged(!isSameAmount || (isSameAmount && checkIfAssetChanged()));
		}
	}, [assignedAssets, serverSelectedAssets, isAssetChanged]);

	useEffect(() => {
		if (organization && selected && serverSelectedAssets) {
			const isQuickChanged = serverSelectedAssets.length !== selected.length;

			if (isQuickChanged) {
				setHasChanges(true);
			} else {
				// let isSharedChanged = false;
				// selected.forEach((asset) => {
				// 	const foundedInitialAsset = organization.organizationAssets.find(
				// 		(initialAsset) => initialAsset.assetId === asset.assetId
				// 	);
				//
				// 	if (
				// 		foundedInitialAsset === undefined ||
				// 		foundedInitialAsset.sharedByDefault !== asset.sharedByDefault
				// 	) {
				// 		isSharedChanged = true;
				// 	}
				// });
				setHasChanges(checkIfAssetChanged());
			}
		}
	}, [selected, organization]);

	function submitHandler(evt: FormEvent<HTMLFormElement>) {
		evt.preventDefault();
		if (!selected?.length) {
			setError(true);
			return setNoAssetError(true);
		}

		updateAssets();
	}

	return (
		<Dialog
			id="asset-modal"
			variant="right-side"
			open={open}
			hasCloseButton={false}
			closeOnOutsideClick
			onRequestClose={checkErrorsOrClose}
			hasWrapper={false}
			{...other}
		>
			<form
				className={style.root}
				onReset={resetHandler}
				onSubmit={submitHandler}
			>
				{open && (

					<SaveResetHeader
						title='Assets'
						headline={
							<>
								Assets <span className={style.title}></span>{" "}
							</>
						}
						disableReset={isAssetUnLinking || isAssetLinking}
						disableSave={!isAssetChanged || isAssetUnLinking || isAssetLinking || hasError}
						isSavedMessageActive={isAssetUnLinking || isAssetLinking}
						headlineID="asset-modal"
						className={style.header}
					/>
				)}
				{hasError && (
					<p className={style.error} role="alert" ref={errorRef} tabIndex={0}>
						{noAssetError
							? "Select asset permissions to assign to the user account."
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
						</tr>
					</thead>
					<tbody ref={scrollRef}>
						{Boolean(options.length) &&
							options.map((option) => (
								<AssetRowWithoutPin
									key={option.assetId}
									option={option}
									selected={assignedAssets.has(option.assetId)}
									disabled={false}
									isSetByDefault={option.sharedByDefault}
									value={option.assetId}
									setSelected={setAssignedAssets}
								/>
							))}
					</tbody>
				</table>
			</form>
		</Dialog>
	);
};

export default AssetModalWithoutPin;