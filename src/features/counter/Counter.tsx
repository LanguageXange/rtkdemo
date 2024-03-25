import React,{useState} from "react";
import {useSelector, useDispatch} from 'react-redux'
import type { RootState } from "../../app/store";
import {addOne, subtractOne, addByAmount} from './counterSlice'

const Counter: React.FC = () => {
  const [amount, setAmount] = useState<number>(0)
  const count = useSelector((state:RootState)=> state.counter.count)
  const dispatch = useDispatch()
  return (
    <>
      <h2>Current Count is {count}</h2>

      <div style={{marginBottom:"30px", display:"flex", gap:"10px"}}>
     <input type="number" onChange={(e)=> setAmount(+e.target.value)}/>
      <span>amount is {amount}</span>
      </div>

<div style={{display:'flex', gap:"15px"}}>
       <button onClick={()=>{dispatch(addOne())}}> add one </button>
      <button onClick={()=>{dispatch(subtractOne())}}> substract one </button>
      <button onClick={()=>{dispatch(addByAmount(amount))}}> Add by {amount} </button>


</div>
 

 
    </>
  );
};

export default Counter;
