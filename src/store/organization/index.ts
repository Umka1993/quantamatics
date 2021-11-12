import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Organization } from "../../types/organization/types";

interface organizationState {
    all: Organization[]
}

const initialState: organizationState = {
    all: []
}

const organizationSlice = createSlice({
    name: 'organization',
    initialState,
    reducers: {
        setAllOrg: (state, action: PayloadAction<Organization[]>) => {
            state.all = action.payload;
        }
    }
})

export const { setAllOrg } = organizationSlice.actions;
export default organizationSlice.reducer;