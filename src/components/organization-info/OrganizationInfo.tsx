import Headline from "../page-title";
import React, { FunctionComponent, HTMLProps } from "react";
import { Organization } from "../../types/organization/types";
import style from "./organization-info.module.scss";
import Button from "../button";
import ComaList from "../coma-list";
import DocIcon from "./assets/doc.svg";
import classNames from "classnames";

interface OrganizationInfoProps extends HTMLProps<HTMLDivElement> {
	organization: Organization;
	toggleAssetModal: () => void;
	toggleOrganizationModal: () => void;
}

const OrganizationInfo: FunctionComponent<OrganizationInfoProps> = ({
	organization,
	toggleAssetModal,
	toggleOrganizationModal,
	className
}) => {
	return (
		<section className={classNames(style.root, className)}>

			<Headline
				className={style.title}
				pageTitle={`Organization ${organization.name}`}
			>
				Organization <span className={style.name}>{organization.name}</span>
			</Headline>
			<Button className={style.cta} onClick={toggleOrganizationModal}>
				Edit
			</Button>
			<Button className={style.cta} onClick={toggleAssetModal}>
				<DocIcon width={21} height={21} fill="currentColor" aria-hidden />
				Manage Assets
			</Button>

			<dl className={style.info}>
				<dt>CRM Customer ID</dt>
				<dd>{organization.customerCrmId}</dd>

				<dt>CRM Customer Link</dt>
				<dd>{organization.customerCrmLink}</dd>

				<dt>Application Assets</dt>
				<dd>
					<ComaList
						list={organization.organizationAssets.map(
							({ asset }) => asset.name
						)}
					/>
				</dd>

				<dt>Comments</dt>
				<dd>{organization.comments}</dd>
			</dl>
		</section>
	);
};

export default OrganizationInfo;
