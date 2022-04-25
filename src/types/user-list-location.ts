import { SortDirection, UserKey } from "../data/enum"

export interface UserListLocation {
	initialSort: UserKey | "",
	initialDirection: SortDirection
}
