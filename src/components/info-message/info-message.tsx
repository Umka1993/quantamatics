import { AppRoute } from "../../data/enum";
import React, { FunctionComponent } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Headline from "../page-title";
import "./style/info.scss";
import classes from "classnames";
import Button from "../button";

export interface InfoMessage {
    headline: string;
    subtitle: string;
    image: "calendar" | "man";
    returnBack?: boolean;
}

const InfoMessage: FunctionComponent = () => {
	const { state } = useLocation();
	if (state as InfoMessage) {
		const isCalendarPic = (state as InfoMessage).image === "calendar";
		return (
			<article className="info">
				{isCalendarPic ? (
					<img
						src="img/calendar.svg"
						width={244}
						height={216}
						alt="Recheck your calendar"
						className="info__img"
					/>
				) : (
					<img
						src="img/man.svg"
						alt="Something went wrong"
						width={440}
						height={370}
						className="info__img"
					/>
				)}

				<Headline
					className={classes("info__title", {
						"info__title--pass": !isCalendarPic,
					})}
				>
					{(state as InfoMessage).headline}
				</Headline>
				<p
					className="info__text"
					dangerouslySetInnerHTML={{ __html: (state as InfoMessage).subtitle }}
				/>

				{(state as InfoMessage).returnBack && (
					<Button href={AppRoute.Login} className="info__back">
                        Return to Sign In
					</Button>
				)}
			</article>
		);
	}

	return <Navigate to={AppRoute.Home} />;
};

export default InfoMessage;
