const { FatherEvent, ChildEvent } = require("../models");

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
      res.status(200).json(result.ChildEvents);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ControllerFatherEvent;
