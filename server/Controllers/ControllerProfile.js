const { User, History } = require("../models");
const { hashPassword } = require("../helpers/bcryptjs");

class ControllerProfile {
  static async updateProfile(req, res, next) {
    const { id } = req.user;
    const data = {
      email: req.body.email,
      password: hashPassword(req.body.password),
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
}

module.exports = ControllerProfile;
