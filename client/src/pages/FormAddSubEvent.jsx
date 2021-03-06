import React, { useState } from "react";
import { useParams } from "react-router";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { addingSubEvent } from "../store/actions";
import Swal from "sweetalert2";

export default function FormAddSubEvent() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [nominalEditDisplay, setNominalEditDisplay] = useState("");
  const [payload, setPayload] = useState({
    keterangan: "",
    jumlahBiaya: 0,
    EventId: 0,
  });

  const createButton = () => {
    if (params && params.eventId) {
      payload.EventId = params.eventId
    }
    if (payload.jumlahBiaya) {
      payload.jumlahBiaya = +payload.jumlahBiaya;
    }
    dispatch(addingSubEvent(payload))
      .then(({ data }) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: data.message,
          showConfirmButton: false,
          timer: 1500,
        });
        setPayload({
          keterangan: "",
          jumlahBiaya: 0,
          EventId: 0,
        });
        navigate(`/father-event/${params.fatherEventId}/child-event/${params.childEventId}/event/${params.eventId}`);
        setPayload({
          keterangan: "",
          jumlahBiaya: 0,
          EventId: 0,
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${err.response.data.message}`,
        });
        setPayload({
          keterangan: "",
          jumlahBiaya: 0,
          EventId: 0,
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

  return (
    <div className="form-parent container-full-view">
      <div className="form-container">
        <div className="text-center justify-center hero-content lg:text-left">
          <h1 className="mt-2 xs:mb-1 xs:mt-1 text-4xl xs:text-xl font-bold italic text-accent uppercase">
            Create Sub-Event
          </h1>
        </div>
        <div className="background-color-nih mb-2">
          <div className="flex-col justify-center hero-content lg:flex-row">
            <div className="card flex-shrink-0 shadow-2xl bg-base-200">
              <div className="card-body form-nya">
                <div className="form-control mb-2">
                  <label className="label">
                    <span className="font-bold">Keterangan</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Keterangan"
                    className="input border-neutral-focus input-bordered"
                    onChange={(e) => inputValue(e, "keterangan")}
                    value={payload.keterangan}
                  />
                </div>
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
                    className="input border-neutral-focus input-bordered"
                    onChange={(e) => inputValue(e, "jumlahBiaya")}
                    value={payload.jumlahBiaya}
                  />
                </div>
                <div className="mt-5 seperate">
                  <div className="button-cancel">
                    <NavLink
                      type="button"
                      to={`/father-event/${params.fatherEventId}/child-event/${params.childEventId}/event/${params.eventId}`}
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
