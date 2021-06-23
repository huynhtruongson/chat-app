import { Box, makeStyles, Typography } from '@material-ui/core'
import { CancelOutlined, Description } from '@material-ui/icons'
import React from 'react'
import { useWatch } from 'react-hook-form'

const IsolateMedia = ({control,handleRemoveMedia}) => {
    const data = useWatch({
        control,
        name : 'media'
    })
    const style = useStyle()
    return (
        data?.length ? data.map((media, index) => (
            <Box key={media.name+index} className={style.mediaBox}>
                {media.type.match(/video/i) ? (
                    <video
                        src={URL.createObjectURL(media)}
                        controls
                        className={style.mediaMessage}
                    />
                ) : media.type.match(/image/i) ? (
                    <img
                        src={URL.createObjectURL(media)}
                        alt="img"
                        className={style.mediaMessage}  
                    />
                ) : <Box display='flex' height='100%' alignItems='center' width='120px'>
                        <Description/>
                        <Typography className={style.mediaFileName} variant='body2'>{media.name}</Typography>
                    </Box>
                }
                <span className={style.mediaMessageIcon} onClick={()=>handleRemoveMedia(index)}>
                    <CancelOutlined/>
                </span>
            </Box>
        )) : <></>
    )
}
const useStyle = makeStyles(theme => ({
    mediaMessage : {
        height : '100%',
        width : '100%',
        objectFit:'cover',
        borderRadius:'inherit'
    },
    mediaMessageIcon : {
        position : 'absolute',
        top : '-6px',
        right : '-6px',
        color : theme.palette.secondary.main,
        cursor: 'pointer'
    },
    mediaBox : {
        height:'60px',
        flexBasis : '60px',
        position:'relative',
        marginRight : theme.spacing(1),
        borderRadius:'8px',
        boxShadow : theme.shadows[1],
        flex : 'none'
    },
    mediaFileName : {
        display:'-webkit-box',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        wordBreak: 'break-word',
    }
}))
export default IsolateMedia
