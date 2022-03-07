import React, {
    Dispatch,
    FunctionComponent,
    ReactNode,
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
import MultiselectAssetOption, {
    MultiselectAssetOptionProps,
} from "./multiselect-asset-option";
import { AssetInOrganization, AssetListItem } from "../../types/asset";
import { SortDirection, UniqueError } from "../../data/enum";
import sortTable from "../sort-table-header/utils/sort";
import SortIcon from "../sort-table-header/assets/sort-icon.svg";
import ISort from "../../types/sort-type";
import { IUpdateUser } from "../../types/user";
import SaveResetHeader from "../save-reset-header/SaveResetHeader";

interface IAssetsModalWindow
    extends Omit<
    MultiselectAssetOptionProps,
    "option" | "selected" | "setSelected"
    >,
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
    // assignedAssetsReset: (target: HTMLButtonElement) => void
    isUpdating: boolean;
    isChanged: boolean;
    externalLoad?: boolean;
    isSavedMessageActive: boolean;
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
    // assignedAssetsReset,
    type,
    isUpdating,
    isChanged,
    externalLoad,
    isSavedMessageActive,
}) => {
    const rootElement = useRef<HTMLFormElement>(null);
    const isEditOrganization = Array.isArray(selected);
    const [hideError, setHideError] = useState(false);
    const INITIAL_SORT = { name: "", direction: SortDirection.Up };
    const [sort, setSort] = useState<ISort>(INITIAL_SORT);
    const [localRows, setLocalRows] = useState<IUpdateUser[]>([]);
    const [visible, setVisible] = useState("");

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
        sortTable("Name", sort, localRows, setSort, setLocalRows);
    }, []);

    useClickOutside(rootElement, hideModal, showOptions);

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

                <div className={classNames("assets__options")}>
                    <ul className="assets__options--header">
                        <li
                            aria-sort={
                                sort.name === "Name" ? sort.direction : SortDirection.Default
                            }
                        >
                            <button
                                onClick={() =>
                                    sortTable("Name", sort, localRows, setSort, setLocalRows)
                                }
                                className="sort-table-header__button"
                            >
                                Name
                                <SortIcon aria-hidden />
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
            </form>
        </article>
    );
};

export default AssetsModalWindow;
