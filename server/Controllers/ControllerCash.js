const { Cash, History } = require("../models");
const changeIntoMoneyFormat = require("../helpers/moneyFormater");

class ControllerCash {
  static async getCurrentBalance(req, res, next) {
    try {
      const result = await Cash.findAll();
      res.status(201).json({
        cash: result[0].cash,
      });
    } catch (err) {
      next(err);
    }
  }

  static async addCurrentBalance(req, res, next) {
    const { nominalToAdd } = req.body;
    const UserId = req.user.id;
    try {
      const foundCash = await Cash.findAll();
      if (foundCash) {
        const data = {
          cash: +foundCash[0].cash + +nominalToAdd,
        };
        const result = await Cash.update(data, {
          where: { id: foundCash[0].id },
          returning: true,
        });
        await History.create({
          riwayat: `Kas telah berhasil ditambahkan dari ${changeIntoMoneyFormat(
            foundCash[0].cash
          )} K menjadi ${changeIntoMoneyFormat(result[1][0].cash)} K`,
          UserId,
        });
        res.status(200).json({
          cash: result[1][0].cash,
          message: `Kas telah berhasil ditambahkan dari ${changeIntoMoneyFormat(
            foundCash[0].cash
          )} K menjadi ${changeIntoMoneyFormat(result[1][0].cash)} K`,
        });
      } else {
        throw { name: "Data not found" };
      }
    } catch (err) {
      next(err);
    }
  }

  static async editCurrentBalance(req, res, next) {
    const data = {
      cash: req.body.cash,
    };
    const UserId = req.user.id;
    try {
      const foundCash = await Cash.findAll();
      if (foundCash) {
        const result = await Cash.update(data, {
          where: { id: foundCash[0].id },
          returning: true,
        });
        await History.create({
          riwayat: `Kas telah berhasil di Edit dari ${changeIntoMoneyFormat(
            foundCash[0].cash
          )} K menjadi ${changeIntoMoneyFormat(result[1][0].cash)} K`,
          UserId,
        });
        res.status(200).json({
          cash: result[1][0].cash,
          message: `Kas telah berhasil di Edit dari ${changeIntoMoneyFormat(
            foundCash[0].cash
          )} K menjadi ${changeIntoMoneyFormat(result[1][0].cash)} K`,
        });
      } else {
        throw { name: "Data not found" };
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ControllerCash;
