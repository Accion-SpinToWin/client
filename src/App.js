
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { Header } from "./components/Header";
import { About } from "./pages/About";
import { Admin } from "./pages/Admin";
import { Dashboard } from "./pages/Dashboard";
import { Home } from "./pages/Home";
import { Main } from "./pages/Main";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { HomeWithSelection } from "./pages/HomeWithSelection";
function App() {
  let pathname = window.location.pathname;
  let isWinner = (pathname.toLowerCase().includes('winner'));
  let availableHeight = window.innerHeight - (isWinner ? 0 : 50);//(document.getElementById("header-li") ? document.getElementById("header-li").clientHeight : 0); // elements being rendered at same time, so getElement is giving null

  return (
    <div className="router-with-header">

      <Router className=''>
        {!isWinner && <Header></Header>}
        <div className="router-div" style={{ '--min-height': availableHeight + 'px' }}>
          <div className="router-content">
            <Routes>
              <Route exact path="/" element={<Main />} />
              <Route exact path="home" element={<Home />} />
              <Route exact path="home-selection" element={<HomeWithSelection />} />
              <Route exact path="dashboard" element={<Dashboard />} />
              <Route exact path="admin" element={<Admin />} />
              {/* <Route exact path="about" element={<About />} /> */}
              <Route path="winner/:uniqueCode" element={<Home />} />
            </Routes>
          </div>


        </div>
      </Router>
    </div>
  );
}

export default App;
