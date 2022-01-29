const { User, History } = require("../models");
const { hashPassword } = require("../helpers/bcryptjs");

class ControllerProfile {
  static async updateProfile(req, res, next) {
    const { id } = req.user;
    const { email, password, role } = req.body;
    const data = {
      email,
      password: hashPassword(password),
      role,
    };
    try {
      const result = await User.update(data, {
        where: { id },
        returning: true,
      });
      if (result[1][0]) {
        await History.create({
          riwayat: `Profile anda telah berhasil di edit`,
          UserId: id,
        });
        res.status(200).json({
          message: `Profile anda telah berhasil di edit`,
          user: {
            id: result[1][0].id,
            email: result[1][0].email,
            role: result[1][0].role,
          },
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async register(req, res, next) {
    const { email, password, role } = req.body;
    const data = {
      email,
      password: hashPassword(password),
      role,
    };
    try {
      const result = await User.create(data);
      res.status(201).json({
        id: result.id,
        email: result.email,
      });
    } catch (err) {
      next(err);
    }
  }

  static async checkUserList(req, res, next) {
    try {
      const result = await User.findAll();
      let users = [];
      if (result && result.length > 0) {
        result.forEach((l) => {
          users.push(l.email);
        });
      }
      res.status(200).json({
        data: users,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ControllerProfile;
