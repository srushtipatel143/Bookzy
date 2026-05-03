'use client';
import {ReactNode,createContext,useContext,useState } from "react";

interface SelectedUser {
    user?: string;
    imageURL:string;
  }
  
  interface UserContextProps {
    selectUser: SelectedUser | null;
    setSelectUser: React.Dispatch<React.SetStateAction<SelectedUser | null>>;
  }
  

const Usercontext=createContext<UserContextProps|undefined>(undefined);

export const UserProvider=({children}:{children:ReactNode})=>{
    const [selectUser,setSelectUser]=useState<SelectedUser|null>(null);
    return(
        <Usercontext.Provider value={{selectUser,setSelectUser}}>
            {children}
        </Usercontext.Provider>
    )
}

export const useUser=():UserContextProps=>{
    const context=useContext(Usercontext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
      }
      return context;
}
