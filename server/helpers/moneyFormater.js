const changeIntoMoneyFormat = (money) => {
    // return new Intl.NumberFormat("id-ID", {
    //   style: "currency",
    //   currency: "IDR",
    // }).format(money);
    return money.toLocaleString()
};

module.exports = changeIntoMoneyFormat