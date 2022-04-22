import {
	FunctionComponent,
	SetStateAction,
	useState,
	Dispatch,
} from "react";

import { adaptRoles } from "../../services/baseService";
import ComaList from "../coma-list";
import { IUser } from "../../types/user";
import ISort from "../../types/sort-type";
import { USER_HEADER } from "./utils/constants";
import { SortDirection } from "../../data/enum";
import style from "./styles/table.module.scss";
import SpriteIcon from "../sprite-icon/SpriteIcon";
import SortTableHeader from "../sort-table-header/SortTableHeader";
import useSortingTable from "../../hooks/useSortingTable";

interface UserTableProps {
	list: IUser[];
	setter: Dispatch<SetStateAction<IUser[]>>;
	dates: Map<number, string>;
	userSetter: Dispatch<SetStateAction<IUser | null>>;
}

export const UserTable: FunctionComponent<UserTableProps> = ({
	list,
	setter,
	dates,
	userSetter
}) => {

	const { activeSort, activeDirection, updateSort } = useSortingTable({ rowSetter: setter })

	return (
		<table className={style.root}>
			<thead className={style.head}>
				<tr className={[style.row, style["row--user"]].join(" ")}>
					{USER_HEADER.keys.map((key: string, index: number) => (
						<SortTableHeader
							key={key}
							isActive={activeSort === key}
							name={key}
							direction={activeDirection}
							onClick={() => updateSort(key)}
							className={style.headline}
						>
							{USER_HEADER.titles[index]}
						</SortTableHeader>
					))}
					<th className={[style.headline, style["headline--action"]].join(" ")}>
						Actions
					</th>
				</tr>
			</thead>
			<tbody>
				{list.map((user) => (
					<tr
						className={[style.row, style["row--body"], style["row--user"]].join(
							" "
						)}
						onClick={({ target }) =>
							(target as any).href === undefined &&
							userSetter(user)
						}

						key={user.id}
					>
						<td className={style.cell}>{user.firstName}</td>
						<td className={style.cell}>{user.lastName}</td>
						<td className={style.cell}>
							<a className="link" href={`mailto:${user.email}`}>
								{user.email}
							</a>
						</td>
						<td className={style.cell}>{dates.get(user.id)}</td>
						<td className={style.cell}>
							<ComaList list={adaptRoles(user.userRoles)} />
						</td>
						<td className={style.cell}>
							<button
								type="button"
								className={style.action}
								onClick={({ currentTarget }) => {
									currentTarget.blur();
								}}
							>
								<SpriteIcon icon='gears' label="Edit user" width={16} id={`edit-${user.id}`} />
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};
