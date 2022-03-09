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
            {dataPresent ? (
                <>
                    <samp className={style.headline}>
                        No results for “{normalizedQuery}” were found.
                    </samp>
                    <p className={style.subtitle}>
                        Make sure the writing is correct. You can contact us at{" "}
                        <a href="mailto:support@quantamatics.com">
                            support@quantamatics.com.
                        </a>
                    </p>
                </>
            ) : (
                <samp className={style.headline}>No organizations found</samp>
            )}
        </article>
    );
};

export default NoResultsMessage;
