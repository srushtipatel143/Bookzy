export interface UpcomingMovie {
    _id: string;
    movieImageURl: string;
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