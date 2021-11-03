import classNames from 'classnames';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { RootState } from '../../store';
import { Link } from 'react-router-dom';

import './style/breadcrumbs.scss'

interface BreadcrumbsProps {

}

interface LinkData {
    text: string
    href: string;
}

const Breadcrumbs: FunctionComponent<BreadcrumbsProps> = () => {

    const { location: { pathname } } = useHistory();

    const breadcrumbs = detectBreadcrumbs()

    function transformFromKebabToSentenceCase(kebab: string): string {
        const words = kebab.split('-');
        const sentenceWords = words.map((word) => word[0].toUpperCase() + word.substr(1))
        return sentenceWords.join(' ')
    }

    function detectBreadcrumbs() : Array<LinkData> {
        const array = pathname.substring(1).split('/');
        const result : Array<LinkData> = [];

        array.forEach((breadcrumb, index, array) => {
            result.push({
                href: '/' + array.slice(0, index + 1).join('/'),
                text: transformFromKebabToSentenceCase(breadcrumb)
            })
        })

        return result;
    }



    /* const [breadcrumbs, setBreadcrumbs] = useState<Array<string>>([
        'Research',
        'My Files',
    ])

    const storeCurrentPage = useSelector<RootState>(
        (state) => state.currentPage.currentPage.pageName
    )

    useEffect(() => {
        const url: any = !!storeCurrentPage ? storeCurrentPage : ''
        const urlArray = url.split('/')
        const refactoredArray = urlArray.length === 1 ? [] : urlArray.map((item: string) => {
            return item.replace(/-/g, ' ')
        })
        setBreadcrumbs(refactoredArray)
    }, [storeCurrentPage])

    const breadcrumbsList = breadcrumbs.map((crumb: any, index) => {
        const listLength = breadcrumbs.length - 1
        return (
            <div key={index} className={classNames('header__breadcrumbs-item', { 'last': index === listLength })}>
                {crumb}
                {index !== listLength ? <span className='breadcrumb-divider'>/</span> : ''}
            </div>
        )
    }) */

    return (<ol className='breadcrumbs'>
        {breadcrumbs.map((breadcrumb, index, array) =>
            <li className='breadcrumbs__item'>
                <Link
                    className='breadcrumbs__link'
                    to={breadcrumb.href}
                    aria-current={index === (array.length - 1) ? 'location' : undefined}
                >
                    {breadcrumb.text}
                </Link>
            </li>)
        }
    </ol>);
}

export default Breadcrumbs;