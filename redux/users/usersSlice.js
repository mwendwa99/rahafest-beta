import { createSlice } from "@reduxjs/toolkit";
import { getAllUsers } from "./usersAction";

const initialState = {
    users: [],
    usersError: null,
    loading: false,
};

const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(getAllUsers.pending, (state) => {
            state.loading = true;
            state.usersError = null;
        });
        builder.addCase(getAllUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload;
            state.usersError = null;
        });
        builder.addCase(getAllUsers.rejected, (state, action) => {
            state.loading = false;
            state.usersError = action.payload;
        });
    }
});

export default usersSlice.reducer;