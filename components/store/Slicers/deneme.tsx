import { createSlice } from "@reduxjs/toolkit";

export const deneme = createSlice({
  name: "denemeSettings",
  initialState: {
    denemeState: false,
  },
  reducers: {
    setDenemeState: (state) => {
      state.denemeState = !state.denemeState;
    },
  },
});

export const { setDenemeState } = deneme.actions;
export default deneme.reducer;
