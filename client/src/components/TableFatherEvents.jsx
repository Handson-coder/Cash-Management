import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import {
  deleteFatherEvent,
  deletingFatherEvent,
  fetchingFatherEvents,
  setCurrentBalance,
} from "../store/actions/index.js";
import infoIcon from "../assets/info.png";
import deleteIcon from "../assets/delete.png";
import editIcon from "../assets/edit.png";
import Swal from "sweetalert2";
import Home from "../pages/Home.jsx";

export default function TableFatherEvents() {
  const dispatch = useDispatch();
  const fatherEvents = useSelector((state) => state.fatherEvents);
  const classNameForFullView =
    "flex flex-col mx-5 bg-neutral rounded-lg shadow-md container-full-view";

  useEffect(() => {
    dispatch(fetchingFatherEvents());
  }, [dispatch]);

  const deleteButton = (id) => {
    dispatch(deletingFatherEvent(id))
      .then(({ data }) => {
        dispatch(deleteFatherEvent(data.id));
        dispatch(setCurrentBalance(data.cash))
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
        <div className="font-mono pb-4" hidden>
          <NavLink
            className="btn bg-accent text-black font-extralight hover:bg-accent-focus hover:text-blue-900"
            to="/add/father-event"
          >
            Tambahkan Father Event
          </NavLink>
        </div>
      </div>
      <div
        className={
          fatherEvents.length > 5
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
                  {fatherEvents.map((fatherEvent) => {
                    return (
                      <tr key={fatherEvent.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">{fatherEvent.kode}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            {fatherEvent.keterangan}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">
                            {fatherEvent.jumlahBiaya.toLocaleString("id-id")}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex button-option">
                            <div>
                              <NavLink
                                to={`father-event/${fatherEvent.id}`}
                                className="btn bg-base-100 hover:bg-base-300"
                              >
                                <img src={infoIcon} alt="" />
                              </NavLink>
                            </div>
                            <div hidden>
                              <NavLink
                                to={`edit/father-event/${fatherEvent.id}`}
                                className="btn bg-base-100 hover:bg-base-300"
                              >
                                <img src={editIcon} alt="" />
                              </NavLink>
                            </div>
                            <div>
                              <button
                                className="btn bg-base-100 hover:bg-base-300"
                                onClick={() => deleteButton(fatherEvent.id)}
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
