import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import TableSubEvents from "./pages/TableSubEvents";
import FormAddEvent from "./pages/FormAddEvent";
import FormEditEvent from "./pages/FormEditEvent";
import ProcessSubEvent from "./pages/ProcessSubEvent";
import FormEditSubEvent from "./pages/FormEditSubEvent";
import FormAddSubEvent from "./pages/FormAddSubEvent";
import LoginPage from "./pages/LoginPage";
import History from "./pages/History";
import Footer from "./components/Footer";
import FormEditProfile from "./pages/FormEditProfile";

export default function App() {
  return (
    <div>
      <div className="container-parent">
        <Navbar></Navbar>
        <Routes>
          <Route
            path="/sub-event/edit/:id"
            element={<FormEditSubEvent />}
          ></Route>
          <Route
            path="/add/sub-event/:id"
            element={<FormAddSubEvent />}
          ></Route>
          <Route path="/sub-event/:id" element={<ProcessSubEvent />}></Route>
          <Route path="/edit/event/:id" element={<FormEditEvent />}></Route>
          <Route path="/event/:id" element={<TableSubEvents />}></Route>
          <Route path="/add/event" element={<FormAddEvent />}></Route>
          <Route path="/profile/edit" element={<FormEditProfile />}></Route>
          <Route path="/history" element={<History />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/" element={<Home />}></Route>
        </Routes>
      </div>
      <Footer></Footer>
    </div>
  );
}
