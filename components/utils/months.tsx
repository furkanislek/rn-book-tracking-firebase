const monthNames = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

export const isValidMonth = (month: any) => {
  return !isNaN(month) ? month >= 1 && month <= 12 : new Date().getMonth() + 1;
};

const getMonthName = (month: any) => {
  if (isValidMonth(month)) {
    return monthNames[month - 1];
  }
  return "Geçersiz Ay";
};

export default getMonthName;
