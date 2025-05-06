import './App.css';
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


import { Home } from './component/Home/Home';
import { Question } from './component/Question/Question';
import { Result } from './component/Result/Result';
import { File } from './component/TakenInput/File';

function App() {


  useEffect(() => {

     localStorage.setItem('site', '127.0.0.1:8000');
     const data= localStorage.getItem('data');
     const answer= localStorage.getItem('answer');

    if (!data) {
      const defaultData = {questions:[[]],options:[[]],answers:[[]],explanations:[[]]}
      localStorage.setItem('data', JSON.stringify(defaultData));
    } 
    if(!answer){
      const defaultAnswer = [[]];
      localStorage.setItem('answer', JSON.stringify(defaultAnswer));
    }
  }, []);


  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/question" element={<Question />} />
          <Route path="/result" element={<Result />} />
          <Route path="/select" element={<File />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
