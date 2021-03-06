import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentBalance,
  fetchingCash,
  uploadingEvents,
  downloadingFile,
  fetchFatherEvents
} from "../store/actions/index.js";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

export default function Home() {
  const dispatch = useDispatch();
  const currentBalance = useSelector((state) => state.currentBalance);
  useEffect(() => {
    dispatch(fetchingCash());
  }, [dispatch]);

  // const uploadFileExcel = (e) => {
  //   Swal.fire({
  //     position: "top-end",
  //     icon: "info",
  //     title: `Loading ...`,
  //     text: "Uploading Realisasi Anggaran ...",
  //     showConfirmButton: false,
  //     timer: 1500,
  //   });
  //   const fileFromInput = e.target.files[0];
  //   if (fileFromInput) {
  //     const promise = new Promise((resolve, reject) => {
  //       const fileReader = new FileReader();
  //       // let datag = new Uint8Array(fileReader);
  //       // console.log(datag, 'datag');
  //       // const workbook = XLSX.read(datag, {type: 'array'});
  //       // console.log(workbook, 'workbook');
  //       fileReader.readAsArrayBuffer(fileFromInput);
  //       fileReader.onload = (e) => {
  //         const bufferArray = e.target.result;
  //         const wb = XLSX.read(bufferArray, { type: "buffer" });
  //         const wsname = wb.SheetNames[0];
  //         let ws = wb.Sheets[wsname];
  //         // ws["!margins"] = {
  //         //   bottom: 0.277777777777778,
  //         //   footer: 0.511811023622047,
  //         //   header: 0.511811023622047,
  //         //   left: 0.277777777777778,
  //         //   right: 0.277777777777778,
  //         //   top: 0.277777777777778,
  //         // };
  //         const data = XLSX.utils.sheet_to_json(ws);
  //         resolve(data);
  //       };
  //       fileReader.onerror = (error) => {
  //         reject(error);
  //       };
  //     });
  //     promise.then((data) => {
  //       if (data[0].Kode) {
  //         dispatch(uploadingEvents(data))
  //           .then((res) => {
  //             if (res.data.message && res.data.events && res.data.histories) {
  //               let histories = res.data.histories;
  //               if (histories && histories.length > 0) {
  //                 let today = new Date().toDateString()
  //                 let newWB = XLSX.utils.book_new();
  //                 let newWS = XLSX.utils.json_to_sheet(histories);
  //                 XLSX.utils.book_append_sheet(
  //                   newWB,
  //                   newWS,
  //                   "Riwayat Tindakan"
  //                 );
  //                 XLSX.writeFile(newWB, `Riwayat Realisasi Anggaran (${today}).xlsx`);
  //               }
  //               dispatch(fetchCash(res.data.cash));
  //               dispatch(fetchEvents(res.data.events));
  //               setUploadStatus(true);
  //               Swal.fire({
  //                 position: "top-end",
  //                 icon: "success",
  //                 title: res.data.message,
  //                 showConfirmButton: false,
  //                 timer: 1500,
  //               });
  //             }
  //           })
  //           .catch((err) => {
  //             Swal.fire({
  //               icon: "error",
  //               title: "Oops...",
  //               text: `${err.response.data.message}`,
  //             });
  //           });
  //       } else {
  //         Swal.fire({
  //           icon: "error",
  //           title: "Oops...",
  //           text: `Gagal upload Realisasi Anggaran, Silahkan check kembali format Excel dengan benar`,
  //         });
  //       }
  //     });
  //   }
  // };

  const uploadFileExcel = (e) => {
    Swal.fire({
      position: "top-end",
      icon: "info",
      title: `Loading ...`,
      text: "Uploading Realisasi Anggaran ...",
      showConfirmButton: false,
      timer: 1500,
    });
    const oFile = e.target.files[0];

    const reader = new FileReader();

    reader.onload = function (e) {
      let data = e.target.result;
      data = new Uint8Array(data);
      const workbook = XLSX.read(data, { type: "array" });
      // console.log(workbook, 'workbook');
      const result = {};
      workbook.SheetNames.forEach(function (sheetName) {
        const roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
        });
        if (roa.length) result[sheetName] = roa;
      });
      const {
        Penindakan = []
      } = result
      if (Penindakan) {
        dispatch(uploadingEvents(Penindakan)).then((res) => {
          if(res && res.status === 201 && res.statusText === "Created") {
            dispatch(setCurrentBalance(res.data.cash));
            dispatch(fetchFatherEvents(res.data.fatherEvents))
            Swal.fire({
              position: "top-end",
              icon: "success",
              title: res.data.message,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
      }
    };
    reader.readAsArrayBuffer(oFile);
  };

  const downloadExcel = () => {
    dispatch(downloadingFile())
      .then(({ data }) => {
        let histories = data[1];
        let newWB = XLSX.utils.book_new();
        let today = new Date().toDateString();
        const fileName = `Realiasi Anggaran (${today}).xlsx`;
        if (data && histories && histories.length > 0) {
          const sheetName = ["Realiasi Anggaran", "Riwayat Realisasi Anggaran"];
          for (let l = 0; l < sheetName.length; l++) {
            let newWS = XLSX.utils.json_to_sheet(data[l]);
            XLSX.utils.book_append_sheet(newWB, newWS, sheetName[l]);
          }
          XLSX.writeFile(newWB, fileName);
        } else {
          let newWS = XLSX.utils.json_to_sheet(data.data);
          XLSX.utils.book_append_sheet(newWB, newWS, "Realisasi Anggaran");
          XLSX.writeFile(newWB, fileName);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };
  return (
    <div className="full-view">
      <div className="pb-4 pt-4 header-cash">
        <div className="pt-11 pb-11 text-sm font-mono">
          <label className="w-64 h-11 flex flex-col items-center px-1 py-2 bg-accent rounded-md shadow-md tracking-wide uppercase border border-blue cursor-pointer hover:bg-accent-focus hover:text-blue-900 bg-accent text-black ease-linear transition-all duration-150">
            <i className="fas fa-cloud-upload-alt fa-3x"></i>
            <span className="pt-1 text-center leading-normal">Upload DIPA</span>
            <input
              type="file"
              className="hidden"
              onChange={(e) => uploadFileExcel(e)}
            />
          </label>
        </div>
        <div className="header-cash-child bg-base-200 pt-3 pb-3 border-double border-4 border-black rounded-lg">
          <div className="current-balance">
            <div>
              <div className="text-2xl font-mono pb-3">Anggaran Saat Ini</div>
              {
                currentBalance ? (
                  <div className="text-2xl font-mono current-balance">
                    {currentBalance.toLocaleString("id-id")}
                  </div>
                ) : (
                  <div className="text-2xl font-mono current-balance">
                    0
                  </div>
                )
              }
            </div>
          </div>
        </div>
        <div className="font-mono pt-11 pb-11">
          <button
            className="btn bg-accent text-black font-extralight hover:bg-accent-focus hover:text-blue-900"
            onClick={() => downloadExcel()}
          >
            Download Realisasi Anggaran
          </button>
        </div>
      </div>
    </div>
  );
}
