import {Box,TextField,DialogContent,makeStyles,DialogActions,Typography,Button,LinearProgress,} from "@material-ui/core";
import {Search} from "@material-ui/icons";
import React, {useState} from "react";
import { getUserMessage } from "../../actions/messageAction";
import UserApi from "../../api/userApi";
import { useData } from "../../context/DataContext";
import ModalBase from "../ModalBase";
import UserCard from "../UserCard";
import UserProfile from "../UserProfile";
const SearchModal = ({open, onClose}) => {
    const style = useStyle();
    const [searchInput, setSearchInput] = useState("");
    const [searchList, setSearchList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userDetail, setUserDetail] = useState(null);
    const {message : [,dispatch]} = useData()
    const handleSearch = async () => {
        try {
            setLoading(true);
            const params = {fullname_like: searchInput};
            const res = await UserApi.searchFriends(params);
            if (res.status === 200) {
                setLoading(false);
                setSearchList(res.data);
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    };
    const handleClickUser = (user) => {
        setUserDetail(user);
    };
    const handleCloseModal = () => {
        setSearchInput("");
        setSearchList("");
        setLoading(false);
        setUserDetail(null);
    };
    const handleChatClick = () => {
        dispatch(getUserMessage(userDetail))
        onClose()
    }
    return (
        <ModalBase
            open={open}
            onClose={onClose}
            title="Add Friend"
            classes={{paper: style.dialogContainer}}
            onExited={handleCloseModal}>
            <DialogContent classes={{dividers: style.dialogContent}} dividers>
                {loading && (
                    <LinearProgress classes={{root: style.loadingProgress}} color="primary" />
                )}
                {userDetail ? (
                    <UserProfile 
                        user={userDetail} 
                        handleBackClick={()=> setUserDetail(null)}
                        handleChatClick={handleChatClick}
                        />
                ) : (
                    <Box>
                        <TextField
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            variant="outlined"
                            size="small"
                            fullWidth
                            placeholder="Search friend"
                            InputProps={{
                                classes: {root: style.searchInput},
                                startAdornment: <Search color="disabled" />,
                            }}
                        />
                        <Box mt={1}>
                            <Typography variant="subtitle2" color="textSecondary">
                                Searching result
                            </Typography>
                        </Box>
                        <Box textAlign="center" mt={1}>
                            {searchList.length ? (
                                searchList.map((user) => (
                                    <UserCard
                                        key={user._id}
                                        user={user}
                                        handleClick={() => handleClickUser(user)}
                                    />
                                ))
                            ) : (
                                <Typography variant="body2">No Data</Typography>
                            )}
                        </Box>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button classes={{root: style.dialogBtn}} onClick={onClose} color="default">
                    Cancel
                </Button>
                <Button
                    onClick={handleSearch}
                    classes={{root: style.dialogBtn}}
                    disabled={loading || !searchInput || !!userDetail}
                    color="primary"
                    type="submit"
                    variant="contained">
                    Search
                </Button>
            </DialogActions>
        </ModalBase>
    );
};
const useStyle = makeStyles((theme) => ({
    dialogContent: {
        padding: theme.spacing(1.5),
        position: "relative",
    },
    searchInput: {
        borderRadius: "100rem",
        fontSize: ".9rem",
    },
    dialogContainer: {
        width: "380px",
        minHeight: "400px",
    },
    dialogBtn: {
        fontSize: ".9rem",
        textTransform: "initial",
    },
    loadingProgress: {
        position: "absolute",
        width: "100%",
        top: 0,
        left: 0,
    },
}));
export default SearchModal;