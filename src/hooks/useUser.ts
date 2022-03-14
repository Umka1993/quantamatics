import { useSelector } from "react-redux";
import { IUser } from "../types/user";
import { RootState } from "../store";

export default function useUser() :IUser {
	const user = useSelector((state: RootState) => state.auth.user);

	return user as IUser;
}
