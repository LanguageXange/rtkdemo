import {createSlice} from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit';

export interface CounterState  {
    count: number;
}

const initialState:CounterState = {
    count:0
}

export const counterSlice = createSlice({
    name:"mycounter",
    initialState,
    reducers:{
        addOne:(state)=>{
            state.count++
        },
        subtractOne:(state)=>{
            state.count--
        },
        addByAmount:(state,action:PayloadAction<number>)=>{
            state.count+=action.payload
        }
    }
})

//console.log(counterSlice,'what is counterSlice')
export const { addOne, subtractOne, addByAmount} = counterSlice.actions
export default counterSlice.reducer 