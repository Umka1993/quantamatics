import { AxiosInstance } from "axios";
import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import { RootState } from "../../store";

export type ThunkActionResult<R = Promise<void>> = ThunkAction<
	R,
	RootState,
	AxiosInstance,
	Action
>;
