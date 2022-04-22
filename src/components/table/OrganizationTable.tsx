import {
	useState,
	Dispatch,
	SetStateAction,
	FunctionComponent,
	HTMLProps,
} from "react";
import SortTableHeader from "../sort-table-header/SortTableHeader";

import { Organization } from "../../types/organization/types";
import { SortDirection } from "../../data/enum";
import ISort from "../../types/sort-type";

import { ORG_HEADER } from "./utils/constants";
import { useNavigate } from "react-router-dom";
import style from "./styles/table.module.scss";
import SpriteIcon from "../sprite-icon/SpriteIcon";

interface ITable extends Omit<HTMLProps<HTMLTableElement>, "list"> {
	list: Organization[];
	setter: Dispatch<SetStateAction<Organization[]>>;
}

export const OrganizationTable: FunctionComponent<ITable> = ({
	list,
	setter,
}) => {
	// ? Need to be in component to reset sort after update
	const INITIAL_SORT = { name: "", direction: SortDirection.Default };
	const [sort, setSort] = useState<ISort>(INITIAL_SORT);

	const navigate = useNavigate();

	const handleOrgNameLength = (name: string) => {
		if (name && name.length > 45) {
			return `${name.slice(0, 29)}...`

		} else {
			return name
		}
	}

	return (
		<table className={style.root}>
			<thead className={style.head}>
				<tr className={[style.row, style["row--organization"]].join(" ")}>
					{ORG_HEADER.keys.map((key, index) => (
						<SortTableHeader
							key={key}
							isActive={sort.name === key}
							name={key}
							direction={sort.direction}
							setSort={setSort}
							rowSetter={setter}
							className={style.headline}
						>
							{ORG_HEADER.titles[index]}
						</SortTableHeader>
					))}

					<th className={[style.headline, style["headline--action"]].join(" ")}>
						Actions
					</th>
				</tr>
			</thead>
			<tbody>
				{list.map((organization, index) => (
					<tr
						className={[
							style.row,
							style["row--body"],
							style["row--organization"],
						].join(" ")}
						onClick={({ target }) =>
							(target as any).href === undefined &&
							navigate(`/organizations/${organization.id}`)
						}
						key={index}
					>
						<td className={style.cell}>{handleOrgNameLength(organization.name)}</td>
						<td className={style.cell}>{organization.customerCrmId}</td>
						<td className={style.cell}>
							{Boolean(organization.customerCrmLink.length) && (
								<a
									className="link"
									href={organization.customerCrmLink}
									target="_blank"
									rel="noopener noreferrer"
								>
									{organization.customerCrmLink}
								</a>
							)}
						</td>
						<td className={style.cell}>
							{organization.comments && organization.comments.length ? organization.comments : "—"}
						</td>
						<td className={style.cell}>
							<button className={style.action} type="button">
								<SpriteIcon icon="gears" label="Edit Organization" width={16} />
							</button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};
