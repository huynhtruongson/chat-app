import { makeStyles } from '@material-ui/core';
export const useStyle = makeStyles((theme) => ({
    button: {
        height: '44px',
        backgroundColor: '#fff',
        justifyContent :'center',
        '&+&' : {
            marginTop : theme.spacing(1),
            backgroundColor : '#1877f2',
            '&:hover' : {
                backgroundColor:'#4267B2'
            }
        }
    },
    startIcon : {
        marginRight:'auto'
    },
    endIcon : {
        marginLeft : 'auto'
    },
    googleIcon : {
        width : '30px'
    },
    icon : {
        '&>*:first-child' : {
            fontSize : '30px',
            color : 'currentColor'
        }
    },
    facebookBtnLabel : {color : '#fff'},
    input: {
        padding : '14px'
    },
    label: {
        transform: 'translate(14px, 16px) scale(1)',
    },
    divider : {
        fontSize : '14px',
        fontWeight : 500,
        textAlign: 'center',
        padding : `${theme.spacing(2)}px 0px`,
        position : 'relative',
        '&::before' : {
            content : "''",
            position : 'absolute',
            top : '50%',
            left  : 0,
            transform : 'translateY(-50%)',
            width : '100%',
            height : '1.5px',
            backgroundColor : '#bdbdbd'
        },
        '&>span' : {
            display :'inline-block',
            color : '#bdbdbd',
            padding : '0px 10px',
            backgroundColor : '#fff',
            zIndex : 2,
            position: 'relative'
        }
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
    loginBtn : {
        height : '44px',
        marginTop : theme.spacing(1.5),
        fontSize : '16px'
    },
    container : {
        [theme.breakpoints.down('xs')] : {
            width : '100%',
        }
    }
}));