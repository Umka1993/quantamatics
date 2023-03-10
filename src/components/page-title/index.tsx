import { AppInfo } from "../../data/enum";
import React, { useEffect, FunctionComponent, HTMLAttributes, useRef } from "react";
import "./style/page-title.scss";

interface HeadlineProps extends HTMLAttributes<HTMLHeadingElement> {
	pageTitle?: string;
}

const Headline: FunctionComponent<HeadlineProps> = ({ pageTitle, children, className, ...other }) => {
	const headlineRef = useRef<HTMLHeadingElement>(null);

	useEffect(() => {
		const oldTitle = document.title;

		document.title = pageTitle
			? pageTitle
			: `${String(children)} | ${AppInfo.Name}`;

		// * Uncomment for a11y improvements. Screen Reader will read headline on mount
		// headlineRef.current?.focus();

		return () => {
			document.title = oldTitle;
		};
	});
	return (
		<h1
			className={["page-title", className].join(" ")}
			ref={headlineRef} tabIndex={0}
			{...other}
		>
			{children}
		</h1>
	);
};

export default Headline;
