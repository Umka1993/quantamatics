import React, {
    InputHTMLAttributes,
    useState,
    FormEventHandler,
    useRef,
    ChangeEventHandler,
} from "react";
import "./styles/input.scss";
import classNames from "classnames";
import CalendarIcon from "./assets/calendar.svg";
import { checkDateInputSupport, formatToValue, formatToDummy } from "./utils/date-utils";
// import SVG from '../SVG'
import DatePicker from "react-datepicker";

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
    const isSupport = checkDateInputSupport();

    const label = "Choose date";
    const inputRef = useRef<HTMLInputElement>(null);
    const initialVal = value ? value : formatToValue(valueAsDate);
    const initialDumb = valueAsDate ? formatToDummy(valueAsDate) : "Enter date";

    const [innerValue, setInnerValue] = useState<string>(initialVal as string);

    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );

    const invalidHandler: FormEventHandler<HTMLInputElement> = (evt) => {
        evt.preventDefault();
        setErrorMessage(inputRef.current?.validationMessage);
    };

    const changeHandler: ChangeEventHandler<HTMLInputElement> = (evt) => {
        const { value, valueAsDate } = evt.target;

        setInnerValue(value);
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
            {isSupport ? (
                <div className="app-input__wrapper">
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

                    <CalendarIcon className="app-input__icon" />

                </div>
            ) : (
                <div className="app-input__wrapper">
                    <DatePicker
                        // placeholderText={placeholder}
                        onChange={(date) => externalSetter && externalSetter(date as Date)}
                        minDate={minDate}
                        selected={valueAsDate}
                        showDisabledMonthNavigation
                        dateFormat="MM/dd/yyyy"
                        className="app-input__field"
                    />
                    <CalendarIcon className="app-input__icon" />
                </div>
            )}

            {errorMessage && <p className="app-input__error">{errorMessage}</p>}
        </div>
    );
};

export default DatePick;
