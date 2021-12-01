import React, { FunctionComponent } from "react";
import Headline from "../page-title";
import Illustration from './assets/calendar.svg';
import './style/info.scss'

const ExpiredMessage: FunctionComponent = () => {
    return (
        <article className='info'>
            <Illustration className='info__img' width={244} height={216} aria-hidden='true' />
            
            <Headline className='info__title'>Your user account has reached its Expiration Date</Headline>
            <p className='info__text'>
                Please contact your organization admin or us at{" "}
                <a href="mailto:support@quantamatics.com">support@quantamatics.com.</a>
            </p>
        </article>
    );
};

export default ExpiredMessage;
