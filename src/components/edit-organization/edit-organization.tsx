import React, { FunctionComponent, useEffect } from "react";
import "./styles/edit-organizations.scss";
import AddIcon from "./assets/human-add.svg";
import Button from "../button";
import { UserTable } from "../table/UserTable";
import { useParams } from "react-router-dom";
import type { RouteParams } from "../../types/route-params";
import { useGetOrganizationQuery } from "../../api/organization";
import IApiError from "../../types/api-error";
import useUser from "../../hooks/useUser";
import { UserRole } from "../../data/enum";

import { EditOrganizationForm } from "../form";
import useToggle from "../../hooks/useToggle";
import AssetModal from "../asset-modal/AssetModal";
import { Organization } from "types/organization/types";

export const EditOrganization: FunctionComponent = () => {
	const user = useUser();

	const { id } = useParams<RouteParams>();

	const {
		data: organization,
		isError,
		error,
		isSuccess,
	} = useGetOrganizationQuery(id as string);

	const EMPTY_ORGANIZATION: Organization = {
		name: "",
		parentId: "",
		id: "",
		customerCrmId: "",
		comments: "",
		customerCrmLink: "",
		organizationAssets: [],
		parentOrganization: "",
	};
	const isHaveAccessToOrgList =
        user?.userRoles.includes(UserRole.Admin) ||
        user?.userRoles.includes(UserRole.OrgOwner);

	const [isAssetOpened, toggleAssetModal] = useToggle(false);

	const hasAssets =
        organization && Boolean(organization.organizationAssets.length);

	return (
		<div className="edit-organization">
			{isError ? (
				<p>Error on loading data: {(error as IApiError).data} </p>
			) : (
				<>
					<EditOrganizationForm
						organization={organization || EMPTY_ORGANIZATION}
						isHaveAccessToOrgList={isHaveAccessToOrgList}
						toggleAssetModal={toggleAssetModal}
					/>
					<AssetModal
						open={isAssetOpened}
						closeFunction={toggleAssetModal}
						organization={organization || EMPTY_ORGANIZATION}
					/>
				</>
			)}
			<section className="edit-organization__user-list">
				<div className="edit-organization__user-list-header">
					<h2 className="sub-headline">User Accounts</h2>
					{!hasAssets && (
						<p id="warning-asset" className="edit-organization__warning">
                            Please set up assets first to invite users to the organization
						</p>
					)}

					<Button
						className="edit-organization__user-list-add"
						href={hasAssets ? "add-user" : undefined}
						aria-describedby={hasAssets ? undefined : "warning-asset"}
						disabled={!hasAssets}
					>
						<AddIcon />
                        Add New
					</Button>
				</div>

				<UserTable orgId={id as string} />
			</section>
		</div>
	);
};
