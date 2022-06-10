import React from "react";
import Footer from "./components/footer";
import Header from "./components/header";
import Main from "./pages/main";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'

function App() {

  return (
    <div className="main-container">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
