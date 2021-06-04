import { Box, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import Images from '../../constants/Images';
import React from 'react';

function AuthForm({ title ,logo, children}) {
    const style = useStyle();
    return (
        <div className={style.root}>
            <Paper className={style.container}>
                <Grid container className={style.gridContainer} justify='center'>
                    <Grid item md={6} xs={12}>
                        <Box display='flex' flexDirection='column' alignItems='center' textAlign='center' p={2}>
                            <img
                                className={style.logo}
                                src={Images.TDT_LOGO}
                                alt=""
                            />
                            <Typography
                                className={style.title}
                                variant="h4"
                                color='primary'
                            >
                                {{title}}
                            </Typography>
                            {children}
                        </Box>
                    </Grid>
                    <Grid item md={6} xs={false}>
                        <Box className={style.wallpaper} display='flex' alignItems='center' height='100%'>
                            <img className={style.chatLogo} src={logo} alt="" />
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </div>
    );
}
const useStyle = makeStyles((theme) => ({
    root: {
        width: '100vw',
        height: '100vh',
        position: 'relative',
        backgroundImage : `url(${Images.AUTH_BG})`,
        backgroundRepeat : 'no-repeat',
        backgroundSize : 'cover'
    },
    wallpaper : {
        [theme.breakpoints.down('sm')] : {
            display : 'none',
        }
    },
    container: {
        width: '68%',
        // minHeight: 40,
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        borderRadius: '8px',
        [theme.breakpoints.down('md')] : {
            width : '80%'
        },
        [theme.breakpoints.down('xs')] : {
            width : '100%'
        }
    },
    gridContainer : {
        height : '100%'
    },
    logo: {
        width: 60,
    },
    title: {
        fontWeight: 500,
        marginTop: theme.spacing(2),
    },
    chatLogo : {
        width : '100%'
    },

}));
export default AuthForm;
