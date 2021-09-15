import React, {useState} from "react";
import "./styles/edit-organizations.scss"
import addIcon from "./assets/human-add.svg"
import {Button} from "../button/button";
import {UserTable} from "../table/UserTable";
import {AddUserAccount} from "../add-user-account";
import {Input} from "../input";
import {SVG} from "../SVG";
import {USER_TABLE_ITEMS} from "../../contstans/constans";
import {useHistory} from "react-router-dom";


export const EditOrganization: React.FunctionComponent = (props) => {
    const [organizationName, setOrganizationName] = useState<string>('')
    const [customerID, setCustomerID] = useState<string>('')
    const [customerLink, setCustomerLink] = useState<string>('')
    const [comment, setComment] = useState<string | undefined>('')
    const history = useHistory();

    const [addUserActive, setAddUserActive] = useState<Boolean>(false)

    return (
       <div>
           {
               addUserActive ?
                   <AddUserAccount onBack={() => setAddUserActive(false)}/>
                   :
                   <div className="edit-organization">
                       <div className="edit-organization__header">
                           <div className="edit-organization__title">
                               Edit Organization
                           </div>
                           <div className="edit-organization__buttons">
                               <div className="edit-organization__cancel-btn" onClick={() => history.push("/")}>
                                   <Button type={'dotted'} text={'Cancel'}/>
                               </div>
                               <div className="edit-organization__save-btn">
                                   <Button type={'simple'} text={'Save'}/>
                               </div>
                           </div>
                       </div>
                       <div className="edit-organization__body">
                           <div className="edit-organization__info">
                               <div className="edit-organization__info-title">
                                   Ogranization info
                               </div>
                               <div className="edit-organization__inputs">
                                   <div className="edit-organization__input">
                                       <Input onChangeInput={(value) => setOrganizationName(value)}
                                              value={organizationName}
                                              placeholder='Name of The Organization'
                                       />
                                   </div>
                                   <div className="edit-organization__input">
                                       <Input onChangeInput={(value) => setCustomerID(value)}
                                              value={customerID}
                                              placeholder='CRM Customer ID'
                                       />
                                   </div>
                                   <div className="edit-organization__input">
                                       <Input onChangeInput={(value) => setCustomerLink(value)}
                                              value={customerLink}
                                              placeholder='CRM Customer ID Link'
                                       />
                                   </div>
                               </div>
                               <div className="edit-organization__comments">
                                   <Input onChangeInput={(value) => setComment(value)}
                                          value={comment}
                                          placeholder='Comments'
                                   />
                               </div>
                           </div>
                           <div className="edit-organization__user-list">
                               <div className="edit-organization__user-list-header">
                                   <div className="edit-organization__user-list-title">
                                       User List
                                   </div>
                                   <div className="edit-organization__user-list-add"
                                        onClick={() => setAddUserActive(true)}
                                   >
                                       <SVG icon={addIcon}/>
                                       <span>Add New</span>
                                   </div>
                               </div>
                               <UserTable inEdit rows={USER_TABLE_ITEMS}/>
                           </div>
                       </div>
                   </div>
           }
       </div>
    )
}
