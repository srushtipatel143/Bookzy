export interface ratingData {
    totalRating: number;
    votes:number;
  }[];
  
  export interface LatestMovie {
    _id: string;
    movieImageURl: string;
    ratingData: ratingData;
    title: string;
    movieType: {
      _id: string;
      type: string;
    }[];
    movieLanguage:{
      language:string;
    }[];
    screenTypes:[];
  }