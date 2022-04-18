import { Dispatch, FunctionComponent, HTMLProps, SetStateAction } from "react";

import classNames from "classnames";
import style from "./style/AssetModalWithoutPin.module.scss";
import Checkbox from "../../app-checkbox";
import { AssetInOrganization } from "../../../types/asset";
import useChangeSet from "../../../hooks/useChangeSet";

export interface MultiselectAssetOptionProps extends HTMLProps<HTMLOptionElement> {
		selected: boolean;
		setSelected: Dispatch<SetStateAction<Set<string | number>>>;
	option: AssetInOrganization;
	disabled?: boolean;
		isSetByDefault?: boolean;

}

const AssetRowWithoutPin: FunctionComponent<MultiselectAssetOptionProps> = ({
	selected,
	option,
	setSelected,
	isSetByDefault,
	value,
	children,

}) => {

	const [addToSelected, removeFromSelected] = useChangeSet(
				value as string | number,
				setSelected
	);


	return (
		<tr
			className={classNames(style.row, style.asset, {
				[style["asset--selected"]]: selected,
				[style['asset--defaultAsset'] ]	: isSetByDefault,
			})}
		>
			<td className={`${isSetByDefault ? 'defaultAsset': ''} `}>{option.asset.name}</td>

			<td className={style.action}
				aria-label={'Is set as default'}>

				<Checkbox
					checked={selected}
					labelCheckbox={isSetByDefault ? "Is set as default" : undefined}
					disabled={isSetByDefault}
					highlightOnChecked
					onChange={({ currentTarget }) => currentTarget.checked ? addToSelected() : removeFromSelected()}
					name={'asset' + value}
				>
					{children}
				</Checkbox >
			</td>

		</tr>
	);
};

export default AssetRowWithoutPin;
