import { configureStore } from "@reduxjs/toolkit";
import latestMovieReducer  from "./features/latestMovie/latest-movie";

export const store=configureStore({
    reducer:{
        latestMovie:latestMovieReducer
    }
});

export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;