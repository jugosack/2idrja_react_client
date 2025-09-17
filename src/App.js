/* eslint-disable react/no-unescaped-entities */
/* eslint-disable */
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import "./App.css";
import Home from "./components/Home";
import ProjectsCoding from "./components/ProjectsCoding";
import ProjectsResearch from "./components/ProjectsResearch";
// Removed hardcoded course category pages in favor of dynamic details
import CourseDetails from "./components/CourseDetails";
import About from "./components/About";
import RegistrationForm from "./components/RegistrationForm";
import Login from "./components/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import ErrorPage from "./components/ErrorPage";
import Dashboard from "./components/ui/Dashboard"; // Додаден импорт
import AccountSettings from "./components/AccountSettings";
import CoursesPanelPage from "./components/CoursesPanelPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/login" element={<Login />} />
        <Route path="/projectscoding" element={<ProjectsCoding />} />
        <Route path="/projectsresearch" element={<ProjectsResearch />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/errorpage" element={<ErrorPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/account-settings" element={<AccountSettings />} />
        <Route path="/courses-panel" element={<CoursesPanelPage />} />{" "}
        {/* Додадена рута */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
