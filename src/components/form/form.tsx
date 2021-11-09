import React, { FormEvent, FormHTMLAttributes, FunctionComponent, useEffect, useRef, useState } from "react";
import "./styles/form.scss";
import { Loader } from "../../components/loader";
import Headline from '../page-title/index'
// import Button  from "../../components/button";


interface IForm extends FormHTMLAttributes<HTMLFormElement> {
    stopLoading?: boolean;
    headline?: string | JSX.Element;
    headlineText?: string;
    subtitle?: string;
}



const Form: FunctionComponent<IForm> = ({ headline, subtitle, children, onSubmit, stopLoading, onInput, headlineText, className, ...other }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [validate, setValidate] = useState<true | undefined>(undefined);

    const formRef = useRef<HTMLFormElement>(null)

    function handleSubmit(evt: FormEvent<HTMLFormElement>) {
        if (onSubmit) {
            evt.preventDefault();
            setValidate(true)
            const isValid = (evt.target as HTMLFormElement).reportValidity()

            if (isValid) {
                setLoading(true);
                onSubmit(evt)
            }
            
        }
    }

    function handleInput(evt:FormEvent<HTMLFormElement>) {
        if (validate) {
            formRef.current?.reportValidity();
        }

        onInput && onInput(evt);
    }

    useEffect(() => {
        if (stopLoading) {
            setLoading(false)
            setValidate(true)
            formRef.current?.reportValidity();
        }
    }, [stopLoading])

    return (
        <form className={["form", className].join(' ')} onSubmit={handleSubmit} ref={formRef} 
            noValidate={validate ? undefined : true} {...other}
            onInput={handleInput}
        >
            <header className="form__header">
                <Headline className="form__title" pageTitle={headlineText}>{headline}</Headline>
                <p className="form__subtitle">{subtitle}</p>
            </header>

            {children}

            {loading && <Loader />}
        </form>
    );
};

export default Form;
