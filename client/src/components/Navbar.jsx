import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import logoIcon from "../assets/logo.jpeg";
import { logout, setIsLoggedIn, setUserLogin } from "../store/actions";
import historyIcon from "../assets/history.png";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.isLoggedIn);

  useEffect(() => {
    checkLocation(); // eslint-disable-next-line
  }, [dispatch]);

  const checkLocation = () => {
    if (window.location.href.includes("/login")) {
      dispatch(setIsLoggedIn(false));
      localStorage.clear();
    } else {
      if (localStorage.getItem("access_token") === null) {
        navigate("/login");
        dispatch(setIsLoggedIn(false));
      } else {
        dispatch(setIsLoggedIn(true));
      }
    }
  };

  const signOutButton = () => {
    const riwayat = "Seorang user terdeteksi telah log out";
    dispatch(logout(riwayat));
    dispatch(setIsLoggedIn(false));
    dispatch(setUserLogin({}));
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="navbar shadow-lg bg-success text-neutral-content rounded-lg">
      {isLoggedIn ? (
        <div className="px-2 mx-2 navbar-start flex">
          <NavLink
            to="/"
            className="border-2 border-base-content rounded-xl bg-neutral-content"
          >
            <img src={logoIcon} alt="" className="w-20 pb-1 pt-1 rounded-xl" />
          </NavLink>
          <NavLink to="/" className="btn btn-ghost btn-sm rounded-btn">
            <div>
              <p className="text-2xl font-birthstone italic">Substansi</p>
            </div>
            <div className="pl-2">
              <p className="text-2xl font-birthstone italic">Penindakan</p>
            </div>
          </NavLink>
        </div>
      ) : (
        <div className="px-2 mx-2 navbar-start flex border-primary-content">
          <div className="border-2 border-base-content rounded-xl bg-neutral-content">
            <img src={logoIcon} alt="" className="w-20 pb-1 pt-1 rounded-xl" />
          </div>
          <div className="pl-3">
            <div>
              <p className="text-2xl font-birthstone italic">Substansi</p>
            </div>
            <div>
              <p className="text-2xl font-birthstone italic">Penindakan</p>
            </div>
          </div>
        </div>
      )}
      <div className="hidden px-2 mx-2 navbar-center lg:flex">
        <div className="flex items-stretch">
          {isLoggedIn ? (
            <div className="pl-5 flex">
              <div className="pt-2">
                <NavLink
                  to="/add/event"
                  className="btn btn-ghost btn-sm rounded-btn"
                >
                  Tambahkan Event
                </NavLink>
              </div>
              <div className="pl-5">
                <NavLink
                  to="/history"
                  className="btn bg-success border-base-content hover:bg-green-700"
                >
                  <img src={historyIcon} alt="" />
                </NavLink>
              </div>
            </div>
          ) : (
            <div className="pl-5">
              <span className="text-2xl font-birthstone">Welcome</span>
            </div>
          )}
        </div>
      </div>
      <div className="navbar-end">
        <div className="px-5">
          {isLoggedIn && (
            <NavLink
              to="/profile/edit"
              className="btn btn-ghost btn-sm rounded-btn"
            >
              Edit Profile
            </NavLink>
          )}
        </div>
        <div className="px-5">
          {isLoggedIn ? (
            <button
              onClick={() => signOutButton()}
              className="btn btn-ghost btn-sm rounded-btn"
            >
              Sign Out
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
