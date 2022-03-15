import React, {
	FunctionComponent,
	SetStateAction,
	useLayoutEffect,
	useState,
	Dispatch,
} from "react";

import EditSVG from "./assets/edit-row-icon.svg";

import { SortTableHeader } from "../sort-table-header/SortTableHeader";
import { adaptRoles } from "../../services/baseService";
import ComaList from "../coma-list";
import { IUpdateUser } from "../../types/user";
import ISort from "../../types/sort-type";
import { USER_HEADER } from "./utils/constants";
import { SortDirection } from "../../data/enum";
import style from "./styles/table.module.scss";

interface UserTableProps {
	list: IUpdateUser[];
	setter: Dispatch<SetStateAction<IUpdateUser[]>>;
	dates: Map<number, string>;
	userSetter: Dispatch<SetStateAction<IUpdateUser | null>>;
}

export const UserTable: FunctionComponent<UserTableProps> = ({
	list,
	setter,
	dates,
	userSetter
}) => {
	// ? Need to be in component to reset sort after update
	const INITIAL_SORT = { name: "", direction: SortDirection.Default };

	const [sort, setSort] = useState<ISort>(INITIAL_SORT);

	const [scrollY, setScrollY] = useState<number>(0);

	// ? Kludge for Chrome to remember scroll position after rerendering

	useLayoutEffect(() => {
		const scrollWrapper = document.querySelector("main");
		if (scrollWrapper) {
			scrollWrapper.scrollTop = scrollY;
		}
	}, [list]);

	return (
		<table className={style.root}>
			<thead className={style.head}>
				<tr className={[style.row, style["row--user"]].join(" ")}>
					{USER_HEADER.keys.map((key: string, index: number) => (
						<SortTableHeader
							key={key}
							name={key}
							text={USER_HEADER.titles[index]}
							sort={sort}
							localRows={list}
							setSort={setSort}
							setLocalRows={setter}
							className={style.headline}
							rememberScroll={setScrollY}
						/>
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
								onClick={() => {
									userSetter(user)
								}}
							>
								<EditSVG role="img" aria-label="edit" fill="currentColor" />
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};
