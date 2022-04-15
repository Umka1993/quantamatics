import React, { CSSProperties, useEffect, useRef, useState } from "react";
import "./styles/input.scss";
import "./styles/new-datepicker.scss";
import classNames from "classnames";
import { ReactComponent as CalendarIcon } from "./assets/calendar.svg";
import { checkDateInputSupport } from "./utils/date-utils";
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
	subscriptionDate: Date;
	setSubscriptionDate: (arg: Date) => void;
	isCancel?: boolean;
}

export default function DatePickerComponent({
	className,
	itemRef,
	required,
	label,
	subscriptionDate,
	setSubscriptionDate,
	variant,
	isCancel,
}: IDatePick) {
	const isSupport = checkDateInputSupport();
	const labelRef = useRef<HTMLSpanElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const datePickerRef = useRef<HTMLInputElement>();

	const [errorMessage, setErrorMessage] = useState<string | undefined>(
		undefined
	);

	const [startDate, setStartDate] = useState<Date>(subscriptionDate);

	const [monthYear, setMonthYear] = useState<string>();

	const [year, setYear] = useState<string>();

	const [defaultCalendar, setDefaultCalendar] = useState(true);

	const [isOpacity, setOpacity] = useState(false);

	const [closeIsSelected, setCloseIsSelected] = useState<boolean>();

	const [isCorrectDate, setIsCorrectedDate] = useState<boolean>(true);

	const [inputValue, setInputValue] = useState<string>(
		moment(subscriptionDate).format("MM/DD/YYYY").toString()
	);

	const [mask, setMask] = useState("11/11/1111");

	const [isErrorValue, setIsError] = useState<boolean>();

	const [selectedDate, setSelectedDate] = useState<Date>(startDate);

	useEffect(() => {

		if (isCancel) {
			setSelectedDate(subscriptionDate);
			setInputValue(moment(subscriptionDate).format("MM/DD/YYYY").toString());
		}
	}, [isCancel]);

	useEffect(() => {
		const maskItemCounter = inputValue.split("/").length;
		const input = document.getElementById("DatePicker") as HTMLInputElement;
		if (isErrorValue) {
			setInputValue(inputValue);
			if (maskItemCounter === 1) {
				setMask("11/");
				setIsError(false);
			}
			if (maskItemCounter === 2) {
				setMask("11/11");
				input && input.setSelectionRange(3, 3);
				setIsError(false);
			}
			if (maskItemCounter === 3) {
				setMask("11/11/1111");
				input && input.setSelectionRange(6, 6);
				setIsError(false);
			}
		} else {
			setMask("11/11/1111");
		}
	}, [selectedDate, isErrorValue]);

	const handleChange = (e: Date) => {
		const changedMonth = e.toLocaleDateString("en-us", {
			month: "long",
			year: "numeric",
		});
		const changedYear = e.toLocaleDateString("en-us", { year: "numeric" });
		setMonthYear(changedMonth);
		setYear(changedYear);
		setSubscriptionDate(new Date(e));
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
	const updateDate = (value: string) => {
		const manualChange = value && value.split("/").length > 1;
		const yesterday = moment().subtract(1, "days").endOf("day").toString();
		const yearToday = moment().year();
		const monthToday = moment().month() + 1;
		const today = moment().date();
		const invalidValue = "_";

		const isCorrectedValue =
			value !== undefined &&
			moment(value).isValid() &&
			moment(value).isAfter(yesterday);

		setIsCorrectedDate(isCorrectedValue);

		if (manualChange) {
			const arr = value.split("/");
			const selectedMonth = Number(arr[0]);
			const selectedDay = Number(arr[1]);
			const selectedYear =
				Boolean(Number(arr[2])) || Number(arr[2]) == 0
					? Number(arr[2])
					: new Date().getFullYear();
			const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
			const errorValue: string[] = [...arr];

			const setErrorValue = (
				selectedValue: number,
				todayValue: number
			): string => {
				const selected = String(selectedValue).split("");
				const yearToday = String(todayValue).split("");

				const val: string[] = [];

				for (let i = 0; i <= selected.length; i++) {
					for (let i = 0; i <= yearToday.length; i++) {
						if (selected[i] === yearToday[i]) {
							val.push(selected[i]);
						} else {
							val.push(invalidValue);
						}
					}
					if (val.length === 5) {
						break;
					}
				}
				return val.join("");
			};

			if (
				selectedMonth > 12 ||
				(selectedMonth < monthToday && selectedYear == yearToday)
			) {
				errorValue[0] = invalidValue;
				errorValue[1] = invalidValue;
				errorValue.splice(1, 2);
				setIsError(true);
			}

			if (
				selectedDay > lastDay ||
				(selectedYear == yearToday &&
					selectedDay < today &&
					selectedMonth == monthToday)
			) {
				errorValue[1] = invalidValue;
				errorValue.splice(2, 1);
				setIsError(true);
			}
			if (selectedYear < yearToday) {
				// errorValue[2] =setErrorValue(selectedYear, yearToday)
				errorValue[2] = invalidValue;
				setIsError(true);
			}

			setInputValue(errorValue.join("/"));
			const exactDate = new Date(
				errorValue.join("/") +
					" " +
					new Date().getHours() +
					":" +
					new Date().getMinutes()
			);

			const isValidValue =
				errorValue[0].includes("_") ||
				errorValue[1].includes("_") ||
				errorValue[2].includes("_");
			!isValidValue &&
				handleChange(exactDate) &&
				setSelectedDate(new Date(errorValue.join("/"))) &&
				// setSubscriptionDate(new Date(errorValue.join("/")));
				!isValidValue &&
				onClose();
		} else {
			if (isCorrectedValue && !isErrorValue) {
				const fieldValue = moment(value).format("MM/DD/YYYY");
				const exactDate = new Date(
					fieldValue +
						" " +
						new Date().getHours() +
						":" +
						new Date().getMinutes()
				);
				handleChange(exactDate);
				setInputValue(fieldValue);
				setSelectedDate(new Date(fieldValue));
				onClose();
			} else {
				onOpen();
			}
		}
	};

	return (
		<div
			className={classNames("app-input", className, {
				"app-input--squared": variant === "squared",
				wrongValue: !isCorrectDate,
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
						id={"DatePicker"}
						selected={selectedDate}
						value={inputValue}
						onChange={(date: Date) => updateDate(String(date))}
						className="app-input__field"
						aria-invalid={!!errorMessage}
						required={required}
						aria-required={required}
						minDate={new Date()}
						locale="enGB"
						showDisabledMonthNavigation
						onCalendarOpen={() => handleChange(startDate)}
						dateFormat="MM/dd/yyyy"
						placeholderText={"MM/dd/yyyy"}
						popperClassName={`${
							isOpacity ? "opacityBlock weeksCalendar" : "weeksCalendar"
						}`}
						onMonthChange={(e) => handleChange(e)}
						shouldCloseOnSelect={false}
						onSelect={() => isCorrectDate && onClose()}
						onClickOutside={() => isCorrectDate && onClose()}
						open={closeIsSelected}
						onInputClick={() => onOpen()}
						onChangeRaw={(e) => updateDate(e.target.value)}
						customInput={<MaskedInput mask={mask} />}
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
						selected={
							Boolean(moment(inputValue).toISOString()) ? selectedDate : null
						}
						value={inputValue}
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
		</div>
	);
}
