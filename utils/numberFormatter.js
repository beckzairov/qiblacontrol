export function formatNumber(value) {
  if (!value) return '0'; // Handle undefined or null values

  // Ensure the value is a string
  const stringValue = value.toString();

  // Split the value into whole and decimal parts
  const [whole, decimal] = stringValue.split('.');

  // Add commas to the whole part
  const formattedWhole = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Append the decimal part if it exists, otherwise keep only the formatted whole
  return decimal !== undefined ? `${formattedWhole}.${decimal}` : formattedWhole;
}
