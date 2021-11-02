import React, { useEffect, FunctionComponent, HTMLAttributes } from 'react';
import './style/page-title.scss'


interface HeadlineProps extends HTMLAttributes<HTMLHeadingElement> {
    pageTitle?: string;
}

const Headline: FunctionComponent<HeadlineProps> = ({ pageTitle, children, className, ...other }) => {
    useEffect(() => {
        const oldTitle = document.title
        document.title = pageTitle ? pageTitle : `${String(children)} | Quantamatics`;
        return () => {document.title = oldTitle}
    }, [])
    return (<h1 className={['page-title', className].join(' ')} {...other}>{children}</h1>);
}

export default Headline;