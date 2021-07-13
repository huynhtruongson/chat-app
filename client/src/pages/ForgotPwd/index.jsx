import { Backdrop, Box, Button, CircularProgress, makeStyles, TextField, Typography } from '@material-ui/core'
import { ArrowRightAlt } from '@material-ui/icons'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router-dom'
import AuthForm from '../../components/AuthForm'
import Images from '../../constants/Images'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import AuthApi from '../../api/authApi'
import _alert from '../../utils/alert'
const schema = yup.object().shape({
    email : yup.string().email('Invalid email!').required('Email is required!'),
})
const ForgotPwdPage = () => {
    const style = useStyle()
    const {register,handleSubmit,formState : {errors,isSubmitting}} = useForm({
        resolver : yupResolver(schema)
    })
    const onSubmit = async (data) => {
        try {
            const {email} = data
            const res = await AuthApi.forgotPwd({email})
            if(res.status === 200) {
                _alert({
                    icon : 'success',
                    msg : res.message
                })
            }
        } catch (error) {}
    }
    return (
        <AuthForm title='Forgot Password' logo={Images.FORGOT_LOGO}>
            <Box className={style.container} width="76%" mt={2.5}>
                <Box mb={2}>
                    <Typography variant='body1'>
                        Please enter your registered email address we will get back to you with the reset password link.Thanks
                    </Typography>
                </Box>
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
                        Send
                    </Button>
                </form>
                <Box textAlign='center' color='#9e9e9e' mt={1.5}>Go back to login.
                    <Link to='/login' className={style.link}>Login</Link>
                </Box>
            </Box>
            <Backdrop open={isSubmitting} classes={{root : style.backdrop}}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </AuthForm>
    )
}
const useStyle =  makeStyles(theme => ({
    container : {
        [theme.breakpoints.down('xs')] : {
            width : '100%',
        }
    },
    formContainer : {
        '& .MuiTextField-root' : {
            marginBottom : theme.spacing(1.5)
        }
    },
    input: {
        padding : '14px'
    },
    label: {
        transform: 'translate(14px, 16px) scale(1)',
    },
    loginBtn : {
        height : '44px',
        marginTop : theme.spacing(1.5),
        fontSize : '16px'
    },
    link : {
        color : theme.palette.primary.main,
        textDecoration : 'none',
        '&:hover' : {
            textDecoration : 'underline'
        }
    },
    startIcon : {
        marginRight:'auto'
    },
    endIcon : {
        marginLeft : 'auto'
    },
    backdrop : {
        zIndex : theme.zIndex.drawer  + 1,
        color : '#fff',
        backgroundColor : 'rgba(0, 0, 0, 0.2)'
    }
}))
export default ForgotPwdPage
