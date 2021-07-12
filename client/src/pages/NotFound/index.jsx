import React, { useEffect } from 'react'
import {Box, makeStyles} from '@material-ui/core';
import Images from '../../constants/Images';
import { useHistory} from 'react-router';
import _alert from '../../utils/alert'
const VerifyEmailPage = () => {
    const style = useStyle()
    const history = useHistory()
    useEffect(() => {
        _alert({
            title : 'Page Not Found!',
            icon : 'warning',
            confirmButtonText : 'Continue to Chat-app',
            callback : ({isConfirmed}) => isConfirmed && history.push('/')
        })    
    },[history])
    return (
        <Box className={style.container}></Box>
    )
}
const useStyle = makeStyles(theme => ({
    container : {
        width: '100vw',
        height: '100vh',
        backgroundImage : `url(${Images.AUTH_BG})`,
        backgroundRepeat : 'no-repeat',
        backgroundSize : 'cover',
        display : 'flex',
        alignItems : 'center',
        justifyContent : 'center'
    },
}))
export default VerifyEmailPage
