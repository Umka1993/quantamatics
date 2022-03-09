import React, { useState, FunctionComponent } from "react";
import style from "./styles/side-bar.module.scss";
import NavBar from "../navbar";
import LinesIcon from "./assets/lines.svg";
import ExelIcon from "./assets/exel.svg";
import classNames from "classnames";
import Logo from "../logo";
import UserMenu from "../user-menu";

type SideBarProps = {
    openModal: (modal:string) => void;
}

export const SideBar: FunctionComponent<SideBarProps> = ({ openModal }) => {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const yearToday = new Date().getFullYear();

    const isMacOs = navigator.userAgent.includes("Mac OS");

    return (
        <aside className={classNames(style.root, { [style.collapsed]: collapsed })}>
            <div className={style.header}>
                {!collapsed && <Logo width={161} height={31} />}
                <button
                    className={style.switcher}
                    type="button"
                    role="switch"
                    aria-label="Hide Menu"
                    aria-checked={collapsed}
                    onClick={() => setCollapsed(!collapsed)}
                >
                    <LinesIcon width={16} height={16} aria-hidden="true" />
                </button>
            </div>

            <NavBar collapsed={collapsed} className={style.navbar} />

            {!collapsed && (
                <small className={style.copyright}>
                    © Copyright {yearToday} Facteus. All <br />
                    rights reserved.{" "}
                    <a
                        href="https://www.facteus.com/privacy-policy"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Privacy Policy
                    </a>
                </small>
            )}

            {!isMacOs && (
                <a
                    href={process.env.EXCEL_PLUGIN_DOWNLOAD_URL}
                    className={style.plugin}
                    aria-label="Get Excel Plug-in"
                    download
                >
                    <ExelIcon aria-hidden="true" fill="#20744A" width={20} height={20} />
                </a>
            )}

            <UserMenu collapsed={collapsed} openModal={openModal} />
        </aside>
    );
};
