const changeIntoMoneyFormat = require("../helpers/moneyFormater");
const {
  Event,
  Cash,
  SubEvent,
  FatherEvent,
  ChildEvent,
  History,
} = require("../models");

class ControllerSubEvent {
  static async findAllSubEvents(req, res, next) {
    const { id } = req.params;
    try {
      const result = await SubEvent.findAll({
        where: { EventId: id },
        order: [["id", "ASC"]],
      });
      if (result) {
        res.status(200).json(result);
      } else {
        throw { name: "Data not found" };
      }
    } catch (err) {
      next(err);
    }
  }

  static async findOneSubEvent(req, res, next) {
    const { id } = req.params;
    try {
      const foundSubEvent = await SubEvent.findByPk(id, {
        include: {
          model: Event,
          include: {
            model: ChildEvent,
            include: {
              model: FatherEvent,
            },
          },
        },
      });
      if (foundSubEvent) {
        res.status(200).json(foundSubEvent);
      } else {
        throw { name: "Data not found" };
      }
    } catch (err) {
      next(err);
    }
  }

  static async processSubEvent(req, res, next) {
    const id = +req.params.id;
    const jumlahBiayaFE = +req.body.jumlahBiaya;
    const UserId = req.user.id;
    try {
      let jumlahBiayaEventSetelahDigunakan = 0;
      let jumlahBiayaCashSetelahDigunakan = 0;
      let jumlahBiayaFatherEventSetelahDigunakan = 0;
      let jumlahBiayaChildEventSetelahDigunakan = 0;
      let jumlahBiayaSubEventSetelahDigunakan = 0;
      if(jumlahBiayaFE > 0) {
        const subEvent = await SubEvent.findByPk(id, {
          include: {
            model: Event,
            include: {
              model: ChildEvent,
              include: {
                model: FatherEvent,
                include: {
                  model: Cash,
                },
              },
            },
          },
        });
        const event = subEvent.Event;
        const childEvent = event.ChildEvent;
        const fatherEvent = childEvent.FatherEvent;
        const cash = fatherEvent.Cash;
        if (jumlahBiayaFE <= subEvent.jumlahBiaya) {
          jumlahBiayaCashSetelahDigunakan = cash.cash - jumlahBiayaFE;
          jumlahBiayaFatherEventSetelahDigunakan =
            fatherEvent.jumlahBiaya - jumlahBiayaFE;
          jumlahBiayaChildEventSetelahDigunakan =
            childEvent.jumlahBiaya - jumlahBiayaFE;
          jumlahBiayaEventSetelahDigunakan = event.jumlahBiaya - jumlahBiayaFE;
          jumlahBiayaSubEventSetelahDigunakan =
            subEvent.jumlahBiaya - jumlahBiayaFE;
          let dataCash = {
            cash: jumlahBiayaCashSetelahDigunakan,
            anggaranTerpakai: cash.anggaranTerpakai + jumlahBiayaFE,
          };
          let dataFatherEvent = {
            jumlahBiaya: jumlahBiayaFatherEventSetelahDigunakan,
            anggaranTerpakai: fatherEvent.anggaranTerpakai + jumlahBiayaFE,
          };
          let dataChildEvent = {
            jumlahBiaya: jumlahBiayaChildEventSetelahDigunakan,
            anggaranTerpakai: childEvent.anggaranTerpakai + jumlahBiayaFE,
          };
          let dataEvent = {
            jumlahBiaya: jumlahBiayaEventSetelahDigunakan,
            anggaranTerpakai: event.anggaranTerpakai + jumlahBiayaFE,
          };
          let dataSubEvent = {
            jumlahBiaya: jumlahBiayaSubEventSetelahDigunakan,
            anggaranTerpakai: subEvent.anggaranTerpakai + jumlahBiayaFE,
          };
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
          await Event.update(dataEvent, {
            where: { id: subEvent.EventId },
            returning: true,
          });
          const result = await SubEvent.update(dataSubEvent, {
            where: { id },
            returning: true,
          });
          await History.create({
            riwayat: `Rp ${changeIntoMoneyFormat(jumlahBiayaFE)} digunakan dari ${
              subEvent.keterangan
            }`,
            UserId: +UserId,
          });
          res.status(200).json({
            result: result[1][0],
            message: `berhasil digunakan`,
          });
        } else {
          throw {
            name: "Jumlah Biaya yang ingin digunakan tidak boleh lebih dari jumlah anggaran yang tersisa",
          };
        }
      } else {
        throw {
          name: "Jumlah biaya tidak boleh kurang dari 0",
        };
      }
    } catch (err) {
      next(err);
    }
  }

