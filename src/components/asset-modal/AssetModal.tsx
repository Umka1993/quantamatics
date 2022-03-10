import SaveResetHeader from "../save-reset-header/SaveResetHeader";
import React, { FunctionComponent, useEffect, useState } from "react";
import { HTMLProps } from "react";
import Dialog from "../dialog";
import style from './AssetModal.module.scss';
import { SortTableHeader } from "../sort-table-header/SortTableHeader";
import { AssetInOrganization } from "types/asset";

interface AssetModalProps extends HTMLProps<HTMLDivElement> {
    open: boolean;
    closeFunction: () => void;
    options: AssetInOrganization[];
}

const AssetModal: FunctionComponent<AssetModalProps> = ({
    closeFunction,
    open,
    options,
    ...other
}) => {
    const [arrAssets, setArrAssets] = useState(options)

    useEffect(() => {
        setArrAssets(options)
    }, [options])


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
            <form className={style.root} onReset={closeFunction} >
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
                        {/* {arrAssets.map((option) => <tr key={option.assetId}>
                            <td>{option.asset}</td>
                            <td>{option.sharedByDefault}</td>
                        </tr>)} */}
                    </tbody>
                </table>

            </form>
        </Dialog>
    );
};

export default AssetModal;
