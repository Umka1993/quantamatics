import { adaptRoles } from "../../services/baseService";
import ComaList from "../coma-list";
import { IUser } from "../../types/user";
import { USER_HEADER } from "./utils/constants";
import style from "./styles/table.module.scss";
import SpriteIcon from "../sprite-icon/SpriteIcon";
import SortTableHeader from "../sort-table-header/SortTableHeader";
import useSortingTable from "../../hooks/useSortingTable";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { RouteParams } from "../../types/route-params";
import { UserListLocation } from "../../types/user-list-location";
import normalizer from "./utils/normalizeUserValuesForCompare";

interface UserTableProps {
	list: IUser[];
	dates: Map<number, string>;
}

export default function UserTable({ list, dates }: UserTableProps) {
	const navigate = useNavigate();
	const { state } = useLocation();

	const { initialDirection, initialSort } = (state as UserListLocation) || {
		initialDirection: undefined,
		initialSort: undefined,
	};

	const { activeSort, activeDirection, updateSort, sortedRows } =
		useSortingTable({
			initialRows: list,
			initialSort,
			initialDirection,
			normalizer,
		});

	const { id: orgID } = useParams<RouteParams>();

	return (
		<table className={style.root}>
			<thead className={style.head}>
				<tr className={[style.row, style["row--user"]].join(" ")}>
					{USER_HEADER.keys.map((key, index: number) => (
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
				{sortedRows.map((user) => (
					<tr
						className={[style.row, style["row--body"], style["row--user"]].join(
							" "
						)}
						onClick={({ target }) => {
							const isNotLink =
								(target as HTMLAnchorElement).href === undefined;

							if (isNotLink) {
								window.scrollTo(0, 0);
								navigate(`/organizations/${orgID}/user/${user.id}/view`, {
									state: {
										initialSort: activeSort,
										initialDirection: activeDirection,
									},
								});
							}
						}}
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
								<SpriteIcon
									icon="gears"
									label="Edit user"
									width={16}
									id={`edit-${user.id}`}
								/>
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}
