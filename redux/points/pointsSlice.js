import { createSlice } from "@reduxjs/toolkit";
import { getPoints } from "./pointsActions";

const initialState = {
    points: null,
    pointsError: null,
    loading: false,
};

const pointsSlice = createSlice({
    name: "points",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPoints.pending, (state) => {
                state.loading = true;
                state.pointsError = null;
            })
            .addCase(getPoints.fulfilled, (state, action) => {
                state.loading = false;
                state.points = action.payload;
                state.pointsError = null;
            })
            .addCase(getPoints.rejected, (state, action) => {
               state.loading = false;
               state.pointsError = action.payload; 
            });
    }
});

export default pointsSlice.reducer;