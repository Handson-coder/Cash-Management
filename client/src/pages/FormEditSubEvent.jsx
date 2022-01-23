import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import {
  editingSubEvent,
  fetchingSubEvent,
  fetchSubEvent,
} from "../store/actions";
import Swal from "sweetalert2";

export default function FormEditSubEvent() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const subEvent = useSelector((state) => state.subEvent);
  const fatherKode = useSelector((state) => state.fatherKode);
  const childKode = useSelector((state) => state.childKode);
  const eventKode = useSelector((state) => state.eventKode);
  const [payload, setPayload] = useState({
    keterangan: "",
    // unit: "",
    jumlahBiaya: 0,
    // qty: 0,
    EventId: 0,
  });
  const [nominalEditDisplay, setNominalEditDisplay] = useState("");
  useEffect(() => {
    firstRender(); // eslint-disable-next-line
  }, [dispatch]);

  const firstRender = async () => {
    await dispatch(fetchingSubEvent(params.id));
    await setPayload({
      keterangan: subEvent.keterangan,
      // unit: subEvent.unit,
      jumlahBiaya: subEvent.jumlahBiaya,
      // qty: subEvent.qty,
      EventId: subEvent.EventId,
    });
  };

  const editButton = () => {
    if(payload && payload.jumlahBiaya) {
      payload.jumlahBiaya = +(payload.jumlahBiaya)
    }
    dispatch(editingSubEvent(payload, params.id))
      .then(({ data }) => {
        dispatch(fetchSubEvent(data.result));
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        setPayload({
          keterangan: "",
          // unit: "",
          jumlahBiaya: 0,
          // qty: 0,
          EventId: 0,
        });
        navigate(`/event/${payload.EventId}`);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${err.response.data.message}`,
        });
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

  const inputValue = (e, key) => {
    if (key === "jumlahBiaya") {
      changeNominalEdit(e);
    }
    const newPayload = { ...payload };
    newPayload[key] = e.target.value;
    setPayload(newPayload);
  };

  const windowRefreshed = () => {
    if (!subEvent.keterangan) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Terdeteksi website anda telah mengalami refresh(reload), silahkan klik "Substansi Penindakan" untuk membuat sub-event kembali`,
      });
    }
  };

  return (
    <div className="form-parent bg-blue-900 container-full-view">
      <div className="form-container bg-blue-900">
        <div className="text-center justify-center lg:text-left bg-blue-900">
          <h1 className="mt-8 mb-8 xs:mb-1 xs:mt-1 text-4xl xs:text-xl font-bold italic text-accent uppercase bg-blue-900">
            Edit Sub-Event
          </h1>
        </div>
        <div className="bg-blue-900 mb-3">
          <div className="flex-col justify-center lg:flex-row">
            <div className="card flex-shrink-0 shadow-2xl bg-base-200">
              <div className="card-body form-nya">
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
                        : subEvent.keterangan
                        ? subEvent.keterangan
                        : ""
                    }
                  />
                </div>
                {/* <div className="form-control">
                  <label className="label">
                    <span className="font-bold">Satuan</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Satuan"
                    className="input border-neutral-focus input-bordered "
                    onChange={(e) => inputValue(e, "unit")}
                    value={
                      payload.unit
                        ? payload.unit
                        : subEvent.unit
                        ? subEvent.unit
                        : ""
                    }
                  />
                </div> */}
                <div className="form-control">
                  <label className="label">
                    <span className="font-bold">Anggaran</span>
                    <span className="label-text font-style: italic text-gray-700">
                      Nominal : {nominalEditDisplay}
                    </span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input border-neutral-focus input-bordered "
                    onChange={(e) => inputValue(e, "jumlahBiaya")}
                    value={
                      payload.jumlahBiaya
                        ? payload.jumlahBiaya
                        : subEvent.jumlahBiaya
                        ? subEvent.jumlahBiaya
                        : ""
                    }
                  />
                </div>
                {/* <div className="form-control">
                  <label className="label">
                    <span className="font-bold">Volume</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input border-neutral-focus input-bordered "
                    onChange={(e) => inputValue(e, "qty")}
                    value={
                      payload.qty
                        ? payload.qty
                        : subEvent.qty
                        ? subEvent.qty
                        : ""
                    }
                  />
                </div> */}
                <div>
                  <label className="label">
                    <span className="label-text font-bold">Event</span>
                  </label>
                  <input
                    type="text"
                    className="input border-neutral-focus input-bordered"
                    onChange={windowRefreshed}
                    value={
                      fatherKode && childKode && eventKode
                        ? fatherKode + "-" + childKode + "-" + eventKode
                        : ""
                    }
                  />
                </div>
                <div className="mt-5 seperate">
                  <div className="button-cancel">
                    <NavLink
                      type="button"
                      to={`/event/${payload.EventId}`}
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
