import { Box,makeStyles, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import {  useSelector } from 'react-redux'
import Images from '../../constants/Images'
import ConversationInfo from '../ConversationInfo'
import MessageBox from '../MessageBox'
import ReactBnbGallery from 'react-bnb-gallery'
import 'react-bnb-gallery/dist/style.css'
import { useEffect } from 'react'
import MessageApi from '../../api/messageApi'
const Conversation = () => {
    const style = useStyle()
    const {activeConv} = useSelector(state => state.message)
    const [imageGallery,setImageGallery] = useState([])
    const [showGallery,setShowGallery] = useState(false)
    const [galleryIndex,setGalleryIndex] = useState(0)
    const handleShowGallery = (src) => {
        if(imageGallery.length === 0)
            return
        const imgIndex = imageGallery.findIndex(img => img === src)
        setGalleryIndex(imgIndex)
        setShowGallery(true)
    }
    useEffect(()=>{
        const fetchUserMedia = async (id) => {
            try {
                if(!id) return
                const res = await MessageApi.getImageGalerry(id)
                if(res.status === 200) {
                    const imageList = res.message.map(img => img.url_cloud) 
                    setImageGallery(imageList)
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchUserMedia(activeConv._id)
    },[activeConv._id])   
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
            <Box className={style.infoBox}>
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
