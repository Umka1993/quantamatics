import React, { FunctionComponent } from "react";

import style from "./styles/no-result.module.scss";

interface NoResultsMessageProps {
    query: string;
}

const NoResultsMessage: FunctionComponent<NoResultsMessageProps> = ({
    query,
}) => {
    return (
        <article className={style.root}>
            <h1 className={style.headline}>
                Oops. No results for{" "}
                {query.length > 32 ? `"${query.slice(0, 32)}…"` : `"${query}"`} were
                found
            </h1>
            <p className={style.subtitle}>
                Make sure the writing is correct. You can contact us at{" "}
                <a href="mailto:support@quantamatics.com">support@quantamatics.com.</a>
            </p>
        </article>
    );
};

export default NoResultsMessage;
