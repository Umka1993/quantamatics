import React from "react";
import Button from "../button";
import ArrowPrew from "./assets/arrowPrew.svg";
import ArrowNext from "./assets/arrowNext.svg";

interface IDatePickerHeader {
	decrease: () => void;
	prevButtonDisabled: boolean;
	setDefaultCalendar: (arg: boolean) => void;
	title: string | undefined;
	increase: () => void;
	nextButtonDisabled: boolean;
	defaultCalendar: boolean;
}

const DatePickerHeader: React.FunctionComponent<IDatePickerHeader> = ({
	decrease,
	prevButtonDisabled,
	setDefaultCalendar,
	title,
	increase,
	nextButtonDisabled,
	defaultCalendar,
}) => {
	return (
		<div className="react-datepicker-header">
			<Button
				className="prev"
				onClick={decrease}
				disabled={prevButtonDisabled}
				type="button"
			>
				<ArrowPrew fill="#7182A6" />
			</Button>

			<div
				onClick={() => setDefaultCalendar(defaultCalendar)}
				className="monthYear"
			>
				<span>{title}</span>
			</div>

			<Button className="next" onClick={increase} disabled={nextButtonDisabled}>
				<ArrowNext fill="#7182A6" />
			</Button>
		</div>
	);
};

export default DatePickerHeader;
