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
		const datePickerRef = useRef<HTMLInputElement>();

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

		const [isCorrectDate, setIsCorrectedDate] = useState<boolean>(true);

		const [inputValue, setInputValue] = useState<string>(
				moment(startDate).format("MM/DD/YYYY").toString()
		);

		const [mask, setMask] = useState("11/11/1111");

		const [isErrorValue, setIsError] = useState<boolean>();

		const [selectedDate, setSelectedDate] = useState<Date>(startDate);

		useEffect(() => {
				const maskItemCounter = inputValue.split("/").length;
				const input = document.getElementById("DatePicker") as HTMLInputElement;
				// console.log('inputValue',inputValue)
				// console.log('selectedDate',selectedDate)
				// console.log('isErrorValue',isErrorValue)

				// if(inputValue.includes('_')){
				// 		setInputValue(inputValue)
				// }else if( String(moment(selectedDate).format("MM/DD/YYYY")) !== inputValue ){
				// 		validateValue(inputValue)
				// }

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
						// setInputValue(String(moment(selectedDate).format("MM/DD/YYYY")))
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

		// const validateValue = (value: string) => {
		// 	const arr = value.split("/");
		// 	const yesterday = moment().subtract(1, "days").endOf("day").toString();
		// 	const yearToday = moment().year();
		// 	const monthToday = moment().month()+1
		// 	const today= moment().date()
		// 	const invalidValue = "__";
		// 	const selectedMonth = Number(arr[0]);
		// 	const selectedDay = Number(arr[1]);
		// 	const selectedYear =
		// 		Boolean(Number(arr[2])) || Number(arr[2]) == 0
		// 			? Number(arr[2])
		// 			: new Date().getFullYear();
		//
		// 	const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
		//
		// 	const errorValue = [...arr];
		//
		// 	debugger;
		// 	const isCorrectedValue =
		// 		moment(value).isValid() && moment(value).isAfter(yesterday);
		// 	setIsCorrectedDate(isCorrectedValue);
		//
		// 	if (selectedMonth > 12 || selectedMonth<monthToday && selectedYear == yearToday) {
		// 		errorValue[0] = invalidValue;
		// 		errorValue[1] = invalidValue;
		// 		errorValue.splice(1, 2);
		// 		setIsError(true);
		// 	}
		//
		// 	if (selectedDay > lastDay || selectedDay<today && selectedYear == yearToday) {
		// 		errorValue[1] = invalidValue;
		// 		errorValue.splice(2, 1);
		// 		setIsError(true);
		// 	}
		// 	if (selectedYear < yearToday) {
		// 		errorValue[2] = invalidValue;
		// 		setIsError(true);
		// 	}
		//
		// 	setInputValue(errorValue.join("/"));
		// };

		const updateDate = (value: string) => {
				// value && value.split("/").length > 1 && validateValue(value);
				//

				const manualChange = value && value.split("/").length > 1;
				const yesterday = moment().subtract(1, "days").endOf("day").toString();
				const yearToday = moment().year();
				const monthToday = moment().month() + 1;
				const today = moment().date();
				const invalidValue = "__";
				// const selectedMonth = Number(arr[0]);
				// const selectedDay = Number(arr[1]);
				// const selectedYear =
				// 	Boolean(Number(arr[2])) || Number(arr[2]) == 0
				// 		? Number(arr[2])
				// 		: new Date().getFullYear();

				// const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();

				const isCorrectedValue =
						moment(value).isValid() && moment(value).isAfter(yesterday);
				setIsCorrectedDate(isCorrectedValue);

				// const errorValue = [...arr];

				// const isCorrectedValue =
				// 		moment(value).isValid() && moment(value).isAfter(yesterday);
				// setIsCorrectedDate(isCorrectedValue);
				if (manualChange) {
						const arr = value.split("/");
						const selectedMonth = Number(arr[0]);
						const selectedDay = Number(arr[1]);
						const selectedYear =
								Boolean(Number(arr[2])) || Number(arr[2]) == 0
										? Number(arr[2])
										: new Date().getFullYear();
						const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
						const errorValue = [...arr];

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
								errorValue[2] = invalidValue;
								setIsError(true);
						}

						setInputValue(errorValue.join("/"));
						setSelectedDate(new Date(errorValue.join("/")));
						const isValidValue =  errorValue[0].includes('_') || errorValue[1].includes('_') || errorValue[2].includes('_')
						!isValidValue && handleChange(new Date(errorValue.join("/")));
						!isValidValue && onClose()
				} else {
						if (isCorrectedValue && !isErrorValue) {
								const fieldValue = moment(value).format("MM/DD/YYYY");
								handleChange(new Date(fieldValue));
								!inputValue.includes("_")
										? setInputValue(fieldValue)
										: setInputValue(value);
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
												customInput={<MaskedInput mask={mask} pattern={" /[a-zA-Z0-9]/"} />}
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
												selected={selectedDate}
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
