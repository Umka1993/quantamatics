import React, {
    Dispatch,
    FunctionComponent,
    SelectHTMLAttributes,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import classNames from "classnames";
import { useClickOutside } from "../../hooks/useClickOutside";
import MultiselectAssetOrgOption from "./multiselect-asset-org-option";
import "./styles/assets.scss";
import MultiselectAssetOption, {MultiselectAssetOptionProps} from "./multiselect-asset-option";
import {AssetInOrganization, AssetServerResponse} from "../../types/asset";
import style from "../form/styles/edit-organization.module.scss";
import Button, {ResetButton} from "../button";
import CheckSVG from "../form/assets/check.svg";
import {SortDirection, UniqueError} from "../../data/enum";
import ISort from "../../types/sort-type";
import {SortTableHeader} from "../sort-table-header/SortTableHeader";

interface IAssetsModalWindow
    extends Omit<
    MultiselectAssetOptionProps,
    "option" | "selected" | "setSelected"
    >,
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
    // assignedAssetsReset: (target: HTMLButtonElement) => void
    isUpdating: boolean;
    isChanged: boolean;
    externalLoad?: boolean;
    duplicateOrgError: undefined | UniqueError.Name
    duplicateIdError: undefined | UniqueError.ID
    isSavedMessageActive: boolean
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
                                                                      isSavedMessageActive

                                                                  }) => {
    const rootElement = useRef<HTMLDivElement>(null);
    const isEditOrganization = Array.isArray(selected);
    const [hideError, setHideError] = useState(false);
    const [scrollY, setScrollY] = useState<number>(0);
    const INITIAL_SORT = {name: "name", direction: SortDirection.Down}
    const [sort, setSort] = useState<ISort>(INITIAL_SORT);
    const [visible, setVisible] = useState('')
    const [arrAssets, setArrAssets] = useState<AssetServerResponse[]>()
    const [filteredOptions, setFilteredOptions] = useState<AssetInOrganization[]>([])

    const addVisible = () => {
        setTimeout(() => setVisible("visible"));
    };

    const hideModal = async () => {
        setVisible("");
        setTimeout(() => setShowOptions(false), 300);
    };

    useEffect(() => {
        addVisible();
    }, [showOptions]);

    useEffect(() => {
        const arr: AssetServerResponse[] = []
        options.forEach((option) => {
            arr.push(option.asset)
        })
        setArrAssets(arr)
    }, [options])


    const getFilteredOptions = () => {

        let newOption: AssetInOrganization
        const filtered: AssetInOrganization[] = []
        const optionsId: number[] = []
        options.forEach((item) => optionsId.push(item.assetId))
        for (let a = 0; arrAssets && a < arrAssets.length; a++) {
            for (let o = 0; o < options.length; o++) {
                if (arrAssets[a].name === options[o].asset.name) {
                    newOption = {
                        organizationId: options[o].organizationId,
                        assetId: options[o].assetId,
                        sharedByDefault: options[o].sharedByDefault,
                        asset: arrAssets[a]
                    }

                    filtered.push(newOption)
                }
            }
        }
        setFilteredOptions(filtered)
    }


    useEffect(() => {
        getFilteredOptions()
    }, [arrAssets])

    useClickOutside(rootElement, () => hideModal(), showOptions);
    return (
        <article className={classNames("assets__modal")}>
            {showError && !hideError && (
                <p className="app-input__error">{errorMessage}</p>
            )}
            <form
                className={`assets__modal--body ${visible}`}
                ref={rootElement}
                onReset={hideModal}
            >
                <SaveResetHeader
                    headline="Application Assets"
                    disableReset={isUpdating}
                    disableSave={!isChanged || isUpdating || externalLoad}
                    isSavedMessageActive={isSavedMessageActive}
                />

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

                        {filteredOptions.map((option: any) =>
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
