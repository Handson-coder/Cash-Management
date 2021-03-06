import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { fetchingEvent, updatingEvent } from "../store/actions/index.js";
import Swal from "sweetalert2";

export default function FormEditEvent() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const eventForEditEventPage = useSelector(
    (state) => state.eventForEditEventPage
  );
  const [payload, setPayload] = useState({
    kode: "",
    keterangan: "",
    anggaranAwal: 0,
  });
  const [nominalEditDisplay, setNominalEditDisplay] = useState("");
  useEffect(() => {
    firstRender(); // eslint-disable-next-line
  }, [dispatch]);

  const firstRender = async () => {
    await dispatch(fetchingEvent(params.id));
    await setPayload({
      kode: eventForEditEventPage.kode,
      keterangan: eventForEditEventPage.keterangan,
      anggaranAwal: eventForEditEventPage.anggaranAwal,
    });
  };

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

  const editButton = () => {
    Swal.fire({
      position: "top-end",
      icon: "info",
      title: `Loading ...`,
      text: "Please Wait ...",
      showConfirmButton: false,
      timer: 1500,
    });
    dispatch(updatingEvent(payload, params.id))
      .then(({ data }) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Event '${data.keterangan}' telah berhasil di Edit`,
          showConfirmButton: false,
          timer: 1500,
        });
        setPayload({
          kode: "",
          keterangan: "",
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

  const inputValue = (e, key) => {
    if (key === "anggaranAwal") {
      changeNominalEdit(e);
    }
    const newPayload = { ...payload };
    newPayload[key] = e.target.value;
    setPayload(newPayload);
  };

  return (
    <div className="form-parent container-full-view">
      <div className="form-container">
        <div className="text-center justify-center hero-content lg:text-left">
          <h1 className="mb-4 mt-4 xs:mb-1 xs:mt-1 text-4xl xs:text-xl font-bold italic text-accent uppercase">
            Edit Event
          </h1>
        </div>
        <div className="bg-blue-900">
          <div className="flex-col justify-center hero-content lg:flex-row">
            <div className="card flex-shrink-0 shadow-2xl bg-base-200">
              <div className="card-body form-nya">
                <div className="form-control">
                  <label className="label">
                    <span className="font-bold">Kode</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Kode"
                    className="input border-neutral-focus input-bordered "
                    onChange={(e) => inputValue(e, "kode")}
                    value={
                      payload.kode
                        ? payload.kode
                        : eventForEditEventPage.kode
                        ? eventForEditEventPage.kode
                        : ""
                    }
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
                    value={
                      payload.keterangan
                        ? payload.keterangan
                        : eventForEditEventPage.keterangan
                        ? eventForEditEventPage.keterangan
                        : ""
                    }
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
                    min="0"
                    onChange={(e) => inputValue(e, "anggaranAwal")}
                    value={
                      payload.anggaranAwal
                        ? payload.anggaranAwal
                        : eventForEditEventPage.anggaranAwal
                        ? eventForEditEventPage.anggaranAwal
                        : 0
                    }
                  />
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
