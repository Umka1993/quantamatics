import { FunctionComponent } from "react";
import style from "../organization-detail/edit-organizations.module.scss";
import Button from "../button";
import SpriteIcon from "../sprite-icon/SpriteIcon";
import UserTable from "../table/UserTable";
import { IUser } from "../../types/user";

interface IUsersList {
	hasAssets: boolean | undefined;
	endDates: Map<number, string> | undefined;
	localRows: IUser[];
	headlineTitle: string;
	className?: string;
	organizationID?: string;
}

export const UsersList: FunctionComponent<IUsersList> = ({
	hasAssets,
	endDates,
	localRows,
	headlineTitle,
	organizationID
}) => {
	return (
		<section>
			<div className={style.subheader}>
				<h2>{headlineTitle}</h2>
				{!hasAssets && (
					<p id="warning-asset" className={style.warning}>
						Please assign assets to the organization to add user accounts
					</p>
				)}

				<Button
					className={style.add}
					href={hasAssets ? `/organizations/${organizationID}/add-user` : undefined}
					aria-describedby={hasAssets ? undefined : "warning-asset"}
					disabled={!hasAssets}
				>
					<SpriteIcon icon="plus" width={10} />
					Add
				</Button>
			</div>
			{endDates && Boolean(localRows.length) && (
				<UserTable
					list={localRows}
					dates={endDates}
				/>
			)}
		</section>
	);
};
