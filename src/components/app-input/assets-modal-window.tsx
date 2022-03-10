import React, {
    Dispatch,
    FunctionComponent,
    SelectHTMLAttributes,
    SetStateAction,
    useEffect,
    useRef,
    useState
} from 'react';
import classNames from "classnames";
import { useClickOutside } from "../../hooks/useClickOutside";
import MultiselectAssetOrgOption from "./multiselect-asset-org-option";
import "./styles/assets.scss";
import MultiselectAssetOption, { MultiselectAssetOptionProps } from "./multiselect-asset-option";
import { AssetInOrganization } from "../../types/asset";
import style from "../form/styles/edit-organization.module.scss";
import Button, { ResetButton } from "../button";
import { SortDirection, UniqueError } from "../../data/enum";
import ISort from "../../types/sort-type";
import { SortTableHeader } from "../sort-table-header/SortTableHeader";
import sortTable from "../sort-table-header/utils/sort";
import { Organization } from "../../types/organization/types";


interface IAssetsModalWindow extends Omit<MultiselectAssetOptionProps,
    "option" | "selected" | "setSelected">,
    SelectHTMLAttributes<HTMLSelectElement> {
    showOptions: boolean;
    setShowOptions: (arg: boolean) => void;
    options: AssetInOrganization[];
    selected: Set<string | number> | AssetInOrganization[];
    errorMessage?: string;
    showError?: boolean;
    setSelected:
    | Dispatch<SetStateAction<Set<string | number>>>
    | Dispatch<SetStateAction<AssetInOrganization[]>>;
    isUpdating: boolean,
    isChanged: boolean,
    externalLoad?: boolean;
    duplicateOrgError: undefined | UniqueError.Name
    duplicateIdError: undefined | UniqueError.ID
    organization?: Organization;
    setAssignedAssets: | Dispatch<SetStateAction<Set<string | number>>>
    | Dispatch<SetStateAction<AssetInOrganization[]>>;

    hideModal: () => void
    visible: string
    assetsReset: () => void,
    setVisible: (arg: string) => void
}

const AssetsModalWindow: FunctionComponent<IAssetsModalWindow> = ({
    showOptions,
    selected,
    errorMessage,
    showError,
    setSelected,
    disabled,
    options,
    type,
    isUpdating,
    isChanged,
    externalLoad,
    duplicateOrgError,
    duplicateIdError,
    hideModal,
    visible,
    setVisible,
    assetsReset
}) => {
    const rootElement = useRef<HTMLDivElement>(null);
    const isEditOrganization = Array.isArray(selected);
    const [hideError, setHideError] = useState(false);
    const [scrollY, setScrollY] = useState<number>(0);
    const INITIAL_SORT = { name: "name", direction: SortDirection.Down }
    const [sort, setSort] = useState<ISort>(INITIAL_SORT);
    // const [visible, setVisible] = useState('')
    const [arrAssets, setArrAssets] = useState<AssetInOrganization[]>(options)
    const [isSave, setIsSave] = useState<boolean>(false)


    const addVisible = () => {
        setTimeout(() => setVisible('visible'))
    }

    useEffect(() => {
        addVisible()
    }, [showOptions])

    useEffect(() => {
        if (isSave) {
            setTimeout(() => setIsSave(false), 1000);
            setTimeout(() => hideModal(), 1200);
        }
    }, [isSave]);


    useEffect(() => {
        setArrAssets(options)
    }, [options])

    useEffect(() => {
        sortTable('name', sort, options, setSort, setArrAssets)
    }, [])


    useClickOutside(rootElement, () => assetsReset(), showOptions);
    return (
        <>
            <div
                className={classNames("assets__modal")}
            >
                {showError && !hideError && (
                    <p className="app-input__error">{errorMessage}</p>
                )}
                <div className={`assets__modal--body ${visible}`}
                    ref={rootElement}>
                    <div className="assets__header">
                        <div className="assets__header--wrap">
                            <div className="assets__header--title">
                                <h3>Application Assets</h3>
                            </div>
                            <div className="assets__header--buttons">
                                <div className={style.buttons}>
                                    <ResetButton
                                        onClick={() =>
                                            assetsReset()
                                        }
                                        disabled={isUpdating}
                                    >
                                        Cancel
                                    </ResetButton>

                                    <Button
                                        type="submit"
                                        className={style.save}
                                        disabled={
                                            !isChanged ||
                                            isUpdating ||
                                            externalLoad ||
                                            Boolean(duplicateOrgError) ||
                                            Boolean(duplicateIdError)
                                        }
                                        variant={isSave ? "valid" : undefined}
                                        onClick={() => setTimeout(() => setIsSave(true), 100)}
                                    >
                                        {isSave ? (
                                            <>
                                                Saved
                                            </>
                                        ) : (
                                            "Save"
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        className={classNames("assets__options")}

                    >
                        <table>
                            <thead>
                                <tr className="assets__options--header">
                                    <SortTableHeader
                                        name={'name'}
                                        text={'Name'}
                                        sort={sort}
                                        localRows={arrAssets}
                                        setSort={setSort}
                                        setLocalRows={setArrAssets}
                                        className="user"
                                        rememberScroll={setScrollY}
                                    />
                                    <th>Read</th>
                                    <th>Write</th>
                                    <th>Default</th>
                                </tr>
                            </thead>

                        </table>

                        {arrAssets.map((option: any) =>
                            isEditOrganization ? (
                                <MultiselectAssetOrgOption
                                    key={option.assetId}
                                    option={option}
                                    selected={selected as any}
                                    setSelected={setSelected as any}
                                    disabled={disabled}
                                />
                            ) : (
                                <MultiselectAssetOption
                                    key={option.assetId}
                                    option={option}
                                    selected={(selected as any).has(option.assetId)}
                                    setSelected={setSelected as any}
                                    disabled={disabled}
                                    type={type}
                                />
                            )
                        )}
                    </div>
                </div>
            </div> 
        </>


    );
};

export default AssetsModalWindow;