const { History, User } = require("../models");

class ControllerHistory {
  static async findAllHistories(req, res, next) {
    try {
      const result = await History.findAll({
        order: [["id", "DESC"]],
        include: { model: User },
      });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  static async createHistoryLogout(req, res, next) {
    const UserId = req.user.id;
    const { riwayat } = req.body;
    const data = {
      riwayat,
      UserId,
    };
    try {
      const result = await History.create(data);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ControllerHistory;
