export const formatNumberWithCommas = (numberString:string) => {
  if (!numberString) return '';

  numberString = numberString.toString();
  return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
