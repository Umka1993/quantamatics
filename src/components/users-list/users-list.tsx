import { Dispatch, FunctionComponent, SetStateAction } from "react";
import style from "../organization-detail/edit-organizations.module.scss";
import Button from "../button";
import SpriteIcon from "../sprite-icon/SpriteIcon";
import UserTable from "../table/UserTable";
import { IUser } from "../../types/user";

interface IUsersList {
	hasAssets: boolean | undefined;
	endDates: Map<number, string> | undefined;
	localRows: IUser[];
	setLocalRows: Dispatch<SetStateAction<IUser[]>>;
	headlineTitle: string;
	className?: string;
	setAddNewUser: (arg: boolean)=>void;
}

export const UsersList: FunctionComponent<IUsersList> = ({
	hasAssets,
	endDates,
	localRows,
	setLocalRows,
	headlineTitle,
	setAddNewUser,
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
					// href={hasAssets ? "add-user" : undefined}
					aria-describedby={hasAssets ? undefined : "warning-asset"}
					disabled={!hasAssets}
					onClick={() =>setAddNewUser(true) }
				>
					<SpriteIcon icon="plus" width={10} />
					Add
				</Button>
			</div>
			{endDates && (
				<UserTable
					list={localRows}
					setter={setLocalRows}
					dates={endDates}
				/>
			)}
		</section>
	);
};
