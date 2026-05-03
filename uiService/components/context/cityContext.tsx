'use client';
import {ReactNode,createContext,useContext,useState } from "react";

interface SelectedCity {
    id: number;
    city: string;
  }
  
  interface CityContextProps {
    selectCity: SelectedCity | null;
    setSelectCity: React.Dispatch<React.SetStateAction<SelectedCity | null>>;
  }
  

const Citycontext=createContext<CityContextProps|undefined>(undefined);

export const CityProvider=({children}:{children:ReactNode})=>{
    const [selectCity,setSelectCity]=useState<SelectedCity|null>(null);
    return(
        <Citycontext.Provider value={{selectCity,setSelectCity}}>
            {children}
        </Citycontext.Provider>
    )
}

export const useCity=():CityContextProps=>{
    const context=useContext(Citycontext);
    if (!context) {
        throw new Error("useSearch must be used within a SearchProvider");
      }
      return context;
}
