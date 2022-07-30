import './App.css';
import { useState, createContext } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PersistentDrawerLeft from './shared/SideNavigation'
import MainNavigation from './shared/MainNavigation'
import HomePage from './pages/HomePage';
import UsersPage from './pages/UsersPage'
import ProductsPage from './pages/ProductsPage'
import CategoriesPage from './pages/CategoriesPage'
import SubCategoriesPage from './pages/SubCategoriesPage'
import OrdersPage from './pages/OrdersPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import OtherControlsPage from './pages/OtherControlesPage'
import MainSliderControlPage from './pages/MainSliderControlPage'
import MayRenderMainNav from './shared/MayRenderMainNav';
import MayRenderSideNav from './shared/MayRenderSideNav';
import { LogInGuard, LogOutGuard } from './auth/authGuards'
import photo from './shared/assets/main-background.svg'
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import SubCategoriesProvider from './contexts/SubCategoriesContext'


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
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={state}>
          {message}
        </Alert>
      </Snackbar>

      <NotificationContext.Provider value={{ handleNotification }}>
        <SubCategoriesProvider>
          <BrowserRouter >
            <MayRenderMainNav>
              <MainNavigation />
            </MayRenderMainNav>
            <MayRenderSideNav>
              <PersistentDrawerLeft />
            </MayRenderSideNav>
            <Routes>
              <Route exact path='/' element={<LogInGuard />}>
                <Route path="/" element={<HomePage />} />
              </Route>
              <Route exact path='/users' element={<LogInGuard />}>
                <Route path="/users" element={<UsersPage />} />
              </Route>
              <Route exact path='/products' element={<LogInGuard />}>
                <Route path="/products" element={<ProductsPage />} />
              </Route>
              <Route exact path='/categories' element={<LogInGuard />}>
                <Route path="/categories" element={<CategoriesPage />} />
              </Route>
              <Route exact path='/subCategories/:categoryID' element={<LogInGuard />}>
                <Route path="/subCategories/:categoryID" element={<SubCategoriesPage />} />
              </Route>
              <Route exact path='/orders' element={<LogInGuard />}>
                <Route path="/orders" element={<OrdersPage />} />
              </Route>
              <Route exact path='/otherControls' element={<LogInGuard />}>
                <Route path="/otherControls" element={<OtherControlsPage />} />
              </Route>
              <Route exact path='/mainSliderControl' element={<LogInGuard />}>
                <Route path="/mainSliderControl" element={<MainSliderControlPage />} />
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
        </SubCategoriesProvider>
      </NotificationContext.Provider>
    </div>
  );
}

export default App;
