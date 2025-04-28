
import { create } from 'zustand';
import { LatestMovie } from '../components/movie/latestMovieInterface';

// interface MovieDetails {
//   imageURl: string;
//   _id: string;
// }

// interface RatingDetail {
//   totalRating: number;
//   userRatings: { ratings: number }[];
// }

// interface LatestMovie {
//   _id: string;
//   movieDetail: MovieDetails;
//   ratingDetail: RatingDetail;
// }

interface LatestMoviesState {
  latestMovies: LatestMovie[];
  setLatestMovies: (movies: LatestMovie[]) => void;
}

export const useLatestMoviesStore = create<LatestMoviesState>((set) => ({
  latestMovies: [],
  setLatestMovies: (movies) => set({ latestMovies: movies }),
}));
