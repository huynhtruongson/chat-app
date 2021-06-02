import React, { useEffect, useState } from 'react';
import { Avatar,Badge,Box,Button,Dialog,DialogActions,DialogContent,DialogTitle,IconButton,makeStyles,TextField,Typography,Zoom,} from '@material-ui/core';
import { Close, PhotoCamera, BorderColor } from '@material-ui/icons';
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {useData} from '../../context/DataContext'
import useStyle from './style'
const Transition = React.forwardRef((props, ref) => {
    return <Zoom ref={ref} {...props} />;
});
const SUPPORTED_FORMATS = ["image/jpg","image/jpeg","image/gif","image/png"];
const schema = yup.object().shape({
    firstname : yup.string().max(10,'Firstname must at most 10 characters long!'),
    lastname : yup.string().max(10,'Lastname must at most 10 characters long!'),
    // avatar : yup.mixed().test('type','Unsupported File Format',value => {
    //     return value && SUPPORTED_FORMATS.includes(value[0].type)
    // })
})
const UserModal = ({ open, onClose }) => {
    const [edit, setEdit] = useState({firstname: false,lastname: false,avatar : false});
    const data = useData()
    const [user] = data.user
    const style = useStyle(edit);
    // const avatarRef = useRef()
    const {register,handleSubmit,formState : {errors,isDirty},reset,getValues,setValue} = useForm({
        mode : 'onChange',
        resolver : yupResolver(schema),
        shouldUnregister : true
    })
    useEffect(()=>{
        reset({
            ...user.infor
        })
    },[user.infor,reset])
    const {ref : fnameRef, ...fnameRest} = register('firstname')
    const {ref: lnameRef, ...lnameRest} = register('lastname')
    const handleEditClick = (field) => {
        setEdit({ ...edit, [field]: !edit[field] });
    };
    const handleModalClose = () => {
        setEdit({fname: false,lname: false,pwd: false})
        reset()
    }
    const handleAvatarChange = (e) => {
        const file  = e.target.files[0]
        if(!SUPPORTED_FORMATS.includes(file.type)) {
            setValue('avatar',getValues('avatar'))
            alert('Unsupported File Format')
        }
        else {
            handleEditClick('avatar')
        }
    }
    const isSubmitable = () => {
        return Object.keys(edit).some(key => edit[key]) && isDirty
    }
    const onSubmit = (data) => {
        console.log(data)
    }
    return (
        <Dialog
            open={open}
            TransitionComponent={Transition}
            classes={{ paper: style.dialog }}
            onExited={handleModalClose}
            disableBackdropClick
        >
            <DialogTitle disableTypography>
                <Typography variant="h6">User Information</Typography>
                <IconButton
                    onClick={onClose}
                    classes={{ root: style.closeBtn }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input accept="image/*" 
                    id="icon-button-file" 
                    type="file"
                    hidden 
                    {...register('avatar')}
                    onChange={handleAvatarChange}
                />
                <DialogContent dividers>
                    <Box height="180px" mx={-2} position="relative">
                        <img
                            className={style.backgroundImg}
                            src="https://cover-talk.zadn.vn/0/4/b/2/3/02b40a29341081a8e6a005375f6ffcf0.jpg"
                            alt=""
                        />
                        <Box
                            className={style.avatarContainer}
                            position="absolute"
                            bottom={0}
                            left="50%"
                        >
                            <Badge
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'right',
                                }}
                                classes={{anchorOriginBottomRightRectangle:style.badgeAnchor}}
                                badgeContent={
                                    <label htmlFor="icon-button-file">
                                        <IconButton classes={{ root: style.uploadBtn }} component='span'>
                                            <PhotoCamera />
                                        </IconButton>
                                    </label>
                                }
                            >
                                <Avatar
                                    classes={{ root: style.avatar }}
                                    src="https://picsum.photos/200/300"
                                />
                            </Badge>
                        </Box>
                    </Box>
                    <Box textAlign="center" mt={8}>
                        <Typography variant="h6">Sơn Huỳnh</Typography>
                    </Box>
                    <Box mt={3}>
                        <Box display="flex">
                            <Typography color="textSecondary">Email:</Typography>
                            <Typography classes={{root : style.textInfo}}>htson.dev.it@gmail.com</Typography>
                        </Box>
                        <Box display="flex" mt={1.5} alignItems="center">
                            <Typography color="textSecondary">
                                Firstname:
                            </Typography>
                            {edit.firstname ? (
                                <TextField 
                                    classes={{root : style.textInfo}} 
                                    fullWidth 
                                    autoFocus
                                    autoComplete='off'
                                    // defaultValue={getValues('firstname') || ''}
                                    // {...register('firstname')}
                                    inputRef={fnameRef}
                                    {...fnameRest}
                                    error={!!errors.firstname}
                                    helperText={errors.firstname?.message}
                                />
                            ) : (
                                <Typography
                                    variant="subtitle1"
                                    classes={{ root: style.textInfo }}
                                >
                                    Sơn
                                </Typography>
                            )}
                            <IconButton
                                onClick={() => handleEditClick('firstname')}
                                classes={{ root: `${style.editBtn} ${edit.firstname && style.editBtnActive}`}}
                            >
                                <BorderColor classes={{ root: style.svgIcon }} />
                            </IconButton>
                        </Box>
                        <Box display="flex" mt={1.5} alignItems="center">
                            <Typography color="textSecondary">Lastname:</Typography>
                            {edit.lastname ? (
                                <TextField 
                                    classes={{root : style.textInfo}} 
                                    fullWidth 
                                    autoFocus
                                    autoComplete='off'
                                    // defaultValue={getValues('lastname') || ''}
                                    // {...register('lastname')}
                                    inputRef={lnameRef}
                                    {...lnameRest}
                                    error={!!errors.lastname}
                                    helperText={errors.lastname?.message}   
                                />
                            ) : (
                                <Typography
                                    variant="subtitle1"
                                    classes={{ root: style.textInfo }}
                                >
                                    Huỳnh
                                </Typography>
                            )}
                            <IconButton
                                onClick={() => handleEditClick('lastname')}
                                classes={{ root: `${style.editBtn} ${edit.lastname && style.editBtnActive}`}}
                            >
                                <BorderColor classes={{ root: style.svgIcon }} />
                            </IconButton>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="secondary">
                        Cancel
                    </Button>
                    <Button color="primary" type='submit'
                        disabled={!isSubmitable()}
                    >Update</Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default UserModal;
