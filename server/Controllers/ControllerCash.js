const { Cash } = require("../models");

class ControllerCash {
  static async getCurrentBalance(req, res, next) {
    try {
      const result = await Cash.findAll();
      if(result && result.length > 0) {
        res.status(201).json({
          cash: result,
          currentBalance: result[0].cash,
        });
      } else {
        res.status(201).json({
          cash: 0,
        });
      }
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ControllerCash;
