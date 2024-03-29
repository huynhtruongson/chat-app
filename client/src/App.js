import './App.css';
import ThemeProvider from './assets/styles/ThemeProvider';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
// import { CssBaseline } from '@material-ui/core';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register'
import HomePage from './pages/Home'
import ForgotPwdPage from './pages/ForgotPwd'
import VerifyEmailPage from './pages/VerifyEmail';
import NotFoundPage from './pages/NotFound'
import PrivateRoute from './components/PrivateRoute';
import AuthRoute from './components/AuthRoute'
import ResetPwdPage from './pages/ResetPwd';
import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getUserInfo } from './actions/userAction';
import io from 'socket.io-client'
import SocketClient from './SocketClient'
import {createSocket} from './actions/socketAction'
function App() {
    const {isLogged} = useSelector(state => state.user)
    const socket = useSelector(state => state.socket)
    const dispatch = useDispatch()
    const socketRef = useRef()
    useEffect(() => {
        const fetchUserInfo = () => {
            if(isLogged)
                dispatch(getUserInfo(localStorage.getItem('token')))
        }
        fetchUserInfo()
    },[dispatch,isLogged])
    useEffect(() => {
        if(isLogged) {
            socketRef.current = io()
            dispatch(createSocket(socketRef.current))
        }
        return () => {
            if(socketRef.current)
                socketRef.current.close()
        }
    },[dispatch,isLogged])
    return (
        <ThemeProvider>
                {/* <CssBaseline/> */}
                {(isLogged && socket) && <SocketClient/>}
                <Router>
                    <Switch>
                        <PrivateRoute path='/' exact>
                            <HomePage/>
                        </PrivateRoute>
                        <AuthRoute path='/login'>
                            <LoginPage/>
                        </AuthRoute>
                        <AuthRoute path='/register'>
                            <RegisterPage/>
                        </AuthRoute>
                        <AuthRoute path='/forgot-password'>
                            <ForgotPwdPage/>
                        </AuthRoute>
                        <AuthRoute path='/verify-email/:token'>
                            <VerifyEmailPage/>
                        </AuthRoute>
                        <AuthRoute path='/reset-password/:token'>
                            <ResetPwdPage/>
                        </AuthRoute>
                        <Route component={NotFoundPage} />
                    </Switch>
                </Router>
        </ThemeProvider>
    );
}

export default App;
