import Headline from "../page-title";
import React, { FunctionComponent, HTMLProps } from "react";
import { Organization } from "../../types/organization/types";
import style from "./organization-info.module.scss";
import Button from "../button";
import ComaList from "../coma-list";
import DocIcon from "./assets/doc.svg";

interface OrganizationInfoProps extends HTMLProps<HTMLDivElement> {
	organization: Organization;
	toggleAssetModal: () => void;
}

const OrganizationInfo: FunctionComponent<OrganizationInfoProps> = ({
	organization,
	toggleAssetModal,
}) => {
	return (
		<section className={style.root}>
			<Headline
				className={style.title}
				pageTitle={`Organization ${organization.name}`}
			>
				Organization {organization.name}
			</Headline>
			<Button className={style.cta} onClick={toggleAssetModal}>
				<DocIcon width={21} height={21} fill="currentColor" aria-hidden />
				Manage Assets
			</Button>
			<Button className={style.cta}>Edit Organization</Button>
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
