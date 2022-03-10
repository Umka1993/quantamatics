import SaveResetHeader from "../save-reset-header/SaveResetHeader";
import React, {
    FunctionComponent,
    SetStateAction,
    useEffect,
    useState,
    Dispatch,
    FormEvent,
} from "react";
import { HTMLProps } from "react";
import Dialog from "../dialog";
import style from "./AssetModal.module.scss";
import { SortTableHeader } from "../sort-table-header/SortTableHeader";
import { AssetInOrganization } from "types/asset";
import AssetRow from "./AssetRow";
import { useRef } from "react";
import { FormEventHandler } from "react";

interface AssetModalProps extends Omit<HTMLProps<HTMLDivElement>, "selected"> {
    open: boolean;
    closeFunction: () => void;
    options: AssetInOrganization[];
    selected: AssetInOrganization[];
    setSelected: Dispatch<SetStateAction<AssetInOrganization[]>>;
    assetsReset: () => void;
}

const AssetModal: FunctionComponent<AssetModalProps> = ({
    closeFunction,
    open,
    options,
    selected,
    disabled,
    setSelected,
    ...other
}) => {
    const [arrAssets, setArrAssets] = useState(options);

    const [hasChanges, setHasChanges] = useState(false);

    const [isSubmitting, setSubmitting] = useState(false);
    const [hasError, setError] = useState(false);

    const errorRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        setArrAssets(options);
    }, [options]);

    useEffect(() => {
        if (isSubmitting) {
            setTimeout(() => setSubmitting(false), 800);
            setTimeout(closeFunction, 800);
        }
    }, [isSubmitting]);

    function resetHandler(evt: FormEvent<HTMLFormElement>) {
        evt.preventDefault();

        if (hasChanges && !hasError) {
            setError(true)
            return;
        }

        if (!hasChanges || hasError) {
            setError(false);
            closeFunction();

        }
    }

    useEffect(() => {
        if (hasError && errorRef.current) {
            errorRef.current.focus();
        }
    }, [hasError, errorRef.current]);

    return (
        <Dialog
            id="asset-modal"
            variant="right-side"
            open={open}
            hasCloseButton={false}
            closeOnOutsideClick
            onRequestClose={closeFunction}
            {...other}
        >
            <form
                className={style.root}
                onReset={resetHandler}
                onSubmit={(evt) => {
                    evt.preventDefault();
                    setSubmitting(true);
                }}
                method='dialog'
            >
                <SaveResetHeader
                    headline="Application Assets"
                    disableReset={false}
                    disableSave={!hasChanges}
                    isSavedMessageActive={isSubmitting}
                    headlineID="asset-modal-title"
                    className={style.header}
                />
                {hasError && (
                    <p className={style.error} role="alert" ref={errorRef} tabIndex={0}>
                        Your changes will not be saved. Click again if you want to persist.
                    </p>
                )}

                <table className={style.table}>
                    <thead>
                        <tr className={style.row}>
                            <th className={style.headline}>Name</th>
                            <th className={[style.headline, style.action].join(" ")}>
                                Assign
                            </th>
                            <th className={[style.headline, style.action].join(" ")}>
                                Default
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {Boolean(arrAssets.length) &&
                            arrAssets.map((option) => (
                                <AssetRow
                                    key={option.assetId}
                                    option={option}
                                    selected={selected}
                                    setSelected={setSelected}
                                    disabled={disabled}
                                    setChange={() => !hasChanges && setHasChanges(true)}
                                />
                            ))}
                    </tbody>
                </table>
            </form>
        </Dialog>
    );
};

export default AssetModal;
