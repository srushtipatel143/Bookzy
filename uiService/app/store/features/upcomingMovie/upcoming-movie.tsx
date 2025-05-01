import { createSlice,PayloadAction } from "@reduxjs/toolkit";
import { UpcomingMovie } from "@/app/components/movie/upcomingMovieInterface";

interface UpcomingMovieState{
    movies:UpcomingMovie[];
}

const initialState:UpcomingMovieState={
    movies:[]
}

const upcomingMovieSlice=createSlice({
    name:"upcoming-movie",
    initialState,
    reducers:{
        setUpcomingMovies:(state,action:PayloadAction<UpcomingMovie[]>)=>{
            state.movies=action.payload;
        }
    }
})

export const {setUpcomingMovies} =upcomingMovieSlice.actions;
export default upcomingMovieSlice.reducer;