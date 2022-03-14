import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {  AuthorizationStatus } from "../../data/enum";
import { IUser } from "../../types/user";
import pendoInitialize from "../../services/pendoInitialize";

export interface AuthState {
    status: AuthorizationStatus;
    user?: IUser;
}

const user: IUser = localStorage.getItem("user")
	? JSON.parse(localStorage.getItem("user") as string): undefined;

user && pendoInitialize(user);

const initialState: AuthState = {
	status: user ? AuthorizationStatus.Auth : AuthorizationStatus.Unknown,
	user: user,
};

const authorizationSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login(state, action: PayloadAction<IUser>) {
			state.status = AuthorizationStatus.Auth;
			state.user = action.payload;
		},
		logout(state) {
			state.status = AuthorizationStatus.NoAuth;
			delete state.user;
		},
	},
});

export const { login, logout } = authorizationSlice.actions;
export default authorizationSlice.reducer;
