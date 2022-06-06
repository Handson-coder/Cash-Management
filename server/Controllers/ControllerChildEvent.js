const {
  Cash,
  ChildEvent,
  Event,
  History,
  SubEvent,
  FatherEvent,
} = require("../models");
const changeIntoMoneyFormat = require("../helpers/moneyFormater");

class ControllerChildEvent {
  static async findAllChildEvents(req, res, next) {
    try {
      const result = await ChildEvent.findAll();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async findOneChildEvent(req, res, next) {
    const { id } = req.params;
    try {
      const result = await ChildEvent.findByPk(id, {
        include: {
          model: Event,
        },
      });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async createNewChildEvent(req, res, next) {
    try {
      const { kode, anggaranAwal, keterangan, FatherEventId } = req.body;
      const UserId = req.user.id;
      const dataChildEvent = {
        kode,
        keterangan,
        anggaranAwal: +anggaranAwal,
        jumlahBiaya: +anggaranAwal,
        anggaranTerpakai: 0,
        FatherEventId: +FatherEventId,
      };
      const result = await ChildEvent.create(dataChildEvent);
      if (result) {
        await History.create({
          riwayat: `Child Event '${
            result.keterangan
          }' berhasil dibuat dengan anggaran awal Rp ${changeIntoMoneyFormat(
            result.anggaranAwal
          )}`,
          UserId: +UserId,
        });
        res.status(201).json(result);
      }
    } catch (err) {
      next(err);
    }
  }

  static async deleteChildEvent(req, res, next) {
    try {
      const { id } = req.params;
      const UserId = req.user.id;
      const foundChildEvent = await ChildEvent.findByPk(id, {
        include: {
          model: Event,
          include: {
            model: SubEvent,
          },
        },
      });
      if (foundChildEvent) {
        const events = foundChildEvent.Events;
        const subEvents = [];
        if (events && Array.isArray(events) && events.length > 0) {
          events.map(async (event, i) => {
            let tempSubEvents = await SubEvent.findAll({
              where: {
                EventId: event.id,
              },
            });
            tempSubEvents.map((tempSubEvent) => {
              subEvents.push(tempSubEvent);
            });
            if (i === events.length - 1) {
              if (
                subEvents &&
                Array.isArray(subEvents) &&
                subEvents.length > 0
              ) {
                subEvents.map(async (subEvent) => {
                  await SubEvent.destroy({ where: { id: subEvent.id } });
                });
              }
            }
            await Event.destroy({ where: { id: event.id } });
          });
        }
        const fatherEventId = foundChildEvent.FatherEventId;
        const foundFatherEvent = await FatherEvent.findOne({
          where: { id: fatherEventId },
        });
        const cashId = foundFatherEvent.CashId;
        const foundCash = await Cash.findOne({ where: { id: cashId } });
        const dataFatherEvent = {
          anggaranAwal:
            +foundFatherEvent.anggaranAwal - +foundChildEvent.jumlahBiaya,
          jumlahBiaya:
            +foundFatherEvent.jumlahBiaya - +foundChildEvent.jumlahBiaya,
        };
        const dataCash = {
          cash: foundCash.cash - +foundChildEvent.jumlahBiaya,
          anggaranAwal: foundCash.anggaranAwal - +foundChildEvent.jumlahBiaya,
        };
        if (foundFatherEvent && foundCash) {
          await ChildEvent.destroy({ where: { id } });
          await FatherEvent.update(dataFatherEvent, {
            where: { id: foundFatherEvent.id },
            returning: true,
          });
          await Cash.update(dataCash, {
            where: { id: foundCash.id },
            returning: true,
          });
          await History.create({
            riwayat: `Child Event '${foundChildEvent.keterangan}' berhasil di hapus`,
            UserId: +UserId,
          });
          res.status(200).json({
            id: foundChildEvent.id,
            cash: dataCash.cash,
            message: `Child Event '${foundChildEvent.keterangan}' berhasil di hapus`,
          });
        } else {
          throw { name: "Data not found" };
        }
      } else {
        throw { name: "Data not found" };
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ControllerChildEvent;
