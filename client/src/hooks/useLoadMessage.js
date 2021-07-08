import { useEffect,useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMoreMessage } from '../actions/messageAction'
import MessageApi from '../api/messageApi'

const useLoadMessage = (page) => {
    const {activeConv,messages} = useSelector(state => state.message)
    const dispatch = useDispatch()
    const [loading,setLoading] = useState(false)
    const [hasMore,setHasMore] = useState(true)
    // const [skip,setSkip] = useState(0)
    useEffect(()=>{
        // setSkip(messages.length)
        setHasMore(true)
    },[activeConv._id])
    useEffect(()=>{
        const fetchMoreMessage = async ()=>{
            try {
                if(page <=1) return
                setLoading(true)
                console.log(messages.length)
                const res = await MessageApi.getMessages(activeConv._id,{pageSkip : messages.length})
                if(res.status === 200) {
                    setLoading(false)
                    // setSkip(prevSkip => prevSkip+res.data.length)
                    dispatch(getMoreMessage(res.data))
                    if(res.data.length === 0 || res.data.length < 20) {
                        setHasMore(false)
                        return
                    }
                }
            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }
        fetchMoreMessage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[page,dispatch])
    return {loading,hasMore}
}

export default useLoadMessage
