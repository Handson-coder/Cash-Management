import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setIsLoggedIn, login, setUserLogin } from "../store/actions/index";
import LoginPhoto from "../assets/login.jpeg";
import Swal from "sweetalert2";

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [radioButtonClicked, setRadioButtonClicked] = useState(false);

  const inputValue = (e, key) => {
    const newUser = { ...user };
    newUser[key] = e.target.value;
    setUser(newUser);
  };

  const loginButton = () => {
    dispatch(login(user))
      .then(({ data }) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Login Berhasil!`,
          showConfirmButton: false,
          timer: 1500,
        });
        dispatch(setIsLoggedIn(true));
        dispatch(setUserLogin(data));
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("email", data.email);
        localStorage.setItem("id", data.id);
        navigate("/");
      })
      .catch((err) => {
        Swal.fire({
          icon: "info",
          title: "Oops...",
          text: `${err.response.data.message}`,
        });
        setUser({
          email: "",
          password: "",
        });
      });
  };

  const changeRadioButtonValue = () => {
    if (radioButtonClicked === true) {
      setRadioButtonClicked(false);
    } else {
      setRadioButtonClicked(true);
    }
  };
  return (
    <div className="header-table-subEvent container-full-view">
      <div className="login-image-icon">
        <img
          src={LoginPhoto}
          alt=""
          className="rounded-xl background-color-nih"
        />
      </div>
      <div className="pl-16 pt-12 bg-blue-900">
        <div className="signin bg-black">
          <div className="uppercase pb-6 text-2xl text-yellow-300">Sign In</div>
          <hr />
          <div className="form-control pt-5">
            <label className="label">
              <span className="label-text text-yellow-300">Email</span>
            </label>
            <input
              type=""
              placeholder="Email"
              className="input border-yellow-300 bg-neutral-900 border-2"
              onChange={(e) => inputValue(e, "email")}
              value={user.email}
            />
            <label className="label pt-7">
              <span className="label-text text-yellow-300">Password</span>
            </label>
            <input
              type={radioButtonClicked ? "text" : "password"}
              placeholder="Password"
              className="input border-yellow-300 bg-neutral-900 border-2"
              onChange={(e) => inputValue(e, "password")}
              value={user.password}
            />
            <div className="flex mt-1 mb-7">
              <div className="cursor-pointer pr-2 pt-1">
                <input
                  type="radio"
                  name="opt"
                  checked={radioButtonClicked}
                  onClick={changeRadioButtonValue}
                  className="radio radio-accent radio-sm"
                />
              </div>
              <div>
                <span className="label-text text-yellow-300">
                  Show password
                </span>
              </div>
            </div>
            <button
              onClick={loginButton}
              className="btn btn-outline text-yellow-300"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
