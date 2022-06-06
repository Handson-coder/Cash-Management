import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchingEvent,
  deletingSubEvent,
  deleteSubEvent,
  fetchingFatherEvent,
  findOneChildEvent,
  setCurrentBalance
} from "../store/actions/index.js";
import deleteIcon from "../assets/delete.png";
import editIcon from "../assets/edit.png";
import processIcon from "../assets/process.png";
import { NavLink } from "react-router-dom";
import Swal from "sweetalert2";
import Home from "../pages/Home.jsx";

export default function TableSubEvents() {
  const params = useParams();
  const dispatch = useDispatch();
  const fatherEvent = useSelector((state) => state.fatherEvent);
  const childEvent = useSelector((state) => state.childEvent);
  const event = useSelector((state) => state.event);
  const subEvents = useSelector((state) => state.subEvents);
  const classNameForFullView = "container-full-view mx-5";

  useEffect(() => {
    dispatch(fetchingFatherEvent(params.fatherEventId));
    dispatch(findOneChildEvent(params.childEventId));
    dispatch(fetchingEvent(params.eventId)); // eslint-disable-next-line
  }, [dispatch]);

  const deleteButton = (id) => {
    dispatch(deletingSubEvent(id))
      .then(({ data }) => {
        console.log(data, 'data');
        dispatch(setCurrentBalance(data.cash));
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
    <div>
      <Home></Home>
      <div className="grid justify-items-center">
        {fatherEvent &&
          childEvent &&
          event &&
          fatherEvent.kode &&
          childEvent.kode &&
          event.kode &&
          event.keterangan && (
            <div className="text-center justify-center lg:text-left bg-blue-900">
              <h1 className="mb-1 xs:mb-1 xs:mt-1 text-2xl xs:text-xl font-bold italic text-accent uppercase bg-blue-900">
                {`${fatherEvent.kode} - ${childEvent.kode} - ${event.kode} - ${event.keterangan}`}
              </h1>
            </div>
          )}
        {fatherEvent &&
          childEvent &&
          event &&
          fatherEvent.id &&
          childEvent.id &&
          event.id && (
            <div className="font-mono pt-4 pb-4" hidden>
              <NavLink
                className="btn bg-accent text-black font-extralight hover:bg-accent-focus hover:text-blue-900"
                to={`/add/father-event/${fatherEvent.id}/child-event/${childEvent.id}/event/${event.id}/sub-event`}
              >
                Tambahkan Sub Event
              </NavLink>
            </div>
          )}
      </div>
      <div
        className={subEvents.length > 5 ? "pb-7 mx-5" : classNameForFullView}
      >
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
                              <div>
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
    </div>
  );
}
