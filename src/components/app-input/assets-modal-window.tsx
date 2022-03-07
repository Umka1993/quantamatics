import React, {
    Dispatch,
    FunctionComponent,
    ReactNode,
    SelectHTMLAttributes,
    SetStateAction, useEffect,
    useRef,
    useState
} from 'react';
import classNames from "classnames";
import {useClickOutside} from "../../hooks/useClickOutside";
import MultiselectAssetOrgOption from "./multiselect-asset-org-option";
import "./styles/assets.scss";
import MultiselectAssetOption, {MultiselectAssetOptionProps} from "./multiselect-asset-option";
import {AssetInOrganization, AssetListItem} from "../../types/asset";
import style from "../form/styles/edit-organization.module.scss";
import Button, {ResetButton} from "../button";
import CheckSVG from "../form/assets/check.svg";
import {SortDirection, UniqueError} from "../../data/enum";
import sortTable from "../sort-table-header/utils/sort";
import SortIcon from "../sort-table-header/assets/sort-icon.svg";
import ISort from "../../types/sort-type";
import {IUpdateUser} from "../../types/user";


interface IAssetsModalWindow extends Omit<MultiselectAssetOptionProps,
    "option" | "selected" | "setSelected">,
    SelectHTMLAttributes<HTMLSelectElement> {
    showOptions: boolean;
    setShowOptions: (arg: boolean) => void;
    options: AssetListItem[] | AssetInOrganization[];
    selected: Set<string | number> | AssetInOrganization[];
    errorMessage?: string;
    showError?: boolean;
    setSelected:
        | Dispatch<SetStateAction<Set<string | number>>>
        | Dispatch<SetStateAction<AssetInOrganization[]>>;
    assignedAssetsReset: (target: HTMLButtonElement) => void
    isUpdating: boolean,
    isChanged: boolean,
    externalLoad?: boolean;
    duplicateOrgError: undefined | UniqueError.Name
    duplicateIdError: undefined | UniqueError.ID
    isSavedMessageActive: boolean,


}

const AssetsModalWindow: FunctionComponent<IAssetsModalWindow> = ({
                                                                      showOptions,
                                                                      setShowOptions,
                                                                      selected,
                                                                      errorMessage,
                                                                      showError,
                                                                      setSelected,
                                                                      disabled,
                                                                      options,
                                                                      assignedAssetsReset,
                                                                      type,
                                                                      isUpdating,
                                                                      isChanged,
                                                                      externalLoad,
                                                                      duplicateOrgError,
                                                                      duplicateIdError,
                                                                      isSavedMessageActive,

                                                                  }) => {
    const rootElement = useRef<HTMLDivElement>(null);
    const isEditOrganization = Array.isArray(selected);
    const [hideError, setHideError] = useState(false);
    const [scrollY, setScrollY] = useState<number>(0);
    const INITIAL_SORT = {name: "", direction: SortDirection.Up}
    const [sort, setSort] = useState<ISort>(INITIAL_SORT);
    const [localRows, setLocalRows] = useState<IUpdateUser[]>([]);
    const [visible, setVisible] = useState('')


    const addVisible = () => {
        setTimeout(() => setVisible('visible'))
    }

    const hideModal = async () => {
        setVisible('')
        setTimeout(() => setShowOptions(false), 300)
    }

    useEffect(() => {
        addVisible()
    }, [showOptions])


    useEffect(() => {
        sortTable("Name", sort, localRows, setSort, setLocalRows)
    }, [])


    useClickOutside(rootElement, () => hideModal(), showOptions);

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
                                        onClick={({target}) =>
                                            assignedAssetsReset(target as HTMLButtonElement)
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
                            </div>
                        </div>
                    </div>
                    <div
                        className={classNames("assets__options", {})}

                    >
                        <ul className="assets__options--header">
                            <li
                                aria-sort={sort.name === 'Name' ? sort.direction : SortDirection.Default}>
                                <button
                                    onClick={() => {
                                        if (setScrollY) {
                                            const scrollWrapper = document.querySelector('main')
                                            scrollWrapper && setScrollY(scrollWrapper.scrollTop)
                                        }
                                        sortTable('Name', sort, localRows, setSort, setLocalRows)
                                    }}
                                    className='sort-table-header__button'
                                >
                                    Name
                                    <SortIcon aria-hidden/>
                                </button>
                            </li>
                            <li>Read</li>
                            <li>Write</li>
                            <li>Default</li>
                        </ul>
                        {options.map((option: any) =>
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