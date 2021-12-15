import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addingCash,
  editingCash,
  fetchCash,
  fetchingCash,
} from "../store/actions/index.js";
import TableEvents from "../components/TableEvents.jsx";
import addIcon from "../assets/add.png";
import editIcon from "../assets/edit.png";
import confirmIcon from "../assets/confirm.png";
import Swal from "sweetalert2";

export default function Home() {
  const dispatch = useDispatch();
  const cash = useSelector((state) => state.cash);
  const [openModalEditCash, setOpenModalEditCash] = useState(false);
  const [openModalAddCash, setOpenModalAddCash] = useState(false);
  const [nominalToEditCash, setNominalToEditCash] = useState(0);
  const [nominalToAddCash, setNominalToAddCash] = useState(0);
  const [nominalEditDisplay, setNominalEditDisplay] = useState("");
  const [nominalAddDisplay, setNominalAddDisplay] = useState("");

  useEffect(() => {
    dispatch(fetchingCash());
  }, [dispatch]);

  const changeIntoMoney = (money) => {
    let moneyDividedBy1000 = money / 1000
    return moneyDividedBy1000.toLocaleString()
};

  const editCash = () => {
    dispatch(editingCash(nominalToEditCash))
      .then(({ data }) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Kas telah berhasil di Edit menjadi ${changeIntoMoney(data.cash)} K`,
          showConfirmButton: false,
          timer: 1500,
        });
        dispatch(fetchCash(data.cash));
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${err.response.data.message}`,
        });
      });
    setNominalToEditCash(0);
  };

  const addCash = () => {
    dispatch(addingCash(nominalToAddCash))
      .then(({ data }) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Kas telah berhasil ditambahkan menjadi ${changeIntoMoney(data.cash)} K`,
          showConfirmButton: false,
          timer: 1500,
        });
        dispatch(fetchCash(data.cash));
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${err.response.data.message}`,
        });
      });
    setNominalToAddCash(0);
  };

  const closeModalEdit = () => {
    setOpenModalEditCash(false);
    setNominalToEditCash(0);
  };

  const closeModalAdd = () => {
    setOpenModalAddCash(false);
    setNominalToAddCash(0);
  };

  const changeIntoMoneyFormat = (money) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(money);
  };

  const changeNominalEdit = (e) => {
    setNominalToEditCash(e.target.value);
    setNominalEditDisplay(changeIntoMoneyFormat(e.target.value));
  };

  const changeNominalAdd = (e) => {
    setNominalToAddCash(e.target.value);
    setNominalAddDisplay(changeIntoMoneyFormat(e.target.value));
  };

  return (
    <div>
      <div className="pb-2 pt-2 header-cash">
        <div className="header-cash-child bg-base-200 pt-3 pb-3 border-double border-4 border-black rounded-lg">
          <div className="current-balance pb-5">
            <div className="text-2xl font-mono">
              Cash = {(cash / 1000).toLocaleString("id-id")} K
            </div>
          </div>
          <div className="flex button-option">
            <div>
              <button
                className="btn bg-base-100 hover:bg-base-300"
                onClick={() => setOpenModalEditCash(true)}
              >
                <img src={editIcon} alt="" />
              </button>
            </div>
            <div>
              <button
                className="btn bg-base-100 hover:bg-base-300"
                onClick={() => setOpenModalAddCash(true)}
              >
                <img src={addIcon} alt="" />
              </button>
            </div>
          </div>
          {openModalEditCash === true ? (
            <div className="form-control pt-5 pl-4 pr-4">
              <label className="label">
                <span className="label-text font-style: italic text-gray-700">
                  Nominal to Edit : {nominalEditDisplay}
                </span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="0"
                  className="w-full input input-primary input-bordered"
                  onChange={(e) => changeNominalEdit(e)}
                  value={nominalToEditCash}
                />
                <button
                  className="btn bg-base-100 hover:bg-base-300"
                  onClick={() => editCash()}
                >
                  <img src={confirmIcon} alt="" className="w-6" />
                </button>
                <button
                  className="btn bg-base-100 hover:bg-base-300 text-black"
                  onClick={() => closeModalEdit()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-6 h-6 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          {openModalAddCash === true ? (
            <div className="form-control pt-5 pl-4 pr-4">
              <label className="label">
                <span className="label-text font-style: italic text-gray-700">
                  Nominal to Add : {nominalAddDisplay}
                </span>
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  min="0"
                  className="w-full input input-primary input-bordered"
                  onChange={(e) => changeNominalAdd(e)}
                  value={nominalToAddCash}
                />
                <button
                  className="btn bg-base-100 hover:bg-base-300"
                  onClick={() => addCash()}
                >
                  <img src={confirmIcon} alt="" className="w-6" />
                </button>
                <button
                  className="btn bg-base-100 text-black hover:bg-base-300"
                  onClick={() => closeModalAdd()}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    className="inline-block w-6 h-6 stroke-current"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      <TableEvents></TableEvents>
    </div>
  );
}
