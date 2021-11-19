import React, { FunctionComponent } from "react";
import './style/comma-list.scss';


interface ComaListProps {
    list: Array<any>;
}

const ComaList: FunctionComponent<ComaListProps> = ({ list }) => {
    return (<ul className="comma-list">
        {list.map((item) =>
            <li key={item}>
                {item}
            </li>
        )}
    </ul>);
}

export default ComaList;