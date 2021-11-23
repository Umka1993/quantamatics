import React from "react";
import "./styles/side-bar.scss"
import NavBar from '../navbar'
import { EXCEL_PLUGIN } from "../../data/constants";

interface ISideBar {
}

export const SideBar: React.FunctionComponent<ISideBar> = () => {
    return (
        <aside className="side-bar">
            <NavBar />
            <a className='side-bar__button' href={EXCEL_PLUGIN} download>Get Excel Plug-in</a>

            <div className="side-bar__footer">
                © Copyright 2021 Facteus. <br />
                All rights reserved. <a target='_blank' href="https://www.facteus.com/privacy-policy/" rel="noreferrer">Privacy Policy</a>
            </div>
        </aside>
    )
}
