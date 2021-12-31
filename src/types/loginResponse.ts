import { IUser } from "./user";

export interface LoginResponse {
    token: string,
    user: IUser,
}
