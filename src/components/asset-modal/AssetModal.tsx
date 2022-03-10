import SaveResetHeader from "../save-reset-header/SaveResetHeader";
import React, { FunctionComponent, useEffect, useState } from "react";
import { HTMLProps } from "react";
import Dialog from "../dialog";
import style from "./AssetModal.module.scss";
import { SortTableHeader } from "../sort-table-header/SortTableHeader";
import { AssetInOrganization } from "types/asset";

interface AssetModalProps extends Omit<HTMLProps<HTMLDivElement>, "selected"> {
    open: boolean;
    closeFunction: () => void;
    options: AssetInOrganization[];
    selected: AssetInOrganization[];
}

const AssetModal: FunctionComponent<AssetModalProps> = ({
    closeFunction,
    open,
    options,
    selected,
    ...other
}) => {
    const [arrAssets, setArrAssets] = useState(options);

    useEffect(() => {
        setArrAssets(options);
    }, [options]);

    console.table(arrAssets);

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
            <form className={style.root} onReset={closeFunction}>
                <SaveResetHeader
                    headline="Application Assets"
                    disableReset={false}
                    disableSave={false}
                    isSavedMessageActive={true}
                    headlineID="asset-modal-title"
                    className={style.header}
                />
                <table className={style.table}>
                    <thead>
                        <tr className={style.row}>
                            <th className={style.headline}>Name</th>
                            <th className={style.headline}>Assign</th>
                            <th className={style.headline}>Default</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {arrAssets.length &&
                            arrAssets.map((option) => (
                                <AssetRow key={option.assetId} />
                            ))} */}
                    </tbody>
                </table>
            </form>
        </Dialog>
    );
};

export default AssetModal;
