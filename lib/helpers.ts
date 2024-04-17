export const formatCurrency = (
  text: string
): [formatedValue: string, parsedValue: number] => {
  const cleanValue = text.replace(/[^0-9]/g, "");
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  const parsedValue = parseFloat(cleanValue) / 100;
  const formatedValue = formatter.format(parsedValue);
  return [formatedValue, parsedValue];
};

export const capitalize = (text: string): string => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};
