// https://dribbble.com/shots/14440819-KosmoTime-Task-Manager/attachments/6121947?mode=media

// @import url('https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@1,300&family=Poppins:wght@300&display=swap');

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './pages';
import SignUp from './pages/register';
import Login from './pages/login';
// import NavbarComponent from "./components/NavbarComponent/NavbarComponent";
import Dashboard from "./pages/dashboard";
import AddTask from "./pages/addTask";

function App() {

  return (
    <Router>

      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route
          path="/register"
          element={<SignUp />}
        />
        <Route
          path="/login"
          element={<Login />}
        />
        <Route
          path="/dashboard"
          element={<Dashboard />}
        />
        <Route
          path="/addTask"
          element={<AddTask />}
        />
      </Routes>
    </Router>
  );
}

export default App;
