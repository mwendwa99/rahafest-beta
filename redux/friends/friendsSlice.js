import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    friends: null,
    friendsError: null,
    loading: false,
};

const friendsSlice = createSlice({
    name: "friends",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase()
    }
});

export default friendsSlice.reducer;
