import { Dispatch, SetStateAction } from "react";

export const enum SideBarModalMode {
	Account = 'my-account',
	Restart = 'restart-server',
}

export type SideBarModalModeType = undefined | SideBarModalMode;

export type SideBarModalOpen = Dispatch<SetStateAction<SideBarModalModeType>>;
