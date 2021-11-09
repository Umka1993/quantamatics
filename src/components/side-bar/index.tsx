import React from "react";
import "./styles/side-bar.scss"
import NavBar from '../navbar'


interface ISideBar {
    onSwitch: (name: string) => void
}

export const SideBar: React.FunctionComponent<ISideBar> = (props) => {
    return(
        <aside className="side-bar">
            <NavBar />
            
            <div className="side-bar__footer">
                © Copyright 2021 Facteus. <br/>
                All rights reserved. <a target='_blank' href="https://www.facteus.com/privacy-policy/">Privacy Policy</a>
            </div>
        </aside>
    )
}
