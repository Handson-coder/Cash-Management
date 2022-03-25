const {
  Cash,
  Event,
  SubEvent,
  History,
  FatherEvent,
  ChildEvent,
  User,
} = require("../models");
const uploadEvents = require("../helpers/uploadEvents");
const uploadSubEvents = require("../helpers/uploadSubEvents");
const changeIntoMoneyFormat = require("../helpers/moneyFormater");

class ControllerEvent {
  static async findAllEvents(req, res, next) {
    try {
      const result = await Event.findAll({
        order: [["id", "ASC"]],
        include: {
          model: ChildEvent,
          include: {
            model: FatherEvent,
          },
        },
      });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async findOneEvent(req, res, next) {
    const { id } = req.params;
    try {
      const result = await Event.findByPk(id, {
        include: {
          model: SubEvent,
        },
      });
      const event = await Event.findByPk(id, {
        include: {
          model: ChildEvent,
          include: {
            model: FatherEvent,
          },
        },
      });
      if (result && event) {
        res.status(200).json({
          eventForTableSubEvent: result,
          eventForEditEventPage: event,
        });
      } else {
        throw { name: "Data not found" };
      }
    } catch (err) {
      next(err);
    }
  }

  static async addNewEvent(req, res, next) {
    const { kode, keterangan, anggaranAwal, ChildEventId } = req.body;
    const UserId = req.user.id;
    const data = {
      kode,
      keterangan,
      anggaranAwal,
      jumlahBiaya: 0,
      anggaranTerpakai: 0,
      ChildEventId: +ChildEventId,
    };
    try {
      const result = await Event.create(data);
      const event = await Event.findOne({
        where: { id: result.id },
        include: {
          model: ChildEvent,
          include: {
            model: FatherEvent,
            include: {
              model: Cash,
            },
          },
        },
      });
      const childEvent = event.ChildEvent;
      const fatherEvent = childEvent.FatherEvent;
      const cash = fatherEvent.Cash;
      let dataChildEvent = {
        anggaranAwal: childEvent.anggaranAwal + +anggaranAwal,
      };
      let dataFatherEvent = {
        anggaranAwal: fatherEvent.anggaranAwal + +anggaranAwal,
      };
      let dataCash = {
        anggaranAwal: cash.anggaranAwal + +anggaranAwal,
      };
      if (childEvent) {
        await ChildEvent.update(dataChildEvent, {
          where: { id: childEvent.id },
          returning: true,
        });
      } else {
        throw { name: "Data not found" };
      }
      if (fatherEvent) {
        await FatherEvent.update(dataFatherEvent, {
          where: { id: fatherEvent.id },
          returning: true,
        });
      } else {
        throw { name: "Data not found" };
      }
      if (cash) {
        await Cash.update(dataCash, {
          where: { id: cash.id },
          returning: true,
        });
      } else {
        throw { name: "Data not found" };
      }
      await History.create({
        riwayat: `Event '${
          result.keterangan
        }' berhasil dibuat dengan anggaran awal Rp ${changeIntoMoneyFormat(
          result.anggaranAwal
        )}`,
        UserId: +UserId,
      });
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async deleteEvent(req, res, next) {
    const { id } = req.params;
    const UserId = req.user.id;
    try {
      const foundEvent = await Event.findByPk(id, {
        include: { model: SubEvent },
      });
      const event = await Event.findByPk(id, {
        include: {
          model: ChildEvent,
          include: {
            model: FatherEvent,
            include: {
              model: Cash,
            },
          },
        },
      });
      const childEvent = event.ChildEvent;
      const fatherEvent = childEvent.FatherEvent;
      const cash = fatherEvent.Cash;
      let dataChildEvent = {
        anggaranAwal: childEvent.anggaranAwal - event.anggaranAwal,
        jumlahBiaya: childEvent.jumlahBiaya - event.jumlahBiaya,
      };
      let dataFatherEvent = {
        anggaranAwal: fatherEvent.anggaranAwal - event.anggaranAwal,
        jumlahBiaya: fatherEvent.jumlahBiaya - event.jumlahBiaya,
      };
      let dataCash = {
        anggaranAwal: cash.anggaranAwal - event.anggaranAwal,
        cash: cash.cash - event.jumlahBiaya,
      };
      if (foundEvent) {
        let subEvents = foundEvent.SubEvents;
        if (subEvents.length > 0) {
          await Cash.update(dataCash, {
            where: { id: cash.id },
            returning: true,
          });
          await FatherEvent.update(dataFatherEvent, {
            where: { id: fatherEvent.id },
            returning: true,
          });
          await ChildEvent.update(dataChildEvent, {
            where: { id: childEvent.id },
            returning: true,
          });
          subEvents.forEach(async (l) => {
            await SubEvent.destroy({ where: { id: l.id } });
          });
          await Event.destroy({ where: { id } });
          await History.create({
            riwayat: `Event '${foundEvent.keterangan}' beserta subEvent-nya berhasil di hapus`,
            UserId: +UserId,
          });
          res.status(200).json({
            id: +id,
            message: `Event '${foundEvent.keterangan}' beserta subEvent-nya berhasil di hapus`,
          });
        } else {
          await Cash.update(dataCash, {
            where: { id: cash.id },
            returning: true,
          });
          await FatherEvent.update(dataFatherEvent, {
            where: { id: fatherEvent.id },
            returning: true,
          });
          await ChildEvent.update(dataChildEvent, {
            where: { id: childEvent.id },
            returning: true,
          });
          await Event.destroy({ where: { id } });
          await History.create({
            riwayat: `Event '${foundEvent.keterangan}' berhasil di hapus`,
            UserId: +UserId,
          });
          res.status(200).json({
            id: +id,
            cash: dataCash.cash,
            message: `Event '${foundEvent.keterangan}' berhasil di hapus`,
          });
        }
      } else {
        throw { name: "Data not found" };
      }
    } catch (err) {
      next(err);
    }
  }

  static async editEvent(req, res, next) {
    const { id } = req.params;
    const { kode, keterangan, anggaranAwal } = req.body;
    const UserId = req.user.id;
    try {
      const foundEvent = await Event.findOne({
        where: { id },
        include: {
          model: ChildEvent,
          include: {
            model: FatherEvent,
            include: {
              model: Cash,
            },
          },
        },
      });
      const childEvent = foundEvent.ChildEvent;
      const fatherEvent = childEvent.FatherEvent;
      const cash = fatherEvent.Cash;
      const dataEvent = {
        kode,
        keterangan,
        jumlahBiaya: foundEvent.jumlahBiaya,
        anggaranAwal: +anggaranAwal,
        anggaranTerpakai: foundEvent.anggaranTerpakai,
        ChildEventId: foundEvent.ChildEventId,
      };
      const dataChildEvent = {
        anggaranAwal:
          childEvent.anggaranAwal - foundEvent.anggaranAwal + +anggaranAwal,
      };
      const dataFatherEvent = {
        anggaranAwal:
          fatherEvent.anggaranAwal - foundEvent.anggaranAwal + +anggaranAwal,
      };
      const dataCash = {
        anggaranAwal:
          cash.anggaranAwal - foundEvent.anggaranAwal + +anggaranAwal,
      };
      if (foundEvent) {
        await Cash.update(dataCash, {
          where: { id: cash.id },
          returning: true,
        });
        await FatherEvent.update(dataFatherEvent, {
          where: { id: fatherEvent.id },
          returning: true,
        });
        await ChildEvent.update(dataChildEvent, {
          where: { id: childEvent.id },
          returning: true,
        });
        const result = await Event.update(dataEvent, {
          where: { id: foundEvent.id },
          returning: true,
        });
        await History.create({
          riwayat: `Event dengan kode: ${foundEvent.kode} & keterangan: ${foundEvent.keterangan} berhasil di edit`,
          UserId: +UserId,
        });
        res.status(200).json(result[1][0]);
      } else {
        throw { name: "Data not found" };
      }
    } catch (err) {
      next(err);
    }
  }

  static async uploadEvents(req, res, next) {
    const data = req.body;
    try {
      const cash = await Cash.findAll();
      const histories = await History.findAll({
        order: [["id", "DESC"]],
        include: { model: User },
      });
      let historyData = [];
      if (histories && histories.length > 0 && cash && cash.length > 0) {
        let cashToExcel = cash[0].cash;
        histories.forEach((history) => {
          historyData.push({
            Riwayat: history.riwayat,
            ["Dilakukan Oleh"]: history.User.email,
            ["Waktu & Tanggal"]: new Date(history.createdAt).toLocaleString(),
          });
        });
        historyData.push(
          {
            Riwayat: "",
            ["Dilakukan Oleh"]: "",
            ["Waktu & Tanggal"]: "",
          },
          {
            Riwayat: "Jumlah Anggaran Terakhir",
            ["Dilakukan Oleh"]: cashToExcel.toLocaleString(),
            ["Waktu & Tanggal"]: new Date().toLocaleString(),
          }
        );
      }
      const fatherEvents = await FatherEvent.findAll();
      const childEvents = await ChildEvent.findAll();
      const events = await Event.findAll();
      const subEvents = await SubEvent.findAll();
      if (cash.length > 0) {
        await Cash.destroy({ where: { id: cash[0].id } });
      }
      if (fatherEvents.length > 0) {
        fatherEvents.forEach(async (e) => {
          await FatherEvent.destroy({ where: { id: e.id } });
        });
      }
      if (childEvents.length > 0) {
        childEvents.forEach(async (e) => {
          await ChildEvent.destroy({ where: { id: e.id } });
        });
      }
      if (events.length > 0) {
        events.forEach(async (e) => {
          await Event.destroy({ where: { id: e.id } });
        });
      }
      if (subEvents.length > 0) {
        subEvents.forEach(async (i) => {
          await Event.destroy({ where: { id: i.id } });
        });
      }
      const uploadedEvents = await uploadEvents(data, next);
      const uploadedSubEvents = await uploadSubEvents(uploadedEvents, next);
      const result = await Event.findAll({
        order: [["id", "DESC"]],
        include: {
          model: SubEvent,
        },
      });
      if (
        uploadedEvents.datas.length > 0 &&
        uploadedSubEvents.length > 0 &&
        result.length > 0
      ) {
        const UserId = req.user.id;
        await History.create({
          riwayat: `Realisasi Anggaran berhasil di upload`,
          UserId: +UserId,
        });
        res.status(201).json({
          cash: uploadedEvents.cash,
          events: result,
          histories: historyData,
          message: `Realisasi Anggaran berhasil di upload`,
        });
      } else {
        throw { name: "gagal upload" };
      }
    } catch (err) {
      next(err);
    }
  }

  static async downloadFileExcel(req, res, next) {
    try {
      const histories = await History.findAll({
        order: [["id", "DESC"]],
        include: { model: User },
      });
      const cash = await Cash.findAll();
      let historyData = [];
      if (histories && histories.length > 0 && cash && cash[0].cash) {
        let cashToExcel = cash[0].cash;
        histories.forEach((history) => {
          historyData.push({
            Riwayat: history.riwayat,
            ["Dilakukan Oleh"]: history.User.email,
            ["Waktu & Tanggal"]: new Date(history.createdAt).toLocaleString(),
          });
        });
        historyData.push(
          {
            Riwayat: "",
            ["Dilakukan Oleh"]: "",
            ["Waktu & Tanggal"]: "",
          },
          {
            Riwayat: "Jumlah Anggaran Terakhir",
            ["Dilakukan Oleh"]: cashToExcel.toLocaleString(),
            ["Waktu & Tanggal"]: new Date().toLocaleString(),
          }
        );
      }
      const fatherEvents = await FatherEvent.findAll({
        // order: [["id", "ASC"]],
        include: {
          model: ChildEvent,
          // order: [["kode", "ASC"]],
          include: {
            model: Event,
            // order: [["id", "ASC"]],
            include: {
              model: SubEvent,
              // order: [["id", "ASC"]],
            },
          },
        },
      });
      // const format = {
      //   Keterangan: "",
      //   Anggaran: 0,
      //   Realisasi: 0,
      //   Sisa: 0,
      // };
      const data = [];
      // data.push([
      //   `${cash[0].kode} ${cash[0].keterangan}`,
      //   `${cash[0].anggaranAwal}`,
      //   `${cash[0].anggaranTerpakai}`,
      //   `${cash[0].anggaranAwal - cash[0].anggaranTerpakai}`,
      // ]);
      data.push({
        Keterangan: `${cash[0].kode} ${cash[0].keterangan}`,
        Anggaran: cash[0].anggaranAwal.toLocaleString(),
        Realisasi: cash[0].anggaranTerpakai.toLocaleString(),
        Sisa: cash[0].cash.toLocaleString(),
      });
      for (let f = 0; f < fatherEvents.length; f++) {
        // data.push([
        //   ` ${grandEvents[g].kode} ${grandEvents[g].keterangan}, , , `,
        // ]);
        data.push({
          Keterangan: `  ${fatherEvents[f].kode} ${fatherEvents[f].keterangan}`,
          Anggaran: fatherEvents[f].anggaranAwal.toLocaleString(),
          Realisasi: fatherEvents[f].anggaranTerpakai.toLocaleString(),
          Sisa: fatherEvents[f].jumlahBiaya.toLocaleString(),
        });
        for (let c = 0; c < fatherEvents[f].ChildEvents.length; c++) {
          let kode = fatherEvents[f].ChildEvents[c].kode;
          let keterangan = fatherEvents[f].ChildEvents[c].keterangan;
          let anggaranAwalChildEvent =
            fatherEvents[f].ChildEvents[c].anggaranAwal;
          let anggaranTerpakaiChildEvent =
            fatherEvents[f].ChildEvents[c].anggaranTerpakai;
          let jumlahBiayaChildEvent =
            fatherEvents[f].ChildEvents[c].jumlahBiaya;
          // data.push([`  ${kode} ${keterangan}, , , `]);
          data.push({
            Keterangan: `     ${kode} ${keterangan}`,
            Anggaran: anggaranAwalChildEvent.toLocaleString(),
            Realisasi: anggaranTerpakaiChildEvent.toLocaleString(),
            Sisa: jumlahBiayaChildEvent.toLocaleString(),
          });
          let events = fatherEvents[f].ChildEvents[c].Events;
          for (let e = 0; e < events.length; e++) {
            // data.push([
            //   `   ${childEvents[c].kode} ${childEvents[c].keterangan}, , , `,
            // ]);
            let anggaranAwalEvent = events[e].anggaranAwal;
            let anggaranTerpakaiEvent = events[e].anggaranTerpakai;
            let jumlahBiayaEvent = events[e].jumlahBiaya;
            data.push({
              Keterangan: `       ${events[e].kode} ${events[e].keterangan}`,
              Anggaran: anggaranAwalEvent.toLocaleString(),
              Realisasi: anggaranTerpakaiEvent.toLocaleString(),
              Sisa: jumlahBiayaEvent.toLocaleString(),
            });
            let subEvents = events[e].SubEvents;
            for (let e = 0; e < subEvents.length; e++) {
              let keteranganSubEvent = subEvents[e].keterangan;
              // let qtySubEvent = subEvents[e].qty;
              // let unitSubEvent = subEvents[e].unit;
              let anggaranAwalSubEvent = subEvents[e].anggaranAwal;
              let anggaranTerpakaiSubEvent = subEvents[e].anggaranTerpakai;
              let jumlahBiayaSubEvent = subEvents[e].jumlahBiaya;
              // data.push([
              //   `    ${event.kode} ${event.keterangan}, ${
              //     event.anggaranAwal
              //   }, ${event.anggaranTerpakai}, ${
              //     event.anggaranAwal - event.anggaranTerpakai
              //   }`,
              // ]);
              data.push({
                // Keterangan: `         ${keteranganSubEvent} : ${qtySubEvent} ${unitSubEvent}`,
                Keterangan: `         ${keteranganSubEvent}`,
                Anggaran: anggaranAwalSubEvent.toLocaleString(),
                Realisasi: anggaranTerpakaiSubEvent.toLocaleString(),
                Sisa: jumlahBiayaSubEvent.toLocaleString(),
              });
              // for (let s = 0; s < subEvents.length; s++) {
              //   let subEvent = subEvents[s];
              //   // data.push([
              //   //   `    ${subEvent.keterangan} : ${subEvent.qty} ${subEvent.unit}`,
              //   //   "",
              //   //   "",
              //   //   "0",
              //   // ]);
              //   data.push({
              //     Keterangan: `           ${subEvent.keterangan} : ${subEvent.qty} ${subEvent.unit}`,
              //     Anggaran: "",
              //     Realisasi: "",
              //     Sisa: 0,
              //   });
              // }
            }
          }
        }
      }
      res.status(200).json([data, historyData]);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ControllerEvent;