  static async deleteSubEvent(req, res, next) {
    const { id } = req.params;
    const UserId = req.user.id;
    try {
      const subEvent = await SubEvent.findByPk(id, {
        include: {
          model: Event,
          include: {
            model: ChildEvent,
            include: {
              model: FatherEvent,
              include: {
                model: Cash,
              },
            },
          },
        },
      });
      const event = subEvent.Event;
      const childEvent = event.ChildEvent;
      const fatherEvent = childEvent.FatherEvent;
      const cash = fatherEvent.Cash;
      let dataCash = {
        cash: cash.cash - subEvent.jumlahBiaya,
        anggaranAwal: cash.anggaranAwal - subEvent.jumlahBiaya,
      };
      let dataFatherEvent = {
        jumlahBiaya: fatherEvent.jumlahBiaya - subEvent.jumlahBiaya,
        anggaranAwal: fatherEvent.anggaranAwal - subEvent.jumlahBiaya,
      };
      let dataChildEvent = {
        jumlahBiaya: childEvent.jumlahBiaya - subEvent.jumlahBiaya,
        anggaranAwal: childEvent.anggaranAwal - subEvent.jumlahBiaya,
      };
      let dataEvent = {
        jumlahBiaya: event.jumlahBiaya - subEvent.jumlahBiaya,
        anggaranAwal: event.anggaranAwal - subEvent.jumlahBiaya,
      };
      if (cash) {
        await Cash.update(dataCash, {
          where: { id: cash.id },
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
      if (childEvent) {
        await ChildEvent.update(dataChildEvent, {
          where: { id: childEvent.id },
          returning: true,
        });
      } else {
        throw { name: "Data not found" };
      }
      if (event) {
        await Event.update(dataEvent, {
          where: { id: event.id },
          returning: true,
        });
      } else {
        throw { name: "Data not found" };
      }
      if (subEvent) {
        await SubEvent.destroy({ where: { id: subEvent.id } });
        await History.create({
          riwayat: `Sub Event ${subEvent.keterangan} berhasil dihapus`,
          UserId: +UserId,
        });
        res.status(200).json({
          id: subEvent.id,
          message: `Sub Event '${subEvent.keterangan}' berhasil dihapus`,
        });
      } else {
        throw { name: "Data not found" };
      }
    } catch (err) {
      next(err);
    }
  }

  static async editSubEvent(req, res, next) {
    const { id } = req.params;
    const { keterangan, unit, price, qty, jumlahBiaya, EventId } = req.body;
    const UserId = req.user.id;
    try {
      const subEvent = await SubEvent.findByPk(id, {
        include: {
          model: Event,
          include: {
            model: ChildEvent,
            include: {
              model: FatherEvent,
              include: {
                model: Cash,
              },
            },
          },
        },
      });
      // let currentQty = qty ? +qty : subEvent.qty;
      // let currentPrice = price ? +price : subEvent.price;
      // let jumlahBiaya = currentPrice * currentQty;
      const event = subEvent.Event;
      const childEvent = event.ChildEvent;
      const fatherEvent = childEvent.FatherEvent;
      const cash = fatherEvent.Cash;
      let dataCash = {
        anggaranAwal: cash.anggaranAwal - subEvent.jumlahBiaya + jumlahBiaya,
        cash: cash.cash - subEvent.jumlahBiaya + jumlahBiaya,
      };
      let dataFatherEvent = {
        anggaranAwal:
          fatherEvent.anggaranAwal - subEvent.jumlahBiaya + jumlahBiaya,
        jumlahBiaya:
          fatherEvent.jumlahBiaya - subEvent.jumlahBiaya + jumlahBiaya,
      };
      let dataChildEvent = {
        anggaranAwal:
          childEvent.anggaranAwal - subEvent.jumlahBiaya + jumlahBiaya,
        jumlahBiaya:
          childEvent.jumlahBiaya - subEvent.jumlahBiaya + jumlahBiaya,
      };
      let dataEvent = {
        anggaranAwal: event.anggaranAwal - subEvent.jumlahBiaya + jumlahBiaya,
        jumlahBiaya: event.jumlahBiaya - subEvent.jumlahBiaya + jumlahBiaya,
      };
      let dataSubEvent = {
        keterangan: keterangan ? keterangan : subEvent.keterangan,
        // unit: unit ? unit : subEvent.unit,
        // price: price ? +price : subEvent.price,
        // qty: qty ? qty : subEvent.qty,
        jumlahBiaya: jumlahBiaya,
        EventId: EventId ? EventId : subEvent.EventId,
      };
      if (cash) {
        await Cash.update(dataCash, {
          where: { id: cash.id },
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
      if (childEvent) {
        await ChildEvent.update(dataChildEvent, {
          where: { id: childEvent.id },
          returning: true,
        });
      } else {
        throw { name: "Data not found" };
      }
      if (event) {
        await Event.update(dataEvent, {
          where: { id: event.id },
          returning: true,
        });
      } else {
        throw { name: "Data not found" };
      }
      const result = await SubEvent.update(dataSubEvent, {
        where: { id },
        returning: true,
      });
      if (result) {
        await History.create({
          riwayat: `Sub Event dengan keterangan '${subEvent.keterangan}' berhasil di update`,
          UserId: +UserId,
        });
        res.status(200).json({
          result: result[1][0],
          message: `Sub Event '${subEvent.keterangan}' berhasil di update`,
        });
      } else {
        throw { name: "Data not found" };
      }
    } catch (err) {
      next(err);
    }
  }

  static async createSubEvent(req, res, next) {
    const { keterangan, jumlahBiaya, EventId } = req.body;
    const UserId = req.user.id;
    try {
      // let jumlahBiaya = 0;
      // if (qty && price) {
      //   jumlahBiaya = +qty * +price;
      // }
      const data = {
        keterangan,
        // unit,
        // price,
        // qty,
        jumlahBiaya,
        EventId,
        anggaranAwal: jumlahBiaya,
        anggaranTerpakai: 0,
      };
      const event = await Event.findOne({
        where: { id: +EventId },
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
      let dataCash = {
        cash: cash.cash + jumlahBiaya,
      };
      let dataFatherEvent = {
        jumlahBiaya: fatherEvent.jumlahBiaya + jumlahBiaya,
      };
      let dataChildEvent = {
        jumlahBiaya: childEvent.jumlahBiaya + jumlahBiaya,
      };
      let dataEvent = {
        jumlahBiaya: event.jumlahBiaya + jumlahBiaya,
      };
      if (cash) {
        await Cash.update(dataCash, {
          where: { id: cash.id },
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
      if (childEvent) {
        await ChildEvent.update(dataChildEvent, {
          where: { id: childEvent.id },
          returning: true,
        });
      } else {
        throw { name: "Data not found" };
      }
      if (event) {
        await Event.update(dataEvent, {
          where: { id: event.id },
          returning: true,
        });
      } else {
        throw { name: "Data not found" };
      }
      const result = await SubEvent.create(data);
      await History.create({
        riwayat: `Sub Event '${result.keterangan}' berhasil ditambahkan ke Event '${event.keterangan}'`,
        UserId: +UserId,
      });
      res.status(201).json({
        result,
        message: `Sub Event '${result.keterangan}' berhasil ditambahkan ke Event '${event.keterangan}'`,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ControllerSubEvent;
