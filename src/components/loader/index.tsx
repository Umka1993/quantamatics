import React, { FunctionComponent, HTMLAttributes } from "react";
import "./styles/styles.scss";

export const Loader: FunctionComponent<HTMLAttributes<HTMLDivElement>> = ({
    className,
    ...other
}) => {
    return (
        <div className={["loader-wrapper", className].join(" ")} {...other}>
            <svg
                className="loader"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 340 340"
                width={96}
                height={96}
                stroke-linecap="round"
            >
                <circle cx="170" cy="170" r="160" stroke="#017AEE" />
                <circle cx="170" cy="170" r="135" stroke="#003C71" />
                <circle cx="170" cy="170" r="110" stroke="#017AEE" />
            </svg>
        </div>
    );
};

export default Loader;
