import React, { FunctionComponent } from "react";
import SVG from "../SVG";
import avatar from "./assets/avatar.svg";
import photoIcon from "./assets/photos.svg";
import { IUser } from "../../types/edit-profile/types";
import './style/profile-summary.scss';
import classNames from "classnames";
import { formatDate } from "../../services/baseService";

interface IProfileSummary {
    user: IUser;
    className?: string;
}

const ProfileSummary: FunctionComponent<IProfileSummary> = ({ user, className }) => {
	return (
		<div className={classNames("profile-summary", className)}>
			<div className="avatar">
				<div className="avatar__img">
					<SVG icon={avatar} />
				</div>
				<div className="avatar__upload">
					<div className="avatar__upload-text">Upload New</div>
					<SVG icon={photoIcon} />
				</div>
			</div>
			<div className="details">
				<div className="details__item">
					<span>Name</span>
					<span>{user.firstName}</span>
				</div>
				<div className="details__item">
					<span>Surname</span>
					<span>{user.lastName}</span>
				</div>
				<div className="details__item">
					<span>Organization</span>
					<span>{user.companyName}</span>
				</div>
				<div className="details__item">
					<span>Email</span>
					<span>{user.email}</span>
				</div>
				<div className="details__item">
					<span>Expiration Date</span>
					<span>{formatDate(user.subscriptionEndDate)}</span>
				</div>
			</div>
		</div>
	);
};

export default ProfileSummary;
