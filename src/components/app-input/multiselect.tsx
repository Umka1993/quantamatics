import React, {
    useState,
    useRef,
    FunctionComponent,
    SelectHTMLAttributes,
    CSSProperties,
    Dispatch,
    SetStateAction,
    useEffect,
} from "react";
import "./styles/input.scss";
import "./styles/multiselect.scss";
import ComaList from "../coma-list";
import useCloseModal from "../../hooks/useCloseModal";
import MultiselectOptions from "./multiselect-options";
import classNames from 'classnames'
import { AssetListItem } from "../../types/asset";
interface IInput extends SelectHTMLAttributes<HTMLSelectElement> {
    error?: string;
    label?: string;
    icon?: string;
    showLimit?: boolean;
    options: AssetListItem[];
    selected: AssetListItem[];
    setSelected: Dispatch<SetStateAction<AssetListItem[]>>;
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
    className,
    disabled
}) => {
    const [rightOffset, setRightOffset] = useState<number>(20);
    const labelRef = useRef<HTMLSpanElement>(null);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const rootElement = useRef<HTMLDivElement>(null);

    const [hideError, setHideError] = useState(false);
    const [list, setList] = useState('');

    const reCalcLabelWidth = () => {
        if (labelRef.current) {
            const { offsetWidth } = labelRef.current;
            setRightOffset(offsetWidth + 25);
        }
    };

    useEffect(() => {
        if (Boolean(selected.length)) {
            setHideError(true)
            setList([...selected.map(selectedItem => selectedItem.name)].join(', '))
        } else {
            setHideError(false)
            setList('')
        }
        reCalcLabelWidth();


    }, [selected])

    /* const openOptions = useCallback(() => setShowOptions(true), [setShowOptions]) */

    const toggleOptions = () => setShowOptions(!showOptions)

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
                    className={classNames("app-input__field", {
                        "app-input__field--error": showError && !hideError && !Boolean(selected.length)
                    })}
                    type="text"
                    placeholder={label ? " " : placeholder}

                    value={list}
                    // onFocus={openOptions}
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


            <MultiselectOptions
                options={options}
                selected={selected}
                setSelected={setSelected}
                hidden={!showOptions}
                disabled={disabled}
            />

        </div>
    );
};

export default Multiselect;
