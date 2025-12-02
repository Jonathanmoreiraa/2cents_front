export const formatToMoney = (value: number) => {
    const moneyFormat = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
    return moneyFormat.format(value);
};