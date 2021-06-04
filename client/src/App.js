import './App.css';
import ThemeProvider from './assets/styles/ThemeProvider';
import {DataProvider} from './context/DataContext'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register'
import HomePage from './pages/Home'
import ForgotPwdPage from './pages/ForgotPwd'
import { CssBaseline } from '@material-ui/core';
function App() {
    return (
        <ThemeProvider>
            <DataProvider>
                <CssBaseline/>
                <Router>
                    <Switch>
                        <Route path='/' exact component={HomePage}/>
                        <Route path='/login' component={LoginPage}/>
                        <Route path='/register' component={RegisterPage}/>
                        <Route path='/forgot-password' component={ForgotPwdPage}/>
                    </Switch>
                </Router>
            </DataProvider>
        </ThemeProvider>
    );
}

export default App;
