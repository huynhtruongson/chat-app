import React from 'react';
import { TextField, Box, Button } from '@material-ui/core';
import { ArrowRightAlt } from '@material-ui/icons';
import AuthForm from '../../components/AuthForm';
import { useStyle } from './style';
import { Link } from 'react-router-dom';
import {useForm} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup'
import Images from '../../constants/Images';
const schema = yup.object().shape({
    firstname : yup.string().max(10,'Firstname must at most 10 characters long!').required('Firstname is required!'),
    lastname : yup.string().max(10,'Lastname must at most 10 characters long!').required('Lastname is required!'),
    email : yup.string().email('Invalid email!').required('Email is required!'),
    password : yup.string().min(6,'Password must at least 6 characters long!').required('Password is required!'),
    confirm_password : yup.string().oneOf([yup.ref('password'),null],'Incorrect confirm password!').required('Confirm password is required!'),
})
const RegisterPage = () => {
    const style = useStyle();
    const {register,handleSubmit,formState : {errors}} = useForm({
        resolver : yupResolver(schema)
    })
    const onSubmit = (data) => {
        console.log(data);
    };
    return (
        <AuthForm title='Create Account' logo={Images.CHAT_LOGO}>
            <Box className={style.container} width="76%" mt={2.5}>
                <form className={style.formContainer} onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        {...register('firstname')}
                        variant="outlined"
                        label="Firstname"
                        fullWidth
                        InputProps={{ classes: { input: style.input } }}
                        InputLabelProps={{ classes: { outlined: style.label}}}
                        error={!!errors.firstname}
                        helperText={errors.firstname?.message}
                    />
                    <TextField
                        {...register('lastname')}
                        variant="outlined"
                        label="Lastname"
                        fullWidth
                        InputProps={{ classes: { input: style.input } }}
                        InputLabelProps={{ classes: { outlined: style.label }}}
                        error={!!errors.lastname}
                        helperText={errors.lastname?.message}
                    />
                    <TextField
                        {...register('email')}
                        variant="outlined"
                        label="Email"
                        fullWidth
                        InputProps={{ classes: { input: style.input } }}
                        InputLabelProps={{ classes: { outlined: style.label }}}
                        error={!!errors.email}
                        helperText={errors.email?.message}
                    />
                    <TextField
                        {...register('password')}
                        variant="outlined"
                        label="Password"
                        type="password"
                        fullWidth
                        InputProps={{ classes: { input: style.input } }}
                        InputLabelProps={{ classes: { outlined: style.label }}}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    <TextField
                        {...register('confirm_password')}
                        variant="outlined"
                        label="Confirm password"
                        type="password"
                        fullWidth
                        InputProps={{ classes: { input: style.input } }}
                        InputLabelProps={{ classes: { outlined: style.label }}}
                        error={!!errors.confirm_password}
                        helperText={errors.confirm_password?.message}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        endIcon={<ArrowRightAlt />}
                        startIcon={<div></div>}
                        classes={{
                            root: style.registerBtn,
                            iconSizeMedium: style.icon,
                            startIcon: style.startIcon,
                            endIcon: style.endIcon,
                        }}
                    >
                        Register
                    </Button>
                </form>
                <Box textAlign="center" color="#9e9e9e" mt={1.5}>
                    Already have an account ?
                    <Link to="/login" className={style.link}>
                        {''} Login
                    </Link>
                </Box>
            </Box>
        </AuthForm>
    );
};

export default RegisterPage;
