import {Avatar, Box, makeStyles, Typography,Accordion,AccordionDetails,AccordionSummary, IconButton, Paper} from '@material-ui/core';
import { ExpandMore,ArrowBack } from '@material-ui/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getActiveImage } from '../../actions/galleryAction';

const ConversationInfo = ({handleShowInfo}) => {
    const style = useStyle();
    const {activeConv} = useSelector(state => state.message)
    const {imageGallery,videoGallery,fileGallery} = useSelector(state => state.gallery)
    const dispatch = useDispatch()
    return (
        <Box display='flex' flexDirection='column' borderLeft='1px solid #cacaca' height='100%'>
            <Box className={style.header}>
                <IconButton onClick={()=>handleShowInfo(false)} className={style.backBtn}>
                    <ArrowBack color='primary'/>
                </IconButton>
                <Box>
                    <Typography classes={{root: style.title}} variant='subtitle2' color='initial'>
                        Conversation Info
                    </Typography>
                </Box>
            </Box>
            <Box className={style.mainContainer}>
                <Box display='flex' flexDirection='column' justifyContent='center' alignItems='center' mt={2}>
                    <Avatar classes={{root : style.avatar}} src={activeConv.avatar} />
                    <Box mt={1}>
                        <Typography classes={{root: style.title}} variant='subtitle2'>{activeConv.fullname}</Typography>
                    </Box>
                </Box>
                <Box mt={2} overflow='hidden'>
                    <Accordion classes={{root : style.accordion}} square>
                        <AccordionSummary expandIcon={<ExpandMore/>} classes={{root : style.accordionSummary,content : style.accordionSummaryContent}}>
                            <Typography variant='subtitle2'>Photo</Typography>
                        </AccordionSummary>
                        <AccordionDetails classes={{root : style.accordionDetail}}>
                            { imageGallery.length ? 
                                <Box className={style.imageGalleryContainer}>
                                    {imageGallery.map(img => 
                                        <Box className={style.imageGalleryItem}>
                                            <Box className={style.imageGalleryRatio}>
                                                <img key={img} onClick={()=>dispatch(getActiveImage(img))} className={style.imageItem} src={img} alt ='img'/>
                                            </Box>
                                        </Box>
                                    )}
                                </Box> : 
                                <Box width='100%' textAlign='center'>
                                    <Typography variant="body2">No Image</Typography>
                                </Box>
                            }
                        </AccordionDetails>
                    </Accordion>
                    <Accordion classes={{root : style.accordion}} square>  
                        <AccordionSummary expandIcon={<ExpandMore/>} classes={{root : style.accordionSummary,content : style.accordionSummaryContent}}>
                            <Typography variant='subtitle2'>Video</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            {videoGallery.length ? 
                                <Box display='flex' flexWrap='wrap' mr='-3px' width='100%'>
                                    {videoGallery.map(vd => <video key={vd} className={style.videoGalleryItem} src={vd} controls/>)}
                                </Box> : 
                                <Box width='100%' textAlign='center'>
                                    <Typography variant="body2">No Video</Typography>
                                </Box>
                            }
                        </AccordionDetails>
                    </Accordion>
                    <Accordion classes={{root : style.accordion}} square>  
                        <AccordionSummary expandIcon={<ExpandMore/>} classes={{root : style.accordionSummary,content : style.accordionSummaryContent}}>
                            <Typography variant='subtitle2'>File</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                        {fileGallery.length ? 
                                <Box width='100%'>
                                    {fileGallery.map(vd => 
                                        <a key={vd.url_cloud} href={vd.url_cloud} className={style.fileGalleryItem} target='_blank' rel='noreferrer'>
                                            <Typography>{vd.name}</Typography>
                                        </a>
                                    )}
                                </Box> : 
                                <Box width='100%' textAlign='center'>
                                    <Typography variant="body2">No File</Typography>
                                </Box>
                            }
                        </AccordionDetails>
                    </Accordion>
                </Box>
            </Box>
        </Box>
    );
};
const useStyle = makeStyles((theme) => ({
    header : {
        height : '65px',
        display : 'flex',
        justifyContent : 'center',
        alignItems : 'center',
        borderBottom : '1px solid #cacaca',
        position : 'relative'
    },
    title: {
        fontSize: '1.1rem',
    },
    mainContainer : {
        flex: 1,
        overflowY : 'auto'
    },
    avatar : {
        width : '52px',
        height : '52px'
    },
    accordion : {
        boxShadow : 'none',
        borderTop: '5px solid rgba(0, 0, 0, .1)',
        '&:last-child' : {
            borderBottom: '5px solid rgba(0, 0, 0, .1)',
        },
        '&:before': {
            display: 'none',
        },
        '&.Mui-expanded': {
            margin: 'auto',
        },
    },
    accordionSummary : {
        '& .MuiTypography-subtitle2' : {
            fontSize: theme.typography.pxToRem(15)
        },
        '&.Mui-expanded' : {
            minHeight : '48px'
        }
    },
    accordionSummaryContent : {
        '&.Mui-expanded': {
            margin: '12px 0',
          },
    },
    accordionDetail : {
        padding : theme.spacing(1)
    },
    imageGalleryContainer : {
        width : '100%',
        display :'grid',
        gridTemplateColumns : 'repeat(3,1fr)',
        gridGap : '3px'
    },
    imageGalleryItem : {
        width : '100%',
        paddingTop : '100%',
        position : 'relative'
    },
    imageGalleryRatio : {   
        position : 'absolute',
        top : 0,
        left : 0,
        width : '100%',
        height : '100%',
        borderRadius : '4px',
        overflow : 'hidden'
    },
    imageItem : {
        width : '100%',
        height : '100%',
        objectFit : 'cover',
        cursor : 'pointer',
        '&:hover' : {
            filter : 'contrast(50%)'
        }
    },
    videoGalleryItem : {
        width : 'calc((100%/2) - 3px)',
        height : '100px',
        marginRight : '3px',
        marginBottom : '3px',
        borderRadius : '6px',
        objectFit : 'cover'
    },
    fileGalleryItem :  {
        display : 'block',
        textDecoration : 'none',
        padding : '8px 4px',  
        borderRadius  : '8px',
        color : theme.palette.grey[900],
        marginBottom : '3px',
        '&:hover' : {
            backgroundColor : theme.palette.grey[300]
        },
        '& .MuiTypography-root' : {
            display:'-webkit-box',
            '-webkit-line-clamp': 2,
            '-webkit-box-orient': 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            wordBreak: 'break-word',
        },
    },
    backBtn : {
        display : 'none',
        position : 'absolute',
        top : '50%',
        left : 0,
        transform : 'translateY(-50%)',
        [theme.breakpoints.down('sm')] : {
            display : 'block'
        }
    }
}));
export default ConversationInfo;
