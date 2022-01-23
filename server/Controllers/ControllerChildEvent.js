const { ChildEvent } = require("../models");

class ControllerChildEvent {
  static async findAllChildEvents(req, res, next) {
    try {
      const result = await ChildEvent.findAll();
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ControllerChildEvent;
