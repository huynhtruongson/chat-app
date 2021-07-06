import {Avatar, Box, makeStyles, Typography,Accordion,AccordionDetails,AccordionSummary} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import { useSelector } from 'react-redux';

const ConversationInfo = ({handleShowGallery}) => {
    const style = useStyle();
    const {activeConv} = useSelector(state => state.message)
    const {imageGallery} = useSelector(state => state.gallery)
    return (
        <Box display='flex' flexDirection='column' borderLeft='1px solid #cacaca' height='100%'>
            <Box className={style.header}>
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
                        <AccordionDetails>
                            <Box display='flex' flexWrap='wrap' mr={'-3px'}>
                                {imageGallery.map(img => <img key={img} onClick={()=>handleShowGallery(img)} className={style.imageGalleryItem} src={img} alt ='img'/>)}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion classes={{root : style.accordion}} square>  
                        <AccordionSummary expandIcon={<ExpandMore/>} classes={{root : style.accordionSummary,content : style.accordionSummaryContent}}>
                            <Typography variant='subtitle2'>Video</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                                maximus est, id dignissim quam.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion classes={{root : style.accordion}} square>  
                        <AccordionSummary expandIcon={<ExpandMore/>} classes={{root : style.accordionSummary,content : style.accordionSummaryContent}}>
                            <Typography variant='subtitle2'>File</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat. Aliquam eget
                                maximus est, id dignissim quam.
                            </Typography>
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
        borderBottom : '1px solid #cacaca'
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
    imageGalleryItem : {
        width : 'calc(106px - 3px)',
        height : 'calc(106px - 3px)',
        marginRight : '3px',
        objectFit : 'cover',
        overflow : 'hidden',
        borderRadius : '4px',
        border : '1px solid #cacaca',
        cursor : 'pointer',
        '&:hover' : {
            filter : 'contrast(50%)'
        }
    }
}));
export default ConversationInfo;
