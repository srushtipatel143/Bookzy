export interface UpcomingMovie {
    _id: string;
    imageURl: string;
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