import {Avatar,Badge,Box,Button,Divider,makeStyles,Popover,} from "@material-ui/core";
import {Settings,AccountCircleOutlined,VpnKeyOutlined,ExitToAppOutlined,Chat,PermContactCalendar,} from "@material-ui/icons";
import React, {useState} from "react";
import {userLogout} from "../../actions/userAction";
import MessageBox from "../../components/MessageBox";
import PasswordModal from "../../components/PwdModal";
import UserModal from "../../components/UserModal";
import {useHistory} from "react-router";
import ChatUserList from "../../components/ChatUserList";
import FriendRequest from '../../components/FriendRequest'
import SearchModal from "../../components/SearchModal";
import { useDispatch } from "react-redux";
const HomePage = () => {
    console.log('home page render')
    const [userModal, setUserModal] = useState(false);
    const [pwdModal, setPwdModal] = useState(false);
    const [searchModal,setSearchModal] = useState(false)
    const [anchorEl, setAnchorEl] = useState(null);
    const [showFriendList,setShowFriendList] = useState(false)
    const [showFrRequest,setShowFrRequest] = useState(false) 
    const dispatch = useDispatch()
    const history = useHistory();
    const style = useStyle();
    const handleLogOut = () => {
        dispatch(userLogout());
        localStorage.removeItem("token");
        history.push("/login");
    };
    return (
        <Box height="100vh" display="flex">
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
                            src="https://picsum.photos/200/300"
                            onClick={() => setUserModal(true)}
                        />
                    </Badge>
                </Box>
                <Box mt={2}>
                    <Button classes={{root: style.settingBtn}}
                        onClick={()=>setShowFriendList(false)}>
                        <Chat fontSize="large" />
                    </Button>
                    <Button classes={{root: style.settingBtn}}
                        onClick={()=>setShowFriendList(true)}>
                        <PermContactCalendar fontSize="large" />
                    </Button>
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
                        anchorOrigin={{vertical: "top", horizontal: "right"}}>
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
            <Box display="flex" position="relative" flex={1} height="100%">
                <Box width="336px" className={style.chatList} height="100%">
                    <ChatUserList 
                        showFriendList={showFriendList} 
                        handleShowFrRequest={(val)=>setShowFrRequest(val)}
                        handleShowSearchModal={()=>setSearchModal(true)}/>
                </Box>
                <Box flex={1} height="100%" className={style.messageBox}>
                    
                        {/* (showFrRequest && showFriendList)
                        ? <FriendRequest/> : <MessageBox /> */}
                        <MessageBox/>
                    
                </Box>
            </Box>
            {/* <UserModal open={userModal} onClose={() => setUserModal(false)} /> */}
            {/* <PasswordModal open={pwdModal} onClose={() => setPwdModal(false)} /> */}
            {/* <SearchModal open={searchModal} onClose={()=>setSearchModal(false)} /> */}
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
    chatList: {
        borderRight: "1px solid #cacaca",
    },
    messageBox: {
        [theme.breakpoints.down("sm")]: {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
        },
    },
    settingBtn: {
        padding : '12px',
        color: "#fff",
        borderRadius: 0,
        "&:hover": {
            backgroundColor: "rgb(255 255 255 / 40%)",
        },
    },
    popoverBtn: {
        textTransform: "initial",
        justifyContent: "flex-start",
        "&:last-child": {
            color: "red",
        },
    },
}));
export default HomePage;
