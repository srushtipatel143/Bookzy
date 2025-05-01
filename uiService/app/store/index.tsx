import { configureStore } from "@reduxjs/toolkit";
import latestMovieReducer  from "./features/latestMovie/latest-movie";
import upcomingMovieReducer from "./features/upcomingMovie/upcoming-movie";


export const store=configureStore({
    reducer:{
        latestMovie:latestMovieReducer,
        upcomingMovie:upcomingMovieReducer
    }
});

export type RootState=ReturnType<typeof store.getState>;
export type AppDispatch=typeof store.dispatch;