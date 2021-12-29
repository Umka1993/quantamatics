import React, {
    useState,
    useRef,
    FunctionComponent,
    SelectHTMLAttributes,
    CSSProperties,
    FormEvent,
    Dispatch,
    SetStateAction,
    useEffect,
    useCallback,
} from "react";
import "./styles/input.scss";
import "./styles/multiselect.scss";
import Checkbox from "../app-checkbox/checkbox";
import ComaList from "../coma-list";
import useCloseModal from "../../hooks/useCloseModal";
import MultiselectOptions from "./multiselect-options";
import classNames from 'classnames'
interface IInput extends SelectHTMLAttributes<HTMLSelectElement> {
    error?: string;
    label?: string;
    icon?: string;
    showLimit?: boolean;
    options: string[];
    selected: string[];
    setSelected: Dispatch<SetStateAction<string[]>>;
    errorMessage?: string,
    showError?: boolean,
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
    className
}) => {
    const [rightOffset, setRightOffset] = useState<number>(20);
    const labelRef = useRef<HTMLSpanElement>(null);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const rootElement = useRef<HTMLDivElement>(null);

    const [hideError, setHideError] = useState(false);

    const reCalcLabelWidth = () => {
        if (labelRef.current) {
            const { offsetWidth } = labelRef.current;
            setRightOffset(offsetWidth + 25);
        }
    };

    useEffect(() => {
        Boolean(selected.length) ? setHideError(true) : setHideError(false)
        reCalcLabelWidth();
    }, [selected])

    const openOptions = useCallback(() => setShowOptions(true), [setShowOptions])

    const toggleOptions = useCallback(() => setShowOptions(!showOptions), [showOptions, setShowOptions])

    useCloseModal(showOptions, setShowOptions);

    return (
        <div
            className={classNames("app-input multiselect", className)}
            ref={rootElement}
            onClick={(e) => e.stopPropagation()}
        >
            <label
                className={classNames("app-input__wrapper multiselect__search_wrap", {
                    'multiselect__search_wrap--opened': showOptions
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
                    className="app-input__field"
                    type="text"
                    placeholder={label ? " " : placeholder}

                    value={selected.join(', ')}
                    onFocus={openOptions}
                    onClick={toggleOptions}
                    readOnly

                    style={{
                        cursor: 'pointer',
                    }}
                />

                {label && (
                    <span className={classNames("app-input__label app-input__label--icon", {
                        'app-input__label--initial': !Boolean(selected.length)
                    })}>
                        <span ref={labelRef}>{label}</span>
                    </span>
                )}
            </label>
            {showError && !hideError && <p className="app-input__error">{errorMessage}</p>}


            {showOptions && (
                <MultiselectOptions
                    options={options}
                    selected={selected}
                    setSelected={setSelected}
                />
            )}
        </div>
    );
};

export default Multiselect;
