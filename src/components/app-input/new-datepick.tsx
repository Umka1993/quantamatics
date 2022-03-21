import React, {
    ChangeEventHandler,
    CSSProperties,
    FormEventHandler,
    InputHTMLAttributes,
    useRef,
    useState,
} from "react";
import "./styles/input.scss";
import "./styles/new-datepicker.scss";
import classNames from "classnames";
import CalendarIcon from "./assets/calendar.svg";
import { checkDateInputSupport } from "./utils/date-utils";
import 'react-day-picker/lib/style.css';
import enGb from "date-fns/locale/en-GB"
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";

registerLocale('enGB', enGb)


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

const DatePickerComponent: React.FunctionComponent<IDatePick> = ({
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

    const changeFallbackHandler: ChangeEventHandler<HTMLInputElement> = (evt) => {
        const { value } = evt.currentTarget;

        const formattedDate = new Date(value);

        const isInvalidDate = isNaN(formattedDate.getTime())
        !isInvalidDate && externalSetter && externalSetter(formattedDate);
        onChange && onChange(evt);
    };

    const [startDate, setStartDate] = useState(new Date());

    const [monthYear, setMonthYear] = useState<string>()

    const [year, setYear] = useState<string>()

    const [defaultCalendar, setDefaultCalendar] = useState(true)

    const handeChange = (e: Date) => {
        const changedValue = e.toLocaleDateString('en-us', {month: 'long', year: 'numeric'})
        const changedYear = e.toLocaleDateString('en-us', {year: 'numeric'})
        setMonthYear(changedValue)
        setYear(changedYear)
    }

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
                        "--label-width": `${labelRef.current ? labelRef.current.offsetWidth + 25 : 100}px`,
                    } as CSSProperties
                }
            >
                {/*{isSupport ? (*/}
                {/*    <input*/}
                {/*        className="app-input__field"*/}
                {/*        type="date"*/}
                {/*        aria-invalid={!!errorMessage}*/}
                {/*        aria-label={label}*/}
                {/*        placeholder={label}*/}
                {/*        required={required}*/}
                {/*        onChange={changeHandler}*/}
                {/*        defaultValue={formatToValue(valueAsDate)}*/}
                {/*        aria-required={required}*/}
                {/*        {...other}*/}
                {/*        ref={inputRef}*/}
                {/*        onInvalid={invalidHandler}*/}
                {/*        min={minDate ? formatToValue(minDate) : min}*/}
                {/*        max={maxDate ? formatToValue(maxDate) : max}*/}
                {/*    />*/}
                {/*) : (*/}
                {/*    <DayPickerInput*/}
                {/*        format='MM/dd/yyyy'*/}
                {/*        formatDate={(date, format) => dateFnsFormat(date, format)}*/}

                {/*        dayPickerProps={{*/}
                {/*            disabledDays: [minDate && {*/}
                {/*                before: minDate*/}
                {/*            }, maxDate && {*/}
                {/*                after: maxDate,*/}
                {/*            }]*/}
                {/*        }}*/}
                {/*        placeholder=''*/}

                {/*        value={valueAsDate || undefined}*/}
                {/*        inputProps={{*/}
                {/*            className: 'app-input__field',*/}
                {/*            onChange: changeFallbackHandler,*/}
                {/*        }}*/}

                {/*    />*/}
                {/*)}*/}
                {defaultCalendar ? <DatePicker
                        selected={startDate}
                        onChange={(date: Date) => setStartDate(date)}
                        className="app-input__field"
                        aria-invalid={!!errorMessage}
                        required={required}
                        aria-required={required}
                        minDate={new Date()}
                        locale="enGB"
                        showDisabledMonthNavigation
                        onCalendarOpen={() => handeChange(startDate)}
                        onMonthChange={(e) => handeChange(e)}>

                        {<div
                            className='monthYear'>
                            <span onClick={() => setDefaultCalendar(false)}>{monthYear}</span>
                        </div>}

                    </DatePicker> :
                    <DatePicker
                        selected={startDate}
                        onChange={(date: Date) => setStartDate(date)}
                        className="app-input__field"
                        aria-invalid={!!errorMessage}
                        required={required}
                        aria-required={required}
                        minDate={new Date()}
                        locale="enGB"
                        showDisabledMonthNavigation
                        showMonthYearPicker
                        onCalendarClose={() => setDefaultCalendar(true)}
                        showFourColumnMonthYearPicker={true}
                        onCalendarOpen={() => handeChange(startDate)}
                        onYearChange={(e) => handeChange(e)}>

                        {<div

                            className='monthYear'>
                            <span onClick={() => setDefaultCalendar(true)}>{year}</span>
                        </div>}

                    </DatePicker>
                }


                {label && (
                    <span
                        className="app-input__label app-input__label--icon app-input__label--shifted">
                        <span ref={labelRef}>{label}</span>
                        <CalendarIcon className="app-input__icon"/>
                    </span>
                )}
            </div>

            {errorMessage && <p className="app-input__error">{errorMessage}</p>}
        </div>
    );
};

export default DatePickerComponent;
