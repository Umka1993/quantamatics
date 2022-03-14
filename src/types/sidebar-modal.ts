import { Dispatch, SetStateAction } from "react";

export type SideBarModalMode = undefined | "my-account" | "restart-server";

export type SideBarModalOpen = Dispatch<SetStateAction<SideBarModalMode>>;
