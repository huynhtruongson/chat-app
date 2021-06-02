import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, makeStyles, TextField, Typography, Zoom } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
const Transition = React.forwardRef((props, ref) => {
    return <Zoom ref={ref} {...props} />;
});
const schema = yup.object().shape({
    password : yup.string().required('Password is required'),
    new_password : yup.string().min(6,'Password must at least 6 characters long!').required('Password is required!'),
    confirm_password : yup.string().oneOf([yup.ref('new_password'),null],'Incorrect confirm password!').required('Confirm password is required!'),
})
const PasswordModal = ({open,onClose}) => {
    const style = useStyle()
    const {register,handleSubmit,formState:{errors},reset} = useForm({
        resolver : yupResolver(schema)
    })
    const onSubmit = (data) => {
        console.log(data)
    }
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            classes={{ paper: style.dialog }}
            onExit={()=> reset()}
            disableBackdropClick
        >
            <DialogTitle disableTypography>
                <Typography variant="h6">Change password</Typography>
                <IconButton
                    onClick={onClose}
                    classes={{ root: style.closeBtn }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent dividers classes={{root : style.formContainer}}>
                    <TextField
                        variant='outlined'
                        label='Password'
                        fullWidth
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
                    <Button onClick={onClose} color="secondary">
                        Cancel
                    </Button>
                    <Button color="primary" type='submit'>Update</Button>
                </DialogActions>
            </form>
        </Dialog>
    )
}
const useStyle = makeStyles(theme => ({
    dialog: {
        width: '480px',
    },
    closeBtn: {
        position: 'absolute',
        top: theme.spacing(1),
        right: theme.spacing(1),
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
    }
}))
export default PasswordModal
