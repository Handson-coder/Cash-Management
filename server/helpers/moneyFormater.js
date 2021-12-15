const changeIntoMoneyFormat = (money) => {
    let moneyDividedBy1000 = money / 1000
    // return new Intl.NumberFormat("id-ID", {
    //   style: "currency",
    //   currency: "IDR",
    // }).format(money);
    return moneyDividedBy1000.toLocaleString()
};

module.exports = changeIntoMoneyFormat