import { useEffect,useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMessages } from '../actions/messageAction'
import MessageApi from '../api/messageApi'

const useLoadMessage = (page) => {
    const {activeConv} = useSelector(state => state.message)
    const dispatch = useDispatch()
    const [loading,setLoading] = useState(false)
    const [hasMore,setHasMore] = useState(false)
    const [skip,setSkip] = useState(0)
    useEffect(()=>{
        setHasMore(true)
    },[activeConv._id])
    useEffect(()=>{
        const fetchMoreMessage = async ()=>{
            try {
                // if(page <=1) return
                setLoading(true)
                const res = await MessageApi.getMessages(activeConv._id,{pageSkip : skip})
                if(res.status === 200) {
                    setHasMore(res.data.length > 0)
                    setSkip(prevSkip => prevSkip+res.data.length)
                    dispatch(getMessages(res.data))
                    setLoading(false)
                }
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }
        fetchMoreMessage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[page,dispatch,activeConv._id])
    return {loading,hasMore}
}

export default useLoadMessage
