import SaveResetHeader from "../save-reset-header/SaveResetHeader";
import React, { FunctionComponent } from "react";
import { HTMLProps } from "react";
import Dialog from "../dialog";
import style from './AssetModal.module.scss';

interface AssetModalProps extends HTMLProps<HTMLDivElement> {
    open: boolean;
    closeFunction: () => void;
}

const AssetModal: FunctionComponent<AssetModalProps> = ({
    closeFunction,
    ...other
}) => {
    return (
        <Dialog
            id="asset-modal"
            variant="right-side"
            hasCloseButton={false}
            closeOnOutsideClick
            onRequestClose={closeFunction}
            wrapperClass={style.root}
            {...other}
        >
            <SaveResetHeader
                headline="Application Assets"
                disableReset={false}
                disableSave={false}
                isSavedMessageActive={true}
                headlineID="asset-modal-title"
                className={style.header}
            />
        </Dialog>
    );
};

export default AssetModal;
