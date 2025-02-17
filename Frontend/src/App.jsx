
import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from './Pages/Home/Home';
import LoginSignupPage from './Pages/LoginSignupPage.jsx/LoginSignupPage';

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginSignupPage />} />
      </Routes>
    </Router>

    </>
  )
}

export default App
