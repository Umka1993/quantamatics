import React, { useState } from "react";
import "./styles/side-bar.scss";
import NavBar from "../navbar";
import { EXCEL_PLUGIN } from "../../data/constants";
import ArrowsIcon from "./assets/arrows.svg";
import classNames from "classnames";

export const SideBar: React.FunctionComponent = () => {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    return (
        <aside
            className={classNames("side-bar", { "side-bar--collapsed": collapsed })}
        >
            <button
                className="side-bar__switcher"
                type="button"
                role="switch"
                aria-checked={collapsed}
                onClick={() => setCollapsed(!collapsed)}
            >
                <ArrowsIcon width={16} height={16} aria-hidden="true" fill="#BCC4D8" />
                Hide Menu
            </button>

            <NavBar collapsed={collapsed} />

            {!collapsed && (
                <p className="side-bar__footer">
                    <small>
                        © Copyright 2021 Facteus. <br />
                        All rights reserved.{" "}
                        <a
                            className='side-bar__privacy'
                            target="_blank"
                            href="https://www.facteus.com/privacy-policy/"
                            rel="noreferrer"
                        >
                            Privacy Policy
                        </a>
                    </small>
                </p>

            )}
        </aside>
    );
};
