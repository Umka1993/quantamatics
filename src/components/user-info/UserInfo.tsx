import { HTMLAttributes } from 'react';
import classes from './user-info.module.scss';
import { IUser } from '../../types/user';
import moment from 'moment';
import { useGetUserAssetsQuery } from '../../api/asset';

type Props = HTMLAttributes<HTMLDListElement> & {
	user: IUser
}

export default function UserInfo({ user }: Props) {
	const { data: assets, isSuccess: isAssetsLoaded } =
		useGetUserAssetsQuery(user.id);

	return <dl className={classes.list}>
		<div className={classes.item}>
			<dt className={classes.key}>First Name</dt>
			<dd className={classes.value}>
				{user.firstName}
			</dd>
		</div>
		<div className={classes.item}>
			<dt className={classes.key}>Last Name</dt>
			<dd className={classes.value}>
				{user.lastName}
			</dd>
		</div>
		<div className={classes.item}>
			<dt className={classes.key}>Email</dt>
			<dd className={classes.value}>
				<a
					className={`${classes.value} ${classes.emailField}`}
					href={`mailto:${user.email}`}
				>
					{user.email}
				</a>
			</dd>
		</div>
		<div className={classes.item}>
			<dt className={classes.key}>Expiration Date</dt>
			<dd className={classes.value}>{moment(new Date(user.subscriptionEndDate)).format("MM/DD/yyyy")}</dd>
		</div>
		<div className={classes.item}>
			<dt className={classes.key}>Organization</dt>
			<dd className={classes.value}>
				{user.companyName}
			</dd>
		</div>
		<div className={classes.item}>
			<dt className={classes.key}>Organization Role</dt>
			<dd className={classes.value}>
				{user.userRoles.join(', ')}
			</dd>
		</div>

		<div className={classes.item}>
			<dt className={classes.key}>Account Assets</dt>
			<dd className={classes.value}>
				{isAssetsLoaded && assets.map(asset => asset.name).join(', ')}
			</dd>
		</div>
	</dl>
}
