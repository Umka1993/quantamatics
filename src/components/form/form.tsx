import React, { FormEvent, FormHTMLAttributes, FunctionComponent, useEffect, useRef, useState } from "react";
import "./styles/form.scss";
import { Loader } from "../../components/loader";
// import Button  from "../../components/app-button";


interface IForm extends FormHTMLAttributes<HTMLFormElement> {
    stopLoading?: boolean;
    title?: string;
    subtitle?: string;
    ref?: React.Ref<HTMLFormElement>;
}



const Form: FunctionComponent<IForm> = ({ title, subtitle, children, onSubmit, stopLoading, onInput, ...other }) => {
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
        <form className="form" onSubmit={handleSubmit} ref={formRef} 
            noValidate={validate ? undefined : true} {...other}
            onInput={handleInput}
        >
            <header className="form__header">
                <h1 className="form__title">{title}</h1>
                <p className="form__subtitle">{subtitle}</p>
            </header>

            {children}

            {loading && <Loader />}
        </form>
    );
};

export default Form;
