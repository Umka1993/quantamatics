import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function useUser() {
    const user = useSelector((state: RootState) => state.auth.user);

    return user;
}
