import React, { Dispatch, FunctionComponent, SetStateAction } from "react";
import { Checkbox } from "../app-checkbox";
import classNames from "classnames";
import { AssetInOrganization } from "../../types/asset";
import PinButton from "../pin-button";
import style from "./AssetModal.module.scss";

export interface MultiselectAssetOptionProps {
	selected: AssetInOrganization[];
	setSelected: Dispatch<SetStateAction<AssetInOrganization[]>>;
	option: AssetInOrganization;
	disabled?: boolean;
}

const AssetRow: FunctionComponent<MultiselectAssetOptionProps> = ({
	selected,
	option,
	setSelected,
	disabled,
}) => {
	const selectedID = selected.findIndex(
		({ assetId }) => assetId === option.assetId
	);
	const isSelected = selectedID !== -1;
	const isPinned = isSelected ? selected[selectedID].sharedByDefault : false;

	const addToSelected = (sharedByDefault: boolean) =>
		setSelected([...selected, { ...option, sharedByDefault }]);

	const removeFromSelected = () =>
		setSelected(
			[...selected].filter(({ assetId }) => assetId !== option.assetId)
		);

	return (
		<tr
			className={classNames(style.row, style.asset, {
				[style["asset--selected"]]: isSelected || isPinned,
			})}
		>
			<td>{option.asset.name}</td>

			<td className={style.action}>
				<Checkbox
					name={option.asset.name}
					checked={isSelected}
					disabled={disabled}
					value={option.assetId}
					highlightOnChecked
					onClick={
						disabled
							? undefined
							: () => {
								isSelected ? removeFromSelected() : addToSelected(false);
							}
					}
				/>
			</td>
			<td className={style.action}>
				<PinButton
					checked={isPinned}
					size={21}
					onClick={() => {
						if (isSelected) {
							const copySelected = [...selected];
							copySelected[selectedID] = {
								...copySelected[selectedID],
								sharedByDefault: !isPinned,
							};
							setSelected(copySelected);
						} else {
							!isPinned && addToSelected(true);
						}
					}}
					aria-label="Set as default for all user accounts"
				/>
			</td>
		</tr>
	);
};

export default AssetRow;
