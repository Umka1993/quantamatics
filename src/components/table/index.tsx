import React, {useState} from "react";
import "./styles/table.scss"
import {IRow} from "../../types/table/types";
import {Modal} from "../modal";


interface ITable {
   rows: IRow[]
}

export const Table: React.FunctionComponent<ITable> = (props) => {
    const { rows } = props;

    const [showModal, setShowModal] = useState<number | null>(null)

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
                {rows.map((row, index) => (
                    <div className="table-body-row" key={index}>
                        <div className="table-body-item">
                            {row.organization}
                        </div>
                        <div className="table-body-item">
                            <span>{row.customerId}</span>
                        </div>
                        <div className="table-body-item">
                            {row.comments}
                        </div>
                        <div className='dots-container' onClick={() => setShowModal(index + 1)}>
                            <div className="dot"/>
                            <div className="dot"/>
                            <div className="dot"/>
                        </div>
                    </div>
                ))}
            </div>
            {!!showModal &&
                <Modal onClose={() => setShowModal(null)}>
                    test
                </Modal>
            }
        </div>
    )
}