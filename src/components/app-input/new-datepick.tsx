import React, { CSSProperties, useRef, useState } from "react";
import "./styles/input.scss";
import "./styles/new-datepicker.scss";
import classNames from "classnames";
import { ReactComponent as CalendarIcon } from "./assets/calendar.svg";
import { checkDateInputSupport } from "./utils/date-utils";
import "react-day-picker/lib/style.css";
import enGb from "date-fns/locale/en-GB";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { ReactDatePicker, registerLocale } from "react-datepicker";
import DatePickerHeader from "./date-picker-header";
import { IInput } from "./input";
import moment from "moment";
import MaskedInput from "react-maskedinput";

registerLocale("enGB", enGb);

interface IDatePick extends Omit<IInput, "externalSetter"> {
	externalSetter?: (value: Date) => void;
	triggerValidity?: boolean;
	valueAsDate?: Date;
	minDate?: Date;
	maxDate?: Date;
	variant?: "squared";
}

export default function DatePickerComponent({
	className,
	itemRef,
	required,
	label,
	onChange,
	externalSetter,
	variant,
}: IDatePick) {
	const isSupport = checkDateInputSupport();
	const labelRef = useRef<HTMLSpanElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const datePickerRef = useRef(null);

	const [errorMessage, setErrorMessage] = useState<string | undefined>(
		undefined
	);

	// const invalidHandler: FormEventHandler<HTMLInputElement> = (evt) => {
	// 	evt.preventDefault();
	// 	setErrorMessage(inputRef.current?.validationMessage);
	// };
	//
	// const changeHandler: ChangeEventHandler<HTMLInputElement> = (evt) => {
	// 	const { valueAsDate } = evt.target;
	//
	// 	externalSetter && externalSetter(valueAsDate ? valueAsDate : new Date());
	// 	onChange && onChange(evt);
	// };
	//
	// const changeFallbackHandler: ChangeEventHandler<HTMLInputElement> = (evt) => {
	// 	const { value } = evt.currentTarget;
	//
	// 	const formattedDate = new Date(value);
	//
	// 	const isInvalidDate = isNaN(formattedDate.getTime());
	// 	!isInvalidDate && externalSetter && externalSetter(formattedDate);
	// 	onChange && onChange(evt);
	// };

	const [startDate, setStartDate] = useState<Date>(new Date());

	const [monthYear, setMonthYear] = useState<string>();

	const [year, setYear] = useState<string>();

	const [defaultCalendar, setDefaultCalendar] = useState(true);

	const [isOpacity, setOpacity] = useState(false);

	const [closeIsSelected, setCloseIsSelected] = useState<boolean>();

	const [isCorrectDate, setIsCorrectedDate] = useState<boolean>(false);

	const handleChange = (e: Date) => {
		const changedMonth = e.toLocaleDateString("en-us", {
			month: "long",
			year: "numeric",
		});
		const changedYear = e.toLocaleDateString("en-us", { year: "numeric" });
		setMonthYear(changedMonth);
		setYear(changedYear);
		setStartDate(e);
	};

	const onClose = () => {
		setOpacity(true);
		setTimeout(() => setCloseIsSelected(false), 200);
		setTimeout(() => setDefaultCalendar(true), 300);
	};

	const onOpen = () => {
		setOpacity(false);
		setCloseIsSelected(true);
		setDefaultCalendar(true);
	};

	const updateDate = (value: Date) => {
		const yesterday = moment().subtract(1, "days").endOf("day").toString();

		const isCorrectedValue =
			moment(value).isValid() && moment(value).isAfter(yesterday);

		setIsCorrectedDate(isCorrectedValue);

		if (isCorrectedValue) {
			const fieldValue = moment(value).format("MM/DD/YYYY");
			handleChange(new Date(fieldValue));
			onClose();
		} else {
			onOpen();
		}
	};

	return (
		<div
			className={classNames("app-input", className, {
				"app-input--validate": true,
				"app-input--squared": variant === "squared",
			})}
			ref={itemRef}
		>
			<div
				className="app-input__wrapper"
				style={
					{
						"--label-width": `${
							labelRef.current ? labelRef.current.offsetWidth + 25 : 100
						}px`,
					} as CSSProperties
				}
			>
				{defaultCalendar ? (
					<DatePicker
						selected={startDate}
						onChange={(date: Date) => updateDate(date)}
						className="app-input__field"
						aria-invalid={!!errorMessage}
						required={required}
						aria-required={required}
						minDate={new Date()}
						locale="enGB"
						showDisabledMonthNavigation
						onCalendarOpen={() => handleChange(startDate)}
						onMonthChange={(e) => handleChange(e)}
						dateFormat="MM/dd/yyyy"
						popperClassName={`${
							isOpacity ? "opacityBlock weeksCalendar" : "weeksCalendar"
						}`}
						shouldCloseOnSelect={false}
						onSelect={() => isCorrectDate && onClose()}
						onClickOutside={() => isCorrectDate && onClose()}
						open={closeIsSelected}
						onInputClick={() => onOpen()}
						onChangeRaw={(e) => updateDate(new Date(e.target.value))}
						placeholderText={"mm/dd/yyyy"}
						customInput={<MaskedInput mask="11/11/1111" />}
						renderCustomHeader={({
							prevMonthButtonDisabled,
							nextMonthButtonDisabled,
							decreaseMonth,
							increaseMonth,
						}) => (
							<DatePickerHeader
								decrease={decreaseMonth}
								increase={increaseMonth}
								title={monthYear}
								nextButtonDisabled={nextMonthButtonDisabled}
								prevButtonDisabled={prevMonthButtonDisabled}
								setDefaultCalendar={setDefaultCalendar}
								defaultCalendar={false}
							/>
						)}
					></DatePicker>
				) : (
					<DatePicker
						selected={startDate}
						onChange={() => setDefaultCalendar(true)}
						className="app-input__field"
						aria-invalid={!!errorMessage}
						required={required}
						aria-required={required}
						minDate={new Date()}
						locale="enGB"
						showDisabledMonthNavigation
						showMonthYearPicker
						focusSelectedMonth={true}
						onCalendarClose={() => isCorrectDate && onClose()}
						onClickOutside={() => isCorrectDate && onClose()}
						showFourColumnMonthYearPicker={true}
						onCalendarOpen={() => handleChange(startDate)}
						onSelect={(e) => handleChange(e)}
						onYearChange={(e) => handleChange(e)}
						shouldCloseOnSelect={false}
						dateFormat="MM/dd/yyyy"
						popperClassName={`${
							isOpacity ? "opacityBlock montCalendar" : "montCalendar"
						}`}
						open={closeIsSelected}
						placeholderText={"mm/dd/yyyy"}
						customInput={<MaskedInput mask="11/11/1111" />}
						renderCustomHeader={({
							decreaseYear,
							increaseYear,
							nextYearButtonDisabled,
							prevYearButtonDisabled,
						}) => (
							<DatePickerHeader
								decrease={decreaseYear}
								increase={increaseYear}
								title={year}
								nextButtonDisabled={nextYearButtonDisabled}
								prevButtonDisabled={prevYearButtonDisabled}
								setDefaultCalendar={setDefaultCalendar}
								defaultCalendar={true}
							/>
						)}
					></DatePicker>
				)}

				{label && (
					<span className="app-input__label app-input__label--icon app-input__label--shifted">
						<span ref={labelRef}>{label}</span>
						<CalendarIcon className="app-input__icon" />
					</span>
				)}
			</div>

			{errorMessage && <p className="app-input__error">{errorMessage}</p>}
		</div>
	);
}
