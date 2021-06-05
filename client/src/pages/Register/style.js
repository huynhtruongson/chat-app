import { makeStyles } from '@material-ui/core';
export const useStyle = makeStyles((theme) => ({
    startIcon : {
        marginRight:'auto'
    },
    endIcon : {
        marginLeft : 'auto'
    },
    icon : {
        '&>*:first-child' : {
            fontSize : '30px',
            color : 'currentColor'
        }
    },
    input: {
        padding : '14px'
    },
    label: {
        transform: 'translate(14px, 16px) scale(1)',
    },
    formContainer : {
        '& .MuiTextField-root' : {
            marginBottom : theme.spacing(1.5)
        }
    },
    link : {
        color : theme.palette.primary.main,
        textDecoration : 'none',
        '&:hover' : {
            textDecoration : 'underline'
        }
    },
    registerBtn : {
        height : '44px',
        marginTop : theme.spacing(1.5),
        fontSize : '16px'
    },
    container : {
        [theme.breakpoints.down('xs')] : {
            width : '100%',
        }
    },
    backdrop : {
        zIndex : theme.zIndex.drawer  + 1,
        color : '#fff',
        backgroundColor : 'rgba(0, 0, 0, 0.2)'
    }
}));