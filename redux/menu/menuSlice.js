import { createSlice } from "@reduxjs/toolkit";
import { getMenu } from "./menuActions";

const initialState = {
    menu: null,
    menuError: null,
    menuLoading: false,
};

const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {},
    extraReducers: (builders) => {
        builders.addCase(getMenu.pending, (state) => {
            state.menuLoading = true;
        });
        builders.addCase(getMenu.fulfilled, (state, action) => {
            state.menuLoading = false;
            state.menu = action.payload.data;
            state.menuError = null;
        });
        builders.addCase(getMenu.rejected, (state, action) => {
            state.menuLoading = false;
            state.menuError = action.error;
        });
    }
});

export default menuSlice.reducer;