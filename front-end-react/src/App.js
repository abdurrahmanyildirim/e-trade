import React from "react";
import Footer from "./components/footer";
import Header from "./components/header";
import Main from "./pages/main";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import Splash from "./pages/splash";
import { useSelector } from 'react-redux'

function App() {
  const isInitialized = useSelector((state) => state.site.isInitialized);

  return (
    <div className="main-container">
      {isInitialized ?
        <div className="app-content">
          <Header />
          <Main />
          <Footer />
        </div>
        :
        <Splash />
      }
    </div>
  );
}

export default App;
