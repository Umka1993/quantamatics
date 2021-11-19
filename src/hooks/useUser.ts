import { useSelector } from "react-redux";
import { RootState } from "../store";

function useUser() {
    const user = useSelector((state: RootState) => state.auth.user);

    return user;
}

export default useUser;