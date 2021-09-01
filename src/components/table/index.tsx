import React from "react";
import "./styles/table.scss"
import {IRow} from "../../types/table/types";


interface ITable {
   rows: IRow[]
}

export const Table: React.FunctionComponent<ITable> = (props) => {
    const { rows } = props;
    const threeDots = () => (
        <div className='dots-container'>
            <div className="dot"/>
            <div className="dot"/>
            <div className="dot"/>

        </div>
    )
    return(
        <div className="table">
            <div className="table-head">
                <div className="table-head-row">
                    <div className="table-head-item">
                        ORGANIZATION Name
                    </div>
                    <div className="table-head-item">
                        CRM Customer ID
                    </div>
                    <div className="table-head-item">
                        comments
                    </div>
                </div>
            </div>
            <div className="table-body">
                {rows.map(row => (
                    <div className="table-body-row">
                        <div className="table-body-item">
                            {row.organization}
                        </div>
                        <div className="table-body-item">
                            <span>{row.customerId}</span>
                        </div>
                        <div className="table-body-item">
                            {row.comments}
                        </div>
                        {threeDots()}
                    </div>
                ))}

            </div>
        </div>
    )
}