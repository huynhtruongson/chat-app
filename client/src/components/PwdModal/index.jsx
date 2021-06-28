import React from 'react'
import { Button, DialogActions, DialogContent, makeStyles, TextField } from '@material-ui/core';
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import ModalBase from '../ModalBase';
const schema = yup.object().shape({
    password : yup.string().required('Password is required'),
    new_password : yup.string().min(6,'Password must at least 6 characters long!').required('Password is required!'),
    confirm_password : yup.string().oneOf([yup.ref('new_password'),null],'Incorrect confirm password!').required('Confirm password is required!'),
})
const PasswordModal = ({open,onClose}) => {
    console.log('pwdmodal rerender')
    const style = useStyle()
    const {register,handleSubmit,formState:{errors},reset} = useForm({
        resolver : yupResolver(schema)
    })
    const onSubmit = (data) => {
        console.log(data)
    }
    return (
        <ModalBase
            open={open}
            onExit={()=> reset()}
            disableBackdropClick
            title='Change Password'
            onClose={onClose}
        >
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers classes={{root : style.dialogContent}}>
                    <TextField
                        variant='outlined'
                        label='Password'
                        fullWidth
                        type='password'
                        InputProps={{classes : {input : style.input}}}
                        InputLabelProps={{classes : {outlined : style.label}}}
                        {...register('password')}
                        error={!!errors.password}
                        helperText={errors.password?.message}
                    />
                    <TextField
                        variant='outlined'
                        label='New password'
                        fullWidth
                        type='password'
                        InputProps={{classes : {input : style.input}}}
                        InputLabelProps={{classes : {outlined : style.label}}}
                        {...register('new_password')}
                        error={!!errors.new_password}
                        helperText={errors.new_password?.message}
                    />
                    <TextField
                        variant='outlined'
                        label='Confirm password'
                        fullWidth
                        type='password'
                        InputProps={{classes : {input : style.input}}}
                        InputLabelProps={{classes : {outlined : style.label}}}
                        {...register('confirm_password')}
                        error={!!errors.confirm_password}
                        helperText={errors.confirm_password?.message}
                    />
                </DialogContent>
                <DialogActions>
                    <Button classes={{root : style.dialogBtn}} onClick={onClose} color="default">
                        Cancel
                    </Button>
                    <Button classes={{root : style.dialogBtn}} color="primary" type='submit' variant='contained'>
                        Update
                    </Button>
                </DialogActions>
            </form>
        </ModalBase>
    )
}
const useStyle = makeStyles(theme => ({
    input: {
        padding : '14px'
    },
    label: {
        transform: 'translate(14px, 16px) scale(1)',
    },
    dialogContent: {
        padding: theme.spacing(1.5),
        '& .MuiTextField-root' : {
            marginBottom : theme.spacing(1.5)
        }
    },
    dialogBtn : {
        fontSize:'.9rem',
        textTransform : 'initial'
    }
}))
export default PasswordModal
