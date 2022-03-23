import { HTMLProps } from "react";
import { IUser } from "../../../types/user";
import style from "./my-account-info.module.scss";
import classNames from "classnames";
import { useGetAllUserAssetsQuery } from "../../../api/asset";
import ComaList from "../../coma-list";
import { adaptRoles } from "../../../services/baseService";
import { AssetServerResponse } from "../../../types/asset";
import { UserRole } from "../../../data/enum";

interface MyAccountInfoProps extends HTMLProps<HTMLDListElement> {
	user: IUser;
	isPasswordClosed: boolean;
	openPassword: () => void;
}

export default function MyAccountInfo({
	user,
	className,
	isPasswordClosed,
	openPassword,
	children,
	...other
}: MyAccountInfoProps) {
	const { data: userAsset } = useGetAllUserAssetsQuery();
	const fullWidthClass = [style.row, style["row--full"]].join(" ");

	return (
		<dl className={classNames(style.root, className)} {...other}>
			<div className={style.row}>
				<dt className={style.name}>Name</dt>
				<dd className={style.value}>{user.firstName}</dd>
			</div>
			<div className={style.row}>
				<dt className={style.name}>Surname</dt>
				<dd className={style.value}>{user.lastName}</dd>
			</div>

			<div className={fullWidthClass}>
				<dt className={style.name}>Email</dt>
				<dd className={style.value}>{user.email}</dd>
			</div>

			<div className={fullWidthClass}>
				<dt className={style.name}>Expiration Date</dt>
				<dd className={style.value}>
					{user.subscriptionEndDate.split(" ")[0]}
				</dd>
			</div>

			<div className={fullWidthClass}>
				<dt className={style.name}>Organization</dt>
				<dd className={style.value}>{user.companyName}</dd>
			</div>

			<div className={fullWidthClass}>
				<dt className={style.name}>Assigned Assets</dt>
				{userAsset && Boolean(userAsset.length) && (
					<dd className={style.value}>
						<ComaList
							list={userAsset.map(({ name }: AssetServerResponse) => name)}
						/>
					</dd>
				)}
			</div>

			<div className={fullWidthClass}>
				<dt className={style.name}>Organization Role</dt>
				<dd className={style.value}>
					<ComaList list={adaptRoles(user.userRoles)} />
				</dd>
			</div>

			{isPasswordClosed && !user.userRoles.includes(UserRole.Demo) && (
				<div className={fullWidthClass}>
					<dt className={style.name}>Current Password</dt>
					<dd className={style.value}>{children}</dd>
				</div>
			)}
		</dl>
	);
}
