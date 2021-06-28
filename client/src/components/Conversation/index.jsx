import { Box,makeStyles, Typography } from '@material-ui/core'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import Images from '../../constants/Images'
import ConversationInfo from '../ConversationInfo'
import MessageBox from '../MessageBox'
import ReactBnbGallery from 'react-bnb-gallery'
import 'react-bnb-gallery/dist/style.css'
const Conversation = () => {
    const style = useStyle()
    const {activeConv} = useSelector(state => state.message)
    const [imageGallery,setImageGallery] = useState([])
    const [showGallery,setShowGallery] = useState(false)
    const handleShowGallery = (index) => {
        if(imageGallery.length === 0)
            setImageGallery([
                'https://res.cloudinary.com/luommess/image/upload/v1624785663/message/q6oinxg9hvhmbaxb3o0q.png',
                'https://res.cloudinary.com/luommess/image/upload/v1624785662/message/tcvkqbpn2rvvjakbfhsh.jpg',
                'https://res.cloudinary.com/luommess/image/upload/v1624785663/message/m0yxzke7ohukfps7jvci.png',
                'https://res.cloudinary.com/luommess/image/upload/v1624785664/message/txc2wtq9gldukex9gcwb.png'
            ])
        setShowGallery(true)
    }   
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
            <ReactBnbGallery show={showGallery} photos={imageGallery} onClose={()=>setShowGallery(false)} backgroundColor='rgb(0 0 0 / 90%)'/> 
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
