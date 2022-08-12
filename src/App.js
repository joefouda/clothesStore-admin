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
import ModelsPage from './pages/ModelsPage'
import OrdersPage from './pages/OrdersPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import MainSliderControlPage from './pages/MainSliderControlPage'
import ProductPhotosControl from './components/Products/ProductPhotosControl/ProductPhotosControl'
import MayRenderMainNav from './shared/MayRenderMainNav';
import { LogInGuard, LogOutGuard, Redirect } from './auth/authGuards'
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import PageNotFound from './shared/PageNotFound';


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
    <>
      <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} open={open} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={state}>
          {message}
        </Alert>
      </Snackbar>

      <NotificationContext.Provider value={{ handleNotification }}>
            <BrowserRouter >
              <MayRenderMainNav>
                <MainNavigation />
              </MayRenderMainNav>
              <Routes>
                <Route exact path='/' element={<LogInGuard />}>
                  <Route path="/" element={<PersistentDrawerLeft><HomePage /></PersistentDrawerLeft>} />
                </Route>
                <Route exact path='/users' element={<LogInGuard />}>
                  <Route path="/users" element={<PersistentDrawerLeft><UsersPage /></PersistentDrawerLeft>} />
                </Route>
                <Route exact path='/:modelID/products' element={<LogInGuard />}>
                  <Route path="/:modelID/products" element={<PersistentDrawerLeft><ProductsPage /></PersistentDrawerLeft>} />
                </Route>
                <Route exact path='/:id/productPhotos' element={<LogInGuard />}>
                  <Route path="/:id/productPhotos" element={<PersistentDrawerLeft><ProductPhotosControl /></PersistentDrawerLeft>} />
                </Route>
                <Route exact path='/categories' element={<LogInGuard />}>
                  <Route path="/categories" element={<PersistentDrawerLeft><CategoriesPage /></PersistentDrawerLeft>} />
                </Route>
                <Route exact path='/:categoryID/subCategories' element={<LogInGuard />}>
                  <Route path="/:categoryID/subCategories" element={<PersistentDrawerLeft><SubCategoriesPage /></PersistentDrawerLeft>} />
                </Route>
                <Route exact path='/:categoryID/:subCategoryID/models' element={<LogInGuard />}>
                  <Route path="/:categoryID/:subCategoryID/models" element={<PersistentDrawerLeft><ModelsPage /></PersistentDrawerLeft>} />
                </Route>
                <Route exact path='/orders' element={<LogInGuard />}>
                  <Route path="/orders" element={<PersistentDrawerLeft><OrdersPage /></PersistentDrawerLeft>} />
                </Route>
                <Route exact path='/mainSliderControl' element={<LogInGuard />}>
                  <Route path="/mainSliderControl" element={<PersistentDrawerLeft><MainSliderControlPage /></PersistentDrawerLeft>} />
                </Route>
                <Route exact path='/login' element={<LogOutGuard />}>
                  <Route path="/login" element={<LoginPage />} />
                </Route>
                <Route exact path='/signup' element={<LogOutGuard />}>
                  <Route path="/signup" element={<SignupPage />} />
                </Route>
                <Route path="*" element={<Redirect />} />
                <Route path="/404" element={<PageNotFound />} />
              </Routes>
            </BrowserRouter>
      </NotificationContext.Provider>
    </>
  );
}

export default App;
