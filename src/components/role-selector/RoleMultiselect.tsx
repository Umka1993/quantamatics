import React, {
	CSSProperties,
	Dispatch,
	FunctionComponent,
	SelectHTMLAttributes,
	SetStateAction,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import "../app-input/styles/input.scss";
import "../app-input//styles/multiselect.scss";
import classNames from "classnames";
import { UserRole } from "../../data/enum";
import { useClickOutside } from "../../hooks/useClickOutside";
import { Option } from "../../types/option";
import RoleOption from "./RoleOption";

interface RoleMultiSelectProp extends SelectHTMLAttributes<HTMLSelectElement> {
	error?: string;
	label?: string;
	icon?: string;
	showLimit?: boolean;

	selected: Set<UserRole>;
	setter: Dispatch<SetStateAction<Set<UserRole>>>;
	className?: string;
	options: Option<UserRole>[];

	errorMessage?: string;
	showError?: boolean;
	variant?: "squared";

	inputList?: string;
}

const RoleMultiSelect: FunctionComponent<RoleMultiSelectProp> = ({
	options,
	label,
	placeholder,
	onFocus,
	setter,
	selected,
	errorMessage,
	showError,
	className,
	variant,
	disabled,
	inputList = "",
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
	// useLayoutEffect(reCalcLabelWidth, [selected, labelRef.current])

	useEffect(() => {
		setHideError(Boolean(selected.size));

		reCalcLabelWidth();
	}, [selected]);

	useLayoutEffect(() => {
		Boolean(selected.size)
			? setList(
				[...options.filter((option) => selected.has(option.value))]
					.map((option) => option.label)
					.join(", ")
			)
			: setList("");
	}, [selected]);

	/* const openOptions = useCallback(() => setShowOptions(true), [setShowOptions]) */

	const toggleOptions = () => setShowOptions(!showOptions);

	// useCloseModal(showOptions, setShowOptions);
	useClickOutside(rootElement, () => setShowOptions(false), showOptions);
	return (
		<div
			className={classNames("app-input multiselect", { "app-input--squared": variant === "squared" }, className)}
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

			<div
				className={classNames("multiselect__options", {
					// 'multiselect__options--ods': options.length % 2 !== 0
				})}
				hidden={!showOptions}
			>
				{options.map((option) => (
					<div key={option.value} className="multiselect__option">
						<RoleOption
							selected={selected.has(option.value)}
							setter={setter}
							highlightOnChecked
							{...option}
						/>
					</div>
				))}
			</div>
		</div>
	);
};

export default RoleMultiSelect;
