import React, {useEffect, useState} from "react";
import {Route, Routes, Navigate} from "react-router";
import Header from "./components/header/header";
import Footer from "./components/footer/footer";
import Cars from "./components/pages/cars/cars";
import Search from "./components/pages/search/search";
import AboutAs from "./components/pages/about/about";
import Personal from "./components/pages/personal/personal";
import Admin from "./components/pages/admin/admin";
import Car from "./components/pages/car/car";
import Chart from "./components/pages/users/adminCars";
import NoMatch from "./components/nomatch/NoMatch";

function App() {

  const [ showHeaderAndFooter, setShowHeaderAndFooter ] = useState(true);

  useEffect(() =>{
    if(window.location.pathname.startsWith('/admin')){
      setShowHeaderAndFooter(false)
    }
  },[window.location.pathname]);

  function RequireAuth({ children }) {
    return localStorage.getItem('admin') ? children : <Navigate to="/admin" replace />;
  }

  return (
        <div>
          {showHeaderAndFooter && <Header/>}
            <div>
              <Routes>
                <Route path='*' element={<NoMatch setShowHeaderAndFooter={setShowHeaderAndFooter}/>}/>
                <Route path='admin' element={<Admin setShowHeaderAndFooter={setShowHeaderAndFooter}/>}/>
                <Route
                  path="admin/car/:id"
                  element={<RequireAuth><Car setShowHeaderAndFooter={setShowHeaderAndFooter}/></RequireAuth>}
                />
                <Route
                  path="/admin/cars/*"
                  element={<RequireAuth><Chart setShowHeaderAndFooter={setShowHeaderAndFooter}/></RequireAuth>}
                />
                <Route path='/' element={<Cars/>}/>
                <Route path='/search' element={<Search/>}/>
                <Route path='/about' element={<AboutAs/>}/>
                <Route path='/personal' element={<Personal/>}/>
              </Routes>
            </div>
          {showHeaderAndFooter && <Footer/> }
        </div>
  );
}

export default App;
