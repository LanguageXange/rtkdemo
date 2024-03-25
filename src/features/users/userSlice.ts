import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export type User = {
    id:string;
    name:string;
}

const initialState: User[] = [
    {id:"1", name:"James"},
    {id:"2", name:"Nini"},
    {id:"3", name:"Steven"},
]

export const userSlice = createSlice({
    name:"users",
    initialState,
    reducers:{

    }
})


export const selectAllUsers = (state:RootState) => state.users

export default userSlice.reducer