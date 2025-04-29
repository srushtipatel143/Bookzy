export interface MovieDetails {
    imageURl: string;
    _id: string;
  }
  
  export interface RatingDetail {
    totalRating: number;
    userRatings: { ratings: number }[];
  }
  
  export interface LatestMovie {
    _id: string;
    movieDetail: MovieDetails;
    ratingDetail: RatingDetail;
  }