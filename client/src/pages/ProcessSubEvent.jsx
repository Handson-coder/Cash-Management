import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchingSubEvent, processSubEvent } from "../store/actions/index.js";
import Swal from "sweetalert2";

export default function ProcessSubEvent() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const subEvent = useSelector((state) => state.subEvent);
  const [jumlahBiaya, setJumlahBiaya] = useState(0);

  useEffect(() => {
    firstRender(); // eslint-disable-next-line
  }, [dispatch]);

  const firstRender = async () => {
    await dispatch(fetchingSubEvent(params.id));
  };

  const changeJumlahBiaya = (e) => {
    setJumlahBiaya(e.target.value);
  };

  const executeButton = () => {
    Swal.fire({
      position: "top-end",
      icon: "info",
      title: `Loading ...`,
      text: "Please Wait ...",
      showConfirmButton: false,
      timer: 1500,
    });
    if(Number(jumlahBiaya) > 0) {
      dispatch(processSubEvent(jumlahBiaya, params.id))
      .then(({ data }) => {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: `Rp. ${jumlahBiaya.toLocaleString("id-id")} dari ${
            data.result.keterangan
          } ${data.message}`,
          showConfirmButton: false,
          timer: 1500,
        });
        navigate(`/event/${data.result.EventId}`);
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: `${err.response.data.message}`,
        });
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: `Jumlah biaya tidak boleh kurang dari 0`,
      });
    }
  };

  const changeIntoMoneyFormat = (money) => {
    let currentMoney = money;
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(currentMoney);
  };

  return (
    <div className="form-parent container-full-view">
      <div className="form-container">
        <div className="text-center justify-center hero-content lg:text-left">
          {subEvent && subEvent.jumlahBiaya && (
            <h1 className="mb-4 mt-4 xs:mb-1 xs:mt-1 text-4xl xs:text-xl font-bold italic text-accent uppercase">
              Anggaran tersisa : {changeIntoMoneyFormat(subEvent.jumlahBiaya)}
            </h1>
          )}
        </div>
        <div className="background-color-nih">
          <div className="flex-col justify-center hero-content lg:flex-row">
            <div className="card flex-shrink-0 shadow-2xl bg-base-200">
              <div className="card-body form-nya-subEvent">
                <div className="form-control">
                  <label className="label">
                    <span className="font-bold">
                      Biaya yang ingin digunakan = {changeIntoMoneyFormat(jumlahBiaya)}
                    </span>
                  </label>
                  {subEvent && subEvent.jumlahBiaya && (
                    <input
                      type="number"
                      min="0"
                      max={subEvent.jumlahBiaya}
                      className="input border-neutral-focus input-bordered "
                      onChange={(e) => changeJumlahBiaya(e)}
                      value={jumlahBiaya}
                    />
                  )}
                </div>
                <div className="mt-5 seperate">
                  <div className="button-cancel">
                    <NavLink
                      type="button"
                      to={`/event/${subEvent.EventId}`}
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
                      onClick={executeButton}
                    >
                      Execute
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
