import React, { useEffect } from 'react'
import {Box, makeStyles} from '@material-ui/core';
import Images from '../../constants/Images';
import { useHistory, useParams } from 'react-router';
import AuthApi from '../../api/authApi';
import useAlert from '../../hooks/alert'
const VerifyEmailPage = () => {
    const style = useStyle()
    const {token} = useParams()
    const {_alert} = useAlert()
    const history = useHistory()
    useEffect(() => {
        const verifyEmail= async () => {
            try {
                const res = await AuthApi.verifyEmail({token})
                if(res.status === 200) {
                    _alert({
                        icon : 'success',
                        msg : res.message,
                        confirmButtonText : 'Continue to Chat-app',
                        callback : (result) => result.isConfirmed &&  history.push('/')
                    })
                }
            } catch (error) {
                const {data : {message},status} = error.response
                if(status === 400)
                    _alert({
                        icon : 'error',
                        msg : message,
                        confirmButtonText : 'Continue to Chat-app',
                        callback : (result) => result.isConfirmed &&  history.push('/login')
                    })
                }
        }
        verifyEmail()
    },[_alert,token,history])
    return (
        <Box className={style.container}>
            {/* <Box display='flex' flexDirection='column' alignItems='center'>
                <Typography variant='h4'>Thank you for registration</Typography>
                <Button href='/' variant='contained' color='primary'>Continue to Zolo</Button>
            </Box> */}
        </Box>
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
    image : {
        width : '100%',
        height : '100%',
        objectFit : 'cover'
    }
}))
export default VerifyEmailPage
