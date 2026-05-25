import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navbar from "./component/common/Navbar";
import Footer from "./component/common/Footer";
import RegisterPage from "./component/auth/Register";
import LoginPage from "./component/auth/Login";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            {/* register page */}
            <Route path="/register" element={<RegisterPage />} />
            {/* login page */}
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
