import {
	useState,
	useRef,
	FunctionComponent,
	CSSProperties,
	useEffect,
	useLayoutEffect,
	Dispatch,
	SetStateAction,
} from "react";
import "./styles/input.scss";
import "./styles/multiselect.scss";
import classNames from "classnames";

import { AssetListItem } from "../../types/asset";
import useClickOutside from "../../hooks/useClickOutside";

import style from "./styles/multiselect.module.scss";
import AssetOption from "../asset-option";
import { IInput } from "./input";
interface Props extends IInput {
	setSelected: Dispatch<SetStateAction<Set<string | number>>>;

	selected: Set<string | number>;
	errorMessage?: string;
	showError?: boolean;

	options: AssetListItem[];
	inputList?: string;
}

const Multiselect: FunctionComponent<Props> = ({
	options,
	label,
	placeholder,
	onFocus,
	setSelected,
	selected,
	errorMessage,
	showError,
	className,
	disabled,
	inputList = "",
	variant,
}) => {
	const [rightOffset, setRightOffset] = useState<number>(20);
	const labelRef = useRef<HTMLSpanElement>(null);
	const [showOptions, setShowOptions] = useState<boolean>(false);
	const rootElement = useRef<HTMLDivElement>(null);

	const [hideError, setHideError] = useState(false);
	const [list, setList] = useState(inputList);

	const reCalcLabelWidth = () => {
		if (labelRef.current) {
			const { offsetWidth } = labelRef.current;
			setRightOffset(offsetWidth + 25);
		}
	};

	useEffect(() => {
		setHideError(Boolean(selected.size));

		reCalcLabelWidth();
	}, [selected]);

	useLayoutEffect(() => {
		Boolean(selected.size)
			? setList(
				[
					...(options as AssetListItem[]).filter(({ assetId }) =>
						selected.has(assetId)
					),
				]
					.map(({ name }) => name)
					.join(", ")
			)
			: setList("");
	}, [selected]);

	/* const openOptions = useCallback(() => setShowOptions(true), [setShowOptions]) */

	const toggleOptions = () => {
		setShowOptions(!showOptions);
	};

	// useCloseModal(showOptions, setShowOptions);
	useClickOutside(rootElement, () => setShowOptions(false), showOptions);

	return (
		<div
			className={classNames(
				"app-input multiselect",
				{ "app-input--squared": variant === "squared" },
				className
			)}
			ref={rootElement}
			onClick={(e) => e.stopPropagation()}
		>
			<label
				className={classNames("app-input__wrapper multiselect__search_wrap", {
					"multiselect__search_wrap--opened": showOptions,
				})}
				style={
					label
						? ({
							"--label-width": `${rightOffset}px`,
						} as CSSProperties)
						: undefined
				}
			>
				<input
					className={classNames("app-input__field", {
						"app-input__field--error":
							showError && !hideError && !Boolean(selected.size),
					})}
					type="text"
					placeholder={label ? " " : placeholder}
					value={list}
					// onFocus={openOptions}
					onClick={toggleOptions}
					readOnly
					style={{
						cursor: "pointer",
					}}
					disabled={disabled}
				/>

				{label && (
					<span
						className={classNames("app-input__label app-input__label--icon")}
					>
						<span ref={labelRef}>{label}</span>
					</span>
				)}
			</label>
			{showError && !hideError && (
				<p className="app-input__error">{errorMessage}</p>
			)}

			<div className={style.options} hidden={!showOptions}>
				{options.map((option) => (
					<AssetOption
						key={option.assetId}
						selected={selected.has(option.assetId)}
						isSetByDefault={option.sharedByDefault}
						value={option.assetId}
						setSelected={setSelected}
						className={style.option}
					>
						{option.name}
					</AssetOption>
				))}
			</div>
		</div>
	);
};

export default Multiselect;
