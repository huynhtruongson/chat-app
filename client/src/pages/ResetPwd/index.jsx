import { Box, Button, makeStyles, TextField, Typography } from '@material-ui/core'
import { ArrowRightAlt } from '@material-ui/icons'
import React from 'react'
import { useForm } from 'react-hook-form'
import { Link, useHistory, useParams } from 'react-router-dom'
import AuthForm from '../../components/AuthForm'
import Images from '../../constants/Images'
import * as yup from 'yup'
import {yupResolver} from '@hookform/resolvers/yup'
import AuthApi from '../../api/authApi'
import useAlert from '../../hooks/alert'
const schema = yup.object().shape({
    password : yup.string().min(6,'Password must at least 6 characters long!').required('Password is required!'),
    confirm_password : yup.string().oneOf([yup.ref('password'),null],'Incorrect confirm password!').required('Confirm password is required!'),
})
const ResetPwdPage = () => {
    const style = useStyle()
    const {register,handleSubmit,formState : {errors}} = useForm({
        resolver : yupResolver(schema)
    })
    const {token} = useParams()
    const history = useHistory()
    const {_alert} = useAlert()
    const onSubmit = async (data) => {
        try {
            const res = await AuthApi.resetPwd({...data,token})
            if(res === 200) {
                _alert({
                    icon : 'success',
                    msg : res.message,
                    confirmButtonText : 'Continue to Login',
                    callback : (result) => result.isConfirmed &&  history.push('/login')
                })
            }
        } catch (error) {
            const {data : {message},status} = error.response
            if(status === 400)
                _alert({
                    icon : 'error',
                    msg : message,
                })
        }
    }
    return (
        <AuthForm title='Reset Password' logo={Images.RESET_LOGO}>
            <Box className={style.container} width="76%" mt={2.5}>
                <Box mb={2}>
                    <Typography variant='body1'>
                        Forgot your password? Let's get a new one
                    </Typography>
                </Box>
                <form className={style.formContainer} onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        {...register('password')}
                        type='password'
                        variant="outlined"
                        label="New password"
                        fullWidth
                        InputProps={{classes : {input : style.input}}}
                        InputLabelProps={{classes : {outlined : style.label}}}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    <TextField
                        {...register('confirm_password')}
                        type='password'
                        variant="outlined"
                        label="Confirm password"
                        fullWidth
                        InputProps={{classes : {input : style.input}}}
                        InputLabelProps={{classes : {outlined : style.label}}}
                        error={!!errors.confirm_password}
                        helperText={errors.confirm_password?.message}
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
                        Reset
                    </Button>
                </form>
                <Box textAlign='center' color='#9e9e9e' mt={1.5}>Go back to login.
                    <Link to='/login' className={style.link}>Login</Link>
                </Box>
            </Box>
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
}))
export default ResetPwdPage
