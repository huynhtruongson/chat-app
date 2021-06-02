import { Avatar, Badge, Box,Button, Divider, makeStyles, Popover, TextField} from '@material-ui/core';
import {Search,Settings,AccountCircleOutlined,VpnKeyOutlined,ExitToAppOutlined} from '@material-ui/icons';
import React, { useState } from 'react';
import ChatCard from '../../components/ChatCard';
import MessageBox from '../../components/MessageBox';
import PasswordModal from '../../components/PwdModal';
import UserModal from '../../components/UserModal';

const HomePage = () => {
    const [userModal, setUserModal] = useState(false)
    const [pwdModal, setPwdModal] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const style = useStyle();
    return (
        <Box height="100vh" display="flex">
            <Box className={style.sidebar} py={1} display='flex' flexDirection='column' justifyContent='space-between'>
                <Box display="flex" justifyContent="center">
                    <Badge
                        variant="dot"
                        classes={{
                            dot: style.badgeDot,
                            anchorOriginTopRightRectangle : style.badgeAnchor
                        }}
                    >
                        <Avatar
                            classes={{ root: style.avatar }}
                            src="https://picsum.photos/200/300"
                            onClick={() => setUserModal(true)}
                        />
                    </Badge>
                </Box>
                <Box>
                    <Button classes={{root : style.settingBtn}} onClick={(e) => setAnchorEl(e.target)}>
                        <Settings fontSize='large'/>
                    </Button>
                    <Popover
                        open={!!anchorEl}
                        anchorEl={anchorEl}
                        onClose={()=> setAnchorEl(null)}
                        anchorOrigin={{vertical : 'top',horizontal:'right'}}
                    >
                        <Box p={1} display='flex' flexDirection='column'>
                            <Button
                                classes={{root : style.popoverBtn}}
                                onClick={()=>{setUserModal(true);setAnchorEl(null)}}
                                startIcon={<AccountCircleOutlined/>}
                            >
                                Profile
                            </Button>
                            <Button 
                                classes={{root : style.popoverBtn}} 
                                startIcon={<VpnKeyOutlined/>}
                                onClick={()=>{setPwdModal(true);setAnchorEl(null)}}
                            >
                                Change password
                            </Button>
                            <Divider/>
                            <Button href='#' classes={{root : style.popoverBtn}} startIcon={<ExitToAppOutlined/>}>
                                Logout
                            </Button>
                        </Box>
                    </Popover>
                </Box>
            </Box>
            <Box display='flex' position='relative' flex={1} height='100%'>
                <Box width='336px' className={style.chatList} height='100%'>
                    <Box display='flex' alignItems='flex-end' px={1}>
                        <Search classes={{root : style.searchIcon}} color='disabled'/>
                        <TextField label='Search' fullWidth/>
                    </Box>
                    <Box display='flex' flexDirection='column'>
                        <ChatCard/>
                        <ChatCard/>
                        <ChatCard/>
                    </Box>
                </Box>
                <Box flex={1} height='100%' className={style.messageBox}>
                    <MessageBox/>
                </Box>
            </Box>
            <UserModal open={userModal} onClose={()=> setUserModal(false)} />
            <PasswordModal open={pwdModal} onClose={()=> setPwdModal(false)} />
        </Box> 
    );
};
const useStyle = makeStyles((theme) => ({
    sidebar: {
        width: '64px',
        height: '100%',
        backgroundColor: '#0091ff',
    },
    avatar: {
        width: '48px',
        height: '48px',
        border : '2px solid #fff',
        cursor : 'pointer'
    },
    badgeDot: {
        backgroundColor: '#15A85F',
        width: '12px',
        height: '12px',
        border: '1.5px solid #fff',
        borderRadius: '100rem',
    },
    badgeAnchor: {
        top: '8px',
        right: '6px',
    },
    chatList : {
        borderRight : '1px solid #cacaca'
    },
    messageBox : {
        [theme.breakpoints.down('sm')] : {
            position:'absolute',
            top: 0,
            left : 0,
            width : '100%',
            height : '100%'
        }
    },
    searchIcon : {
        fontSize:'30px'
    },
    settingBtn : {
        color : '#fff',
        borderRadius : 0,
        '&:hover' : {
            backgroundColor : 'rgb(255 255 255 / 40%)'
        }
    },
    popoverBtn : {
        textTransform:'initial',
        justifyContent : 'flex-start',
        '&:last-child' : {
            color : 'red'
        }
    }
}));
export default HomePage;
