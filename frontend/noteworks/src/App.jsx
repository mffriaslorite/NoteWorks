import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
import Subjects from './pages/Subjects/Subjects';
import SubjectNotes from './pages/SubjectNotes/SubjectNotes';

const routes = (
  <Router>
    <Routes>
      <Route path = "/subjects" exact element = {<Subjects />} />
      <Route path = "/login" exact element = {<Login />} />
      <Route path = "/signup" exact element = {<SignUp />} />
      <Route path = "subjects/:subjectId" exact element = {<SubjectNotes />} />
    </Routes>
  </Router>
);

const App = () => {
  return (
    <div>
      {routes}
    </div>
  )
};

export default App
