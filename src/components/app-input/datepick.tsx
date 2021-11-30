import React, {
    InputHTMLAttributes,
    useState,
    FormEventHandler,
    useRef,
    ChangeEventHandler,
    CSSProperties,
} from "react";
import "./styles/input.scss";
import classNames from "classnames";
import CalendarIcon from "./assets/calendar.svg";
import { checkDateInputSupport, formatToValue } from "./utils/date-utils";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { Moment } from "moment";

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
    label,
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
    const labelRef = useRef<HTMLSpanElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [errorMessage, setErrorMessage] = useState<string | undefined>(
        undefined
    );

    const invalidHandler: FormEventHandler<HTMLInputElement> = (evt) => {
        evt.preventDefault();
        setErrorMessage(inputRef.current?.validationMessage);
    };

    const changeHandler: ChangeEventHandler<HTMLInputElement> = (evt) => {
        const { valueAsDate } = evt.target;
        
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
                style={
                    {
                        "--label-width": `${labelRef.current?.offsetWidth}px`,
                    } as CSSProperties
                }
            >
                {isSupport ? (
                    <input
                        className="app-input__field"
                        type="date"
                        aria-invalid={!!errorMessage}
                        aria-label={label}
                        placeholder={label}
                        required={required}
                        onChange={changeHandler}
                        defaultValue={formatToValue(valueAsDate)}
                        aria-required={required}
                        {...other}
                        ref={inputRef}
                        onInvalid={invalidHandler}
                        min={minDate ? formatToValue(minDate) : min}
                        max={maxDate ? formatToValue(maxDate) : max}
                    />
                ) : (
                    <Datetime
                        dateFormat="MM/DD/YYYY"
                        onChange={(date) =>
                           { 
                            
                            if (date instanceof Object ) {
                                return externalSetter && externalSetter((date as Moment).toDate());
                            } else {
                                return date;
                            }
                            
                        }
                        }
                        timeFormat={false}
                        initialValue={valueAsDate}
                        inputProps={{
                            placeholder: 'MM/DD/YYYY',
                            className: 'app-input__fallback-date'
                        }}
                        isValidDate={(currentDate) => {                            
                            
                            if (minDate) {
                                return currentDate.toDate() > minDate;
                            }
                            return true;
                        }}
                    />
                )}
                {label && (
                    <span
                        className="app-input__label app-input__label--start"
                        ref={labelRef}
                        data-width={labelRef.current?.offsetWidth}
                    >
                        {label}
                        <CalendarIcon className="app-input__icon" />
                    </span>
                )}
            </div>

            {errorMessage && <p className="app-input__error">{errorMessage}</p>}
        </div>
    );
};

export default DatePick;
