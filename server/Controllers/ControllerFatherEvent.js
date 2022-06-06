const {
  FatherEvent,
  ChildEvent,
  Cash,
  History,
  Event,
  SubEvent
} = require("../models");
const changeIntoMoneyFormat = require("../helpers/moneyFormater");

class ControllerFatherEvent {
  static async findAllFatherEvents(req, res, next) {
    try {
      const result = await FatherEvent.findAll();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async findOneFatherEvents(req, res, next) {
    const { id } = req.params;
    try {
      const result = await FatherEvent.findByPk(id, {
        include: {
          model: ChildEvent,
        },
      });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async createNewFatherEvent(req, res, next) {
    try {
      const { CashId, anggaranAwal, keterangan, kode } = req.body;
      const UserId = req.user.id;
      const dataFatherEvent = {
        kode,
        keterangan,
        anggaranAwal: +anggaranAwal,
        jumlahBiaya: +anggaranAwal,
        anggaranTerpakai: 0,
        CashId: +CashId,
      };
      const foundCash = await Cash.findOne({ where: { id: CashId } });
      const dataCash = {
        cash: foundCash.cash + +anggaranAwal,
        anggaranAwal: foundCash.anggaranAwal + +anggaranAwal,
      };
      const result = await FatherEvent.create(dataFatherEvent);
      if (foundCash) {
        await Cash.update(dataCash, {
          where: { id: foundCash.id },
          returning: true,
        });
      } else {
        throw { name: "Data not found" };
      }
      if (result) {
        await History.create({
          riwayat: `Father Event '${
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

  static async deleteFatherEvent(req, res, next) {
    try {
      const { id } = req.params;
      const UserId = req.user.id;
      const foundFatherEvent = await FatherEvent.findByPk(id, {
        include: {
          model: ChildEvent,
          include: {
            model: Event,
            include: {
              model: SubEvent,
            },
          },
        },
      });
      if (foundFatherEvent) {
        const childEvents = foundFatherEvent.ChildEvents;
        const events = [];
        const subEvents = [];
        if (
          childEvents &&
          Array.isArray(childEvents) &&
          childEvents.length > 0
        ) {
          childEvents.map(async (childEvent, i) => {
            let tempEvents = await Event.findAll({
              where: {
                ChildEventId: childEvent.id,
              },
            });
            tempEvents.map((tempEvent) => {
              events.push(tempEvent);
            });
            if (i === childEvents.length - 1) {
              console.log(events.length , 'events.length');
              if (events && Array.isArray(events) && events.length > 0) {
                events.map(async (event, index) => {
                  let tempSubEvents = await SubEvent.findAll({
                    where: {
                      EventId: event.id,
                    },
                  });
                  tempSubEvents.map((tempSubEvent) => {
                    subEvents.push(tempSubEvent);
                  });
                  if (index === events.length - 1) {
                    if (
                      subEvents &&
                      Array.isArray(subEvents) &&
                      subEvents.length > 0
                    ) {
                      console.log(subEvents.length , 'subEvents.length');
                      subEvents.map(async (subEvent) => {
                        await SubEvent.destroy({ where: { id: subEvent.id } });
                      });
                    }
                  }
                  await Event.destroy({ where: { id: event.id } });
                });
              }
            }
            await ChildEvent.destroy({ where: { id: childEvent.id } });
          });
        }
        const cashId = foundFatherEvent.CashId;
        const foundCash = await Cash.findOne({ where: { id: cashId } });
        const dataCash = {
          cash: foundCash.cash - +foundFatherEvent.jumlahBiaya,
          anggaranAwal: foundCash.anggaranAwal - +foundFatherEvent.jumlahBiaya,
        };
        await FatherEvent.destroy({ where: { id } }); 
        await Cash.update(dataCash, {
          where: { id: foundCash.id },
          returning: true,
        });
        await History.create({
          riwayat: `Father Event '${foundFatherEvent.keterangan}' berhasil di hapus`,
          UserId: +UserId,
        });
        res.status(200).json({
          id: foundFatherEvent.id,
          cash: dataCash.cash,
          message: `Father Event '${foundFatherEvent.keterangan}' berhasil di hapus`,
        });
      } else {
        throw { name: "Data not found" };
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ControllerFatherEvent;
