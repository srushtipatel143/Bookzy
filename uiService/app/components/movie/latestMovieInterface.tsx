export interface ratingData {
    totalRating: number;
    votes:number;
  }
  
  export interface LatestMovie {
    _id: string;
    imageURl: string;
    ratingData: ratingData;
  }