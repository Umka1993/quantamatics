import React, { FormEvent, FormHTMLAttributes, ForwardedRef, FunctionComponent, useEffect, useState } from "react";
import "./styles/form.scss";
import { Loader } from "../../components/loader";
import Headline from '../page-title/index'
// import Button  from "../../components/button";


interface IForm extends FormHTMLAttributes<HTMLFormElement> {
	stopLoading?: boolean;
	headline?: string | JSX.Element;
	headlineText?: string;
	subtitle?: string;
	forwardRef?: ForwardedRef<HTMLFormElement>
}



const Form: FunctionComponent<IForm> = ({ headline, subtitle, children, onSubmit, stopLoading, headlineText, className, forwardRef, ...other }) => {
	const [loading, setLoading] = useState<boolean>(false);

	function handleSubmit(evt: FormEvent<HTMLFormElement>) {
		if (onSubmit) {
			evt.preventDefault();
			const isValid = (evt.target as HTMLFormElement).reportValidity()

			if (isValid) {
				setLoading(true);
				onSubmit(evt)
			}

		}
	}

	useEffect(() => {
		stopLoading && setLoading(false)
	}, [stopLoading])

	return (
		<form className={["form", className].join(' ')} onSubmit={handleSubmit} ref={forwardRef}
			{...other}
		>
			<header className="form__header">
				<Headline
					className="form__title"
					pageTitle={headlineText}
					style={{ fontWeight: 400 }}
				>
					{headline}
				</Headline>
				<p className="form__subtitle">{subtitle}</p>
			</header>

			{children}

			{loading && <Loader />}
		</form>
	);
};

export default Form;
