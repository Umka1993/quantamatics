import React, { useEffect, FunctionComponent, HTMLAttributes } from 'react';
import './style/page-title.scss'


interface HeadlineProps extends HTMLAttributes<HTMLHeadingElement> {
    pageTitle?: string;
}

const Headline: FunctionComponent<HeadlineProps> = ({ pageTitle, children, className, ...other }) => {
    useEffect(() => {
        document.title = pageTitle ? pageTitle : `${String(children)} | Quantamatics`;
        return console.log('as')
    }, [])
    return (<h1 className={['page-title', className].join(' ')} {...other}>{children}</h1>);
}

export default Headline;