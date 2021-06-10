import { makeStyles } from "@material-ui/core";

const useStyle = makeStyles((theme) => ({
    dialog: {
        width: '480px',
    },
    closeBtn: {
        position: 'absolute',
        top: theme.spacing(1),
        right: theme.spacing(1),
    },
    backgroundImg: {
        height: '100%',
        width: '100%',
        objectFit: 'cover',
    },
    avatar: {
        width: '120px',
        height: '120px',
        border: '5px solid #fff',
        cursor: 'pointer',
    },
    badgeAnchor: {
        bottom: '22px',
        right: '22px',
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
    }
}));

export default useStyle