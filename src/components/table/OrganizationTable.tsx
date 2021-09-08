import React, {useState, useEffect} from "react";
import "./styles/table.scss"
import {useHistory} from "react-router-dom";
import {IRow} from "../../types/table/types";
import {SVG} from "../SVG";
import {sortTable} from "../../services/baseService";

import editSVG from './assets/edit-row-icon.svg'
import deleteSVG from './assets/delete-row-icon.svg'
import sortNoneSVG from './assets/sort-none.svg'
import sortActiveSVG from './assets/sort-active.svg'
import classNames from "classnames";


interface ITable {
    rows: IRow[]
    inEdit?: boolean
}

export const OrganizationTable: React.FunctionComponent<ITable> = (props) => {
    const { rows } = props;
    const history = useHistory();
    const [localRows, setLocalRows] = useState<IRow[]>(rows)
    const [sort, setSort] = useState<any>({name: '', direction: 'none'})

    useEffect(()=> {
        localStorage.setItem('rows', JSON.stringify(props.rows))
    }, [props.rows])

    return(
        <div className="table">
            <div className="table-head">
                <div className="table-head-row">
                    <div className={classNames("table-head-item", {desc: sort.direction === 'desc'})}
                         onClick={() => sortTable('organization', sort, localRows, setSort, setLocalRows) }
                    >
                        ORGANIZATION Name <SVG icon={sort.name === 'organization' ? sortActiveSVG : sortNoneSVG} />
                    </div>
                    <div className={classNames("table-head-item", {desc: sort.direction === 'desc'})}
                         onClick={() => sortTable('customerId', sort, localRows, setSort, setLocalRows) }
                    >
                        CRM Customer ID <SVG icon={sort.name === 'customerId' ? sortActiveSVG : sortNoneSVG} />
                    </div>
                    <div className={classNames("table-head-item", {desc: sort.direction === 'desc'})}
                         onClick={() => sortTable('comments', sort, localRows, setSort, setLocalRows)}
                    >
                        comments <SVG icon={sort.name === 'comments' ? sortActiveSVG : sortNoneSVG} />
                    </div>
                </div>
            </div>
            <div className="table-body">
                {localRows.map((row, index) => (
                    <div className="table-body-row" key={index}>
                        <div className="table-body-item">
                            {row.row.organization}
                        </div>
                        <div className="table-body-item">
                            <span><a href={row.row.customerLink}>{row.row.customerId}</a></span>
                        </div>
                        <div className="table-body-item">
                            {row.row.comments}
                        </div>
                        <div className='table-body-row__actions'>
                            <SVG icon={editSVG} onClick={() => history.push("/organization-edit")}/>
                            <SVG icon={deleteSVG} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}