import React, { FunctionComponent } from "react";
import Headline from "../page-title";
import Illustration from './assets/man.svg';
import './style/info.scss'
import Button from "../button";
import { AppRoute } from "../../data/enum";

interface TokenExpiredProps {
    headline: string,
    subtitle: string
}

const TokenExpired: FunctionComponent<TokenExpiredProps> = ({headline, subtitle}) => {
    return (
        <article className='info'>
            <Illustration className='info__img' width={440} height={370} aria-hidden='true' />
            <Headline className='info__title info__title--pass'>{headline}</Headline>
            <p className='info__text'>{subtitle}</p>
            <Button href={AppRoute.Login} className='info__back'>Return to Sign In</Button>
        </article>
    );
};

export default TokenExpired;
