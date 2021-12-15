const { Event, SubEvent, History } = require("../models");

class ControllerEvent {
  static async findAllEvents(req, res, next) {
    try {
      const result = await Event.findAll({
        order: [["id", "DESC"]],
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
      if (result) {
        res.status(200).json(result);
      } else {
        throw { name: "Data not found" };
      }
    } catch (err) {
      next(err);
    }
  }

  static async addNewEvent(req, res, next) {
    const { kode, keterangan } = req.body;
    const UserId = req.user.id;
    const data = {
      kode,
      keterangan,
      jumlahBiaya: 0,
    };
    try {
      const result = await Event.create(data);
      await History.create({
        riwayat: `Event '${result.keterangan}' telah berhasil dibuat`,
        UserId,
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
      if (foundEvent) {
        let subEvents = foundEvent.SubEvents;
        if (subEvents.length > 0) {
          subEvents.forEach(async (l) => {
            await SubEvent.destroy({ where: { id: l.id } });
          });
          await Event.destroy({ where: { id } });
          await History.create({
            riwayat: `Event '${foundEvent.keterangan}' beserta subEvent-nya telah berhasil di hapus`,
            UserId,
          });
          res.status(200).json({
            id: +id,
            message: `Event '${foundEvent.keterangan}' beserta subEvent-nya telah berhasil di hapus`,
          });
        } else {
          await Event.destroy({ where: { id } });
          await History.create({
            riwayat: `Event '${foundEvent.keterangan}' berhasil di hapus`,
            UserId,
          });
          res.status(200).json({
            id: +id,
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
    const { kode, keterangan } = req.body;
    const UserId = req.user.id;
    try {
      const foundEvent = await Event.findByPk(id);
      const data = {
        kode,
        keterangan,
        jumlahBiaya: foundEvent.jumlahBiaya,
      };
      if (foundEvent) {
        const result = await Event.update(data, {
          where: { id: foundEvent.id },
          returning: true,
        });
        await History.create({
          riwayat: `Event dengan kode: ${foundEvent.kode} & keterangan: ${foundEvent.keterangan} telah berhasil di edit menjadi kode: ${result[1][0].kode} & keterangan: ${result[1][0].keterangan} `,
          UserId,
        });
        res.status(200).json(result[1][0]);
      } else {
        throw { name: "Data not found" };
      }
    } catch (err) {
      next(err);
    }
  }

  // static async finishedEvent(req, res, next) {
  //   const { id } = req.params;
  //   try {
  //     const foundCash = await Cash.findAll();
  //     const foundEvent = await Event.findByPk(id);
  //     let cashValue = +foundCash[0].cash - +foundEvent.price;
  //     let data = {
  //       isFinished: true,
  //     };
  //     if (foundEvent.isFinished === false) {
  //       await Cash.update(
  //         {
  //           cash: cashValue,
  //         },
  //         {
  //           where: { id: foundCash[0].id },
  //           returning: true,
  //         }
  //       );
  //       const result = await Event.update(data, {
  //         where: { id: foundEvent.id },
  //         returning: true,
  //       });
  //       res.status(200).json(result);
  //     } else {
  //       throw { name: "This event has been processed" };
  //     }
  //   } catch (err) {
  //     next(err);
  //   }
  // }
}

module.exports = ControllerEvent;
