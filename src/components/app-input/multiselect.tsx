import React, {
    useState,
    useRef,
    FunctionComponent,
    SelectHTMLAttributes,
    CSSProperties,
    useEffect,
} from "react";
import "./styles/input.scss";
import "./styles/multiselect.scss";
import useCloseModal from "../../hooks/useCloseModal";
import classNames from "classnames";
import MultiselectAssetOption, {
    MultiselectAssetOptionProps,
} from "./multiselect-asset-option";
import { AssetListItem } from "../../types/asset";
interface IInput
    extends Omit<MultiselectAssetOptionProps, "option" | "selected">,
    SelectHTMLAttributes<HTMLSelectElement> {
    error?: string;
    label?: string;
    icon?: string;
    showLimit?: boolean;
    selected: Set<string | number>;

    errorMessage?: string;
    showError?: boolean;

    options: AssetListItem[];
}

const Multiselect: FunctionComponent<IInput> = ({
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
    setAssetsToUpdateShared,
    assetsToUpdateShared,
    type,
}) => {
    const [rightOffset, setRightOffset] = useState<number>(20);
    const labelRef = useRef<HTMLSpanElement>(null);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const rootElement = useRef<HTMLDivElement>(null);

    const [hideError, setHideError] = useState(false);
    const [list, setList] = useState("");

    const reCalcLabelWidth = () => {
        if (labelRef.current) {
            const { offsetWidth } = labelRef.current;
            setRightOffset(offsetWidth + 25);
        }
    };

    useEffect(() => {
        if (Boolean(selected.size)) {
            setHideError(true);
            setList(
                [...options.filter(({ assetId }) => selected.has(assetId))]
                    .map(({ name }) => name)
                    .join(", ")
            );
        } else {
            setHideError(false);
            setList("");
        }
        reCalcLabelWidth();
    }, [selected]);

    /* const openOptions = useCallback(() => setShowOptions(true), [setShowOptions]) */

    const toggleOptions = () => setShowOptions(!showOptions);

    useCloseModal(showOptions, setShowOptions);

    return (
        <div
            className={classNames("app-input multiselect", className)}
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
                        className={classNames("app-input__label app-input__label--icon", {
                            "app-input__label--initial": !Boolean(selected.size),
                        })}
                    >
                        <span ref={labelRef}>{label}</span>
                    </span>
                )}
            </label>
            {showError && !hideError && (
                <p className="app-input__error">{errorMessage}</p>
            )}

            {showOptions && (
                <div
                    className={classNames("multiselect__options", {
                        // 'multiselect__options--ods': options.length % 2 !== 0
                    })}
                >
                    {Array.from(options).map((option) => (
                        <MultiselectAssetOption
                            key={option.assetId}
                            option={option}
                            selected={selected.has(option.assetId)}
                            setSelected={setSelected}
                            disabled={disabled}
                            setAssetsToUpdateShared={setAssetsToUpdateShared}
                            assetsToUpdateShared={assetsToUpdateShared}
                            type={type}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Multiselect;
