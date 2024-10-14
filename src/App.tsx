import React from 'react';
import logo from './logo.svg';
import KakaoMap from './components/mapfunction';
import './App.css';
import { Route, Routes } from "react-router-dom";
import BasicMap from './components/usebikemap';
import Loign from "./components/login/kakaologin"
import CallBack from "./components/login/kakaocallback";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Loign />} />
      <Route path="/login/oauth2/callback/kakao" element={<CallBack />} />
      <Route path="/map" element={<BasicMap />} />
      
    </Routes>
  );
}

export default App;
