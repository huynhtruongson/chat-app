import { Box,makeStyles, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import {  useDispatch, useSelector } from 'react-redux'
import Images from '../../constants/Images'
import ConversationInfo from '../ConversationInfo'
import MessageBox from '../MessageBox'
import ReactBnbGallery from 'react-bnb-gallery'
import 'react-bnb-gallery/dist/style.css'
import { useEffect } from 'react'
import { getFileGallery, getImageGallery, getVideoGallery } from '../../actions/galleryAction'
const Conversation = () => {
    const style = useStyle()
    const {activeConv} = useSelector(state => state.message)
    const {imageGallery} = useSelector(state => state.gallery)
    const [showGallery,setShowGallery] = useState(false)
    const [galleryIndex,setGalleryIndex] = useState(0)
    const dispatch = useDispatch()
    const handleShowGallery = (src) => {
        if(imageGallery.length === 0)
            return
        const imgIndex = imageGallery.findIndex(img => img === src)
        setGalleryIndex(imgIndex)
        setShowGallery(true)
    }
    useEffect(()=>{
        const fetchUserMedia = async (id) => {
            if(!id) return
            dispatch(getImageGallery(id))
            dispatch(getVideoGallery(id))
            dispatch(getFileGallery(id))
        }
        fetchUserMedia(activeConv._id)
    },[activeConv._id,dispatch])   
    if(!activeConv._id)
        return (
            <Box position='relative' height='100%'>
                <Box className={style.bgcGreeting} textAlign='center'>
                    <img src={Images.CHAT_LOGO2} className={style.bgcImage} alt='img'/>
                    <Typography variant='h5'>Welcome to Chat App</Typography>
                </Box>
            </Box>
        )
    return (
        <Box className={style.container}>
            <Box className={style.messageBox}>
                <MessageBox handleShowGallery={handleShowGallery}/>
            </Box>
            <Box className={style.infoBox} display='none'>
                <ConversationInfo handleShowGallery={handleShowGallery}/>
            </Box>
            <ReactBnbGallery 
                show={showGallery} 
                photos={imageGallery}
                activePhotoIndex={galleryIndex}
                onClose={()=>setShowGallery(false)} backgroundColor='rgb(0 0 0 / 90%)'/> 
        </Box>
    )
}
const useStyle = makeStyles(theme => ({
    container : {
        display : 'flex',
        height : '100%'
    },
    messageBox : {
        flex : 1,
        height : '100%'
    },
    infoBox : {
        width : '350px',
    },
    bgcGreeting : {
        position : 'absolute',
        top : '50%',
        left : '50%',
        transform : 'translate(-50%,-50%)'
    },
    bgcImage : {
        width : '450px',
    },
}))

export default Conversation
