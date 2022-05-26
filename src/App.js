import './App.css';
import { useState, createContext } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PersistentDrawerLeft from './shared/SideNavigation'
import MainNavigation from './shared/MainNavigation'
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import { LogInGuard, LogOutGuard } from './auth/authGuards'
import photo from './shared/assets/main-background.svg'
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

export const NotificationContext = createContext([])

function App() {
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(false);
  const [message, setMessage] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  const handleNotification = (variant, message) => {
    setState(variant);
    setMessage(message);
    setOpen(true);
  };

  return (
    <div style={{ backgroundImage: `url(${photo})`, backgroundSize: "cover", height: '100vh' }}>
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={state}>
          {message}
        </Alert>
      </Snackbar>

      <NotificationContext.Provider value={{ handleNotification }}>
        <BrowserRouter >
          <MainNavigation />
          <Routes>
            <Route exact path='/' element={<LogInGuard />}>
              <Route path="/" element={<PersistentDrawerLeft />} />
            </Route>
            <Route exact path='/login' element={<LogOutGuard />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>
            <Route exact path='/signup' element={<LogOutGuard />}>
              <Route path="/signup" element={<SignupPage />} />
            </Route>
            <Route path="*" element={<div>404 - NotFound</div>} />
          </Routes>
        </BrowserRouter>
      </NotificationContext.Provider>
    </div>
  );
}

export default App;
