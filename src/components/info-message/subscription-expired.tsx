import React, { FunctionComponent } from "react";
import Headline from "../page-title";
import './style/info.scss'

const ExpiredMessage: FunctionComponent = () => {
    return (
        <article className='info'>
            <img src="img/calendar.svg" width={244} height={216} alt="Recheck your calendar" className="info__img" />
            <Headline className='info__title'>Your user account has reached its Expiration Date</Headline>
            <p className='info__text'>
                Please contact your organization admin or us at{" "}
                <a href="mailto:support@quantamatics.com">support@quantamatics.com.</a>
            </p>
        </article>
    );
};

export default ExpiredMessage;
