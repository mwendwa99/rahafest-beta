import { createSlice } from "@reduxjs/toolkit";
import { getMenu } from "./menuActions";

const initialState = {
    menu: [],
    menuError: null,
    loading: false,
};

const menuSlice = createSlice({
    name: "menu",
    initialState,
    reducers: {},
    extraReducers: (builders) => {
        builders.addCase(getMenu.pending, (state) => {
            state.loading = true;
        });
        builders.addCase(getMenu.fulfilled, (state, action) => {
            state.loading = false;
            state.menu = action.payload;
            state.menuError = null;
        });
        builders.addCase(getMenu.rejected, (state, action) => {
            state.loading = false;
            state.menuError = action.error;
        });
    }
});

export default menuSlice.reducer;