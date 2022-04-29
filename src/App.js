
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";

import './App.css';
import { Header } from "./components/Header";
import { About } from "./pages/About";
import { Home } from "./pages/Home";
import { Main } from "./pages/Main";

function App() {
  return (
    <div className="router-with-header">
      <Router className=''>
        <Header></Header>
        <div className="router-div">
          <div className="router-content">
            <Routes>
              <Route exact path="/" element={<Main />}/>
              <Route exact path="home" element={<Home />} />
              <Route exact path="about" element={<About />} />
            </Routes>
          </div>


        </div>
      </Router>
    </div>
  );
}

export default App;
