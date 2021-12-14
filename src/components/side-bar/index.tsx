import React, { useState } from "react";
import style from "./styles/side-bar.module.scss";
import NavBar from "../navbar";
import LinesIcon from "./assets/lines.svg";
import ExelIcon from "./assets/exel.svg";
import classNames from "classnames";
import Logo from "../logo";
import Button from "../button";
import UserMenu from "../user-menu";

export const SideBar: React.FunctionComponent = () => {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    return (
        <aside
            className={classNames(style.root, { [style.collapsed]: collapsed })}
        >
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
                    <LinesIcon width={16} height={16} aria-hidden="true" fill="#BCC4D8" />
                </button>
            </div>

            <NavBar collapsed={collapsed} />

            <Button className={style.plugin} aria-label='Get Excel Plug-in'>
                <ExelIcon aria-hidden="true" fill="#20744A" />
            </Button>

            <UserMenu collapsed={collapsed} />
        </aside >
    );
};
