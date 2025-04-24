'use client';
import {ReactNode, createContext,useContext,useState} from "react";


interface SearchContextProps {
    showSearch: boolean;
    setShowSearch: (value: boolean) => void;
}

const SearchContext = createContext<SearchContextProps | undefined>(undefined);

export const SearchProvider=({children }:{children :ReactNode})=>{
    const [showSearch,setShowSearch]=useState(false);
    return(
        <SearchContext.Provider value={{showSearch,setShowSearch}}>
            {children}
        </SearchContext.Provider>
    )
}

export const useSearch = (): SearchContextProps => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};