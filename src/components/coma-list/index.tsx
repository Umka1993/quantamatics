import React, { FunctionComponent, HTMLAttributes } from "react";
import './style/comma-list.scss';
import classNames from 'classnames'


interface ComaListProps extends HTMLAttributes<HTMLUListElement> {
	list: Array<any>;
}

const ComaList: FunctionComponent<ComaListProps> = ({ list, className, ...other }) => {
	return (<ul className={classNames("comma-list", className)} {...other}>
		{list.map((item, index) =>
			<li key={item + index}>
				{item}
			</li>
		)}
	</ul>);
}

export default ComaList;
