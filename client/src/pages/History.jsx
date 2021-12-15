import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {fetchingHistories} from '../store/actions/index'

export default function History() {
  const dispatch = useDispatch();
  const histories = useSelector((state) => state.histories);

  useEffect(() => {
    dispatch(fetchingHistories());
  }, [dispatch]);

  const dateFormater = (tanggal) => {
    return new Date(tanggal).toLocaleString()
  }

  return (
    <div className="flex flex-col mx-5 bg-neutral rounded-lg shadow-md">
      <div className="-my-5 overflow-x-auto sm:-mx-6 lg:-mx-5">
        <div className="py-5 align-middle inline-block min-w-full sm:px-6 lg:px-5">
          <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-500 text-left">
              <thead className="bg-accent-content">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    no
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    riwayat
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    oleh
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Pada Tanggal
                  </th>
                </tr>
              </thead>
              <tbody className="bg-base-300 divide-y divide-gray-700 text-left">
                {histories.map((history, index) => {
                  return (
                    <tr key={history.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{index + 1}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{history.riwayat}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          {history.User.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">
                          {dateFormater(history.createdAt)}
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
