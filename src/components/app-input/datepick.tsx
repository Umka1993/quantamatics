import React, {
    InputHTMLAttributes,
    useState,
    useCallback,
    FormEventHandler,
    useRef,
    useEffect,
    ChangeEventHandler,
} from "react";
import "./styles/input.scss";
import classNames from "classnames";
import CalendarIcon from "./assets/calendar.svg";
// import SVG from '../SVG'
// import DatePicker from "react-datepicker";

interface IDatePick extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
    autoComplete?: "current-password" | "new-password";
    externalSetter?: (value: Date) => void;
    triggerValidity?: boolean;
    valueAsDate?: Date;
    minDate?: Date;
    maxDate?: Date;
}

const DatePick: React.FunctionComponent<IDatePick> = ({
    className,
    itemRef,
    required,
    value,
    valueAsDate,
    onChange,
    externalSetter,
    min,
    minDate,
    max,
    maxDate,
    ...other
}) => {
    
    const label = "Choose date";
    const inputRef = useRef<HTMLInputElement>(null);
    const initialVal = value ? value : formatToValue(valueAsDate)
    const initialDumb = valueAsDate ? formatToDummy(valueAsDate) : 'Enter date'

    const [innerValue, setInnerValue] = useState<string>(initialVal as string);
    const [dummy, setDummy] = useState<string>(initialDumb);

    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );

    const invalidHandler: FormEventHandler<HTMLInputElement> = (evt) => {
        evt.preventDefault();
        setErrorMessage(inputRef.current?.validationMessage);
    };

    function formatDate(date: Date) :string {
        return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
    }

    function formatToDummy(value : Date | null)  {
        const result  = value ? formatDate(value) : formatDate(new Date);
        return result.split("/").join(".")
    }

    function formatToValue(value : Date | undefined) : string  {
        const dataToFormat = value ? value : new Date();
        const temp = dataToFormat.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit'}).split('/')
        const result = `${temp[2]}-${temp[0]}-${temp[1]}`
        return result;
    }

    const changeHandler: ChangeEventHandler<HTMLInputElement> = (evt) => {
        const { value, valueAsDate } = evt.target;
        
        setInnerValue(value);
        setDummy(formatToDummy(valueAsDate));

        externalSetter && externalSetter(valueAsDate ? valueAsDate : new Date());
        onChange && onChange(evt);
    };

    return (
        <div
            className={classNames("app-input", className, {
                "app-input--validate": true,
            })}
            ref={itemRef}
        >
            <div
                className="app-input__wrapper"
            >
                <input
                    className="app-input__field"
                    type="date"
                    aria-invalid={!!errorMessage}
                    aria-label={label}
                    placeholder={label}
                    required={required}
                    onChange={changeHandler}
                    value={innerValue}
                    aria-required={required}
                    {...other}
                    ref={inputRef}
                    onInvalid={invalidHandler}
                    min={minDate ? formatToValue(minDate) : min}
                    max={maxDate ? formatToValue(maxDate) : max}
                />
                <span className={"app-input__dummy"} aria-hidden="true">
                    {dummy}
                    <CalendarIcon  className="app-input__icon" />
                </span>
            </div>

            {errorMessage && <p className="app-input__error">{errorMessage}</p>}
        </div>
    );
};

export default DatePick;
