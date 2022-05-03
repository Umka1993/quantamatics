import { adaptRoles } from "../../services/baseService";
import ComaList from "../coma-list";
import { UserWithRoles } from "../../types/user";
import style from "./styles/table.module.scss";
import SpriteIcon from "../sprite-icon/SpriteIcon";
import SortTableHeader from "../sort-table-header/SortTableHeader";
import useSortingTable from "../../hooks/useSortingTable";
import { useLocation, useNavigate } from "react-router-dom";
import normalizer from "./utils/normalizeUserWithRoles";
import { AppRoute, SortDirection } from "../../data/enum";
interface UserTableProps {
	list: UserWithRoles[];
	dates: Map<number, string>;
}

export interface UserListLocation {
	initialSort: keyof UserWithRoles | "",
	initialDirection: SortDirection
}

export default function AllUserTable({ list, dates }: UserTableProps) {
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

	const KEYS: Array<keyof UserWithRoles> = ['firstName', 'lastName', 'userName', 'subscriptionEndDate', 'companyName', 'roles']

	const TITLES = ['First Name', 'First Name', 'Email Address', 'Expiration Date', 'Organization', 'Organization Role ']

	return (
		<table className={style.root}>
			<thead className={style.head}>
				<tr className={[style.row, style["row--all-user"]].join(" ")}>
					{KEYS.map((key, index: number) => (
						<SortTableHeader
							key={key}
							isActive={activeSort === key}
							name={key}
							direction={activeDirection}
							onClick={() => updateSort(key)}
							className={style.headline}
						>
							{TITLES[index]}
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
						className={[style.row, style["row--body"], style["row--all-user"]].join(
							" "
						)}
						onClick={({ target }) => {
							const isNotLink =
								(target as HTMLAnchorElement).href === undefined;

							if (isNotLink) {
								window.scrollTo(0, 0);
								navigate(`/${AppRoute.Users}/${user.id}`, {
									state: {
										initialSort: activeSort,
										initialDirection: activeDirection,
										fromAllUser: true
									},
								});
							}
						}}
						key={user.id}
					>
						<td className={style.cell}>{user.firstName}</td>
						<td className={style.cell}>{user.lastName}</td>
						<td className={style.cell}>
							<a className="link" href={`mailto:${user.userName}`}>
								{user.userName}
							</a>
						</td>
						<td className={style.cell}>{dates.get(user.id)}</td>
						<td className={style.cell}>
							<a className="link link--inherit" href={`/organizations/${user.organizationId}`}>{user.companyName}</a>
						</td>
						<td className={style.cell}>
							<ComaList list={adaptRoles(user.roles)} />
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
