import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import {
  creatingFatherEvent,
  fetchingCash,
} from "../store/actions/index";
import Swal from "sweetalert2";

export default function FormAddFatherEvent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cash = useSelector((state) => state.cash);
  const [nominalEditDisplay, setNominalEditDisplay] = useState("");
  const [payload, setPayload] = useState({
    kode: "",
    keterangan: "",
    anggaranAwal: 0,
    CashId: 0,
  });

  useEffect(() => {
    dispatch(fetchingCash());
  }, [dispatch]);

  const changeIntoMoneyFormat = (money) => {
    let currentMoney = money;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(currentMoney);
  };
  const changeNominalEdit = (e) => {
    setNominalEditDisplay(changeIntoMoneyFormat(e.target.value));
  };

  const createButton = () => {
    Swal.fire({
      position: "top-end",
      icon: "info",
      title: `Loading ...`,
      text: "Please Wait ...",
      showConfirmButton: false,
      timer: 1500,
    });
    if (payload.CashId === 0) {
      payload.CashId = 1;
    }
    dispatch(creatingFatherEvent(payload))
      .then(({ data }) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Father Event '${data.keterangan}' telah berhasil dibuat`,
          showConfirmButton: false,
          timer: 1500,
        });
        setPayload({
          kode: "",
          keterangan: "",
          anggaranAwal: 0,
          CashId: 0,
        });
        navigate("/");
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${err.response.data.message}`,
        });
        setPayload({
          kode: "",
          keterangan: "",
          anggaranAwal: 0,
          CashId: 0,
        });
      });
  };

  const inputValue = (e, key) => {
    if (key === "anggaranAwal") {
      changeNominalEdit(e);
    }
    const newPayload = { ...payload };
    newPayload[key] = e.target.value;
    setPayload(newPayload);
  };

  return (
    <div
      className="form-parent container-full-view"
    >
      <div className="form-container">
        <div className="text-center justify-center lg:text-left bg-blue-900">
          <h1 className="mt-3 mb-1 xs:mb-1 xs:mt-1 text-4xl xs:text-xl font-bold italic text-accent uppercase bg-blue-900">
            Add Parent Event
          </h1>
        </div>
        <div className="bg-blue-900">
          <div className="flex-col justify-center hero-content lg:flex-row">
            <div className="card flex-shrink-0 shadow-2xl bg-base-200">
              <div className="card-body form-nya">
                <div className="">
                  <label className="label">
                    <span className="font-bold">Main Event</span>
                  </label>
                  <select
                    className="select select-bordered select-neutral-focus w-full max-w-lg"
                    onChange={(e) => inputValue(e, "CashId")}
                  >
                    <option>Choose Main Event</option>
                    {cash.map((cash) => {
                      return (
                        <option key={cash.id} value={cash.id}>
                          {cash.kode} - {cash.keterangan}
                        </option>
                      );
                    })}
                  </select>
                </div>
                {
                  payload.CashId && payload.CashId !== 0 && payload.CashId !== 'Choose Main Event' ? (
                    <div>
                      <div className="form-control">
                        <label className="label">
                          <span className="font-bold">Kode</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Kode"
                          className="input border-neutral-focus input-bordered "
                          onChange={(e) => inputValue(e, "kode")}
                          value={payload.kode}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="font-bold">Keterangan</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Keterangan"
                          className="input border-neutral-focus input-bordered"
                          onChange={(e) => inputValue(e, "keterangan")}
                          min="0"
                          value={payload.keterangan}
                        />
                      </div>
                      <div className="form-control">
                        <label className="label">
                          <span className="font-bold">Anggaran Awal</span>
                          <span className="label-text font-style: italic text-gray-700">
                            Nominal : {nominalEditDisplay}
                          </span>
                        </label>
                        <input
                          type="number"
                          placeholder="Anggaran Awal"
                          className="input border-neutral-focus input-bordered"
                          onChange={(e) => inputValue(e, "anggaranAwal")}
                          value={payload.anggaranAwal}
                        />
                      </div>
                    </div>
                  ) : <div></div>
                }
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
                      onClick={createButton}
                    >
                      Create
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
