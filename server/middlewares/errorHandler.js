module.exports = function (err, req, res, next) {
  console.log(err, 'err');
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
  } else if (err.name === "gagal upload") {
    code = 400;
    message =
      "Gagal upload Realisasi Anggaran, Silahkan check kembali format Excel dengan benar";
  } else if (err.name === "Jumlah Biaya yang ingin digunakan tidak boleh lebih dari jumlah anggaran yang tersisa") {
    code = 403;
    message =
      "Jumlah Biaya yang ingin digunakan tidak boleh lebih dari jumlah anggaran yang tersisa";
  } else if (err.name === 'Forbidden') {
    code = 404
    message = "Developer ONLY!"
  } else if (err.name === 'Jumlah biaya tidak boleh kurang dari 0') {
    code = 404
    message = "Jumlah biaya tidak boleh kurang dari 0"
  }
  res.status(code).json({ message });
};
