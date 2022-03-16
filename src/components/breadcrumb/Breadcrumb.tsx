import React, { FunctionComponent, HTMLProps } from "react";
import { Link } from "react-router-dom";
import style from "./Breadcrumb.module.scss";

export interface BreadcrumbLink {
	href: string;
	text: string;
}

interface BreadcrumbProps extends HTMLProps<HTMLDivElement> {
	links: BreadcrumbLink[];
	label?: string;
}

const Breadcrumb: FunctionComponent<BreadcrumbProps> = ({
	links,
	label = "Breadcrumb",
	...other
}) => {
	return (
		<nav aria-label={label} {...other}>
			<ol className={style.list}>
				{links.map((link, index) => (
					<li className={style.item} key={link.href}>
						<Link
							to={link.href}
							aria-current={index === links.length - 1 ? "page" : undefined}
							className={style.link}
						>
							{link.text}
						</Link>
					</li>
				))}
			</ol>
		</nav>
	);
};

export default Breadcrumb;
