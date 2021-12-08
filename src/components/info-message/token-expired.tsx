import React, { FunctionComponent } from "react";
import Headline from "../page-title";
import './style/info.scss'
import Button from "../button";
import { AppRoute } from "../../data/enum";

interface TokenExpiredProps {
    headline: string,
    subtitle: string,
    returnBack?: boolean
}

const TokenExpired: FunctionComponent<TokenExpiredProps> = ({ headline, subtitle, returnBack = true }) => {
    return (
        <article className='info'>
            <img src="img/man.svg" alt="Something went wrong" width={440} height={370} className="info__img" />
            <Headline className='info__title info__title--pass'>{headline}</Headline>
            <p className='info__text'>{subtitle}</p>
            {returnBack && <Button href={AppRoute.Login} className='info__back'>Return to Sign In</Button>}

        </article>
    );
};

export default TokenExpired;
