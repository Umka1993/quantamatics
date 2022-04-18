import Headline from "../page-title";
import React, { FunctionComponent, HTMLProps } from "react";
import { Organization } from "../../types/organization/types";
import style from "./organization-info.module.scss";
import Button from "../button";
import { ReactComponent as DocIcon } from "./assets/doc.svg";
import classNames from "classnames";
import Breadcrumb from "../breadcrumb/Breadcrumb";
import { AppRoute, OrganizationKey, UserKey } from "../../data/enum";

interface OrganizationInfoProps extends HTMLProps<HTMLDivElement> {
	organization: Organization;
	toggleAssetModal: () => void;
	toggleOrganizationModal: () => void;
}

const OrganizationInfo: FunctionComponent<OrganizationInfoProps> = ({
	organization,
	toggleAssetModal,
	toggleOrganizationModal,
	className,
}) => {
	const links = [
		{
			href: AppRoute.OrganizationList,
			text: "Organizations",
		},
		{
			// href: `/organizations/${organization[OrganizationKey.Id]}`,
			text: organization[OrganizationKey.Name],
		},
	];
	return (
		<section className={classNames(style.root, className)}>
			<div className={style.headlineWrap}>
				<div className={style.orgTitle}>
					{/*<Breadcrumb links={links} />*/}

					<Headline
						className={style.title}
						pageTitle={`Organization ${organization.name}`}
					>
						Organization <span className={style.name}>{organization.name}</span>
					</Headline>
				</div>
				<div className={style.headlineWrap__buttons}>
					<Button className={style.cta} onClick={toggleOrganizationModal}>
						Edit
					</Button>
					<Button className={style.cta} onClick={toggleAssetModal}>
						<DocIcon width={21} height={21} fill="currentColor" aria-hidden />
						Manage Assets
					</Button>
				</div>
			</div>

			<dl className={style.info}>

				<dt>CRM Customer ID</dt>
				<dd>{organization.customerCrmId}</dd>



				<dt>CRM Customer Link</dt>
				<dd>
					{organization.customerCrmLink && (
						<a
							href={organization.customerCrmLink}
							className="link"
							target="_blank"
							rel="noopener noreferrer"
						>
							{organization.customerCrmLink}
						</a>
					)}
				</dd>


				<dt >Assets</dt>
				<dd>
					{organization.organizationAssets
						.map(({ asset }) => asset.name)
						.join(", ")}
				</dd>




				<dt>Comments</dt>
				<dd>{organization.comments}</dd>
			</dl>
		</section>
	);
};

export default OrganizationInfo;
