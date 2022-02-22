import {LoginResponse} from "../types/loginResponse";
import {AppRoute} from "../data/enum";
import pendoInitialize from "../services/pendoInitialize";
import {saveToken} from "../services/token";
import {setCookie} from "../services/cookies";
import {useDispatch} from "react-redux";
import {login} from "../store/authorization";
import {useNavigate} from "react-router-dom";

export default function useLogin(): (body: LoginResponse) => void {
    const dispatch = useDispatch();
    const navigate = useNavigate()

    return ({user, token}) => {
        pendoInitialize(user);
        dispatch(login(user))
        saveToken(token);
        setCookie('user', user.email)
        localStorage.setItem("user", JSON.stringify(user));
        return navigate(AppRoute.Home);
    }
}