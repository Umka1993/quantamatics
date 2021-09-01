import React from "react";
import "./styles/side-bar.scss"
import pieImg from "./assets/pie.svg"


interface ISideBar {
   // items: Array<>
}

export const SideBar: React.FunctionComponent = (props) => {
    return(
        <div className="side-bar">
             <div className="side-bar__block">
                 <div className="side-bar__item">
                     <img src={pieImg} className="side-bar__item-img"/>
                     <div className="side-bar__item-name">
                         Overview
                     </div>
                 </div>
                 <div className="side-bar__item">
                     <img src={pieImg} className="side-bar__item-img"/>
                     <div className="side-bar__item-name">
                         Research
                     </div>
                 </div>
                 <div className="side-bar__item side-bar__item_active">
                     <img src={pieImg} className="side-bar__item-img"/>
                     <div className="side-bar__item-name">
                         Organizations
                     </div>
                 </div>
                 <div className="side-bar__item">
                     <img src={pieImg} className="side-bar__item-img"/>
                     <div className="side-bar__item-name">
                         Accounts list
                     </div>
                 </div>
             </div>
        </div>
    )
}