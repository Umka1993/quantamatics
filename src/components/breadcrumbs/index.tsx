import React, { FunctionComponent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { RootState, store } from '../../store';
import { Link } from 'react-router-dom';

import './style/breadcrumbs.scss'
import { changeAllNavLinks } from '../../store/breadcrumbs/actions';

interface BreadcrumbsProps {

}

interface LinkData {
    text: string
    href: string;
}

const Breadcrumbs: FunctionComponent<BreadcrumbsProps> = () => {

    const { location: { pathname } } = useHistory();
    const [breadcrumbs, setBreadcrumbs] = useState<Array<string>>([
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
            return transformFromKebabToSentenceCase(item)
        })
        setBreadcrumbs(refactoredArray)
    }, [storeCurrentPage])


    function transformFromKebabToSentenceCase(kebab: string): string {
        const words = kebab.split('-');
        const sentenceWords = words.map((word) => word[0].toUpperCase() + word.substr(1))
        return sentenceWords.join(' ')
    }
    /* const storeBreadcrumbs = useSelector((state: RootState) => state.breadcrumbs)
    const dispatch = useDispatch();

    useEffect(() => {
        !storeBreadcrumbs && dispatch(changeAllNavLinks(detectBreadcrumbs()))
    }, []) 

    function transformFromKebabToSentenceCase(kebab: string): string {
        const words = kebab.split('-');
        const sentenceWords = words.map((word) => word[0].toUpperCase() + word.substr(1))
        return sentenceWords.join(' ')
    }

    function detectBreadcrumbs(): Array<LinkData> {
        const array = pathname.substring(1).split('/');
        const result: Array<LinkData> = [];

        array.forEach((breadcrumb, index, array) => {
            result.push({
                href: '/' + array.slice(0, index + 1).join('/'),
                text: transformFromKebabToSentenceCase(breadcrumb)
            })
        })

        return result;
    }
    */

    return (<ol className='breadcrumbs'>
        {breadcrumbs.map((crumb) => {
            <li className='breadcrumbs__item'>
                {crumb}
            </li>
        })}
        {/* {storeBreadcrumbs && storeBreadcrumbs.map((breadcrumb, index, array) =>
            <li className='breadcrumbs__item'>
                <a
                    className='breadcrumbs__link'
                    // to={breadcrumb.href}
                    aria-current={index === (array.length - 1) ? 'location' : undefined}
                >
                    {breadcrumb.text}
                </a>
            </li>)
        } */}
    </ol>);
}

export default Breadcrumbs;