
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { getPostById } from './postSlice'
import { selectAllUsers } from '../users/userSlice'
import { RootState } from "../../app/store";

//1815 4th
const EditPostForm = () => {
    const {postId} = useParams()
    const navigate = useNavigate()
    const singlePost = useSelector((state: RootState) =>
    getPostById(state, Number(postId)))
    
    const [title,setTitle] = useState(singlePost?.title)


  return (
    <div>Edit Post#{postId} - {title}</div>
  )
}

export default EditPostForm