// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { postsReducer } from "./slices/posts";
import { authReducer } from "./slices/auth";
import userReducer from "./slices/getme";
import { storeReducer } from "./slices/store";

const store = configureStore({
    reducer: {
        posts: postsReducer,
        auth: authReducer,
        user: userReducer,
        store: storeReducer,
    }
});

export default store;