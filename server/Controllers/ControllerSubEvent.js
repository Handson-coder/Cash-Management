const changeIntoMoneyFormat = require("../helpers/moneyFormater");
const { Event, Cash, SubEvent, History } = require("../models");

class ControllerSubEvent {
  static async findAllSubEvents(req, res, next) {
    const { id } = req.params;
    try {
      const result = await SubEvent.findAll({
        where: { EventId: id },
        order: [["id", "DESC"]],
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
        include: { model: Event },
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
    const volume = +req.body.volume;
    const UserId = req.user.id;
    try {
      let biayaDigunakan = 0;
      let qtySetelahDigunakan = 0;
      let volumeSetelahDigunakan = 0;
      let jumlahBiayaEventSetelahDigunakan = 0;
      let jumlahBiayaCashSetelahDigunakan = 0;
      let jumlahBiayaSubEventSetelahDigunakan = 0;
      const foundSubEvent = await SubEvent.findByPk(id, {
        include: { model: Event },
      });
      const foundCash = await Cash.findAll();
      const foundEvent = await Event.findByPk(foundSubEvent.EventId);
      volumeSetelahDigunakan = foundSubEvent.qty - volume;
      biayaDigunakan = volume * foundSubEvent.price;
      jumlahBiayaEventSetelahDigunakan =
        foundEvent.jumlahBiaya - biayaDigunakan;
      jumlahBiayaCashSetelahDigunakan = foundCash[0].cash - biayaDigunakan;
      jumlahBiayaSubEventSetelahDigunakan =
        foundSubEvent.jumlahBiaya - biayaDigunakan;
      qtySetelahDigunakan = foundSubEvent.qty - volume;
      let data = {
        cash: jumlahBiayaCashSetelahDigunakan,
      };
      const resultCash = await Cash.update(data, {
        where: { id: foundCash[0].id },
        returning: true,
      });
      await Event.update(
        { jumlahBiaya: jumlahBiayaEventSetelahDigunakan },
        { where: { id: foundSubEvent.EventId }, returning: true }
      );
      const result = await SubEvent.update(
        {
          jumlahBiaya: jumlahBiayaSubEventSetelahDigunakan,
          qty: qtySetelahDigunakan,
        },
        { where: { id }, returning: true }
      );
      await History.create({
        riwayat: `${volume} ${foundSubEvent.unit} telah digunakan dari ${
          foundSubEvent.keterangan
        } dan cash otomatis berkurang dari ${changeIntoMoneyFormat(
          foundCash[0].cash
        )} K menjadi ${changeIntoMoneyFormat(resultCash[1][0].cash)} K`,
        UserId,
      });
      res.status(200).json({
        result: result[1][0],
        message: `telah berhasil digunakan`,
      });
    } catch (err) {
      next(err);
    }
  }

  static async deleteSubEvent(req, res, next) {
    const { id } = req.params;
    const UserId = req.user.id;
    try {
      const foundSubEvent = await SubEvent.findByPk(id);
      if (foundSubEvent) {
        await SubEvent.destroy({ where: { id: foundSubEvent.id } });
        await History.create({
          riwayat: `Sub Event ${foundSubEvent.keterangan} telah berhasil dihapus`,
          UserId,
        });
        res.status(200).json({
          id: foundSubEvent.id,
          message: `Sub Event '${foundSubEvent.keterangan}' telah berhasil dihapus`,
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
    const { keterangan, unit, price, qty, EventId } = req.body;
    const UserId = req.user.id;
    try {
      const foundSubEvent = await SubEvent.findByPk(id, {
        include: { model: Event },
      });
      const foundEvent = await Event.findOne({
        where: { id: foundSubEvent.EventId },
      });
      let currentQty = qty ? +qty : foundSubEvent.qty;
      let currentPrice = price ? +price : foundSubEvent.price;
      let jumlahBiayaSubEvent = currentPrice * currentQty;
      let currentJumlahBiayaEvent =
        foundEvent.jumlahBiaya -
        foundSubEvent.jumlahBiaya +
        jumlahBiayaSubEvent;
      let data = {
        keterangan: keterangan ? keterangan : foundSubEvent.keterangan,
        unit: unit ? unit : foundSubEvent.unit,
        price: price ? price : foundSubEvent.price,
        qty: qty ? qty : foundSubEvent.qty,
        jumlahBiaya: jumlahBiayaSubEvent,
        EventId: EventId ? EventId : foundSubEvent.EventId,
      };
      await Event.update(
        { jumlahBiaya: currentJumlahBiayaEvent },
        { where: { id: foundEvent.id }, returning: true }
      );
      const result = await SubEvent.update(data, {
        where: { id },
        returning: true,
      });
      await History.create({
        riwayat: `Sub Event dengan keterangan: '${foundSubEvent.keterangan}' telah berhasil di update`,
        UserId,
      });
      res.status(200).json({
        result: result[1][0],
        message: `Sub Event '${foundSubEvent.keterangan}' telah berhasil di update`,
      });
    } catch (err) {
      next(err);
    }
  }

  static async createSubEvent(req, res, next) {
    const { keterangan, unit, price, qty, EventId } = req.body;
    const UserId = req.user.id;
    try {
      let jumlahBiaya = 0;
      let jumlahBiayaEvent = 0;
      if (qty && price) {
        jumlahBiaya = +qty * +price;
      }
      const data = {
        keterangan,
        unit,
        price,
        qty,
        jumlahBiaya,
        EventId,
      };
      const foundEvent = await Event.findOne({ where: { id: +EventId } });
      jumlahBiayaEvent = foundEvent.jumlahBiaya + jumlahBiaya;
      await Event.update(
        { jumlahBiaya: jumlahBiayaEvent },
        { where: { id: foundEvent.id }, returning: true }
      );
      await History.create({
        riwayat: `Sub Event '${result.keterangan}' telah berhasil ditambahkan ke Event '${foundEvent.keterangan}'`,
        UserId,
      });
      const result = await SubEvent.create(data);
      res.status(201).json({
        result,
        message: `Sub Event '${result.keterangan}' telah berhasil ditambahkan ke Event '${foundEvent.keterangan}'`,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ControllerSubEvent;
