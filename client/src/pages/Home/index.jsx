import {Avatar,Badge,Box,Button,Divider,makeStyles,Popover,} from "@material-ui/core";
import {Settings,AccountCircleOutlined,VpnKeyOutlined,ExitToAppOutlined,Chat,PermContactCalendar,} from "@material-ui/icons";
import React, {useEffect, useState, useCallback} from "react";
import {updateNewFriendRequest, userLogout} from "../../actions/userAction";
import PasswordModal from "../../components/PwdModal";
import UserModal from "../../components/UserModal";
import {useHistory} from "react-router";
import ConversationSidebar from "../../components/ConversationSidebar";
import FriendRequest from '../../components/FriendRequest'
import SearchModal from "../../components/SearchModal";
import { useDispatch, useSelector } from "react-redux";
import Conversation from "../../components/Conversation";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Swal from "sweetalert2";
const HomePage = () => {
    const [userModal, setUserModal] = useState(false);
    const [pwdModal, setPwdModal] = useState(false);
    const [searchModal,setSearchModal] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [showFriendList,setShowFriendList] = useState(false)
    const [showFrRequest,setShowFrRequest] = useState(false)
    const [showConversation,setShowConversation] = useState(false)  // Mobile breakpoint
    const {info,friendRequest} = useSelector(state => state.user)
    const {conversations} = useSelector(state => state.message)
    const socket = useSelector(state => state.socket)
    const dispatch = useDispatch()
    const history = useHistory();
    const style = useStyle({showConversation,showFriendList});
    const isMobileBp = useMediaQuery(theme => theme.breakpoints.down('sm'))
    const handleLogOut = () => {
        dispatch(userLogout());
        localStorage.removeItem("token");
        history.push("/login");
    };
    const handleShowConversation = useCallback((val) => {
        if(isMobileBp)
            setShowConversation(val)
    },[isMobileBp])
    const unseenConv = conversations.filter(cv => !cv.seen && cv._id === cv.last_sender).length
    useEffect(()=> {
        if(socket) {
            socket.on('FRIEND_REQUEST',(info)=>{
                dispatch(updateNewFriendRequest(info))
                const Toast = Swal.mixin({
                    toast : true,
                    timer : 3000,
                    showConfirmButton : false,
                    position : 'bottom-left',
                    timerProgressBar : true,
                    didOpen : (toast) => {
                        toast.addEventListener('mouseenter',()=>toast.style.cursor = 'pointer')
                        toast.addEventListener('click',()=> {
                            setShowFriendList(true)
                            setShowFrRequest(true)
                            handleShowConversation(true)
                        })
                    }
                })
                Toast.fire({
                    icon : 'info',
                    html : `You have a new friend request from <b>${info.fullname}</b>`
                })
            })
        }
        return ()=>{
            if(socket)
                socket.off('FRIEND_REQUEST')
        }
    },[handleShowConversation,socket,dispatch])
    return (
        <Box height="100vh" display="flex" overflow='hidden'>
            <Box
                className={style.sidebar}
                py={1}
                display="flex"
                flexDirection="column">
                <Box display="flex" justifyContent="center">
                    <Badge
                        variant="dot"
                        classes={{
                            dot: style.badgeDot,
                            anchorOriginTopRightRectangle: style.badgeAnchor,
                        }}>
                        <Avatar
                            classes={{root: style.avatar}}
                            src={info.avatar}
                            onClick={() => setUserModal(true)}
                        />
                    </Badge>
                </Box>
                <Box mt={2}>
                    <Badge badgeContent={unseenConv} color='error' classes={{anchorOriginTopRightRectangle: style.btnBadgeAnchor}}>
                        <Button classes={{root: `${style.settingBtn} ${!showFriendList && style.settingBtnActive}`}}
                            onClick={()=>{
                                if(showFriendList) 
                                    handleShowConversation(false)
                                setShowFriendList(false)
                                }}>
                            <Chat fontSize="large" />
                        </Button>
                    </Badge>
                    <Badge badgeContent={friendRequest.length} color='error' classes={{anchorOriginTopRightRectangle: style.btnBadgeAnchor}}>
                        <Button classes={{root: `${style.settingBtn} ${showFriendList && style.settingBtnActive}`}}
                            onClick={()=>{
                                if(!showFriendList)
                                    handleShowConversation(false)
                                setShowFriendList(true)
                            }}>
                            <PermContactCalendar fontSize="large" />
                        </Button>
                    </Badge>
                </Box>
                <Box marginTop='auto'>
                    <Button
                        classes={{root: style.settingBtn}}
                        onClick={(e) => setAnchorEl(e.target)}>
                        <Settings fontSize="large" />
                    </Button>
                    <Popover
                        open={!!anchorEl}
                        anchorEl={anchorEl}
                        onClose={() => setAnchorEl(null)}
                        anchorOrigin={{vertical: "top", horizontal: "right"}}
                        transformOrigin={{vertical : 'bottom',horizontal : 'left'}}>
                        <Box p={1} display="flex" flexDirection="column">
                            <Button
                                classes={{root: style.popoverBtn}}
                                onClick={() => {
                                    setUserModal(true);
                                    setAnchorEl(null);
                                }}
                                startIcon={<AccountCircleOutlined />}>
                                Profile
                            </Button>
                            <Button
                                classes={{root: style.popoverBtn}}
                                startIcon={<VpnKeyOutlined />}
                                onClick={() => {
                                    setPwdModal(true);
                                    setAnchorEl(null);
                                }}>
                                Change password
                            </Button>
                            <Divider />
                            <Button
                                onClick={handleLogOut}
                                classes={{root: style.popoverBtn}}
                                startIcon={<ExitToAppOutlined />}>
                                Logout
                            </Button>
                        </Box>
                    </Popover>
                </Box>
            </Box>
            <Box display="flex" flex={1} height="100%" position='relative'>
                <Box className={style.conversationSidebar}>
                    <ConversationSidebar
                        handleShowConversation={handleShowConversation}
                        showFriendList={showFriendList} 
                        handleShowFrRequest={(val)=>setShowFrRequest(val)}
                        handleShowSearchModal={()=>setSearchModal(true)}/>
                </Box>
                <Box className={style.conversation}>
                        {(showFrRequest && showFriendList)
                            ? <FriendRequest handleShowConversation={handleShowConversation}/> : 
                            <Conversation handleShowConversation={handleShowConversation}/>
                        }
                </Box>
            </Box>
            <UserModal open={userModal} onClose={() => setUserModal(false)} />
            <PasswordModal open={pwdModal} onClose={() => setPwdModal(false)} />
            <SearchModal open={searchModal} onClose={()=>setSearchModal(false)} 
                handleShowConversation={handleShowConversation}
                handleShowFrRequest={(val)=>setShowFrRequest(val)}/>
        </Box>
    );
};
const useStyle = makeStyles((theme) => ({
    sidebar: {
        width: "64px",
        height: "100%",
        backgroundColor: theme.palette.primary.main,
    },
    avatar: {
        width: "48px",
        height: "48px",
        border: "2px solid #fff",
        cursor: "pointer",
    },
    badgeDot: {
        backgroundColor: "#15A85F",
        width: "12px",
        height: "12px",
        border: "1.5px solid #fff",
        borderRadius: "100rem",
    },
    badgeAnchor: {
        top: "8px",
        right: "6px",
    },
    conversationSidebar: {
        borderRight: "1px solid #cacaca",
        width:"336px",
        height:"100%",
        [theme.breakpoints.down('sm')] : {
            width : '100%'
        }
    },
    conversation: {
        backgroundColor : '#fff',
        flex:1,
        height:"100%",
        [theme.breakpoints.down("sm")]: {
            display : ({showConversation}) => showConversation ? 'block' : 'none',
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex : 2,
            animation : '$slideIn 150ms linear'
        },
    },
    settingBtn: {
        padding : '12px',
        color: "#fff",
        borderRadius: 0,
        "&:hover": {
            backgroundColor: "rgb(255 255 255 / 40%)",
        }

    },
    settingBtnActive : {
        backgroundColor: "rgb(255 255 255 / 40%)",
    },
    popoverBtn: {
        textTransform: "initial",
        justifyContent: "flex-start",
        "&:last-child": {
            color: "red",
        },
    },
    btnBadgeAnchor: {
        top: "12px",
        right: "12px",
    },
    '@keyframes slideIn' : {
        '0%' : {
            transform : 'translateX(100%)'
        },
        '100%' : {
            transform : 'initial'
        }
    }
}));
export default HomePage;
