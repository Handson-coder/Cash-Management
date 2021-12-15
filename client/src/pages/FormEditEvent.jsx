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
  const event = useSelector((state) => state.event);
  const [payload, setPayload] = useState({
    kode: "",
    keterangan: "",
  });
  useEffect(() => {
    firstRender() // eslint-disable-next-line
  }, [dispatch]);

  const firstRender = async () => {
    await dispatch(fetchingEvent(params.id));
    await setPayload({
      kode: event.kode,
      keterangan: event.keterangan
    }) 
  }

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
          keterangan: ""
        })
        navigate('/')
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
    const newPayload = { ...payload };
    newPayload[key] = e.target.value;
    setPayload(newPayload);
  };

  return (
    <div className="form-parent">
      <div className="form-container">
        <div className="text-center justify-center hero-content lg:text-left">
          <h1 className="mb-4 mt-4 xs:mb-1 xs:mt-1 text-4xl xs:text-xl font-bold italic text-neutral-focus uppercase">
            Edit Event
          </h1>
        </div>
        <div className="bg-base-100">
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
                    value={payload.kode ? payload.kode : event.kode ? event.kode : ""}
                  />
                </div>
                <div className="form-control mt-5">
                  <label className="label">
                    <span className="font-bold">Keterangan</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Keterangan"
                    className="input border-neutral-focus input-bordered"
                    onChange={(e) => inputValue(e, "keterangan")}
                    value={payload.keterangan ? payload.keterangan : event.keterangan ? event.keterangan : ""}
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
