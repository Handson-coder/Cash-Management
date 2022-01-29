import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  fetchingEvents,
  deletingEvent,
  deleteEvent,
  fetchingCash,
} from "../store/actions/index.js";
import infoIcon from "../assets/info.png";
import deleteIcon from "../assets/delete.png";
import editIcon from "../assets/edit.png";
import Swal from "sweetalert2";

export default function TableEvents({ uploadStatus }) {
  const dispatch = useDispatch();
  const events = useSelector((state) => state.events);
  const [finishFetching, setFinishFetching] = useState(false);
  const [finishProcessEvent, setFinishProcessEvent] = useState(false);

  const classNameForFullView = "flex flex-col mx-5 bg-neutral rounded-lg shadow-md container-full-view"

  useEffect(() => {
    dispatch(fetchingEvents());
  }, [dispatch]);

  if (
    (uploadStatus === true && finishFetching === false) ||
    finishProcessEvent === true
  ) {
    dispatch(fetchingEvents());
    setFinishFetching(true);
    setFinishProcessEvent(false);
  }

  const deleteButton = (id) => {
    dispatch(deletingEvent(id))
      .then(({ data }) => {
        dispatch(deleteEvent(data.id));
        dispatch(fetchingCash())
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: data.message,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${err.response.data.message}`,
        });
      });
  };

  return (
    <div
      className={
        events.length > 4
          ? "flex flex-col mx-5 rounded-lg shadow-md pb-4 background-color-nih"
          : classNameForFullView
      }
    >
      <div className="-my-5 overflow-x-auto sm:-mx-6 lg:-mx-5">
        <div className="py-5 align-middle inline-block min-w-full sm:px-6 lg:px-5">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-500 text-center">
              <thead className="bg-base-content">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    kode
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    keterangan
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    jumlah biaya
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Option
                  </th>
                </tr>
              </thead>
              <tbody className="bg-base-300 divide-y divide-gray-700">
                {events.map((event) => {
                  return (
                    <tr key={event.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {event &&
                          event.ChildEvent &&
                          event.ChildEvent.FatherEvent &&
                          event.ChildEvent.FatherEvent.kode && (
                            <div className="text-sm">{`${event.ChildEvent.FatherEvent.kode}-${event.ChildEvent.kode}-${event.kode}`}</div>
                          )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{event.keterangan}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          {event.jumlahBiaya.toLocaleString("id-id")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex button-option">
                          <div>
                            <NavLink
                              to={`event/${event.id}`}
                              className="btn bg-base-100 hover:bg-base-300"
                            >
                              <img src={infoIcon} alt="" />
                            </NavLink>
                          </div>
                          <div>
                            <NavLink
                              to={`edit/event/${event.id}`}
                              className="btn bg-base-100 hover:bg-base-300"
                            >
                              <img src={editIcon} alt="" />
                            </NavLink>
                          </div>
                          <div>
                            <button
                              className="btn bg-base-100 hover:bg-base-300"
                              onClick={() => deleteButton(event.id)}
                            >
                              <img src={deleteIcon} alt="" />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
