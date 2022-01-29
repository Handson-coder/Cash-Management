import React, { useState } from "react";
import { editingProfile, setUserLogin } from "../store/actions";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";

export default function FormEditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [radioButtonClicked, setRadioButtonClicked] = useState(false);
  const [payload, setPayload] = useState({
    email: "",
    password: "",
    role: "admin"
  });

  const inputValue = (e, key) => {
    const newPayload = { ...payload };
    newPayload[key] = e.target.value;
    setPayload(newPayload);
  };

  const editButton = () => {
    let inputValue = payload;
    if (inputValue.email === "") {
      inputValue.email = localStorage.email;
    }
    dispatch(editingProfile(inputValue))
      .then(({ data }) => {
        dispatch(setUserLogin(data.user));
        localStorage.setItem("email", data.user.email);
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        setPayload({
          email: "",
          password: "",
        });
        navigate("/");
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${err.response.data.message}`,
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
    <div className="form-parent container-full-view">
      <div className="form-container">
        <div className="text-center justify-center hero-content lg:text-left">
          <h1 className="mb-4 mt-4 xs:mb-1 xs:mt-1 text-4xl xs:text-xl font-bold italic text-accent uppercase">
            Edit Profile
          </h1>
        </div>
        <div className="bg-blue-900">
          <div className="flex-col justify-center hero-content lg:flex-row">
            <div className="card flex-shrink-0 shadow-2xl bg-base-200">
              <div className="card-body form-nya">
                <div className="form-control">
                  <label className="label">
                    <span className="font-bold">Email</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Email"
                    className="input border-neutral-focus input-bordered "
                    onChange={(e) => inputValue(e, "email")}
                    value={
                      payload.email
                        ? payload.email
                        : localStorage.email
                        ? localStorage.email
                        : ""
                    }
                  />
                </div>
                <div className="form-control mt-5">
                  <label className="label">
                    <span className="font-bold">Password</span>
                  </label>
                  <input
                    type={radioButtonClicked ? "text" : "password"}
                    placeholder="Password"
                    className="input border-neutral-focus input-bordered"
                    onChange={(e) => inputValue(e, "password")}
                    value={payload.password}
                  />
                </div>
                <div className="flex mt-1">
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
                    <span className="label-text">Show password</span>
                  </div>
                </div>
                <div className="mt-5 seperate">
                  <div className="button-cancel">
                    <NavLink
                      type="button"
                      to="/"
                      className="btn btn-neutral rounded-xl"
                      aria-pressed="true"
                    >
                      Cancel
                    </NavLink>
                  </div>
                  <div className="button-update-create">
                    <button
                      type="button"
                      className="btn btn-warning rounded-xl"
                      aria-pressed="true"
                      onClick={editButton}
                    >
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
