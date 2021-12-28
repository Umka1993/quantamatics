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

interface IInput extends SelectHTMLAttributes<HTMLSelectElement> {
    error?: string;
    label?: string;
    icon?: string;
    showLimit?: boolean;
    options: string[];
    selected: string[];
    setSelected: Dispatch<SetStateAction<string[]>>;
}

const Multiselect: FunctionComponent<IInput> = ({
    options,
    label,
    placeholder,
    onFocus,
    setSelected,
    selected,
}) => {
    const [rightOffset, setRightOffset] = useState<number>(20);
    const labelRef = useRef<HTMLSpanElement>(null);
    const [showOptions, setShowOptions] = useState<boolean>(false);
    const rootElement = useRef<HTMLDivElement>(null);

    const reCalcLabelWidth = () => {
        if (labelRef.current) {
            const { offsetWidth } = labelRef.current;
            setRightOffset(offsetWidth + 25);
        }
    };

    const openOptions = useCallback(() => setShowOptions(true), [setShowOptions])

    function handleFocus(evt: any) {
        reCalcLabelWidth();
        setShowOptions(true);
        onFocus && onFocus(evt as any);
    }

    useCloseModal(showOptions, setShowOptions);

    return (
        <div
            className="app-input multiselect"
            ref={rootElement}
            onClick={(e) => e.stopPropagation()}
        >
            <label
                className="app-input__wrapper multiselect__search_wrap"
                style={
                    label
                        ? ({
                            "--label-width": `${rightOffset}px`,
                        } as CSSProperties)
                        : undefined
                }
            >
                <div
                    className="app-input__field"
                    tabIndex={0}
                    onFocus={openOptions}
                    onClick={openOptions}
                    style={{
                        cursor: 'pointer'
                    }}
                >
                    {selected && Boolean(selected.length) && (
                        <ComaList list={selected} style={{ pointerEvents: 'none' }} />
                    )}
                </div>

                {label && (
                    <span className="app-input__label app-input__label--icon">
                        <span ref={labelRef}>{label}</span>
                    </span>
                )}
            </label>
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
