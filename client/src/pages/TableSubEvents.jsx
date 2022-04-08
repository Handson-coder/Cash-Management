import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchingSubEvents,
  fetchingEvent,
  deletingSubEvent,
  deleteSubEvent,
} from "../store/actions/index.js";
import addIcon from "../assets/add.png";
import deleteIcon from "../assets/delete.png";
import editIcon from "../assets/edit.png";
import processIcon from "../assets/process.png";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";

export default function TableSubEvents() {
  const params = useParams();
  const dispatch = useDispatch();
  const subEvents = useSelector((state) => state.subEvents);
  const eventForTableSubEvent = useSelector(
    (state) => state.eventForTableSubEvent
  );

  const classNameForFullView = "container-full-view mx-5"

  useEffect(() => {
    dispatch(fetchingEvent(params.id));
    dispatch(fetchingSubEvents(params.id)); // eslint-disable-next-line
  }, [dispatch]);

  const deleteButton = (id) => {
    dispatch(deletingSubEvent(id))
      .then(({ data }) => {
        dispatch(deleteSubEvent(data.id));
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
      className={subEvents.length > 4 ? "pb-7 mx-5" : classNameForFullView}
    >
      <div className="header-table-subEvent">
        <h1 className="mb-4 mt-4 xs:mb-1 xs:mt-1 text-4xl xs:text-xl font-bold italic text-accent uppercase">
          {eventForTableSubEvent.keterangan
            ? eventForTableSubEvent.keterangan
            : ""}
        </h1>
        <div className="pt-3 pl-5" hidden>
          <NavLink
            className="btn bg-base-100 hover:bg-base-300"
            to={`/add/sub-event/${eventForTableSubEvent.id}`}
          >
            <img src={addIcon} alt="" />
          </NavLink>
        </div>
      </div>
      <div className="flex flex-col mx-5 bg-neutral rounded-lg shadow-md">
        <div className="-my-5 overflow-x-auto sm:-mx-6 lg:-mx-5">
          <div className="py-5 align-middle inline-block min-w-full">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-500 text-center ">
                <thead className="bg-base-content">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      keterangan
                    </th>
                    {/* <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      volume
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      harga satuan
                    </th> */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider"
                    >
                      anggaran tersisa
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
                  {subEvents.map((subEvent) => {
                    return (
                      <tr key={subEvent.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">{subEvent.keterangan}</div>
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            {subEvent.qty} {subEvent.unit}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            {subEvent.price.toLocaleString("id-id")}
                          </div>
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            <div className="text-sm">
                              {subEvent.jumlahBiaya.toLocaleString("id-id")}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex button-option">
                            <div>
                              <NavLink
                                to={`/sub-event/${subEvent.id}`}
                                className="btn bg-base-100 hover:bg-base-300"
                              >
                                <img src={processIcon} alt="" />
                              </NavLink>
                            </div>
                            <div hidden>
                              <NavLink
                                to={`/sub-event/edit/${subEvent.id}`}
                                className="btn bg-base-100 hover:bg-base-300"
                              >
                                <img src={editIcon} alt="" />
                              </NavLink>
                            </div>
                            <div hidden>
                              <button
                                className="btn bg-base-100 hover:bg-base-300"
                                onClick={() => deleteButton(subEvent.id)}
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
    </div>
  );
}
