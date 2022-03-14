import React, { FunctionComponent } from "react";

import style from "./styles/no-result.module.scss";

interface NoResultsMessageProps {
    query: string;
    dataPresent?: boolean;
}

const NoResultsMessage: FunctionComponent<NoResultsMessageProps> = ({
    query,
    dataPresent,
}) => {
    const normalizedQuery = query.length > 32 ? `${query.slice(0, 32)}…` : query;

    return (
        <article className={style.root}>
            <samp className={style.headline}>
                {dataPresent
                    ? ` No results for “${normalizedQuery}” were found.`
                    : "No organizations found"}
            </samp>
        </article>
    );
};

export default NoResultsMessage;
