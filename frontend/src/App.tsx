import React from 'react';
import './styles/App.css';
import Header from "./components/header";
import Footer from "./components/footer";
import Login from "./components/login";
import Register from "./components/register";
import Homepage from "./components/homepage";
import ApiTokens from "./components/apiTokens";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PasswordRecovery from "./components/PasswordRecovery";

function App() {

    return (
        <Router>
            <div className="App">
                <Header />
                <div className="centered">
                    <h1>Stefan Gajdos</h1>
                    <Routes>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/homepage" element={<Homepage />} />
                        <Route path="/tokens" element={<ApiTokens/>} />
                        <Route path="*" element={<Homepage />} />
                        <Route path="/passwordrecovery" element={<PasswordRecovery/>} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
