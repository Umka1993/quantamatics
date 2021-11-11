import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../types/user";

interface usersState {
    list: IUser[]
}

const initialState: usersState = {
    list: []
}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setList: (state, action: PayloadAction<IUser[]>) => {
            state.list = action.payload;
        }
    }
})

export const { setList } = usersSlice.actions;
export default usersSlice.reducer;