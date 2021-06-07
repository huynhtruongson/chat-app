import './App.css';
import ThemeProvider from './assets/styles/ThemeProvider';
import {DataProvider} from './context/DataContext'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import { CssBaseline } from '@material-ui/core';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register'
import HomePage from './pages/Home'
import ForgotPwdPage from './pages/ForgotPwd'
import VerifyEmailPage from './pages/VerifyEmail';
import NotFoundPage from './pages/NotFound'
import PrivateRoute from './components/PrivateRoute';
import AuthRoute from './components/AuthRoute'
import ResetPwdPage from './pages/ResetPwd';
function App() {
    return (
        <ThemeProvider>
            <DataProvider>
                <CssBaseline/>
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
            </DataProvider>
        </ThemeProvider>
    );
}

export default App;
