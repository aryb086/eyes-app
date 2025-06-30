import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './/components/pages/landing.js'
import LoginPage from './/components/pages/login.js'
import StartPage from './/components/pages/startpage.js'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/start" element={<StartPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
