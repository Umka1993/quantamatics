import React, {useState} from "react";
import "./styles/input.scss"
import classNames from "classnames";
import SVG from "../SVG";
import arrowIcon from "./assets/arrow.svg"

interface ISelectorInput {
    className?: string,
    placeholder?: string,
    onChangeInput: (value: any) => void
    value?: any
    required?: boolean
    errors?: boolean
}

export const SelectorInput: React.FunctionComponent<ISelectorInput> = (props) => {
    const {className, placeholder, value, onChangeInput, required, errors} = props;
    const [selecting, setSelecting] = useState(false)
    const inputClassNames = classNames('selector-input', className, {'error': errors})

    return (
        <div className={inputClassNames}>
            <div className="selector-input__value">{value}</div>
            <SVG icon={arrowIcon}/>
            {selecting &&
            <div className="selector-input__list">
                <div className="selector-input__item">General Electric</div>
                <div className="selector-input__item">General Electric</div>
                <div className="selector-input__item">General Electric</div>
                <div className="selector-input__item">General Electric</div>
                <div className="selector-input__item">General Electric</div>
                <div className="selector-input__item">General Electric</div>
                <div className="selector-input__item">General Electric</div>
                <div className="selector-input__item">General Electric</div>
            </div>
            }
        </div>
    )
}
