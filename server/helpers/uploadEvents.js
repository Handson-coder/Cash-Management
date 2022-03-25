const { Event, Cash, FatherEvent, ChildEvent } = require("../models");

const uploadEvents = async (data, next) => {
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
  let obj = {
    cash: 0,
    datas: [],
  };
  try {
    if(data[1][0].includes("U15")) {
      cashCreated = await Cash.create({
        kode: data[1][0],
        keterangan: data[1][1],
        cash: data[1][4],
        anggaranAwal: data[1][4],
        anggaranTerpakai: 0,
      });
      obj.cash = cashCreated.cash;
      cashId = cashCreated.id;
    }
    let newData = data.slice(2)
    for (let i = 0; i < newData.length; i++) {
      let dataEvent = {
        kode: "",
        keterangan: "",
        anggaranAwal: 0,
        jumlahBiaya: 0,
        ChildEventId: 0,
        anggaranTerpakai: 0,
      };
      if (
        newData[i][0] !== null &&
        isNaN(Number(newData[i][0])) === false &&
        !newData[i][2] &&
        !newData[i][3] &&
        !newData[i][5]
      ) {
        fatherEventCreated = await FatherEvent.create({
          kode: newData[i][0],
          keterangan: newData[i][1],
          jumlahBiaya: newData[i][4],
          anggaranAwal: newData[i][4],
          anggaranTerpakai: 0,
          CashId: cashId,
        });
        fatherEventId = fatherEventCreated.id;
      } else {
        if (
          newData[i][0] !== null &&
          newData[i].length > 0 &&
          isNaN(Number(newData[i][0])) &&
          !newData[i][2] &&
          !newData[i][3] &&
          !newData[i][5]
        ) {
          childEventCreated = await ChildEvent.create({
            kode: newData[i][0],
            keterangan: newData[i][1],
            jumlahBiaya: newData[i][4],
            anggaranAwal: newData[i][4],
            anggaranTerpakai: 0,
            FatherEventId: fatherEventId,
          });
          childEventId = childEventCreated.id;
        } else {
          if (
            newData[i][0] !== null &&
            isNaN(Number(newData[i][0])) === false &&
            !newData[i][2] &&
            !newData[i][3] && 
            newData[i][5] &&
            newData[i][5] === 'RM'
          ) {
            dataEvent.kode = newData[i][0];
            dataEvent.keterangan = newData[i][1];
            dataEvent.jumlahBiaya = newData[i][4];
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
          } 
          else if (
            newData[i][0] === null &&
            newData[i][2] &&
            newData[i][3]
          ) {
            // let volume = newData[i].Volume.split(" ");
            // let qty = +volume[0];
            // let unit = volume[1];
            obj.datas[obj.datas.length - 1].SubEvents.push({
              keterangan: newData[i][1],
              jumlahBiaya: newData[i][4],
              anggaranAwal: newData[i][4],
              anggaranTerpakai: 0,
              // qty,
              // unit,
              // price: newData[i]["Harga Satuan"],
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
    return obj;
  } catch (err) {
    next(err);
  }
};

module.exports = uploadEvents;
