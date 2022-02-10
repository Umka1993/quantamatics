import React, {
    useState,
    useRef,
    FunctionComponent,
    SelectHTMLAttributes,
    CSSProperties,
    useEffect,
    useLayoutEffect,
    Dispatch,
    SetStateAction,
} from "react";
import "./styles/input.scss";
import "./styles/multiselect.scss";
import useCloseModal from "../../hooks/useCloseModal";
import classNames from "classnames";
import MultiselectAssetOption, {
    MultiselectAssetOptionProps,
} from "./multiselect-asset-option";
import { AssetInOrganization, AssetListItem } from "../../types/asset";
import MultiselectAssetOrgOption from "./multiselect-asset-org-option";
interface IInput
    extends Omit<
    MultiselectAssetOptionProps,
    "option" | "selected" | "setSelected"
    >,
    SelectHTMLAttributes<HTMLSelectElement> {
    error?: string;
    label?: string;
    icon?: string;
    showLimit?: boolean;
    selected: Set<string | number> | AssetInOrganization[];

    setSelected:
    | Dispatch<SetStateAction<Set<string | number>>>
    | Dispatch<SetStateAction<AssetInOrganization[]>>;

    errorMessage?: string;
    showError?: boolean;

    options: AssetListItem[] | AssetInOrganization[];
    inputList?: string;
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
    inputList = "",
    type,
}) => {
    const isEditOrganization = Array.isArray(selected);
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
        setHideError(
            isEditOrganization ? Boolean(selected.length) : Boolean(selected.size)
        );

        reCalcLabelWidth();
    }, [selected]);

    useLayoutEffect(() => {
        if (isEditOrganization) {
            Boolean(selected.length)
                ? setList([...selected].map((asset) => asset.asset.name).join(", "))
                : setList("");
        } else {
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
        }
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
                            showError &&
                            !hideError &&
                            !(isEditOrganization
                                ? Boolean(selected.length)
                                : Boolean(selected.size)),
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
                {options.map((option: any) =>
                    isEditOrganization ? (
                        <MultiselectAssetOrgOption
                            key={option.assetId}
                            option={option}
                            selected={selected as any}
                            setSelected={setSelected as any}
                            disabled={disabled}
                        />
                    ) : (
                        <MultiselectAssetOption
                            key={option.assetId}
                            option={option}
                            selected={(selected as any).has(option.assetId)}
                            setSelected={setSelected as any}
                            disabled={disabled}
                            type={type}
                        />
                    )
                )}
            </div>
        </div>
    );
};

export default Multiselect;
