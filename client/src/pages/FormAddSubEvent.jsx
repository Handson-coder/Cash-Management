import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { addingSubEvent, fetchingEvents } from "../store/actions";
import Swal from "sweetalert2";

export default function FormAddSubEvent() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [payload, setPayload] = useState({
    keterangan: "",
    unit: "",
    price: 0,
    qty: 0,
    EventId: 1,
  });
  const events = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchingEvents());
  }, [dispatch]);

  const createButton = () => {
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
          unit: "",
          price: 0,
          qty: 0,
          EventId: 0,
        });
        navigate(`/event/${payload.EventId}`);
        setPayload({
          keterangan: "",
          unit: "",
          price: 0,
          qty: 0,
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
          unit: "",
          price: 0,
          qty: 0,
          EventId: 0,
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
            Create Sub-Event
          </h1>
        </div>
        <div className="bg-base-100">
          <div className="flex-col justify-center hero-content lg:flex-row">
            <div className="card flex-shrink-0 shadow-2xl bg-base-200">
              <div className="card-body form-nya">
                <div className="form-control mt-5">
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
                    <span className="font-bold">Satuan</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Satuan"
                    className="input border-neutral-focus input-bordered "
                    onChange={(e) => inputValue(e, "unit")}
                    value={payload.unit}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="font-bold">Price</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input border-neutral-focus input-bordered "
                    onChange={(e) => inputValue(e, "price")}
                    value={payload.price}
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="font-bold">Volume</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input border-neutral-focus input-bordered "
                    onChange={(e) => inputValue(e, "qty")}
                    value={payload.qty}
                  />
                </div>
                <div>
                  <label className="label">
                    <span className="label-text font-bold">Event</span>
                  </label>
                  <select
                    className="select select-bordered select-neutral-focus w-full max-w-lg"
                    onChange={(e) => inputValue(e, "EventId")}
                  >
                    <option disabled="disabled">Choose Product Category</option>
                    {events.map((event) => {
                      return (
                        <option key={event.id} value={event.id}>
                          {event.keterangan}
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div className="mt-5 seperate">
                  <div className="button-cancel">
                    <NavLink
                      type="button"
                      to={`/`}
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
