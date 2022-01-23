const { Event, Cash, FatherEvent, ChildEvent } = require("../models");

const uploadEvents = async (data, next) => {
  console.log(data, "data di uploadEvent.js");
  let obj = {
    cash: 0,
    datas: [],
  };
  let cashCreated;
  let eventCreated;
  let fatherEventCreated;
  let childEventCreated;
  let cashId;
  let fatherEventId = 0;
  let childEventId = 0;
  // function isLower(str) {
  //   let counter = 0;
  //   for (let i = 0; i < str.length; i++) {
  //     if (str[i] !== " " && str[i].toLowerCase() === str[i]) {
  //       counter++;
  //     }
  //   }
  //   if (counter === 0) {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  try {
    for (let i = 0; i < data.length; i++) {
      let dataEvent = {
        kode: "",
        keterangan: "",
        anggaranAwal: 0,
        jumlahBiaya: 0,
        ChildEventId: 0,
        anggaranTerpakai: 0,
      };
      if (
        data[i] === data[0] &&
        data[i].Kode &&
        data[i].Kode.includes("U15") &&
        !data[i].Volume &&
        !data[i]["Harga Satuan"]
      ) {
        cashCreated = await Cash.create({
          kode: data[i].Kode,
          keterangan: data[i].Keterangan,
          cash: data[i].Jumlah,
          anggaranAwal: data[i].Jumlah,
          anggaranTerpakai: 0,
        });
        obj.cash = cashCreated.cash;
        cashId = cashCreated.id;
      } else {
        if (
          isNaN(Number(data[i].Kode)) === false &&
          !data[i].__EMPTY &&
          !data[i].Volume &&
          !data[i]["Harga Satuan"]
        ) {
          fatherEventCreated = await FatherEvent.create({
            kode: data[i].Kode,
            keterangan: data[i].Keterangan,
            jumlahBiaya: data[i].Jumlah,
            anggaranAwal: data[i].Jumlah,
            anggaranTerpakai: 0,
            CashId: cashId,
          });
          fatherEventId = fatherEventCreated.id;
        } else {
          if (
            isNaN(Number(data[i].Kode)) === true &&
            !data[i].__EMPTY &&
            !data[i].Volume &&
            !data[i]["Harga Satuan"]
          ) {
            childEventCreated = await ChildEvent.create({
              kode: data[i].Kode,
              keterangan: data[i].Keterangan,
              jumlahBiaya: data[i].Jumlah,
              anggaranAwal: data[i].Jumlah,
              anggaranTerpakai: 0,
              FatherEventId: fatherEventId,
            });
            childEventId = childEventCreated.id;
          } else {
            if (
              data[i].Kode &&
              data[i].Keterangan &&
              data[i].Jumlah &&
              !data[i].Volume &&
              !data[i]["Harga Satuan"]
            ) {
              dataEvent.kode = data[i].Kode;
              dataEvent.keterangan = data[i].Keterangan;
              dataEvent.jumlahBiaya = data[i].Jumlah;
              eventCreated = await Event.create({
                kode: dataEvent.kode,
                keterangan: dataEvent.keterangan,
                anggaranAwal: dataEvent.jumlahBiaya,
                jumlahBiaya: dataEvent.jumlahBiaya,
                anggaranTerpakai: 0,
                ChildEventId: childEventId,
              });
              obj.datas.push({
                id: eventCreated.id,
                kode: eventCreated.kode,
                keterangan: eventCreated.keterangan,
                anggaranAwal: eventCreated.anggaranAwal,
                jumlahBiaya: eventCreated.jumlahBiaya,
                ChildEventId: eventCreated.ChildEventId,
                anggaranTerpakai: eventCreated.anggaranTerpakai,
                SubEvents: [],
              });
            } else if (
              !data[i].Kode &&
              data[i].Keterangan &&
              data[i].Jumlah &&
              data[i].Volume &&
              data[i]["Harga Satuan"]
            ) {
              // let volume = data[i].Volume.split(" ");
              // let qty = +volume[0];
              // let unit = volume[1];
              obj.datas[obj.datas.length - 1].SubEvents.push({
                keterangan: data[i].Keterangan,
                jumlahBiaya: data[i].Jumlah,
                anggaranAwal: data[i].Jumlah,
                anggaranTerpakai: 0,
                // qty,
                // unit,
                // price: data[i]["Harga Satuan"],
              });
            }
            dataEvent = {
              kode: "",
              keterangan: "",
              anggaranAwal: 0,
              jumlahBiaya: 0,
              ChildEventId: 0,
              anggaranTerpakai: 0,
            };
          }
        }
      }
    }
    return obj;
  } catch (err) {
    console.log(err, "error di uploadEvents.js");
    next(err);
  }
};

module.exports = uploadEvents;
