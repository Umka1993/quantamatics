import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Asset = {
    id: number,
    name: string,
}

type AssetsState = Asset[]

const initialState :AssetsState = []

const assetsSlice = createSlice({name: 'asset', initialState, reducers: {
    addAsset(state, action: PayloadAction<Asset>) {
        state.push(action.payload)
    }
} })

export const {addAsset} = assetsSlice.actions;
export default assetsSlice.reducer;