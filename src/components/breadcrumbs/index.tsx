import React, { FunctionComponent, OlHTMLAttributes, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { RootState, store } from '../../store';
import { Link } from 'react-router-dom';

import './style/breadcrumbs.scss'
import { changeAllNavLinks } from '../../store/breadcrumbs/actions';

interface BreadcrumbsProps extends OlHTMLAttributes<HTMLOListElement> {

}

// interface LinkData {
//     text: string
//     href: string;
// }

const Breadcrumbs: FunctionComponent<BreadcrumbsProps> = ({className}) => {

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
    /* 
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

    console.log(breadcrumbs);


    return (<ol className={['breadcrumbs', className].join(' ')}>
        {breadcrumbs && breadcrumbs.map((crumb, index, array) =>
            <li className='breadcrumbs__item'>
                <span
                    className='breadcrumbs__link'
                    aria-current={index === (array.length - 1) ? 'location' : undefined}
                >
                    {crumb}
                </span>
            </li>
        )}
    </ol>);
}

export default Breadcrumbs;