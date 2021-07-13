import { Box,makeStyles, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import {  useDispatch, useSelector } from 'react-redux'
import Images from '../../constants/Images'
import ConversationInfo from '../ConversationInfo'
import MessageBox from '../MessageBox'
import ReactBnbGallery from 'react-bnb-gallery'
import 'react-bnb-gallery/dist/style.css'
import { useEffect } from 'react'
import { getFileGallery, getImageGallery, getVideoGallery, removeActiveImage } from '../../actions/galleryAction'
import { useCallback } from 'react'
const Conversation = ({handleShowConversation}) => {
    const [showInfo,setShowInfo] = useState(false)
    const {activeConv} = useSelector(state => state.message)
    const {imageGallery,activeImage} = useSelector(state => state.gallery)
    const dispatch = useDispatch()
    const style = useStyle({showInfo})
    const handleShowGallery = (src) => {
        const imgIndex = imageGallery.findIndex(img => img === src)
        if(imageGallery.length === 0 || imgIndex === -1)
            return false
        return true
    }
    const handleShowIndex = (src) => {
        const imgIndex = imageGallery.findIndex(img => img === src)
        return imgIndex !== -1 ? imgIndex : 0
    }
    const handleClose = () => {
        dispatch(removeActiveImage())
    }
    const handleShowInfo = useCallback(() => {
        setShowInfo(prev => !prev)
    },[])
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
                    <Typography variant='h5'>Welcome to Lượm Message</Typography>
                </Box>
            </Box>
        )
    return (
        <Box className={style.container}>
            <Box className={style.messageBox}>
                <MessageBox handleShowInfo={handleShowInfo} handleShowConversation={handleShowConversation}/>
            </Box>
            <Box className={style.infoBox}>
                <ConversationInfo handleShowInfo={handleShowInfo}/>
            </Box>
            <ReactBnbGallery 
                show={handleShowGallery(activeImage)} 
                activePhotoIndex={handleShowIndex(activeImage)}
                photos={imageGallery}
                onClose={handleClose} 
                backgroundColor='rgb(0 0 0 / 90%)'/> 
        </Box>
    )
}
const useStyle = makeStyles(theme => ({
    container : {
        display : 'flex',
        height : '100%',
        overflow : 'hidden',
        position : 'relative',
        backgroundColor : '#fff'
    },
    messageBox : {
        flex : 1,
        height : '100%'
    },
    infoBox : {
        display : ({showInfo}) => showInfo ? 'block' : 'none',
        width : '352px',
        height : '100%',
        [theme.breakpoints.down('sm')] : {
            position : 'absolute',
            top : 0,
            right : 0,
            zIndex : 2,
            backgroundColor : '#fff',
            animation : '$slideIn 150ms linear'
        },
        [theme.breakpoints.down('420')] : {
            width : '100%'
        }
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
    '@keyframes slideIn' : {
        '0%' : {
            transform : 'translateX(100%)'
        },
        '100%' : {
            transform : 'initial'
        }
    }
}))

export default React.memo(Conversation)
