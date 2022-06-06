import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import TableSubEvents from "./pages/TableSubEvents";
import FormAddEvent from "./pages/FormAddEvent";
import FormRegister from "./pages/FormRegister";
import FormEditEvent from "./pages/FormEditEvent";
import ProcessSubEvent from "./pages/ProcessSubEvent";
import FormEditSubEvent from "./pages/FormEditSubEvent";
import FormAddSubEvent from "./pages/FormAddSubEvent";
import LoginPage from "./pages/LoginPage";
import History from "./pages/History";
import Footer from "./components/Footer";
import FormEditProfile from "./pages/FormEditProfile";
import FormAddFatherEvent from "./pages/FormAddFatherEvent";
import FormAddChildEvent from "./pages/FormAddChildEvent";
import TableFatherEvents from "./components/TableFatherEvents";
import TableChildEvents from "./components/TableChildEvents";
import TableEvents from "./components/TableEvents";

export default function App() {
  return (
    <div>
      <div className="container-parent">
        <Navbar></Navbar>
        <Routes>
          {/* form edit */}
          <Route
            path="/sub-event/edit/:id"
            element={<FormEditSubEvent />}
          ></Route>
          <Route path="/edit/event/:id" element={<FormEditEvent />}></Route>
          {/* form edit */}
          {/* form add */}
          <Route
            path="/add/father-event/:fatherEventId/child-event/:childEventId/event/:eventId/sub-event"
            element={<FormAddSubEvent />}
          ></Route>
          <Route
            path="/add/father-event/:fatherEventId/child-event/:childEventId/event"
            element={<FormAddEvent />}
          ></Route>
          <Route
            path="/add/father-event/:fatherEventId/child-event"
            element={<FormAddChildEvent />}
          ></Route>
          {/* form add */}
          {/* tables */}
          <Route
            path="/father-event/:fatherEventId/child-event/:childEventId/event/:eventId"
            element={<TableSubEvents />}
          ></Route>
          <Route
            path="/father-event/:fatherEventId/child-event/:childEventId"
            element={<TableEvents />}
          ></Route>
          <Route
            path="/father-event/:fatherEventId"
            element={<TableChildEvents />}
          ></Route>
          {/* tables */}
          <Route path="/sub-event/:id" element={<ProcessSubEvent />}></Route>
          <Route path="/developer/register" element={<FormRegister />}></Route>
          <Route
            path="/add/father-event"
            element={<FormAddFatherEvent />}
          ></Route>
          <Route path="/profile/edit" element={<FormEditProfile />}></Route>
          <Route path="/history" element={<History />}></Route>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/" element={<TableFatherEvents />}></Route>
        </Routes>
      </div>
      <Footer></Footer>
    </div>
  );
}
