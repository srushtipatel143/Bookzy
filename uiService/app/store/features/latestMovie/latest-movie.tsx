import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { LatestMovie } from "@/app/components/movie/latestMovieInterface";

interface LatestMovieState{
    movies:LatestMovie[];
}

const initialState:LatestMovieState={
    movies:[]
}

const latestMovieSlice=createSlice({
    name:"latest-movie",
    initialState,
    reducers:{
        setLatestMovies:(state,action:PayloadAction<LatestMovie[]>)=>{
            state.movies=action.payload;
        }
    }
})

export const {setLatestMovies} =latestMovieSlice.actions;
export default latestMovieSlice.reducer;