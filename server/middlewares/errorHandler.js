module.exports = function (err, req, res, next) {
  let code = err.code || 500;
  let message = "Internal Server Error";

  if (err.name === "SequelizeValidationError") {
    let errors = err.errors.map((l) => {
      return l.message;
    });
    code = 400;
    message = errors;
  } else if (err.name === "Email/Password is wrong") {
    code = 401;
    message = "Email/Password salah";
  } else if (err.name === "Invalid Token") {
    code = 401;
    message = "Invalid Token";
  } else if (err.name === "JsonWebTokenError") {
    code = 401;
    message = "Invalid Token";
  } else if (err.name === "Please Login First") {
    code = 401;
    message = "Silahkan login terlebih dahulu";
  } else if (err.name === "Data not found") {
    code = 404;
    message = "Data tidak ditemukan";
  }
  // else if (err.name === 'Forbidden') {
  //     code = 403
  //     message = 'Forbidden'
  // }
  res.status(code).json({ message });
};
