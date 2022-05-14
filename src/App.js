import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PersistentDrawerLeft from './shared/SideNavigation'
import MainNavigation from './shared/MainNavigation'
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import { LogInGuard, LogOutGuard } from './auth/authGuards'
import photo from './shared/assets/main-background.svg'


function App() {
  return (
    <div style={{ backgroundImage: `url(${photo})`,backgroundSize: "cover",
    height: "100vh", }}>
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
    </div>
  );
}

export default App;
