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
import "./styles/input.scss";
import "./styles/multiselect.scss";
import useCloseModal from "../../hooks/useCloseModal";
import classNames from "classnames";
import {MultiselectAssetOptionProps,} from "./multiselect-asset-option";
import {UserRole} from "../../data/enum";
import RolesOption from "./roles-option";
import useUser from "../../hooks/useUser";
import {useClickOutside} from "../../hooks/useClickOutside";


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
    selected: UserRole[];

    setSelected:
    | Dispatch<SetStateAction<Set<string | number>>>
    | Dispatch<SetStateAction<UserRole[]>>;

    errorMessage?: string;
    showError?: boolean;

    options: UserRole[];
    inputList?: string;
}

const RolesMultiselect: FunctionComponent<IInput> = ({
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
            Boolean(selected.length)
        );

        reCalcLabelWidth();
    }, [selected]);

    useLayoutEffect(() => {
        Boolean(selected.length)
            ? setList(
                [
                    ...(options as UserRole[]).filter((userRoleItem) =>
                        selected.includes(userRoleItem)
                    ),
                ]
                    .map((userRoleItem) => userRoleItem)
                    .join(", ")
            )
            : setList("");
    }, [selected]);

    /* const openOptions = useCallback(() => setShowOptions(true), [setShowOptions]) */

    const toggleOptions = () => setShowOptions(!showOptions);

    // useCloseModal(showOptions, setShowOptions);
    useClickOutside(rootElement, () => setShowOptions(false), showOptions)
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
                            !Boolean(selected.length)
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
                {options.map((option: any, index) =>
                    <RolesOption
                        key={index}
                        option={option}
                        selected={selected.includes(option)}
                        setSelected={setSelected as any}
                        disabled={disabled}
                        type={type}
                    />
                )}
            </div>
        </div>
    );
};

export default RolesMultiselect;
