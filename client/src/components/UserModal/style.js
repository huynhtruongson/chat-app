import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
    backgroundImg: {
        height: '100%',
        width: '100%',
        objectFit: 'cover',
    },
    avatar: {
        width: '100px',
        height: '100px',
        border: '3px solid #fff',
        cursor: 'pointer',
    },
    badgeAnchor: {
        bottom: '16px',
        right: '16px',
    },
    avatarContainer: {
        transform: 'translate(-50%,50%)',
    },
    uploadBtn: {
        backgroundColor: 'rgb(255 255 255 / 80%)',
        padding: '6px',
        '&:hover': {
            backgroundColor: theme.palette.grey[700],
            color: '#fff',
        },
    },
    textInfo: {
        flex: 1,
        marginLeft: theme.spacing(1),
        fontWeight: 500,
    },
    editBtn: {
        padding: theme.spacing(1),
        marginLeft: 'auto',
    },
    editBtnActive : {
        color : theme.palette.primary.main
    },
    svgIcon: {
        fontSize: '18px',
    },
    backdrop : {
        zIndex : theme.zIndex.drawer  + 1,
        color : '#fff',
        backgroundColor : 'rgba(0, 0, 0, 0.2)'
    },
    dialogContent: {
        padding: theme.spacing(1.5),
    },
    dialogBtn : {
        fontSize:'.9rem',
        textTransform : 'initial'
    }
}));

export default useStyle