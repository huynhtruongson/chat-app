import React, { useEffect, useState } from 'react';
import { Avatar,Backdrop,Badge,Box,Button,CircularProgress,DialogActions,DialogContent,IconButton,TextField,Typography,Zoom,} from '@material-ui/core';
import { PhotoCamera, BorderColor } from '@material-ui/icons';
import {useForm} from 'react-hook-form'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from 'yup'
import {useData} from '../../context/DataContext'
import useStyle from './style'
import { updateUserInfo } from '../../actions/userAction';
import { readFileAsBase64 } from '../../utils';
import UserApi from '../../api/userApi';
import useAlert from '../../hooks/alert';
import ModalBase from '../ModalBase';
const Transition = React.forwardRef((props, ref) => {
    return <Zoom ref={ref} {...props} />;
});
const SUPPORTED_FORMATS = ["image/jpg","image/jpeg","image/gif","image/png"];
const schema = yup.object().shape({
    firstname : yup.string().max(10,'Firstname must at most 10 characters long!'),
    lastname : yup.string().max(10,'Lastname must at most 10 characters long!'),
})
const UserModal = ({ open, onClose }) => {
    const [edit, setEdit] = useState({firstname: false,lastname: false});
    const {user : [user,dispatch]} = useData()
    const [avatar,setAvatar] = useState(null)
    const {_alert} = useAlert()
    const style = useStyle(edit);
    const {register,handleSubmit,formState : {errors,isDirty,isSubmitting},reset,setValue,watch} = useForm({
        mode : 'onChange',
        resolver : yupResolver(schema),
        shouldUnregister : true
    })
    const {ref : fnameRef, ...fnameRest} = register('firstname')
    const {ref: lnameRef, ...lnameRest} = register('lastname')
    const handleEditClick = (field) => {
        setEdit({ ...edit, [field]: !edit[field] });
    };
    const handleModalClose = () => {
        setEdit({fname: false,lname: false})
        setAvatar(user.info.avatar)
        reset() //reset to default value
    }
    const handleAvatarChange = async (e) => {
        const file  = e.target.files[0]
        if(!file) 
            return 
        if(!SUPPORTED_FORMATS.includes(file.type)) {
            _alert({
                icon : 'warning',
                msg : 'Unsupported File Format'
            })
        }
        else {
            const src = await readFileAsBase64(e.target.files[0])
            setAvatar(src)
            setValue('avatar',e.target.files)
        }
    }
    const isSubmitable = () => {
        if(watch('avatar') && watch('avatar').length)
            return true
        return Object.keys(edit).some(key => edit[key]) && isDirty
    }
    const onSubmit = async (data) => {
        try {
            const {firstname,lastname,avatar} = data
            const userData = new FormData()
            userData.append('firstname',firstname)
            userData.append('lastname',lastname)
            if(avatar && avatar.length) {
                userData.append('avatar',avatar[0])
            }
            const res = await UserApi.updateInfo(userData)
            if(res.status === 200) {
                console.log(res)
                onClose()
                dispatch(updateUserInfo(res.data))
                _alert({
                    icon : 'success',
                    msg : res.message
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
    useEffect(()=>{
        reset({           //set defaultValue to hook-form 
            firstname : user.info.firstname,
            lastname : user.info.lastname,
        })
        setAvatar(user.info.avatar)
    },[user.info,reset])
    return (
        <ModalBase
            open={open}
            TransitionComponent={Transition}
            onClose={onClose}
            onExited={handleModalClose}
            disableBackdropClick
            title='User Information'>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input accept="image/*" 
                    id="icon-button-file" 
                    type="file"
                    hidden 
                    {...register('avatar')}
                    onChange={handleAvatarChange}
                />
                <DialogContent dividers classes={{dividers : style.dialogContent}}>
                    <Box height="150px" mx={-1.5} position="relative">
                        <img
                            className={style.backgroundImg}
                            src="https://cover-talk.zadn.vn/0/4/b/2/3/02b40a29341081a8e6a005375f6ffcf0.jpg"
                            alt="img"
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
                                            <PhotoCamera fontSize='small'/>
                                        </IconButton>
                                    </label>
                                }
                            >
                                <Avatar
                                    classes={{ root: style.avatar }}
                                    src={avatar}
                                />
                            </Badge>
                        </Box>
                    </Box>
                    <Box textAlign="center" mt={6.5}>
                        <Typography variant="h6">{`${user.info.firstname} ${user.info.lastname}`}</Typography>
                    </Box>
                    <Box mt={3}>
                        <Box display="flex">
                            <Typography color="textSecondary">Email:</Typography>
                            <Typography classes={{root : style.textInfo}}>{user.info.email}</Typography>
                        </Box>
                        <Box display="flex" mt={1} alignItems="center">
                            <Typography color="textSecondary">
                                Firstname:
                            </Typography>
                            {edit.firstname ? (
                                <TextField 
                                    classes={{root : style.textInfo}} 
                                    fullWidth 
                                    autoFocus
                                    autoComplete='off'
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
                                    {user.info.firstname}
                                </Typography>
                            )}
                            <IconButton
                                onClick={() => handleEditClick('firstname')}
                                classes={{ root: `${style.editBtn} ${edit.firstname && style.editBtnActive}`}}
                            >
                                <BorderColor classes={{ root: style.svgIcon }} />
                            </IconButton>
                        </Box>
                        <Box display="flex" mt={1} alignItems="center">
                            <Typography color="textSecondary">Lastname:</Typography>
                            {edit.lastname ? (
                                <TextField 
                                    classes={{root : style.textInfo}} 
                                    fullWidth 
                                    autoFocus
                                    autoComplete='off'
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
                                    {user.info.lastname}
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
                    <Button onClick={onClose} color="default" classes={{root : style.dialogBtn}}>
                        Cancel
                    </Button>
                    <Button 
                        classes={{root : style.dialogBtn}}
                        color="primary" 
                        type='submit'
                        variant='contained'
                        disabled={!isSubmitable()}
                    >Update</Button>
                </DialogActions>
            </form>
            <Backdrop open={isSubmitting} classes={{root : style.backdrop}}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </ModalBase>
    );
};

export default UserModal;
