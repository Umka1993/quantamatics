import Button, { ResetButton } from "../button";
import Headline from "../page-title";
import React, { FunctionComponent, HTMLProps } from "react";
import CheckSVG from "./assets/check.svg";
import style from "./SaveResetHeader.module.scss"

interface SaveResetHeaderProps extends HTMLProps<HTMLDivElement> {
    headline: string,
    disableSave?: boolean,
    isSavedMessageActive?: boolean,
    disableReset?: boolean,
}

const SaveResetHeader: FunctionComponent<SaveResetHeaderProps> = ({ headline, disableSave, disableReset, isSavedMessageActive, ...other }) => {
    return (
        <header className={style.header} {...other}>
            <Headline style={{ margin: 0 }}>
                {headline}
            </Headline>
            <div className={style.buttons}>
                <ResetButton
                    disabled={disableReset}
                    onClick={({ currentTarget }) => currentTarget.blur()}
                >
                    Cancel
                </ResetButton>

                <Button
                    type="submit"
                    className={style.save}
                    disabled={disableSave
                    }
                    variant={isSavedMessageActive ? "valid" : undefined}
                >
                    {isSavedMessageActive ? (
                        <>
                            <CheckSVG
                                aria-hidden="true"
                                width={17}
                                height={17}
                                fill="currentColor"
                            />
                            Saved
                        </>
                    ) : (
                        "Save"
                    )}
                </Button>
            </div>
        </header>);
}

export default SaveResetHeader;