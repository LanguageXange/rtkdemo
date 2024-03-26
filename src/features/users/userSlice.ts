import { createSlice , createAsyncThunk} from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from 'axios'
export type User = {
    id:string;
    name:string;
    username?:string;
    email?:string;
}

const USER_URL  = "https://jsonplaceholder.typicode.com/users"
export const fetchUsers = createAsyncThunk("users/fetchUsers", async()=>{
    try {
        const users = await axios.get(USER_URL)
        return users.data
    } catch (error) {
        return error
    }
})
const initialState:User[] = []

// const initialState: User[] = [
//     {id:"1", name:"James"},
//     {id:"2", name:"Nini"},
//     {id:"3", name:"Steven"},
// ]

export const userSlice = createSlice({
    name:"users",
    initialState,
    reducers:{},
    extraReducers(builder){
        builder.addCase(fetchUsers.fulfilled,(_,action)=>{
            return action.payload // this will replace the initial array
        })
    }
})


export const selectAllUsers = (state:RootState) => state.users

export default userSlice.reducer