import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import QuizPlatform from './components/QuizPlatform';
function App() {
  return (
    <><Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quiz" element={<QuizPlatform />} /> 
      </Routes>
    </Router>
    
    </>
    
  );
}

export default App;
