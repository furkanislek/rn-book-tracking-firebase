import { createSlice } from "@reduxjs/toolkit";

export const auth = createSlice({
  name: "auth",
  initialState: {
    userInfo: null,
    email: null,
    authPassword: null,
    user: null,
    isLogin: true,
  },
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setAuthPassword: (state, action) => {
      state.authPassword = action.payload;
    },
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setAuthIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
  },
});

export const { setUserInfo, setEmail, setAuthPassword, setAuthUser, setAuthIsLogin } =
  auth.actions;
export default auth.reducer;
