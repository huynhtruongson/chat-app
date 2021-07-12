import { TextField, Box, Button, Backdrop, CircularProgress } from '@material-ui/core';
import {ArrowRightAlt,Facebook} from '@material-ui/icons';
import React from 'react';
import GoogleLogin from 'react-google-login';
import { Link, useHistory } from 'react-router-dom';
import AuthForm from '../../components/AuthForm';
import Images from '../../constants/Images';
import { useStyle } from './style';
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import AuthApi from '../../api/authApi';
import { useDispatch } from 'react-redux';
import { userLoginSuccess } from '../../actions/userAction';
const schema = yup.object().shape({
    email : yup.string().email('Invalid email!').required('Email is required!'),
    password : yup.string().required('Password is required!')
})
function LoginPage() {
    const style = useStyle();
    const dispatch  = useDispatch()
    const {register,handleSubmit, formState : {errors,isSubmitting}} = useForm({
        resolver : yupResolver(schema)
    })
    const history = useHistory()
    const onSubmit = async (data) => {
        try {
            const res = await AuthApi.login(data)
            if(res.status === 200) {
                localStorage.setItem('token',res.data)
                AuthApi.setHeaderAxios(res.data)
                dispatch(userLoginSuccess())
                history.push('/')
            }
        } catch (error) {
            console.log(error)
        }
    }
    const responseGoogleSuccess = async (response) => {
        try {
            const res = await AuthApi.googleLogin({tokenId :response.tokenId})
            if(res.status === 200) {
                localStorage.setItem('token',res.data)
                AuthApi.setHeaderAxios(res.data)
                dispatch(userLoginSuccess())
                history.push('/')
            }
        } catch (error) {}
    }
    const responseGoogleFail = (response) => {
        console.log(response)
    }
    return (
        <AuthForm title='Welcome Back' logo={Images.CHAT_LOGO2}>
            <Box className={style.container} width="76%" mt={2.5}>
                <GoogleLogin
                    clientId='713987113089-v6kssliis8c1m004jdlbfumnd4b51chd.apps.googleusercontent.com'
                    onSuccess={responseGoogleSuccess}
                    onFailure={responseGoogleFail}
                    cookiePolicy={'single_host_origin'}
                    render={(props) => 
                        <Button
                            {...props}
                            classes={{
                                root : style.button,
                                startIcon : style.startIcon,
                                endIcon : style.endIcon,
                            }}
                            variant="contained"
                            fullWidth
                            startIcon={<img className={style.googleIcon} src={Images.GOOGLE_ICON} alt=""></img>}
                            endIcon={<div></div>}
                        >
                            Login with Google
                        </Button>}
                />
                <div className={style.divider}><span>OR LOGIN WITH EMAIL</span></div>
                <form className={style.formContainer} onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        {...register('email')}
                        variant="outlined"
                        label="Email"
                        fullWidth
                        InputProps={{classes : {input : style.input}}}
                        InputLabelProps={{classes : {outlined : style.label}}}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    <TextField
                        {...register('password')}
                        variant="outlined"
                        label="Password"
                        type='password'
                        fullWidth
                        InputProps={{classes : {input : style.input}}}
                        InputLabelProps={{classes : {outlined : style.label}}}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    <Box textAlign='end'>
                        <Link to='/forgot-password' className={style.link}>Forgot password !</Link>
                    </Box>
                    <Button 
                        type='submit'
                        fullWidth
                        variant='contained'
                        color='primary'
                        endIcon={<ArrowRightAlt/>}
                        startIcon={<div></div>}
                        classes={{
                            root : style.loginBtn,
                            iconSizeMedium : style.icon,
                            startIcon : style.startIcon,
                            endIcon : style.endIcon,
                        }}
                    >
                        Login
                    </Button>
                </form>
                <Box textAlign='center' color='#9e9e9e' mt={1.5}>Don't have an account yet ?
                    <Link to='/register' className={style.link}>{''} Register</Link>
                </Box>
            </Box>
            <Backdrop open={isSubmitting} classes={{root : style.backdrop}}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </AuthForm>
    );
}

export default LoginPage;
