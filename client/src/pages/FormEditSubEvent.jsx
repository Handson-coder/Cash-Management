import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import {
  editingSubEvent,
  fetchingEvents,
  fetchingSubEvent,
  fetchSubEvent
} from "../store/actions";
import Swal from "sweetalert2";

export default function FormEditSubEvent() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [payload, setPayload] = useState({
    keterangan: "",
    unit: "",
    price: 0,
    qty: 0,
    EventId: 0,
  });
  const events = useSelector((state) => state.events);
  const subEvent = useSelector((state) => state.subEvent);

  useEffect(() => {
    firstRender() // eslint-disable-next-line
  }, [dispatch]);

  const firstRender = async () => {
    await dispatch(fetchingSubEvent(params.id));
    await setPayload({
      keterangan: subEvent.keterangan,
      unit: subEvent.unit,
      price: subEvent.price,
      qty: subEvent.qty,
      EventId: subEvent.EventId,
    });
    await dispatch(fetchingEvents());
  }

  const editButton = () => {
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
          unit: "",
          price: 0,
          qty: 0,
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
            Edit Sub-Event
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
                    value={
                      payload.keterangan
                        ? payload.keterangan
                        : subEvent.keterangan
                        ? subEvent.keterangan
                        : ""
                    }
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
                    value={
                      payload.unit
                        ? payload.unit
                        : subEvent.unit
                        ? subEvent.unit
                        : ""
                    }
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
                    value={
                      payload.price
                        ? payload.price
                        : subEvent.price
                        ? subEvent.price
                        : ""
                    }
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
                    value={
                      payload.qty
                        ? payload.qty
                        : subEvent.qty
                        ? subEvent.qty
                        : ""
                    }
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
