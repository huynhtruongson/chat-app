import {Box,Dialog,DialogTitle,Typography,IconButton,makeStyles,Zoom} from "@material-ui/core";
import {Close} from "@material-ui/icons";
import React from "react";
const Transition = React.forwardRef((props, ref) => {
    return <Zoom ref={ref} {...props} />;
});
const ModalBase = ({onClose,children,title,...props}) => {
    const style = useStyle();
    return (
        <Dialog
            TransitionComponent={Transition}
            classes={{paper: style.dialog}}
            disableBackdropClick
            {...props}>
            <DialogTitle disableTypography classes={{root : style.dialogTitle}}>
                <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography variant='h6'>{title}</Typography>
                    <IconButton onClick={onClose} classes={{root : style.closeBtn}}><Close/></IconButton>
                </Box>
            </DialogTitle>
            {children}
        </Dialog>
    );
};
const useStyle = makeStyles((theme) => ({
    dialog: {
        width: "400px",
    },
    closeBtn: {
        padding: theme.spacing(1)
    },
    dialogTitle : {
        padding : `${theme.spacing(.5)}px ${theme.spacing(1.5)}px`
    },
}));
export default ModalBase;
